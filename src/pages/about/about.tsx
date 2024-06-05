import { useNavigate } from "react-router-dom";
import DefaultLayout from "../../components/layouts/default-layout";
import "./about.css";
import React from "react";

const teamMembers = [
  {
    name: "Yersultan",
    position: "Fullstack Developer",
    image: "public/images/us.jpg",
    github: "https://github.com/3qrsb",
  },
  {
    name: "Nurbol",
    position: "Frontend Developer",
    image: "public/images/us.jpg",
    github: "https://github.com/NBL01",
  },
  {
    name: "Askar",
    position: "Backend Developer",
    image: "public/images/us.jpg",
    github: "https://github.com/Askar-A-A",
  },
];

const About = () => {
  const navigate = useNavigate();
  return (
    <DefaultLayout>
      <section id="about" className="about">
        <div className="section-title">
          <h2 className="text-center">About Us</h2>
        </div>
        <div className="team-container">
          {teamMembers.map((member, index) => (
            <div key={index} className="team-member">
              <a
                href={member.github}
                target="_blank"
                rel="noopener noreferrer"
                className="team-member-link"
              >
                <div className="team-member-card">
                  <img
                    src={member.image}
                    alt={`${member.name}`}
                    className="team-image"
                  />
                  <h3>{member.name}</h3>
                  <p>{member.position}</p>
                </div>
              </a>
            </div>
          ))}
        </div>
      </section>
    </DefaultLayout>
  );
};

export default About;
