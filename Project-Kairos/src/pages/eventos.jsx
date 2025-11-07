import React from "react";
import FiltroEve from "../components/FiltroEve";
import EventosList from "../components/Eventoslist";
import DescEventos from "../components/descEventos";
import "../css/Eventos.css";

export default function Eventos() {
  return (
    <div className="container page-eventos">
      <DescEventos />
      <FiltroEve />
      <EventosList />
    </div>
  );
}
