import React, { useState, useMemo, useRef } from "react";
import "../css/Eventos.css";
import Footer from "../components/Footer"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Importações de imagens
import techConferenceImg from '../assets/IMG/Conferencia de tecnologia.jpg';
import reactImg from '../assets/IMG/React.png';
import pitchImg from '../assets/IMG/Pitch.jpg';
import pythonImg from '../assets/IMG/Python.png';
import designThinkingImg from '../assets/IMG/Design Thinking.jpg';
import devOpsImg from '../assets/IMG/DevOps.jpg';
import uxUiImg from '../assets/IMG/UX_UI.jpg';
import hackathonImg from '../assets/IMG/Hackathon.jpg';
import codeChallengeImg from '../assets/IMG/Code Challenge.jpg';
import startupWeekendImg from '../assets/IMG/Startup weekend.jpg';

const allEvents = [
  { id: 1, title: "Tech Conference 2025", date: "15 Jan", location: "São Paulo", image: techConferenceImg, category: "Conferência", featured: true },
  { id: 2, title: "React Workshop", date: "20 Jan", location: "Online", image: reactImg, category: "Workshop", featured: true },
  { id: 3, title: "Startup Pitch Day", date: "25 Jan", location: "Rio de Janeiro", image: pitchImg, category: "Networking", featured: true },
  { id: 4, title: "Python para Iniciantes", date: "18 Jan", location: "Online", image: pythonImg, category: "Workshop" },
  { id: 5, title: "Design Thinking", date: "22 Jan", location: "São Paulo", image: designThinkingImg, category: "Workshop" },
  { id: 6, title: "DevOps Essentials", date: "28 Jan", location: "Online", image: devOpsImg, category: "Curso" },
  { id: 7, title: "UX/UI Masterclass", date: "02 Fev", location: "Curitiba", image: uxUiImg, category: "Workshop" },
  { id: 8, title: "Global Hackathon 2025", date: "05 Fev", location: "São Paulo", image: hackathonImg, category: "Hackathon" },
  { id: 9, title: "Code Challenge", date: "10 Fev", location: "Online", image: codeChallengeImg, category: "Competição" },
  { id: 10, title: "Startup Weekend", date: "20 Fev", location: "Porto Alegre", image: startupWeekendImg, category: "Hackathon" },
];

export default function Eventos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState({});
  const scrollRefs = useRef({});

  const scrollLeft = (categoryIndex) => {
    const container = scrollRefs.current[categoryIndex];
    if (container) {
      container.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = (categoryIndex) => {
    const container = scrollRefs.current[categoryIndex];
    if (container) {
      container.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const toggleCategory = (categoryIndex) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryIndex]: !prev[categoryIndex]
    }));
  };

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
      { title: "Eventos em Destaque", filter: (event) => event.featured === true },
      { title: "Workshops e Cursos", filter: (event) => ["Workshop", "Curso"].includes(event.category) && !event.featured },
      { title: "Hackathons e Competições", filter: (event) => ["Hackathon", "Competição"].includes(event.category) }
    ];

    return categories.map((cat, index) => {
      const categoryEvents = filteredEvents.filter(cat.filter);
      return {
        ...cat,
        events: expandedCategories[index] ? categoryEvents : categoryEvents.slice(0, 8),
        totalEvents: categoryEvents.length
      };
    }).filter(cat => cat.totalEvents > 0);
  }, [filteredEvents, expandedCategories]);

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
            <div className="events-container-with-arrows">
              <button 
                className="nav-arrow nav-arrow-left"
                onClick={() => scrollLeft('search')}
              >
                <FaChevronLeft />
              </button>
              <div 
                className="events-row"
                ref={(el) => scrollRefs.current['search'] = el}
              >
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
              <button 
                className="nav-arrow nav-arrow-right"
                onClick={() => scrollRight('search')}
              >
                <FaChevronRight />
              </button>
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
                {category.totalEvents > 8 && (
                  <button 
                    className="see-all"
                    onClick={() => toggleCategory(index)}
                  >
                    {expandedCategories[index] ? 'Ver menos' : `Ver todos (${category.totalEvents})`}
                  </button>
                )}
              </div>
              <div className="events-container-with-arrows">
                {!expandedCategories[index] && (
                  <button 
                    className="nav-arrow nav-arrow-left"
                    onClick={() => scrollLeft(index)}
                  >
                    <FaChevronLeft />
                  </button>
                )}
                <div 
                  className={`events-row ${expandedCategories[index] ? 'expanded' : ''}`}
                  ref={(el) => scrollRefs.current[index] = el}
                >
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
                {!expandedCategories[index] && (
                  <button 
                    className="nav-arrow nav-arrow-right"
                    onClick={() => scrollRight(index)}
                  >
                    <FaChevronRight />
                  </button>
                )}
              </div>
            </section>
          ))
        )}
      </div>
      <Footer />
    </>
  );
}
