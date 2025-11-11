import React, { useState, useMemo } from "react";
import "../css/Eventos.css";
import Footer from "../components/Footer"

const allEvents = [
  { id: 1, title: "Tech Conference 2025", date: "15 Jan", location: "São Paulo", image: "/api/placeholder/300/200", category: "Conferência" },
  { id: 2, title: "React Workshop", date: "20 Jan", location: "Online", image: "/api/placeholder/300/200", category: "Workshop" },
  { id: 3, title: "Startup Pitch Day", date: "25 Jan", location: "Rio de Janeiro", image: "/api/placeholder/300/200", category: "Networking" },
  { id: 4, title: "AI & Machine Learning", date: "30 Jan", location: "Belo Horizonte", image: "/api/placeholder/300/200", category: "Conferência" },
  { id: 5, title: "Python para Iniciantes", date: "18 Jan", location: "Online", image: "/api/placeholder/300/200", category: "Workshop" },
  { id: 6, title: "Design Thinking", date: "22 Jan", location: "São Paulo", image: "/api/placeholder/300/200", category: "Workshop" },
  { id: 7, title: "DevOps Essentials", date: "28 Jan", location: "Online", image: "/api/placeholder/300/200", category: "Curso" },
  { id: 8, title: "UX/UI Masterclass", date: "02 Fev", location: "Curitiba", image: "/api/placeholder/300/200", category: "Workshop" },
  { id: 9, title: "Global Hackathon 2025", date: "05 Fev", location: "São Paulo", image: "/api/placeholder/300/200", category: "Hackathon" },
  { id: 10, title: "Code Challenge", date: "10 Fev", location: "Online", image: "/api/placeholder/300/200", category: "Competição" },
  { id: 11, title: "Innovation Contest", date: "15 Fev", location: "Brasília", image: "/api/placeholder/300/200", category: "Competição" },
  { id: 12, title: "Startup Weekend", date: "20 Fev", location: "Porto Alegre", image: "/api/placeholder/300/200", category: "Hackathon" },
];

export default function Eventos() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEvents = useMemo(() => {
    if (!searchTerm.trim()) return allEvents;
    
    return allEvents.filter(event => 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const eventCategories = useMemo(() => {
    const categories = [
      { title: "Eventos em Destaque", filter: () => true },
      { title: "Workshops e Cursos", filter: (event) => ["Workshop", "Curso"].includes(event.category) },
      { title: "Hackathons e Competições", filter: (event) => ["Hackathon", "Competição"].includes(event.category) }
    ];

    return categories.map(cat => ({
      ...cat,
      events: filteredEvents.filter(cat.filter).slice(0, 8)
    })).filter(cat => cat.events.length > 0);
  }, [filteredEvents]);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <div className="eventos-container">
        {/* Hero Section */}
        <section className="eventos-hero">
          <div className="hero-content">
            <h1>Descubra Eventos Tech</h1>
            <p>Conecte-se com a comunidade tech através de eventos, workshops e conferências</p>
            <form className="hero-search" onSubmit={handleSearch}>
              <input 
                type="text" 
                placeholder="Buscar eventos..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit">Buscar</button>
            </form>
          </div>
        </section>

        {/* Search Results or Categories */}
        {searchTerm.trim() ? (
          <section className="event-category">
            <div className="category-header">
              <h2>Resultados da busca "{searchTerm}" ({filteredEvents.length})</h2>
            </div>
            <div className="events-row">
              {filteredEvents.map((event) => (
                <div key={event.id} className="event-card">
                  <div className="event-image">
                    <img src={event.image} alt={event.title} />
                    <div className="event-category-badge">{event.category}</div>
                  </div>
                  <div className="event-info">
                    <h3>{event.title}</h3>
                    <p className="event-date">{event.date}</p>
                    <p className="event-location">{event.location}</p>
                  </div>
                </div>
              ))}
            </div>
            {filteredEvents.length === 0 && (
              <div className="no-results">
                <p>Nenhum evento encontrado para "{searchTerm}"</p>
              </div>
            )}
          </section>
        ) : (
          /* Event Categories */
          eventCategories.map((category, index) => (
            <section key={index} className="event-category">
              <div className="category-header">
                <h2>{category.title}</h2>
                <button className="see-all">Ver todos</button>
              </div>
              <div className="events-row">
                {category.events.map((event) => (
                  <div key={event.id} className="event-card">
                    <div className="event-image">
                      <img src={event.image} alt={event.title} />
                      <div className="event-category-badge">{event.category}</div>
                    </div>
                    <div className="event-info">
                      <h3>{event.title}</h3>
                      <p className="event-date">{event.date}</p>
                      <p className="event-location">{event.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))
        )}
      </div>
      <Footer />
    </>
  );
}
