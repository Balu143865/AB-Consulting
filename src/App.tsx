/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import AboutUs from './components/AboutUs';
import Services from './components/Services';
import Experts from './components/Experts';
import Process from './components/Process';
import CaseStudies from './components/CaseStudies';
import SuccessStories from './components/SuccessStories';
import ThoughtLeadership from './components/ThoughtLeadership';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import Portal from './components/Portal';
import { Database, Sparkles } from 'lucide-react';
import { getCurrentUser } from './lib/supabase';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const metaConfig = {
  hero: {
    title: "NextGen AI Agency | Enterprise Cognitive & Generative Solutions",
    description: "Deploy task-specific multi-agent cognitive workflows, hybrid vector-graph RAG databases, and secure semantic firewalls designed for high-frequency production scale.",
    keywords: "AI agency, agentic workflows, enterprise AI, custom LLMs, RAG database, semantic firewall"
  },
  about: {
    title: "About NextGen AI | Leading the Agentic Workflows Era",
    description: "Learn about our world-class team of AI researchers, security architects, and deep engineering leaders dedicated to bridging monolithic models with deterministic workflows.",
    keywords: "AI research team, Saskia Daly, AI consulting, cognitive engineering"
  },
  services: {
    title: "Enterprise AI Services | Agentic Workflows & MLOps Solutions",
    description: "From business process automation and hybrid RAG search to semantic firewalls and Dynamic Model Routing, discover how we build secure enterprise AI pipelines.",
    keywords: "AI services, prompt engineering, MLOps, semantic firewall, business automation"
  },
  experts: {
    title: "Our Team of AI Experts | NextGen Cognitive Leadership",
    description: "Meet our senior research team, Chief Security Architects, and MLOps leaders pushing the boundaries of generative systems.",
    keywords: "AI engineers, security architects, machine learning experts"
  },
  process: {
    title: "Our Strategic AI Implementation Process | NextGen AI",
    description: "Explore our 4-stage discovery, sandbox-mapping, integration, and continuous MLOps evaluation methodology.",
    keywords: "AI methodology, software implementation, MLOps monitoring"
  },
  'success-stories': {
    title: "AI Success Stories | Proven ROI at Production Scale",
    description: "Read deep-dives on how we reduced distributed inference costs by 62%, achieved near-zero hallucination rates, and deployed secure cognitive pipelines.",
    keywords: "AI success stories, client case studies, model accuracy, client feedback"
  },
  cases: {
    title: "Client Case Studies | Transformative Business Impact",
    description: "Real-world stories showing how our custom reinforcement learning, hybrid knowledge graph databases, and neural art engines drive business ROI.",
    keywords: "AI case studies, robotic process automation, knowledge graph search"
  },
  'thought-leadership': {
    title: "AI Thought Leadership & Research Insights | NextGen AI",
    description: "Explore engineering guides, strategic briefs, and research articles on agentic workflows, prompt injection defenses, and hybrid databases.",
    keywords: "AI research, prompt injection defense, dynamic model routing, agentic workflows"
  },
  faq: {
    title: "Frequently Asked Questions | Enterprise AI Integration",
    description: "Find detailed answers about data readiness, zero-trust cloud LLM pipelines, Salesforce/HubSpot API integrations, and maintenance strategies.",
    keywords: "AI integration FAQ, LLM security, model drift support"
  }
};

export default function App() {
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
    }
    return 'light';
  });
  const activeUser = getCurrentUser();

  useEffect(() => {
    const sectionIds = ['hero', 'about', 'services', 'experts', 'process', 'success-stories', 'cases', 'thought-leadership', 'faq'];
    
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -40% 0px',
      threshold: 0.1
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleOpenPortal = () => {
    setIsPortalOpen(true);
  };

  const handleClosePortal = () => {
    setIsPortalOpen(false);
  };

  const handleToggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', next);
      return next;
    });
  };

  const currentMeta = metaConfig[activeSection as keyof typeof metaConfig] || metaConfig.hero;
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://nextgen-ai.agency';

  return (
    <HelmetProvider>
      <div className={`min-h-screen font-sans antialiased flex flex-col justify-between transition-colors duration-300 ${theme === 'dark' ? 'bg-[#030712] text-slate-100 dark' : 'bg-white text-slate-800'}`} id="app-root">
        
        {/* Dynamic SEO Meta Headers */}
        <Helmet>
          <title>{currentMeta.title}</title>
          <meta name="description" content={currentMeta.description} />
          <meta name="keywords" content={currentMeta.keywords} />
          
          {/* Open Graph / Facebook */}
          <meta property="og:type" content="website" />
          <meta property="og:url" content={currentUrl} />
          <meta property="og:title" content={currentMeta.title} />
          <meta property="og:description" content={currentMeta.description} />
          <meta property="og:image" content="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1200&h=630" />

          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:url" content={currentUrl} />
          <meta name="twitter:title" content={currentMeta.title} />
          <meta name="twitter:description" content={currentMeta.description} />
          <meta name="twitter:image" content="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1200&h=630" />
        </Helmet>

        {/* Absolute Landing Header */}
        <Header onOpenPortal={handleOpenPortal} theme={theme} onToggleTheme={handleToggleTheme} />

        {/* Main Sections */}
        <main className="flex-1">
          <Hero onOpenPortal={handleOpenPortal} />
          <AboutUs onOpenPortal={handleOpenPortal} />
          <Services onOpenPortal={handleOpenPortal} />
          <Experts />
          <Process />
          <SuccessStories />
          <CaseStudies />
          <ThoughtLeadership />
          <FAQ />
        </main>

        {/* Brand Footer */}
        <Footer />

        {/* Interactive Database, Auth & Chat Console Sidebar */}
        <Portal isOpen={isPortalOpen} onClose={handleClosePortal} />

        {/* Floating Call-to-Action Sandbox Indicator (For rapid testing) */}
        <div className="fixed bottom-6 left-6 z-40 hidden sm:flex">
          <button
            onClick={handleOpenPortal}
            className="bg-brand-dark/95 backdrop-blur-xs border border-brand-blue hover:border-brand-orange text-white px-4 py-3 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-103 transition-all flex items-center gap-3 cursor-pointer group text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-brand-orange/20 flex items-center justify-center text-brand-orange group-hover:scale-110 transition-transform">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-brand-orange uppercase leading-none tracking-wider">Interactive Console</p>
              <p className="text-[11px] text-slate-300 font-semibold mt-1">
                {activeUser ? `Session: ${activeUser.name}` : 'Test Real-Time DB & Auth'}
              </p>
            </div>
          </button>
        </div>

      </div>
    </HelmetProvider>
  );
}
