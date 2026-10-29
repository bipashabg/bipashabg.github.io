*How I taught tensor operations to run on a GPU. (Mind you I had no experience working on compiler dev before this.)*
* Resources that helped me: [CUDA Programming Guide](https://docs.nvidia.com/cuda/cuda-programming-guide/index.html) , [Emmy: Optimized GPU compiler for LLM inference.](https://github.com/cloudrift-ai/emmy) & [Parallel Thread Execution](https://docs.nvidia.com/cuda/parallel-thread-execution/index.html)

Compilers rarely jump straight from source code to hardware instructions in one leap. Instead, they first convert your program into an intermediate representation (IR), a cleaned-up, structured version of what the program does, stripped of the syntax and convenience features of the original language. The IR isn't meant for humans to write or for hardware to run; it's a middle layer that's easy for a compiler to analyze and transform. For a CUDA program, for example, the compiler front-end parses your kernel and lowers it into an IR that captures the essential operations: load this, multiply that, store the result.

From there, the IR gets lowered again, this time into PTX, NVIDIA's low-level assembly-like language. PTX finally speaks the GPU's dialect: threads, registers, memory addresses, and explicit instructions. (PTX then gets assembled one more step down into the actual machine code for a specific GPU, but PTX is as low as this project goes.)

## The problem:

When you write `torch.randn(1024) + torch.randn(1024)` in PyTorch, something turns it into instructions a GPU can actually execute. GPUs don't understand "add two arrays" directly. They understand thousands of tiny threads, registers, memory addresses, and a low-level assembly language called PTX.
Over the past few days, I tried to built a small component of the compiler that does exactly that translation under the Emmy Hackathon 2026. It takes Emmy ML's intermediate representation (IR), a structured description of what a tensor program should compute and lowers it into PTX assembly that NVIDIA's tools can assemble and run on real hardware.
Think of it as a translator between two very different languages. Emmy's IR speaks in terms of tensors and mathematical operations. PTX speaks in terms of threads, registers, and memory. My compiler sits in the middle and rewrites one into the other.

## What the IR looks like:

Emmy hands you a program as a tree of operations. For a simple element-wise add, it looks roughly like this:

```
Tile[a0] (N=64)
    in0 = load x0[(a0*2)+0]
    in1 = load x1[(a0*2)+0]
    v0  = add(in0, in1)
    ...
    add[(a0*2)+0] = (v0, v1)
```

A `Tile` is a unit of parallel work. Inside it are several statements: loads from memory, arithmetic, and writes back out. The variable `a0` is an *axis*, a logical index that each GPU thread takes a different value of. My job was to turn each of these statements into the right PTX instructions.

## Architecture

The compiler is three small pieces:

- **A loader** that parses the IR graph and finds the kernel to compile.
- **A lowerer** that walks the IR statement by statement and decides what PTX to emit for each one.
- **A PTX builder** that handles the mechanical details: allocating registers, formatting instructions, and assembling the final kernel.

Every kernel I generated was checked two ways. First with `ptxas`, NVIDIA's assembler, which catches any syntax errors. Then with the hackathon's runner, which actually executes the kernel on a GPU and compares the output against a reference. A kernel only "passed" if the numbers matched.

The first targets were element-wise operations: add, scale-and-shift, relu-times-multiply. These are the "easy" ones, because each output element only depends on the matching input elements. No thread ever needs to talk to any other thread.

Even so, they made me get the fundamentals right. A GPU launches a grid of blocks, each containing many threads, and every thread has to figure out which piece of the array it's responsible for using its own position. For a single block, that's just the thread's ID; across multiple blocks it becomes block_index × block_size + thread_index. Getting this formula right was exactly what made the jump from a 128-element array to a 1024-element one (split across two blocks) work correctly.

There's also the matter of threads that have nothing to do. If you launch 256 threads but only have 64 logical positions to process, the extra threads must do nothing at all. So every kernel starts with a bounds guard: compare your index against the size, and if you're past it, skip straight to the exit. This single check is the difference between correct output and reading garbage memory.

And reading memory itself is just arithmetic. To read element i of a float array, you compute base_pointer + i × 4 (four bytes per float), then load from that address.

Then it became a little difficult, summing an array meant combining *every* element into a single number, which means threads have to cooperate. This is a bit tricky on a GPU, and it's where I learned the most.

A naive approach (have every thread add into one location) is slow and error-prone. The efficient pattern is a hierarchy, and I implemented it in layers:

1. With a strided loop, thread 0 adds elements 0, 128, 256, …; thread 1 adds 1, 129, 257, … and so on. After this, 128 threads hold 128 partial sums instead of thousands of raw values.

2. GPU threads come in groups of 32 called *warps*, and threads in a warp can pass values directly to each other through registers using a "shuffle" instruction. Using a kind of pattern (combine with your neighbor 16 away, then 8, then 4, 2, 1), each warp collapses its 32 partials into one in just five steps.

3. A block has a small scratchpad called *shared memory* that all its threads can see. The first thread of each warp writes its warp's total there. After a synchronization barrier, the partial sums are sitting side by side.

4. Finally, a single thread reads the handful of warp-totals from shared memory, adds them up, and writes the final answer out to global memory.


The last reduction was a row-wise sum, so given a 64×512 matrix, produce 64 sums, one per row. The neat trick here was mapping the problem onto the hardware: one block per row. Block number 7 reduces row 7, entirely independently of the others. Its 128 threads run the same reduction pipeline on their 512 columns, and the block's first thread writes that row's total.

This needed two upgrades to the compiler: a tile with two axes (one mapped to the block/row, one to the thread), and turning a `[row, column]` access into a flat memory offset (`row × 512 + column`), so proper multidimensional indexing. With those in place, the row-sum kernel passed too.

Also for the reductions, my results aren't *bit-identical* to PyTorch, they are correct only upto a small tolerance. Floating-point addition isn't perfectly associative, so `(a + b) + c` can differ in the last digit from `a + (b + c)`. Since my kernel adds numbers in a different order than PyTorch does, tiny rounding differences are expected and accepted. The element-wise kernels, which don't reorder anything, are indeed bit-exact.

## Results

The compiler passes *8 out of 8* kernels across the two categories I targeted:

- *Element-wise:* scalar add, vector add, scale-shift, relu-multiply (all bit-exact).
- *Reductions:* array sum, large sum, mean, and 2D row sum.

The compiler deliberately stops short of the harder kernels such as softmax, matrix multiply, and attention which need more sophisticated tiling and memory strategies. It also focuses on 32-bit floats and reductions that fit within a single block's cooperation. Those are the natural next steps.

The biggest lesson was how much of "making a GPU go fast" is really about getting threads to cooperate correctly. And building it incrementally, validating each kernel against real hardware before moving on, meant I was never debugging five things at once. 
