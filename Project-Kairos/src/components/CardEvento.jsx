import React from "react";
import "../CSS/Eventos.css";

export default function CardEvento({ imagem, titulo, descricao }) {
  return (
    <div className="card-evento">
      <div className="card-capa">
        <img
          src={
            imagem ||
            "https://via.placeholder.com/300x180/9b72cf/ffffff?text=Evento+Tech"
          }
          alt={titulo}
          className="card-imagem"
        />
      </div>
      <div className="card-conteudo">
        <h3 className="card-titulo">{titulo}</h3>
        <p className="card-descricao">{descricao}</p>
      </div>
    </div>
  );
}
