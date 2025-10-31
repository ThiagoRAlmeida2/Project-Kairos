import React from "react";
import FiltroEve from "../components/FiltroEve";
import EventosList from "../components/Eventoslist";
import DescEventos from "../components/descEventos";
import "../css/Eventos.css";

export default function Eventos() {
  return (
    <div className="eventos-container">
      <DescEventos />
      <FiltroEve />
      <EventosList />
    </div>
  );
}
