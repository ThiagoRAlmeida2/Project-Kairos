
import React, { useState } from "react";
import Hero from "../components/Hero.jsx";
import Services from "../components/Services.jsx";
import HowItWorks from "../components/HowItWorks.jsx";
import CadastroCard from "../components/CadastroCard.jsx";

export default function Home() {
  const [showCadastro, setShowCadastro] = useState(false);

  const handleCadastroClick = () => {
    console.log('Abrindo modal de cadastro');
    setShowCadastro(true);
  };

  return (
    <>
      <div className="container page-home">
        <Hero onCadastroClick={handleCadastroClick} />
        <Services />
        <HowItWorks onCadastroClick={handleCadastroClick} />
      </div>
      
      {showCadastro && (
        <div className="modal-overlay" onClick={() => setShowCadastro(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <CadastroCard onClose={() => setShowCadastro(false)} />
          </div>
        </div>
      )}
    </>
  );
}
