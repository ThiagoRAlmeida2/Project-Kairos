import React from "react";
import "../css/Eventos.css";

export default function FiltroEve() {
  return (
    <section className="filtro-eve">
      <div className="filtro-bloco">
        <h4 className="filtro-titulo">Filtrar por</h4>
        <select className="filtro-select">
          <option>Data</option>
          <option>Workshops</option>
          <option>Hackathons</option>
          <option>Conferências</option>
        </select>
      </div>

      <div className="filtro-bloco">
        <h4 className="filtro-titulo">Ordenar por</h4>
        <select className="filtro-select">
          <option>Relevância</option>
          <option>Mais recentes</option>
          <option>Mais próximos</option>
        </select>
      </div>
    </section>
  );
}
