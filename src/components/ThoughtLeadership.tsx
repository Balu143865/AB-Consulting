import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, User, ArrowRight, Search, Filter, BookOpen, X, Share2, Check, Bookmark } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  author: string;
  excerpt: string;
  content: string;
  image: string;
}

export default function ThoughtLeadership() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  const categories = ['All', 'Generative AI', 'MLOps & Scale', 'AI Security'];

  const articles: Article[] = [
    {
      id: "agentic-workflows",
      title: "The Shift from Monolithic Models to Specialized Agentic Workflows",
      category: "Generative AI",
      readTime: "6 min read",
      date: "July 12, 2026",
      author: "Dr. Evelyn Vance, Head of AI Research",
      excerpt: "Why monolithic language models are giving way to orchestrated, multi-agent frameworks capable of self-correction, reasoning loops, and deterministic goal execution.",
      content: "As enterprise generative AI matures, the industry is witnessing a significant shift from raw model parameter size to task-specific Agentic Workflows. Monolithic foundation models, while capable, often struggle with complex multi-step reasoning, deterministic compliance, and integration with legacy APIs. By wrapping these models in structured execution frameworks with feedback loops, tool access, and memory layers, agencies can build robust AI assistants. These agents collaborate, critique each other's outputs, and run iterative validation checks.\n\nThis approach minimizes hallucinations and unlocks real-world automation in finance, legal, and operational planning. In this article, we outline our blueprint for multi-agent systems and share benchmarks showing a 34% drop in output error compared to single-shot prompts.",
      image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800&h=533"
    },
    {
      id: "securing-llms",
      title: "Securing LLMs Against Prompt Injection & Data Exfiltration",
      category: "AI Security",
      readTime: "8 min read",
      date: "June 28, 2026",
      author: "Marcus Kane, Chief Security Architect",
      excerpt: "An in-depth analysis of semantic firewalls, real-time input sanitization, and sandboxed execution environments for modern cognitive APIs.",
      content: "Connecting Large Language Models (LLMs) to real-world corporate databases and email pipelines introduces critical threat vectors, primarily prompt injection and lateral data exfiltration. If a malicious input is embedded in a customer support ticket or email body, an active AI agent can be coerced into ignoring its system prompt, accessing unauthorized data sources, or leaking proprietary intellectual property.\n\nTo defend against this, we have developed a multi-layered 'Semantic Firewall' pattern. This system intercepts inputs and uses lightweight, high-speed classifiers to flag adversarial language before it reaches the core LLM. In addition, we enforce strict zero-trust sandboxing on agent tool executions and utilize outbound data sanitization rules to identify personal identifiable information (PII) or API tokens. In this guide, we detail how to design and build these defense systems without degrading semantic response latency.",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800&h=533"
    },
    {
      id: "inference-optimization",
      title: "Optimizing Distributed Inference Costs at Production Scale",
      category: "MLOps & Scale",
      readTime: "5 min read",
      date: "June 15, 2026",
      author: "Sarah Chen, VP of Engineering",
      excerpt: "How quantization, speculative decoding, and model routing strategies reduced our enterprise client inference overhead by up to 62%.",
      content: "Deploying high-frequency AI features to millions of active users can quickly lead to astronomical cloud provider bills. For many enterprises, GPU resource scarcity and token cost structures remain the primary bottlenecks to scaling generative features. Our engineering team recently undertook an intensive optimization project to make AI systems both cost-effective and highly responsive.\n\nIn this article, we explore three key techniques that delivered spectacular cost reductions:\n\n1) Speculative Decoding, where a tiny, extremely fast helper model proposes draft tokens that are verified in parallel by our primary LLM.\n2) Dynamic Semantic Routing, which directs simple queries to smaller, low-cost models while reserving the massive foundation models for complex reasoning.\n3) Deep Model Quantization (4-bit/8-bit precision adjustments) tailored for specific hardware targets.\n\nImplementing this unified pipeline has allowed our enterprise partners to scale their active workloads while slashing inference overhead by 62%.",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800&h=533"
    },
    {
      id: "hybrid-vector-graphs",
      title: "The Emergence of Hybrid Vector-Graph Databases for RAG",
      category: "MLOps & Scale",
      readTime: "7 min read",
      date: "May 29, 2026",
      author: "Aria Sterling, Lead AI Engineer",
      excerpt: "Why combining structured knowledge graphs with high-dimensional vector embeddings yields unparalleled retrieval accuracy.",
      content: "Standard Retrieval-Augmented Generation (RAG) models rely on vector databases to find relevant document chunks using mathematical similarity. While effective for simple text searches, traditional vector retrieval lacks the capacity to map complex conceptual relationships, structural hierarchies, and global system dependencies across disparate data.\n\nTo bridge this gap, the future belongs to Hybrid Vector-Graph architectures. By combining semantic embeddings with structured knowledge graphs, our systems can execute high-dimensional searches while tracking explicit connection nodes—such as organizational structures, relational tables, and sequence workflows. This results in significantly richer context injection, reducing hallucination rates to near-zero and providing a traceable audit trail for critical AI assertions. We present a walk-through of the design patterns, storage schemas, and retrieval algorithms that power our hybrid knowledge networks.",
      image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=800&h=533"
    }
  ];

  // Filtering articles based on Category & Search
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
      const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            article.author.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleShare = (article: Article, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}#thought-leadership?article=${article.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(article.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleBookmark = (articleId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedIds((prev) => 
      prev.includes(articleId) 
        ? prev.filter((id) => id !== articleId) 
        : [...prev, articleId]
    );
  };

  return (
    <section 
      id="thought-leadership" 
      className="py-12 sm:py-16 bg-[#f8fafc] dark:bg-[#040815] border-t border-slate-100 dark:border-white/[0.03] transition-colors duration-300 relative overflow-hidden"
    >
      {/* Decorative Blur Spheres */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-10 space-y-3"
        >
          <span className="text-xs font-bold text-[#ff5a22] uppercase tracking-[0.2em] font-mono block mb-2">
            AI Research & Insights
          </span>
          <h2 className="font-display font-black text-4xl sm:text-5xl text-[#0f172a] dark:text-white tracking-tight leading-none mb-4 transition-colors duration-300">
            Thought Leadership
          </h2>
          <div className="w-16 h-[3px] bg-[#ff5a22] mx-auto rounded-full mb-6" />
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm sm:text-[15px] leading-relaxed max-w-xl mx-auto transition-colors duration-300">
            Explore cutting-edge industry insights, engineering guides, and strategic briefs written by our active AI research team.
          </p>
        </motion.div>

        {/* Search and Category Filter Toolbar */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-white dark:bg-[#070e20]/60 border border-slate-100 dark:border-white/[0.04] rounded-3xl p-4 sm:p-5 shadow-sm transition-all duration-300">
          
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-1.5" id="category-filters">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  selectedCategory === category
                    ? 'bg-[#ff5a22] text-white shadow-md shadow-brand-orange/10'
                    : 'bg-slate-50 dark:bg-white/[0.02] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:max-w-xs" id="search-bar-container">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.04] hover:border-slate-200 dark:hover:border-white/[0.08] focus:border-brand-orange dark:focus:border-brand-orange rounded-xl text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-brand-orange/20 transition-all duration-200"
            />
          </div>

        </div>

        {/* Articles Grid Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="articles-grid">
          <AnimatePresence mode="popLayout">
            {filteredArticles.length > 0 ? (
              filteredArticles.map((article, idx) => (
                <motion.article
                  layout
                  key={article.id}
                  initial={{ opacity: 0, scale: 0.98, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 15 }}
                  transition={{ duration: 0.4, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -6, scale: 1.025 }}
                  onClick={() => setActiveArticle(article)}
                  className="group relative bg-white dark:bg-[#070e20]/60 border border-slate-100 dark:border-white/[0.04] hover:border-brand-orange/20 hover:bg-[#fffbf9] dark:hover:bg-[#0c142c]/90 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl dark:shadow-none transition-all duration-300 cursor-pointer flex flex-col h-full"
                >
                  {/* Article Image Accent */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-white/[0.02]">
                    <img
                      src={article.image}
                      alt={article.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                    
                    {/* Category Label Overlay */}
                    <span className="absolute top-3 left-3 bg-white/95 dark:bg-[#040815]/95 backdrop-blur-md text-[#ff5a22] text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded shadow-sm border border-slate-100/10 transition-colors">
                      {article.category}
                    </span>

                    {/* Quick Interaction Buttons Overlay */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={(e) => handleBookmark(article.id, e)}
                        className={`p-1.5 rounded-md backdrop-blur-md transition-all cursor-pointer ${
                          bookmarkedIds.includes(article.id)
                            ? 'bg-brand-orange text-white'
                            : 'bg-white/80 dark:bg-black/80 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-black'
                        }`}
                        title="Bookmark Article"
                      >
                        <Bookmark className="w-3.5 h-3.5" fill={bookmarkedIds.includes(article.id) ? "currentColor" : "none"} />
                      </button>
                      <button
                        onClick={(e) => handleShare(article, e)}
                        className="p-1.5 bg-white/80 dark:bg-black/80 hover:bg-white dark:hover:bg-black text-slate-700 dark:text-slate-300 rounded-md backdrop-blur-md transition-all cursor-pointer"
                        title="Copy Share Link"
                      >
                        {copiedId === article.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Share2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Article Contents */}
                  <div className="p-5 flex flex-col justify-between flex-1 space-y-3">
                    <div className="space-y-2.5">
                      {/* Meta header details */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-400 dark:text-slate-500 font-semibold font-mono">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-brand-orange/70" />
                          <span>{article.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-brand-orange/70" />
                          <span>{article.readTime}</span>
                        </div>
                      </div>

                      {/* Main Title */}
                      <h3 className="font-display font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-[#ff5a22] transition-colors duration-200 line-clamp-2 leading-snug">
                        {article.title}
                      </h3>

                      {/* Snippet Excerpt */}
                      <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed line-clamp-2">
                        {article.excerpt}
                      </p>
                    </div>

                    {/* Author & Action footer */}
                    <div className="pt-3 border-t border-slate-50 dark:border-white/[0.03] flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-white/[0.04] flex items-center justify-center text-slate-500 dark:text-slate-400 flex-shrink-0">
                          <User className="w-3 h-3" />
                        </div>
                        <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 truncate">
                          {article.author.split(',')[0]}
                        </span>
                      </div>

                      <span className="flex items-center gap-0.5 text-[10px] font-black text-[#ff5a22] uppercase tracking-wider group-hover:gap-1 transition-all flex-shrink-0">
                        Read
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>

                  </div>
                </motion.article>
              ))
            ) : (
              <div className="col-span-full py-16 text-center" id="no-articles-fallback">
                <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">No articles found</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">Try adjusting your category selection or search keywords.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Full In-depth Reader Modal Overlay */}
      <AnimatePresence>
        {activeArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" id="article-reader-modal">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveArticle(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-3xl max-h-[90vh] bg-white dark:bg-[#050914] border border-slate-100 dark:border-white/[0.05] rounded-3xl shadow-2xl overflow-y-auto flex flex-col z-10"
            >
              
              {/* Close Button Floating on Header */}
              <button
                onClick={() => setActiveArticle(null)}
                className="absolute top-4 right-4 z-20 p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] text-slate-700 dark:text-slate-200 rounded-full cursor-pointer transition-all shadow-md hover:scale-105"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Hero Header Area */}
              <div className="relative aspect-video w-full flex-shrink-0 bg-slate-100 dark:bg-white/[0.02]">
                <img
                  src={activeArticle.image}
                  alt={activeArticle.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                
                {/* Content Overlay */}
                <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 space-y-3">
                  <span className="inline-block bg-[#ff5a22] text-white text-[10px] sm:text-xs font-black uppercase tracking-wider px-3 py-1 rounded-lg">
                    {activeArticle.category}
                  </span>
                  <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight leading-snug">
                    {activeArticle.title}
                  </h1>
                </div>
              </div>

              {/* In-depth Article Metadata */}
              <div className="px-6 sm:px-8 py-5 border-b border-slate-100 dark:border-white/[0.04] bg-slate-50/50 dark:bg-white/[0.01] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/[0.04] flex items-center justify-center text-slate-500 dark:text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-none">{activeArticle.author.split(',')[0]}</p>
                    <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5">{activeArticle.author.split(',')[1]?.trim() || 'Contributor'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono font-bold text-slate-400 dark:text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-brand-orange" />
                    <span>{activeArticle.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-brand-orange" />
                    <span>{activeArticle.readTime}</span>
                  </div>
                </div>
              </div>

              {/* Main Text Content */}
              <div className="p-6 sm:p-8 space-y-6 flex-1 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-medium">
                {activeArticle.content.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              {/* Footer Panel */}
              <div className="p-6 sm:p-8 bg-slate-50/50 dark:bg-white/[0.01] border-t border-slate-100 dark:border-white/[0.04] flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleBookmark(activeArticle.id, e)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      bookmarkedIds.includes(activeArticle.id)
                        ? 'bg-brand-orange text-white'
                        : 'bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.03] dark:hover:bg-white/[0.07] text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Bookmark className="w-4 h-4" fill={bookmarkedIds.includes(activeArticle.id) ? "currentColor" : "none"} />
                    {bookmarkedIds.includes(activeArticle.id) ? 'Bookmarked' : 'Bookmark'}
                  </button>
                  
                  <button
                    onClick={(e) => handleShare(activeArticle, e)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.03] dark:hover:bg-white/[0.07] text-slate-700 dark:text-slate-300 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer"
                  >
                    {copiedId === activeArticle.id ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-500" />
                        <span>Link Copied</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4" />
                        <span>Share Article</span>
                      </>
                    )}
                  </button>
                </div>

                <button
                  onClick={() => setActiveArticle(null)}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-xl font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer"
                >
                  Close Reader
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
