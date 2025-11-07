// src/components/Hero.jsx
import React from 'react'
import Carousel from '../components/Carrossel.jsx'

// IMPORTAÇÕES DE IMAGEM MANTIDAS
import appspagamentoImg from '../assets/IMG/appspagamento.png';
import kairosImg from '../assets/IMG/Kairos-techevent.png';
import ecommerceImg from '../assets/IMG/e-commerce-moda.png';

const items = [
  { title: 'App de Pagamentos', desc: 'Integração PIX, boletos e dashboard.', badge: 'Fintech', image: appspagamentoImg, alt: 'App de pagamentos' },
  { title: 'Evento Kairos Tech', desc: 'Edição 2025 – palestras e workshops.', badge: 'Evento', image: kairosImg, alt: 'Evento Kairos' },
  { title: 'E-commerce Moda', desc: 'Next.js + CMS + checkout.', badge: 'E-commerce', image: ecommerceImg, alt: 'E-commerce' },
  { title: 'Portal Corporativo', desc: 'Autenticação SSO e intranet.', badge: 'Enterprise', 
    image: '/assets/banner.jpg',
    alt: 'Portal' 
  },
  { title: 'API Analytics', desc: 'Pipelines e relatórios de dados.', badge: 'Dados', 
    image: '/assets/hero-dev.jpg',
    alt: 'Analytics' 
  },
]

export default function Hero(){
  return (
    <section className="hero">
        <div className="hero__content-grid">
            
            {/* SOBRE NÓS - Coluna 1 */}
            <div className="hero__about">
                <h1 className="about__title">Conectando o Aprendizado ao Mercado</h1>
                <p className="about__subtitle">
                    O **Project Kairos** é a ponte entre a excelência acadêmica e a inovação empresarial. Nosso objetivo é transformar a teoria em prática, oferecendo aos estudantes a oportunidade de trabalhar em projetos reais propostos por empresas.
                </p>
                
                <h3 className="about__section-title">Nossa Missão</h3>
                <p className="about__description">
                    Oferecer um ambiente colaborativo onde estudantes de tecnologia possam desenvolver habilidades valiosas e construir portfólios robustos, enquanto fornecemos às empresas acesso direto a talentos emergentes para resolver desafios de desenvolvimento e tecnologia.
                </p>
                <div className="about__buttons">
                    <a href="/projetos" className="btn btn--primary">Ver Projetos Ativos</a>
                    <a href="/cadastro" className="btn btn--light">Cadastre-se</a>
                </div>
            </div>

            {/* CARROSSEL - Coluna 2 */}
            <div className="hero__carousel-wrapper">
                <Carousel title="Projetos em Destaque" items={items} />
            </div>

        </div>
    </section>
  );
}