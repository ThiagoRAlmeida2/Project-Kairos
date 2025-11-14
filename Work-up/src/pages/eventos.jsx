import React, { useState, useMemo, useRef, useEffect } from "react";
import "../css/Eventos.css";
import Footer from "../components/Footer";
import LoginCard from "../components/LoginCard"; 
import { FaChevronLeft, FaChevronRight, FaCalendarAlt, FaMapMarkerAlt, FaTag, FaCheckCircle, FaLaptopCode, FaTimes, FaPlusCircle } from "react-icons/fa";

// Simulação de Dados de Eventos
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
  { id: 1, title: "Tech Conference 2025", description: "Grande conferência anual sobre tendências e inovações em IA e Cloud Computing.", date: "15 Jan", location: "São Paulo", image: techConferenceImg, category: "Conferência", featured: true },
  { id: 2, title: "React Workshop", description: "Imersão de 8 horas para construir uma SPA moderna com hooks avançados do React.", date: "20 Jan", location: "Online", image: reactImg, category: "Workshop", featured: true },
  { id: 3, title: "Startup Pitch Day", description: "Oportunidade para startups apresentarem suas ideias para investidores.", date: "25 Jan", location: "Rio de Janeiro", image: pitchImg, category: "Networking", featured: true },
  { id: 4, title: "Python para Iniciantes", description: "Aprenda a sintaxe básica e manipulação de dados com Python.", date: "18 Jan", location: "Online", image: pythonImg, category: "Workshop" },
  { id: 5, title: "Design Thinking Aplicado", description: "Workshop prático para resolver problemas complexos com foco no usuário.", date: "22 Jan", location: "São Paulo", image: designThinkingImg, category: "Workshop" },
  { id: 6, title: "DevOps Essentials", description: "Introdução às práticas de CI/CD, Docker e Kubernetes.", date: "28 Jan", location: "Online", image: devOpsImg, category: "Curso" },
  { id: 7, title: "UX/UI Masterclass", description: "Design de interfaces intuitivas e testes de usabilidade.", date: "02 Fev", location: "Curitiba", image: uxUiImg, category: "Workshop" },
  { id: 8, title: "Global Hackathon 2025", description: "48h de programação para construir soluções para desafios globais.", date: "05 Fev", location: "São Paulo", image: hackathonImg, category: "Hackathon" },
  { id: 9, title: "Code Challenge", description: "Maratona de desafios de algoritmos e estrutura de dados.", date: "10 Fev", location: "Online", image: codeChallengeImg, category: "Competição" },
  { id: 10, title: "Startup Weekend", description: "Tire sua ideia do papel e lance sua startup em um fim de semana.", date: "20 Fev", location: "Porto Alegre", image: startupWeekendImg, category: "Hackathon" },
];

// Estado inicial do formulário de criação de evento
const initialNewEvent = {
    title: '',
    description: '',
    date: '',
    location: '',
    category: 'Workshop',
    image: null,
};

// Componente do Modal de Detalhes do Evento (para Aluno/Deslogado)
function EventDetailsModal({ event, userRole, onClose, onOpenLogin }) {
    if (!event) return null;

  // Bloqueia scroll do body enquanto o modal estiver aberto
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, []);

    const isAluno = userRole === 'ROLE_ALUNO';
    const isDeslogado = !userRole;

    const handleInscricao = () => {
        if (isDeslogado) {
            // Fecha o modal de detalhes e abre o modal de login
            onClose(); 
            onOpenLogin();
        } else if (isAluno) {
            alert(`Inscrição confirmada para o evento: ${event.title}!`);
            onClose();
            // Lógica real de API para inscrição
        }
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content event-details-modal" onClick={e => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}><FaTimes /></button>
                <div className="event-modal-image">
                    <img src={event.image} alt={event.title} />
                    <div className="event-category-badge-modal">{event.category}</div>
                </div>
                
                <div className="event-modal-info">
                    <h2>{event.title}</h2>
                    <p className="modal-description">{event.description}</p>
                    <div className="modal-details-grid">
                        <p><FaCalendarAlt /> Data: <span>{event.date}</span></p>
                        <p><FaMapMarkerAlt /> Local: <span>{event.location}</span></p>
                        <p><FaTag /> Categoria: <span>{event.category}</span></p>
                    </div>

                    <div className="modal-actions">
                        {isAluno && (
                            <button className="btn-inscrever" onClick={handleInscricao}>
                                <FaCheckCircle /> Inscrever-se
                            </button>
                        )}
                        {isDeslogado && (
                            <button className="btn-login" onClick={handleInscricao}>
                                Fazer Login para Inscrever-se
                            </button>
                        )}
                        {(userRole === 'ROLE_EMPRESA' || userRole === 'ROLE_ADMIN') && (
                            <p className="empresa-info">Você é uma Empresa e não pode se inscrever em eventos.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Componente do Modal de Criação de Evento (para Empresa) - CORRIGIDO O AGRUPAMENTO DO INPUT DE ARQUIVO
function CreateEventModal({ onClose, onEventCreated }) { // <-- Recebe a nova função
    const [newEvent, setNewEvent] = useState(initialNewEvent);
    const [fileName, setFileName] = useState('');

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        
        // Lógica de manipulação para input type="file"
        if (name === "image" && files && files.length > 0) {
            const file = files[0];
            setFileName(file.name);
            
            // CORREÇÃO: Cria uma URL temporária para o arquivo de imagem selecionado (Visualização local)
            const objectUrl = URL.createObjectURL(file); 
            
            setNewEvent(prev => ({ 
                ...prev, 
                image: objectUrl, // <--- Agora usa a URL da imagem selecionada
                fileData: file 
            }));
            
            return;
        }

        // Lógica padrão para inputs de texto/select
        setNewEvent(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // 1. Simulação de Criação/Publicação
        const novoEventoPublicado = {
            id: Date.now(),
            title: newEvent.title,
            description: newEvent.description,
            date: newEvent.date,
            location: newEvent.location,
            category: newEvent.category,
            image: newEvent.image || techConferenceImg, 
            featured: false, 
        };

        // 2. Adiciona o novo evento ao estado pai
        onEventCreated(novoEventoPublicado);

        alert(`Novo Evento Criado: ${novoEventoPublicado.title}`);
        onClose();
    };

    const categories = ["Workshop", "Curso", "Hackathon", "Competição", "Conferência", "Networking"];

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content create-event-modal" onClick={e => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}><FaTimes /></button>
                <h2><FaLaptopCode /> Criar Novo Evento</h2>
                
                <form onSubmit={handleSubmit} className="event-form">
                    <label>Título:</label>
                    <input 
                        name="title" 
                        value={newEvent.title} 
                        onChange={handleChange} 
                        required 
                        placeholder="Ex: Spring Boot Masterclass"
                    />

                    <label>Descrição:</label>
                    <textarea
                        name="description"
                        value={newEvent.description}
                        onChange={handleChange}
                        required
                        rows="3"
                        placeholder="Descreva o objetivo e o público-alvo do evento."
                    />

                    <label>Categoria:</label>
                    <select name="category" value={newEvent.category} onChange={handleChange}>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    
                    {/* CAMPO DE UPLOAD DE IMAGEM AGRUPADO CORRETAMENTE */}
                    <div className="form-group-image">
                        {/* Rótulo Principal */}
                        <label>Imagem de Capa do Evento:</label>
                        
                        <div className="file-input-wrapper">
                            
                            {/* Input REAL (escondido) */}
                            <input 
                                id="event-image-upload" // ID para associar ao rótulo
                                name="image" 
                                type="file" 
                                onChange={handleChange} 
                                accept="image/*" 
                            />
                            
                            {/* RÓTULO CUSTOMIZADO (O BOTÃO VISÍVEL) */}
                            <label htmlFor="event-image-upload" className="btn-upload-custom">
                                <FaPlusCircle /> Inserir Imagem
                            </label>
                            
                            {/* NOME DO ARQUIVO SELECIONADO */}
                            <span className="file-name-display">
                                {fileName || "Nenhum arquivo selecionado"}
                            </span>
                        </div>
                    </div>

                    {/* DIV ENVOLVENDO DATA E LOCAL para alinhar lado a lado */}
                    <div className="input-group-row">
                        <label>Data (Ex: DD Mês):</label>
                        <input 
                            name="date" 
                            value={newEvent.date} 
                            onChange={handleChange} 
                            required 
                            placeholder="Ex: 10 Mar"
                        />

                        <label>Local:</label>
                        <input 
                            name="location" 
                            value={newEvent.location} 
                            onChange={handleChange} 
                            required 
                            placeholder="Ex: Online ou São Paulo"
                        />
                    </div>
                    
                    <button type="submit" className="btn-principal btn-submit-event">
                        <FaPlusCircle /> Publicar Evento
                    </button>
                </form>
            </div>
        </div>
    );
}

// Componente principal Eventos
export default function Eventos() {
  // ATUALIZADO: Inicializa com allEvents e permite alteração
  const [events, setEvents] = useState(allEvents);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState({});
  const [selectedEvent, setSelectedEvent] = useState(null); 
  const [showCreateModal, setShowCreateModal] = useState(false); 
  const [showLoginModal, setShowLoginModal] = useState(false); // ESTADO para o modal de Login
  const [userRole, setUserRole] = useState(null); 
  const scrollRefs = useRef({});
  
  // NOVA FUNÇÃO: Adiciona o novo evento ao array de eventos
  const handleAddEvent = (newAvent) => {
      setEvents(prevEvents => [newAvent, ...prevEvents]);
  }

  // 1. Lógica para carregar o papel do usuário ao carregar a página
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUserRole(user.role); 
      }
    } catch (e) {
      console.error("Erro ao ler role do localStorage:", e);
      setUserRole(null);
    }
  }, []);

  // 🎁 FUNÇÃO PARA LIDAR COM O SUCESSO DO LOGIN
  const handleLoginSuccess = (userData) => {
    setUserRole(userData.role); 
    setShowLoginModal(false);
  };


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
  
  // Função para abrir o modal de detalhes
  const handleViewDetails = (event) => {
    setSelectedEvent(event);
  };
  
  // Função para abrir o modal de criação (apenas Empresa)
  const handleOpenCreateModal = () => {
    if (userRole === 'ROLE_EMPRESA') {
        setShowCreateModal(true);
    }
  };
  
  // Função para abrir o modal de login (chamada pelo EventDetailsModal)
  const handleOpenLoginModal = () => {
    setShowLoginModal(true);
  };

  // ATUALIZADO: Filtra e usa a lista de eventos do estado local
  const filteredEvents = useMemo(() => {
    if (!searchTerm.trim()) return events; // Usa events do state
    
    return events.filter(event => 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, events]); // Depende do events do state

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
  
  // Componente de Card de Evento reutilizável - COM FALLBACK DE IMAGEM
  const EventCard = ({ event }) => {
    const imageSrc = event.image || techConferenceImg; // Usa uma imagem de fallback se a URL for nula

    return (
      <div 
        key={event.id} 
        className="event-card"
      >
        <div className="event-image">
          <img src={imageSrc} alt={event.title} />
          <div className="event-category-badge">{event.category}</div>
        </div>
        <div className="event-info">
          <h3>{event.title}</h3>
          <p className="event-date"><FaCalendarAlt /> {event.date}</p>
          <p className="event-location"><FaMapMarkerAlt /> {event.location}</p>
        </div>
        <button
          className="btn-ver-detalhes"
          onClick={(e) => {
            e.stopPropagation();
            handleViewDetails(event);
          }}
        >
          Ver Detalhes
        </button>
      </div>
    );
  };

  return (
    <>
      <div className="eventos-container">
        {/* Hero Section */}
        <section className="eventos-hero">
          <div className="hero-content">
            <h1>Descubra Eventos Tech</h1>
            <p>Conecte-se com a comunidade tech através de eventos, workshops e conferências</p>
            <div className="hero-actions-row">
                <form className="hero-search" onSubmit={handleSearch}>
                  <input 
                    type="text" 
                    placeholder="Buscar eventos..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button type="submit">Buscar</button>
                </form>
                
                {/* Botão de Criar Evento (Apenas para Empresa) */}
                {userRole === 'ROLE_EMPRESA' && (
                    <button 
                        className="btn-create-event" 
                        onClick={handleOpenCreateModal}
                    >
                        <FaPlusCircle /> Criar Evento
                    </button>
                )}
            </div>
          </div>
        </section>

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
                    <EventCard key={event.id} event={event} />
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
                {category.totalEvents > category.events.length && (
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
                    <EventCard key={event.id} event={event} />
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
      
      {selectedEvent && (
        <EventDetailsModal 
            event={selectedEvent} 
            userRole={userRole} 
            onClose={() => setSelectedEvent(null)} 
            onOpenLogin={handleOpenLoginModal}
        />
      )}
      
      {/* Modal de Criação de Evento (Empresa) - PASSANDO NOVA PROPRIEDADE */}
      {showCreateModal && (
        <CreateEventModal 
            onClose={() => setShowCreateModal(false)} 
            onEventCreated={handleAddEvent} // <-- NOVO PROP
        />
      )}
      
      {/* 🟢 Renderiza o LoginCard REAL quando showLoginModal é true */}
      {showLoginModal && (
        <LoginCard 
            onClose={() => setShowLoginModal(false)} // Fecha o modal
            onLoginSuccess={handleLoginSuccess} // Atualiza o estado de Eventos após sucesso
        />
      )}
      
      <Footer />
    </>
  );
}