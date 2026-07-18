import React, { useState, useEffect, useRef } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  image: string;
  content: string;
  impact: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Jenkins",
    role: "VP of Engineering",
    company: "CloudScale Inc.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200",
    content: "AB Consulting's AI agent completely streamlined our release cycle. We went from bi-weekly deploys to multiple times a day with zero downtime and unmatched code confidence.",
    impact: "5x Release Velocity",
    rating: 5,
  },
  {
    id: 2,
    name: "Marcus Vance",
    role: "CTO",
    company: "Apex Financial",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200",
    content: "The neural RPA workflows delivered outstanding results within the first week. Our processing accuracy is now at 99.8%, far exceeding our initial enterprise targets.",
    impact: "99.8% Accuracy",
    rating: 5,
  },
  {
    id: 3,
    name: "Elena Rostova",
    role: "Head of Product",
    company: "Veloce Solutions",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200",
    content: "The cognitive semantic search implementation is a game-changer. Our support desk can now retrieve complex enterprise records and resolve tickets 60% faster than before.",
    impact: "-60% Support Delay",
    rating: 5,
  },
  {
    id: 4,
    name: "David Chen",
    role: "Director of Operations",
    company: "Titan Retail Group",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200&h=200",
    content: "Integrating AB Consulting's predictive inventory models optimized our warehouse logistics. Our logistics overhead plummeted overnight while order fulfillment soared.",
    impact: "-35% Overhead Cost",
    rating: 5,
  },
  {
    id: 5,
    name: "Amina Al-Mansoor",
    role: "Chief Information Officer",
    company: "QuadraHealth",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=200&h=200",
    content: "Patient data security and high-speed processing were our main hurdles. AB Consulting engineered a highly robust, zero-trust HIPAA compliant private cloud AI network.",
    impact: "100% HIPAA Secure",
    rating: 5,
  },
  {
    id: 6,
    name: "Julian Mercer",
    role: "Co-founder",
    company: "Zenith Labs",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200",
    content: "Their engineers are world-class experts. The machine learning pipelines they built have scaled effortlessly with our rapid hyper-growth, processing millions of runs daily.",
    impact: "10M+ Queries/Day",
    rating: 5,
  }
];

export default function SuccessStories() {
  const [visibleCards, setVisibleCards] = useState(3);
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Dynamically calculate visible cards for perfect responsive layout
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCards(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2);
      } else {
        setVisibleCards(3);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = testimonials.length - visibleCards;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  return (
    <section className="py-24 bg-slate-100 dark:bg-[#080e21] relative overflow-hidden transition-colors duration-300" id="success-stories">
      
      {/* Dynamic Background Glow Blobs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#ff5a22]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[140px] pointer-events-none" />
      
      {/* Digital Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
        >
          <div className="text-left space-y-4 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ff5a22] shadow-[0_0_8px_#ff5a22]" />
              <span className="text-xs font-bold text-[#ff5a22] uppercase tracking-widest font-mono">Testimonials</span>
            </div>
            <h2 className="font-display font-black text-4xl sm:text-5xl text-[#070d1e] dark:text-white tracking-tight leading-none transition-colors duration-300">
              Client Success Stories
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm sm:text-base leading-relaxed transition-colors duration-300">
              Discover how leading enterprises leverage our high-performance AI integration systems to unlock unprecedented productivity and compound growth.
            </p>
          </div>

          {/* Slider Buttons */}
          <div className="flex gap-3 justify-start md:justify-end">
            <button
              onClick={prevSlide}
              className="p-3.5 bg-white dark:bg-slate-900/80 hover:bg-[#ff5a22] dark:hover:bg-[#ff5a22] text-slate-600 dark:text-slate-300 hover:text-white dark:hover:text-white rounded-xl border border-slate-200 dark:border-white/10 hover:border-[#ff5a22] dark:hover:border-[#ff5a22] shadow-lg transition-all duration-300 cursor-pointer hover:shadow-[0_0_15px_rgba(255,90,34,0.3)]"
              aria-label="Previous Success Story"
              id="success-carousel-prev"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="p-3.5 bg-white dark:bg-slate-900/80 hover:bg-[#ff5a22] dark:hover:bg-[#ff5a22] text-slate-600 dark:text-slate-300 hover:text-white dark:hover:text-white rounded-xl border border-slate-200 dark:border-white/10 hover:border-[#ff5a22] dark:hover:border-[#ff5a22] shadow-lg transition-all duration-300 cursor-pointer hover:shadow-[0_0_15px_rgba(255,90,34,0.3)]"
              aria-label="Next Success Story"
              id="success-carousel-next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Carousel Window */}
        <div className="overflow-hidden w-full" ref={containerRef} id="success-stories-carousel">
          <motion.div
            className="flex gap-6 w-full"
            animate={{
              x: `calc(-${currentIndex * (100 / visibleCards)}% - ${currentIndex * (24 - 24 / visibleCards)}px)`
            }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 28
            }}
          >
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] shrink-0 h-auto"
                id={`testimonial-card-${testimonial.id}`}
              >
                <motion.div
                  className="relative h-full bg-white dark:bg-slate-950/45 backdrop-blur-xl border border-slate-200/60 dark:border-white/[0.08] hover:border-[#ff5a22]/35 dark:hover:border-[#ff5a22]/35 rounded-[32px] p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 shadow-xl dark:shadow-2xl overflow-hidden group"
                  whileHover={{ y: -6, boxShadow: "0 25px 50px -12px rgba(255,90,34,0.12)" }}
                >
                  {/* Decorative Subtle Glowing Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#ff5a22]/0 via-[#ff5a22]/0 to-[#ff5a22]/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <div className="absolute -right-20 -top-20 w-40 h-40 bg-[#ff5a22]/5 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  
                  {/* Glass Card Content */}
                  <div>
                    {/* Quotation & Rating Headers */}
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex gap-0.5">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <Quote className="w-9 h-9 text-slate-200/60 dark:text-white/5 group-hover:text-[#ff5a22]/15 transition-all duration-500 rotate-180" />
                    </div>

                    {/* Impact metric badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#ff5a22]/10 border border-[#ff5a22]/20 text-[#ff5a22] text-[10px] sm:text-[11px] font-bold rounded-full uppercase tracking-wider mb-5 shadow-[0_0_12px_rgba(255,90,34,0.06)]">
                      <Sparkles className="w-3.5 h-3.5 text-[#ff5a22]" />
                      <span>{testimonial.impact}</span>
                    </div>

                    {/* Feedback content */}
                    <blockquote className="text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-300 text-sm sm:text-[15px] leading-relaxed font-medium font-sans italic mb-8">
                      "{testimonial.content}"
                    </blockquote>
                  </div>

                  {/* Profile Info */}
                  <div className="flex items-center gap-4 pt-6 border-t border-slate-100 dark:border-white/[0.06] mt-auto">
                    <div className="relative shrink-0">
                      <div className="absolute inset-0 rounded-full border border-[#ff5a22]/20 dark:border-[#ff5a22]/30 group-hover:scale-110 group-hover:border-[#ff5a22]/60 transition-transform duration-300" />
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 object-cover rounded-full"
                      />
                    </div>
                    <div className="text-left">
                      <h4 className="font-sans font-bold text-slate-900 dark:text-white text-base leading-snug group-hover:text-[#ff5a22] dark:group-hover:text-[#ff5a22] transition-colors duration-300">
                        {testimonial.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {testimonial.role}, <span className="text-[#ff5a22]/80 font-semibold">{testimonial.company}</span>
                      </p>
                    </div>
                  </div>

                </motion.div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Indicator dots for precise location navigation */}
        <div className="flex justify-center gap-2 mt-10">
          {[...Array(maxIndex + 1)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentIndex ? 'w-8 bg-[#ff5a22]' : 'w-2.5 bg-slate-300 dark:bg-white/20 hover:bg-slate-400 dark:hover:bg-white/40'
              }`}
              aria-label={`Go to slide group ${idx + 1}`}
              id={`carousel-indicator-${idx}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
