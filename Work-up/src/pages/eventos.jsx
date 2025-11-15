import React, { useState, useMemo, useRef, useEffect } from "react";
import "../css/Eventos.css";
import Footer from "../components/Footer";
import LoginCard from "../components/LoginCard"; 
import { FaChevronLeft, FaChevronRight, FaCalendarAlt, FaMapMarkerAlt, FaTag, FaCheckCircle, FaLaptopCode, FaTimes, FaPlusCircle } from "react-icons/fa";

import api from '../service/api' 
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

// 3. Seus cards estáticos (Mantidos)
const allEvents = [
  { id: 100009, title: "Tech Conference 2025", description: "Grande conferência anual sobre tendências e inovações em IA e Cloud Computing.", date: "15 Jan", location: "São Paulo", image: techConferenceImg, category: "Conferência", featured: true },
  { id: 200000, title: "React Workshop", description: "Imersão de 8 horas para construir uma SPA moderna com hooks avançados do React.", date: "20 Jan", location: "Online", image: reactImg, category: "Workshop", featured: true },
  { id: 300000, title: "Startup Pitch Day", description: "Oportunidade para startups apresentarem suas ideias para investidores.", date: "25 Jan", location: "Rio de Janeiro", image: pitchImg, category: "Networking", featured: true },
  { id: 400000, title: "Python para Iniciantes", description: "Aprenda a sintaxe básica e manipulação de dados com Python.", date: "18 Jan", location: "Online", image: pythonImg, category: "Workshop" },
  { id: 500000, title: "Design Thinking Aplicado", description: "Workshop prático para resolver problemas complexos com foco no usuário.", date: "22 Jan", location: "São Paulo", image: designThinkingImg, category: "Workshop" },
  { id: 600000, title: "DevOps Essentials", description: "Introdução às práticas de CI/CD, Docker e Kubernetes.", date: "28 Jan", location: "Online", image: devOpsImg, category: "Curso" },
  { id: 700000, title: "UX/UI Masterclass", description: "Design de interfaces intuitivas e testes de usabilidade.", date: "02 Fev", location: "Curitiba", image: uxUiImg, category: "Workshop" },
  { id: 800000, title: "Global Hackathon 2025", description: "48h de programação para construir soluções para desafios globais.", date: "05 Fev", location: "São Paulo", image: hackathonImg, category: "Hackathon" },
  { id: 900000, title: "Code Challenge", description: "Maratona de desafios de algoritmos e estrutura de dados.", date: "10 Fev", location: "Online", image: codeChallengeImg, category: "Competição" },
  { id: 100000, title: "Startup Weekend", description: "Tire sua ideia do papel e lance sua startup em um fim de semana.", date: "20 Fev", location: "Porto Alegre", image: startupWeekendImg, category: "Hackathon" },
];

const initialNewEvent = {
    title: '',
    description: '',
    date: '',
    location: '',
    category: 'Workshop',
    image: null, 
    fileData: null 
};

// Componente do Modal de Detalhes do Evento
function EventDetailsModal({ event, userRole, onClose, onOpenLogin, onEventClosed }) {
    if (!event) return null;

    useEffect(() => {
        const previous = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = previous; };
    }, []);

    const isAluno = userRole === 'ROLE_ALUNO';
    const isEmpresa = userRole === 'ROLE_EMPRESA';
    const isDeslogado = !userRole;

    const handleInscricao = () => {
        if (isDeslogado) {
            onClose(); 
            onOpenLogin();
        } else if (isAluno) {
            alert(`Inscrição confirmada para o evento: ${event.title}!`);
            onClose();
        }
    };
    
    const handleCloseEvent = async () => {
        if (!window.confirm(`Tem certeza que deseja encerrar o evento: ${event.title}? Esta ação é irreversível.`)) {
            return;
        }

        try {
            // USA 'api.delete'
            // O token é adicionado automaticamente pelo interceptor
            await api.delete(`/api/eventos/${event.id}`);

            alert(`Evento '${event.title}' encerrado com sucesso.`);
            onClose();
            onEventClosed(event.id);

        } catch (error) {
            console.error("Falha na comunicação com a API:", error);
            const errorMsg = error.response?.data?.message || error.response?.data || error.message;
            alert(`Erro ao encerrar evento: ${errorMsg}`);
        }
    };


    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content event-details-modal" onClick={e => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}><FaTimes /></button>
                <div className="event-modal-image">
                    <img src={event.image || techConferenceImg} alt={event.title} />
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
                        {isEmpresa && (
                            <button className="btn-encerrar" onClick={handleCloseEvent}>
                                <FaTimes /> Encerrar Evento
                            </button>
                        )}
                        {(isEmpresa || userRole === 'ROLE_ADMIN') && (
                             <p className="empresa-info">Você pode gerenciar este evento.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Componente do Modal de Criação de Evento
function CreateEventModal({ onClose, onEventCreated }) {
    const [newEvent, setNewEvent] = useState(initialNewEvent);
    const [fileName, setFileName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        
        if (name === "image" && files && files.length > 0) {
            const file = files[0];
            setFileName(file.name);
            const objectUrl = URL.createObjectURL(file); 
            
            setNewEvent(prev => ({ 
                ...prev, 
                image: objectUrl, // Preview local
                fileData: file    // O arquivo real
            }));
            
            return;
        }

        setNewEvent(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!newEvent.fileData) {
            alert("Por favor, selecione uma imagem de capa para o evento.");
            return;
        }
        
        setIsLoading(true);

        const eventData = {
            title: newEvent.title,
            description: newEvent.description,
            date: newEvent.date,
            location: newEvent.location,
            category: newEvent.category
        };
        
        const formData = new FormData();
        formData.append("file", newEvent.fileData); 
        formData.append("eventData", JSON.stringify(eventData));
        
        // O token é pego automaticamente pelo interceptor do 'api.js'
        
        try {
            // USA 'api.post'
            // O 'Content-Type' correto (multipart/form-data) é definido
            // automaticamente pelo Axios (pois removemos o header padrão)
            const response = await api.post('/api/eventos/criar', formData);

            // A resposta do Axios já está em .data
            const eventoCriado = response.data;
            
            const novoEventoPublicado = {
                id: eventoCriado.id,
                title: eventoCriado.title,
                description: eventoCriado.description,
                date: eventoCriado.date,
                location: eventoCriado.location,
                category: eventoCriado.category,
                // A URL do Cloudinary já é completa (https://...)
                // Não precisamos adicionar 'http://localhost'
                image: eventoCriado.imageUrl || techConferenceImg, 
                featured: eventoCriado.featured, 
            };
            
            onEventCreated(novoEventoPublicado);
            alert(`Novo Evento Criado com sucesso: ${eventoCriado.title}`);
            onClose();

        } catch (error) {
            console.error("Falha ao publicar evento:", error);
            const errorMsg = error.response?.data?.message || error.response?.data || error.message;
            alert(`Falha ao publicar evento: ${errorMsg}`);
        } finally {
            setIsLoading(false);
        }
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
                        disabled={isLoading}
                    />
                    <label>Descrição:</label>
                    <textarea
                        name="description"
                        value={newEvent.description}
                        onChange={handleChange}
                        required
                        rows="3"
                        placeholder="Descreva o objetivo e o público-alvo do evento."
                        disabled={isLoading}
                    />

                    <label>Categoria:</label>
                    <select name="category" value={newEvent.category} onChange={handleChange} disabled={isLoading}>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    
                    <div className="form-group-image">
                        <label>Imagem de Capa do Evento:</label>
                        <div className="file-input-wrapper">
                            <input 
                                id="event-image-upload" 
                                name="image" 
                                type="file" 
                                onChange={handleChange} 
                                accept="image/*" 
                                disabled={isLoading}
                                required
                            />
                            <label htmlFor="event-image-upload" className="btn-upload-custom">
                                <FaPlusCircle /> Inserir Imagem
                            </label>
                            <span className="file-name-display">
                                {fileName || "Nenhum arquivo selecionado"}
                            </span>
                        </div>
                    </div>

                    <div className="input-group-row">
                        <label>Data (Ex: DD Mês):</label>
                        <input 
                            name="date" 
                            value={newEvent.date} 
                            onChange={handleChange} 
                            required 
                            placeholder="Ex: 10 Mar"
                            disabled={isLoading}
                        />
                        <label>Local:</label>
                        <input 
                            name="location" 
                            value={newEvent.location} 
                            onChange={handleChange} 
                            required 
                            placeholder="Ex: Online ou São Paulo"
                            disabled={isLoading}
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className="btn-principal btn-submit-event"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Publicando...' : <><FaPlusCircle /> Publicar Evento</>}
                    </button>
                </form>
            </div>
        </div>
    );
}

// Componente principal Eventos
export default function Eventos() {
    // Começa o estado com seus 10 cards estáticos
    const [events, setEvents] = useState(allEvents);
    
    // Começa false, pois já temos cards para mostrar
    const [isLoading, setIsLoading] = useState(false); 
    const [error, setError] = useState(null);
  
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedCategories, setExpandedCategories] = useState({});
    const [selectedEvent, setSelectedEvent] = useState(null); 
    const [showCreateModal, setShowCreateModal] = useState(false); 
    const [showLoginModal, setShowLoginModal] = useState(false); 
    const [userRole, setUserRole] = useState(null); 
    const scrollRefs = useRef({});

    // Adiciona o novo evento criado no topo da lista
    const handleAddEvent = (newAvent) => {
      setEvents(prevEvents => [newAvent, ...prevEvents]);
    }
  
    // Remove o evento da lista (estática ou dinâmica)
    const handleCloseEventSuccess = (deletedEventId) => {
        setEvents(prevEvents => prevEvents.filter(event => event.id !== deletedEventId));
    }

    // Carrega o 'userRole' do localStorage
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

    // Busca os eventos da API e junta com os estáticos
    useEffect(() => {
        const fetchEvents = async () => {
            setIsLoading(true); // Mostra o loading só durante a busca
            setError(null);
            
            try {
                // USA 'api.get'
                const response = await api.get('/api/eventos');

                // A resposta do Axios já está em .data
                const data = response.data;
                
                const formattedEvents = data.map(event => ({
                    ...event,
                    // A URL do Cloudinary já é completa
                    image: event.imageUrl || techConferenceImg 
                }));
                
                // Junta os 10 cards estáticos com os cards vindos da API
                setEvents([...allEvents, ...formattedEvents]);

            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvents();
    }, []); // Executa apenas uma vez

    // Função de Sucesso do Login
    const handleLoginSuccess = (userData) => {
        setUserRole(userData.role); 
        setShowLoginModal(false);
    };

    // Funções de Scroll
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
    
    // Funções de UI (Modais, etc)
    const toggleCategory = (categoryIndex) => {
        setExpandedCategories(prev => ({
          ...prev,
          [categoryIndex]: !prev[categoryIndex]
        }));
    };
  
    const handleViewDetails = (event) => {
        setSelectedEvent(event);
    };
  
    const handleOpenCreateModal = () => {
        if (userRole === 'ROLE_EMPRESA') {
            setShowCreateModal(true);
        }
    };
  
    const handleOpenLoginModal = () => {
        setShowLoginModal(true);
    };

    // Filtros e Categorias (useMemo)
    const filteredEvents = useMemo(() => {
        if (!searchTerm.trim()) return events; 
        
        return events.filter(event => 
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, events]); 

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
    
    // Componente do Card de Evento (Reutilizável)
    const EventCard = ({ event }) => {
        // Funciona para URLs locais (import) e remotas (Cloudinary)
        const imageSrc = event.image || techConferenceImg; 

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

    // Renderização principal do componente
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

            {/* Loading (só durante o fetch) */}
            {isLoading && (
                <div className="loading-message">
                    <p>Buscando novos eventos...</p>
                </div>
            )}
            
            {/* Erro (só se o fetch falhar) */}
            {error && (
                <div className="error-message">
                    <p>Erro ao buscar eventos: {error}</p>
                </div>
            )}

            {/* Renderização condicional da Busca ou Categorias */}
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
            
            {/* Mensagem de "nenhum evento" */}
            {events.length === 0 && !isLoading && (
              <div className="no-results">
                <p>Nenhum evento encontrado no momento.</p>
              </div>
            )}
          </div>
          
          {/* Modais e Footer */}
          {selectedEvent && (
            <EventDetailsModal 
                event={selectedEvent} 
                userRole={userRole} 
                onClose={() => setSelectedEvent(null)} 
                onOpenLogin={handleOpenLoginModal}
                onEventClosed={handleCloseEventSuccess} 
            />
          )}
          
          {showCreateModal && (
            <CreateEventModal 
                onClose={() => setShowCreateModal(false)} 
                onEventCreated={handleAddEvent} 
            />
          )}
          
          {showLoginModal && (
            <LoginCard 
                onClose={() => setShowLoginModal(false)} 
                onLoginSuccess={handleLoginSuccess} 
            />
          )}
          
          <Footer />
        </>
    );
}