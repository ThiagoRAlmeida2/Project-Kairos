import React from 'react'
import Carousel from './Carousel.jsx'

const items = [
  { title: 'App de Pagamentos', desc: 'Integração PIX, boletos e dashboard.', badge: 'Fintech', image: '/assets/hero-dev.jpg', alt: 'App de pagamentos' },
  { title: 'Evento Kairos Tech', desc: 'Edição 2025 – palestras e workshops.', badge: 'Evento', image: '/assets/banner.jpg', alt: 'Evento Kairos' },
  { title: 'E-commerce Moda', desc: 'Next.js + CMS + checkout.', badge: 'E-commerce', image: '/assets/hero-dev.jpg', alt: 'E-commerce' },
  { title: 'Portal Corporativo', desc: 'Autenticação SSO e intranet.', badge: 'Enterprise', image: '/assets/banner.jpg', alt: 'Portal' },
  { title: 'API Analytics', desc: 'Pipelines e relatórios de dados.', badge: 'Dados', image: '/assets/hero-dev.jpg', alt: 'Analytics' },
]

export default function Hero(){
  return <Carousel title="📊 Projetos & Eventos" items={items} />
}
