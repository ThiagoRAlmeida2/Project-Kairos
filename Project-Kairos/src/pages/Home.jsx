
import React from "react";
import Hero from "../components/Hero.jsx";
import Services from "../components/Services.jsx";
import HowItWorks from "../components/HowItWorks.jsx";

export default function Home() {
  return (
    <div className="container page-home">
      <Hero />
      <Services />
      <HowItWorks />
    </div>
  );
}
