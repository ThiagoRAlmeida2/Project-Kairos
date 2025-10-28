import React from "react";
import FiltroEve from "../components/FiltroEve";
import EventosList from "../components/Eventoslist";
import DescEventos from "../components/descEventos";
import "../CSS/Eventos.css";

export default function Eventos() {
  return (
    <div className="eventos-container">
      <section className="eventos-descricao">
        <DescEventos />
      </section>
      <section className="eventos-filtro">
        <FiltroEve />
      </section>

      <section className="eventos-lista">
        <EventosList />
      </section>

    </div>
  );
}
