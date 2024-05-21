import { useNavigate } from "react-router-dom";
import DefaultLayout from "../../components/layouts/default-layout";
import "./about.css";
import React from "react";

const About = () => {
  const navigate = useNavigate();
  return (
    <DefaultLayout>
      <section id="about" className="about"></section>
      <div className="section-title">
        <h2 className="text-center">About Us</h2>
      </div>
    </DefaultLayout>
  );
};

export default About;
