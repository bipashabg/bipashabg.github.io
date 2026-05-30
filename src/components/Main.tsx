import React from "react";
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import '../assets/styles/Main.scss';

function Main() {
  return (
    <div className="container">

      <div className="about-section">
        <div className="image-wrapper">
          <img
            src="https://media.licdn.com/dms/image/v2/D5603AQGVDKQxVatuJQ/profile-displayphoto-scale_400_400/B56Z3jgfufK4Ak-/0/1777638442075?e=1781740800&v=beta&t=Yhe-Yyggu0oJb0u8wPIVK2ATUGqZ8cpTEbAPsxaYFv8"
            alt="Avatar"
          />
        </div>
        <div className="content">
          <div className="social_icons">
            <a href="https://github.com/bipashabg" target="_blank" rel="noreferrer"><GitHubIcon /></a>
            <a href="https://www.linkedin.com/in/bipashagayary" target="_blank" rel="noreferrer"><LinkedInIcon /></a>
          </div>
          <h1>Bipasha Gayary</h1>
          <p>Software Engineer</p>
          <h3>I like to build and solve complex and creative problems, and contribute to open source.</h3>
          <div className="mobile_social_icons">
            <a href="https://github.com/yujisatojr" target="_blank" rel="noreferrer"><GitHubIcon /></a>
            <a href="https://www.linkedin.com/in/yujisato/" target="_blank" rel="noreferrer"><LinkedInIcon /></a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;