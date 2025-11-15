import React, { useState, useMemo, useRef, useEffect } from "react";
import "../css/Eventos.css";
import Footer from "../components/Footer";
import LoginCard from "../components/LoginCard"; 
import Toast from "../components/Toast";
import ConfirmDialog from "../components/ConfirmDialog";
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
  // IDs alterados para evitar colisão com IDs gerados pelo banco de dados
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
    image: null, // Armazena a URL temporária para visualização local
    fileData: null // Não é mais usado no envio, mas mantém a lógica de seleção de arquivo
};

// Componente do Modal de Detalhes do Evento (para Aluno/Deslogado/Empresa)
function EventDetailsModal({ event, userRole, onClose, onOpenLogin, onEventClosed, onShowToast, onRequestConfirm }) {
    if (!event) return null;

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, []);

    const isAluno = userRole === 'ROLE_ALUNO';
    const isEmpresa = userRole === 'ROLE_EMPRESA';
    const isDeslogado = !userRole;
    // 🔑 Usando a chave 'token'
    const token = localStorage.getItem('token'); 

    const handleInscricao = () => {
      if (isDeslogado) {
        onClose(); 
        onOpenLogin();
      } else if (isAluno) {
        onShowToast && onShowToast({ message: `Inscrição confirmada para o evento: ${event.title}!`, type: 'success' });
        onClose();
      }
    };
    
    // Lógica: Encerrar Evento (Empresa) com confirmação via onRequestConfirm
    const handleCloseEvent = () => {
      const message = `Tem certeza que deseja encerrar o evento: ${event.title}? Esta ação é irreversível.`;
      const doClose = async () => {
        try {
          const response = await fetch(`/api/eventos/${event.id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            const errorText = await response.text(); 
            onShowToast && onShowToast({ message: `Erro ao encerrar evento: ${errorText || response.statusText}`, type: 'error' });
            return;
          }

          onShowToast && onShowToast({ message: `Evento '${event.title}' encerrado com sucesso.`, type: 'success' });
          onClose();
          onEventClosed(event.id);

        } catch (error) {
          console.error("Falha na comunicação com a API:", error);
          onShowToast && onShowToast({ message: "Falha na comunicação com a API.", type: 'error' });
        }
      };

      if (onRequestConfirm) {
        onRequestConfirm(message, doClose);
      } else {
        // Fallback imediata
        if (window.confirm(message)) doClose();
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
                        {isEmpresa && (
                            <button className="btn-encerrar" onClick={handleCloseEvent}>
                                <FaTimes /> Encerrar Evento
                            </button>
                        )}
                        {(isEmpresa || userRole === 'ROLE_ADMIN') && (
                             <p className="empresa-info">Você pode gerenciar este evento.</p>
                        )}
                        {isAluno && (userRole === 'ROLE_EMPRESA' || userRole === 'ROLE_ADMIN') && (
                            <p className="empresa-info">Você é uma Empresa e não pode se inscrever em eventos.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Componente do Modal de Criação de Evento (para Empresa) - AJUSTADO PARA JSON
function CreateEventModal({ onClose, onEventCreated, onShowToast, onRequestConfirm }) {
    const [newEvent, setNewEvent] = useState(initialNewEvent);
    const [fileName, setFileName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        
        if (name === "image" && files && files.length > 0) {
            const file = files[0];
            setFileName(file.name);
            // Cria a URL temporária para visualização local (mantida)
            const objectUrl = URL.createObjectURL(file); 
            
            setNewEvent(prev => ({ 
                ...prev, 
                image: objectUrl, // 👈 Esta URL será enviada como imageUrl
                fileData: file 
            }));
            
            return;
        }

        setNewEvent(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // 1. DADOS DE TEXTO PARA JSON (Incluindo a URL de imagem como string)
        const eventData = {
            title: newEvent.title,
            description: newEvent.description,
            date: newEvent.date,
            location: newEvent.location,
            category: newEvent.category,
            // 🟢 Enviando a URL temporária para o backend salvar como string
            imageUrl: newEvent.image, 
        };
        
        const token = localStorage.getItem('token'); 
        
        if (!token) {
          onShowToast && onShowToast({ message: "Erro: Token de autenticação não encontrado. Faça login novamente.", type: 'error' });
          setIsLoading(false);
          return;
        }
        
        const API_URL = 'https://project-api-1-bw7k.onrender.com/api/eventos/criar';

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                // 🟢 CORREÇÃO: Content-Type: application/json
                headers: {
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(eventData), // 🟢 Enviando JSON
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({ message: `Erro HTTP: ${response.status}` }));
                throw new Error(error.message || `Erro ao criar evento: ${response.status}`);
            }

            const eventoCriado = await response.json();
            
            const novoEventoPublicado = {
                id: eventoCriado.id,
                title: eventoCriado.title,
                description: eventoCriado.description,
                date: eventoCriado.date,
                location: eventoCriado.location,
                category: eventoCriado.category,
                // 🟢 Usando a URL de volta do backend (que deve ser a URL enviada ou o fallback)
                image: eventoCriado.imageUrl || techConferenceImg, 
                featured: eventoCriado.featured, 
            };

            onEventCreated(novoEventoPublicado);
            
            onShowToast && onShowToast({ message: `Novo Evento Criado com sucesso: ${eventoCriado.title}`, type: 'success' });
            onClose();

        } catch (error) {
          console.error("Falha ao publicar evento:", error);
          onShowToast && onShowToast({ message: `Falha ao publicar evento: ${error.message}`, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const categories = ["Workshop", "Curso", "Hackathon", "Competição", "Conferência", "Networking"];

    const handleCloseAttempt = () => {
      const isDirty = Boolean(newEvent.title || newEvent.description || newEvent.date || newEvent.location || fileName);
      if (!isDirty) {
        onClose();
        return;
      }

      const message = 'Você tem certeza que deseja cancelar? As alterações não salvas serão perdidas.';
      const doCancel = () => onClose();
      if (onRequestConfirm) onRequestConfirm(message, doCancel);
      else if (window.confirm(message)) doCancel();
    };

    return (
      <div className="modal-backdrop" onClick={handleCloseAttempt}>
        <div className="modal-content create-event-modal" onClick={e => e.stopPropagation()}>
          <button className="modal-close-btn" onClick={handleCloseAttempt}><FaTimes /></button>
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
                    
                    {/* O input de arquivo é mantido para que o usuário possa selecionar a imagem 
                        e gerar a URL temporária (newEvent.image), mas o arquivo em si não é enviado. */}
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
  const [events, setEvents] = useState(allEvents);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState({});
  const [selectedEvent, setSelectedEvent] = useState(null); 
  const [showCreateModal, setShowCreateModal] = useState(false); 
  const [showLoginModal, setShowLoginModal] = useState(false); 
  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, message: '', onConfirm: null });
  const [userRole, setUserRole] = useState(null); 
  const scrollRefs = useRef({});
  
  // FUNÇÃO: Adiciona o novo evento ao array de eventos
  const handleAddEvent = (newAvent) => {
      setEvents(prevEvents => [newAvent, ...prevEvents]);
  }
  
  // 🌟 NOVA FUNÇÃO: Remove o evento da lista após exclusão bem-sucedida
  const handleCloseEventSuccess = (deletedEventId) => {
      setEvents(prevEvents => prevEvents.filter(event => event.id !== deletedEventId));
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

  // FUNÇÃO PARA LIDAR COM O SUCESSO DO LOGIN
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

  const requestConfirm = (message, onConfirm) => {
    setConfirmDialog({ open: true, message, onConfirm });
  };

  const closeConfirm = () => setConfirmDialog({ open: false, message: '', onConfirm: null });

  // Filtra e usa a lista de eventos do estado local
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
  
  // Componente de Card de Evento reutilizável
  const EventCard = ({ event }) => {
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
            onEventClosed={handleCloseEventSuccess}
            onShowToast={setToast}
            onRequestConfirm={requestConfirm}
        />
      )}
      
      {/* Modal de Criação de Evento (Empresa) */}
      {showCreateModal && (
        <CreateEventModal 
            onClose={() => setShowCreateModal(false)} 
            onEventCreated={handleAddEvent} 
            onShowToast={setToast}
            onRequestConfirm={requestConfirm}
        />
      )}
      {showCreateModal && toast && (
        /* noop: placeholder to keep linter quiet about multiple render blocks */
        null
      )}
      
      {/* Renderiza o LoginCard */}
      {showLoginModal && (
        <LoginCard 
            onClose={() => setShowLoginModal(false)} 
            onLoginSuccess={handleLoginSuccess} 
            onShowToast={setToast}
        />
      )}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      {confirmDialog.open && (
        <ConfirmDialog
          message={confirmDialog.message}
          onConfirm={() => { closeConfirm(); confirmDialog.onConfirm && confirmDialog.onConfirm(); }}
          onCancel={() => { closeConfirm(); }}
        />
      )}

      <Footer />
    </>
  );
}