import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle, Search, Sparkles, MessageSquare, ArrowUpRight } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Capabilities', 'Security', 'Integration', 'Pricing & Process'];

  const faqItems: FAQItem[] = [
    {
      id: "ai-readiness",
      question: "How do we assess if our data infrastructure is ready for enterprise AI?",
      answer: "We offer a comprehensive AI Readiness Audit where we analyze your existing storage pipelines, security schemas, and API constraints. Generally, having structured data in SQL/NoSQL databases or even well-organized document repositories is a great starting point. Our integration layers are designed to sanitize and index your legacy sources securely without requiring complete data migrations.",
      category: "Capabilities"
    },
    {
      id: "agentic-security",
      question: "What security measures protect our corporate data from leaking into public models?",
      answer: "All enterprise cognitive pipelines we deploy enforce a zero-trust model. We configure private VPC gateways, deploy semantic firewalls, and use strict outbound PII filters. Furthermore, your data is never used to train foundational public models; we exclusively bind custom solutions to sandboxed cloud-hosted LLM instances or local open-weights servers.",
      category: "Security"
    },
    {
      id: "api-integration",
      question: "Can these AI agents integrate with our current CRM and ERP software?",
      answer: "Absolutely. Our agent frameworks are designed to be tool-agnostic. We write specialized semantic interfaces that connect with popular platforms like Salesforce, HubSpot, SAP, or your in-house custom REST/GraphQL APIs, enabling agents to retrieve and commit actions dynamically under strict human-in-the-loop approvals.",
      category: "Integration"
    },
    {
      id: "custom-models",
      question: "Do you build proprietary models or fine-tune existing foundation models?",
      answer: "We specialize in hybrid architectures. For 90% of business tasks, fine-tuning is unnecessary and Retrieval-Augmented Generation (RAG) combined with specialized prompt orchestration is more efficient. When deep domain-specific knowledge or high compliance is required, we fine-tune open-weights models (like Llama 3 or Mistral) on dedicated secure compute nodes.",
      category: "Capabilities"
    },
    {
      id: "ongoing-maintenance",
      question: "How do you handle model updates, drift, and accuracy degradation over time?",
      answer: "Our systems come pre-configured with continuous MLOps monitoring. We track metric indicators like token latencies, cost thresholds, and semantic drift. If a foundation model updates or changes behavior, our automated prompt testing suites evaluate outputs against historical golden datasets to prevent accuracy degradation.",
      category: "Pricing & Process"
    },
    {
      id: "project-timelines",
      question: "What is the typical timeline from concept discovery to live production deployment?",
      answer: "A standard custom cognitive system or business automation workflow takes between 4 to 8 weeks. This includes initial sandbox mapping (1-2 weeks), custom API integration and orchestration (2-4 weeks), rigorous automated security red-teaming (1 week), and assisted rollout with performance monitoring.",
      category: "Pricing & Process"
    }
  ];

  // Filter FAQs based on selected category and search input
  const filteredFAQs = useMemo(() => {
    return faqItems.filter((item) => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const toggleAccordion = (id: string) => {
    setActiveIndex(activeIndex === id ? null : id);
  };

  return (
    <section 
      id="faq" 
      className="py-10 sm:py-12 bg-white dark:bg-[#020617] border-t border-slate-100 dark:border-white/[0.02] transition-colors duration-300 relative overflow-hidden"
    >
      {/* Subtle Ambient Background Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-brand-orange/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-8 space-y-2.5"
        >
          <span className="text-xs font-bold text-[#ff5a22] uppercase tracking-[0.2em] font-mono block mb-1">
            Questions & Answers
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-950 dark:text-white tracking-tight leading-none mb-2 transition-colors duration-300">
            Frequently Asked Questions
          </h2>
          <div className="w-10 h-[2.5px] bg-[#ff5a22] mx-auto rounded-full mb-3" />
          <p className="text-slate-500 dark:text-slate-400 font-medium text-[11px] sm:text-xs leading-relaxed max-w-lg mx-auto transition-colors duration-300">
            Got questions about integrations, security, or cognitive capabilities? Explore our answers below.
          </p>
        </motion.div>

        {/* Search & Categories Toolbar */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-50/50 dark:bg-[#070e20]/40 border border-slate-100 dark:border-white/[0.04] rounded-2xl p-2.5 shadow-xs">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all duration-200 cursor-pointer ${
                  selectedCategory === category
                    ? 'bg-[#ff5a22] text-white shadow-xs'
                    : 'bg-white dark:bg-white/[0.02] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] border border-slate-100 dark:border-white/[0.02]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search inputs */}
          <div className="relative min-w-[180px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-2.5 py-1 bg-white dark:bg-[#040815] border border-slate-100 dark:border-white/[0.04] focus:border-brand-orange dark:focus:border-brand-orange rounded-lg text-[11px] font-medium text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-brand-orange/20 transition-all duration-200"
            />
          </div>
        </div>

        {/* Collapsible Accordion Container */}
        <div className="space-y-2.5" id="faq-accordion-list">
          <AnimatePresence mode="popLayout">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq, index) => {
                const isOpen = activeIndex === faq.id;
                return (
                  <motion.div
                    key={faq.id}
                    layout="position"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    whileHover={{ y: -2, scale: 1.008 }}
                    className={`relative border rounded-xl overflow-hidden transition-all duration-300 ${
                      isOpen
                        ? 'bg-[#fffbf9] dark:bg-[#091024] border-brand-orange/25 dark:border-brand-orange/25 shadow-sm'
                        : 'bg-white dark:bg-[#070e20]/50 border-slate-100 dark:border-white/[0.04] hover:bg-[#fffbf9]/40 dark:hover:bg-[#0a1228]'
                    }`}
                  >
                    {/* Glowing Left Indicator on Open */}
                    <div className={`absolute left-0 top-0 bottom-0 w-[3px] bg-[#ff5a22] transition-transform duration-300 origin-left ${
                      isOpen ? 'scale-x-100' : 'scale-x-0'
                    }`} />

                    {/* Header trigger */}
                    <button
                      onClick={() => toggleAccordion(faq.id)}
                      className="w-full text-left px-4 py-3 sm:py-3.5 flex items-center justify-between gap-3 cursor-pointer focus:outline-hidden select-none"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-6.5 h-6.5 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                          isOpen 
                            ? 'bg-brand-orange/15 text-brand-orange' 
                            : 'bg-slate-100 dark:bg-white/[0.03] text-slate-400'
                        }`}>
                          <HelpCircle className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-display font-bold text-xs sm:text-sm text-slate-900 dark:text-white transition-colors duration-200 truncate pr-2">
                          {faq.question}
                        </span>
                      </div>
                      
                      {/* Chevron Arrow Icon */}
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ type: "spring", stiffness: 350, damping: 22 }}
                        className={`w-4.5 h-4.5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                          isOpen 
                            ? 'bg-brand-orange/20 text-brand-orange' 
                            : 'bg-slate-100 dark:bg-white/[0.02] text-slate-400'
                        }`}
                      >
                        <ChevronDown className="w-3 h-3" />
                      </motion.div>
                    </button>

                    {/* Expandable Panel */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: "easeInOut" }}
                        >
                          <div className="px-4 pb-3.5 pt-0.5 text-slate-600 dark:text-slate-300 text-xs sm:text-[13px] leading-relaxed font-medium pl-13">
                            <p className="border-t border-slate-100/50 dark:border-white/[0.03] pt-2">{faq.answer}</p>
                            <div className="mt-2 flex items-center gap-1 text-[9px] text-[#ff5a22] font-mono font-bold tracking-wider uppercase">
                              <span>Category: {faq.category}</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            ) : (
              <div className="py-10 text-center" id="no-faqs-fallback">
                <HelpCircle className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">No FAQs matched your filter</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Try choosing a different category or clearing the search box.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Help footer */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-8 text-center bg-slate-50/40 dark:bg-[#070e20]/20 border border-slate-100 dark:border-white/[0.03] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2.5 text-left">
            <div className="w-8 h-8 rounded-lg bg-brand-orange/10 flex items-center justify-center text-brand-orange">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Still have custom integration questions?</h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Connect directly with our security and engineering experts.</p>
            </div>
          </div>
          <button 
            onClick={() => {
              const el = document.getElementById('contact') || document.getElementById('footer') || document.body;
              el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-lg font-bold text-xs transition-all shadow-xs cursor-pointer"
          >
            Ask a Custom Question
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </motion.div>

      </div>
    </section>
  );
}
