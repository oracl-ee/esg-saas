import React, { useEffect, useRef, useState } from 'react';
import AnimatedBackground from '../components/AnimatedBackground';

const LandingPage = ({ onBookDemo, onNavigate }) => {
  const canvasRef = useRef(null);
  const counterRef = useRef(null);
  const [counterValue, setCounterValue] = useState(0);

  // Particle system
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 50;
    
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
      }
      
      update() {
        this.x += this.vx;
        this.y += this.vy;
        
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
      
      draw() {
        ctx.fillStyle = 'rgba(99, 102, 241, 0.3)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    let animationId;
    
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.2 * (1 - distance / 100)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      
      animationId = requestAnimationFrame(animate);
    }
    
    animate();
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Counter animation
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = 1292.4;
          const duration = 2000;
          let current = 0;
          const increment = target / (duration / 16);
          
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCounterValue(target);
              clearInterval(timer);
            } else {
              setCounterValue(current);
            }
          }, 16);
          
          observer.disconnect();
        }
      });
    });
    
    if (counterRef.current) {
      observer.observe(counterRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  // Scroll reveal
  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });
    
    revealElements.forEach(el => revealObserver.observe(el));
    
    return () => revealObserver.disconnect();
  }, []);

  // Parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
      const mouseY = (e.clientY / window.innerHeight - 0.5) * 20;
      
      document.querySelectorAll('.parallax-layer').forEach((layer) => {
        const speed = 0.5;
        layer.style.transform = `translate(${mouseX * speed}px, ${mouseY * speed}px)`;
      });
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Magnetic button effect
  useEffect(() => {
    document.querySelectorAll('.magnetic-btn').forEach(btn => {
      const handleMouseMove = (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      };
      
      const handleMouseLeave = () => {
        btn.style.transform = 'translate(0, 0)';
      };
      
      btn.addEventListener('mousemove', handleMouseMove);
      btn.addEventListener('mouseleave', handleMouseLeave);
    });
  }, []);

  const scrollToDemo = () => {
    document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleGetStarted = () => {
    if (onBookDemo) {
      onBookDemo();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-gray-950 text-white overflow-x-hidden relative">
      <AnimatedBackground />
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(50px, -50px) rotate(90deg); }
          50% { transform: translate(0, -100px) rotate(180deg); }
          75% { transform: translate(-50px, -50px) rotate(270deg); }
        }
        
        @keyframes morph {
          0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          25% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
          50% { border-radius: 50% 60% 30% 60% / 30% 50% 70% 50%; }
          75% { border-radius: 60% 40% 60% 30% / 70% 30% 60% 40%; }
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.5); }
          50% { box-shadow: 0 0 40px rgba(102, 126, 234, 0.8); }
        }
        
        @keyframes growBar {
          from { width: 0; }
          to { width: var(--bar-width); }
        }
        
        @keyframes dash {
          to { stroke-dashoffset: 0; }
        }
        
        @keyframes holographic-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .geometric-shape {
          position: absolute;
          opacity: 0.1;
          animation: float 20s infinite ease-in-out;
        }
        
        .morph-shape {
          animation: morph 8s ease-in-out infinite;
        }
        
        .glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        
        .data-bar {
          height: 8px;
          animation: growBar 1.5s ease-out forwards;
        }
        
        .reveal {
          opacity: 0;
          transform: translateY(50px);
          transition: all 0.8s cubic-bezier(0.165, 0.84, 0.44, 1);
        }
        
        .reveal.active {
          opacity: 1;
          transform: translateY(0);
        }
        
        .card-3d {
          transform-style: preserve-3d;
          transition: transform 0.3s ease;
        }
        
        .card-3d:hover {
          transform: rotateX(5deg) rotateY(5deg) scale(1.05);
        }
        
        .grid-pattern {
          background-image: 
            linear-gradient(rgba(99, 102, 241, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.05) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        
        .mesh-gradient {
          background: 
            radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.3) 0px, transparent 50%),
            radial-gradient(at 100% 0%, rgba(139, 92, 246, 0.3) 0px, transparent 50%),
            radial-gradient(at 100% 100%, rgba(236, 72, 153, 0.3) 0px, transparent 50%),
            radial-gradient(at 0% 100%, rgba(251, 146, 60, 0.3) 0px, transparent 50%);
        }
        
        .glass {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .holographic {
          background: linear-gradient(135deg, 
            rgba(99, 102, 241, 0.1) 0%,
            rgba(139, 92, 246, 0.1) 25%,
            rgba(236, 72, 153, 0.1) 50%,
            rgba(251, 146, 60, 0.1) 75%,
            rgba(99, 102, 241, 0.1) 100%);
          background-size: 400% 400%;
          animation: holographic-shift 10s ease infinite;
        }
        
        .parallax-layer {
          transition: transform 0.1s ease-out;
        }
        
        .scale-hover {
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .scale-hover:hover {
          transform: scale(1.1);
        }
        
        .hexagon {
          clip-path: polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%);
        }
        
        .geo-loader {
          animation: spin 3s linear infinite;
        }
        
        .gradient-animate {
          background: linear-gradient(270deg, #667eea, #764ba2, #f093fb, #4facfe);
          background-size: 800% 800%;
          animation: gradientShift 15s ease infinite;
        }
        
        .line-connect {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: dash 2s linear forwards;
        }
        
        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
        .stagger-4 { animation-delay: 0.4s; }
        .stagger-5 { animation-delay: 0.5s; }
        .stagger-6 { animation-delay: 0.6s; }
        
        .magnetic-btn {
          position: relative;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>

      {/* Particle Canvas */}
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-[1]" />

      {/* Floating Geometric Shapes */}
      <div className="geometric-shape" style={{ top: '10%', left: '5%', width: '100px', height: '100px' }}>
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <polygon points="50,10 90,30 90,70 50,90 10,70 10,30" fill="rgba(99, 102, 241, 0.2)" stroke="rgba(99, 102, 241, 0.5)" strokeWidth="2"/>
        </svg>
      </div>

      <div className="geometric-shape" style={{ top: '60%', right: '10%', width: '80px', height: '80px', animationDelay: '-5s' }}>
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(139, 92, 246, 0.5)" strokeWidth="2"/>
          <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(236, 72, 153, 0.5)" strokeWidth="2"/>
        </svg>
      </div>

      <div className="geometric-shape" style={{ top: '30%', right: '25%', width: '120px', height: '120px', animationDelay: '-10s' }}>
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <rect x="25" y="25" width="50" height="50" fill="none" stroke="rgba(251, 146, 60, 0.5)" strokeWidth="2" transform="rotate(45 50 50)"/>
        </svg>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg blur opacity-75 animate-pulse"></div>
                <div className="relative w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
              </div>
              <span className="text-xl font-bold">CarboniQ</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#compliance" className="text-gray-300 hover:text-white transition-colors">Compliance</a>
              <a href="#timeline" className="text-gray-300 hover:text-white transition-colors">Timeline</a>
              <button 
                onClick={scrollToDemo}
                className="magnetic-btn px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
              >
                Book Demo
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
        <div className="absolute inset-0 mesh-gradient"></div>
        <div className="absolute inset-0 grid-pattern"></div>
        
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-600/20 morph-shape blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-600/20 morph-shape blur-3xl" style={{ animationDelay: '-4s' }}></div>
        
        <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 parallax-layer">
              <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full border border-white/20">
                <div className="relative">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-ping absolute"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-sm font-semibold">Live: SB 253 Enforcement Active</span>
              </div>
              
              <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
                California
                <span className="block gradient-text">Climate Compliance</span>
                <span className="block text-5xl mt-2">Reimagined</span>
              </h1>
              
              <p className="text-xl text-gray-300 leading-relaxed">
                Enterprise carbon accounting platform engineered for SB 253 & SB 261. 
                Real-time emissions tracking, automated reporting, and audit-ready documentation.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleGetStarted}
                  className="group magnetic-btn px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-2"
                >
                  Request Demo
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                  </svg>
                </button>
                <button className="px-8 py-4 glass rounded-xl font-semibold hover:bg-white/10 transition-all border border-white/20">
                  View Platform
                </button>
              </div>
              
              {/* Trust badges */}
              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-sm text-gray-300">GHG Protocol</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-sm text-gray-300">SOC 2 Type II</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-sm text-gray-300">CARB Listed</span>
                </div>
              </div>
            </div>
            
            {/* Right - Interactive Dashboard */}
            <div className="parallax-layer">
              <div className="relative">
                <div className="glass rounded-2xl p-6 border border-white/10 backdrop-blur-xl">
                  {/* Browser chrome */}
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="text-sm text-gray-400">platform.esg.app/dashboard</div>
                  </div>
                  
                  {/* Emissions display */}
                  <div ref={counterRef} className="holographic rounded-xl p-6 mb-4 border border-white/10">
                    <div className="text-sm text-gray-400 mb-2">Total GHG Emissions (2024)</div>
                    <div className="text-4xl font-bold mb-2">
                      <span className="gradient-text">{counterValue.toFixed(1)}</span>
                      <span className="text-2xl text-gray-300 ml-2">tonnes CO₂e</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"/>
                      </svg>
                      <span className="text-green-400">15.2% reduction vs. baseline</span>
                    </div>
                  </div>
                  
                  {/* Scope breakdown */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="glass rounded-lg p-4 border border-white/10">
                      <div className="text-xs text-gray-400 mb-2">Scope 1</div>
                      <div className="text-xl font-bold mb-2">243.5t</div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div className="data-bar bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" style={{ '--bar-width': '60%' }}></div>
                      </div>
                    </div>
                    <div className="glass rounded-lg p-4 border border-white/10">
                      <div className="text-xs text-gray-400 mb-2">Scope 2</div>
                      <div className="text-xl font-bold mb-2">156.8t</div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div className="data-bar bg-gradient-to-r from-purple-500 to-purple-600 rounded-full" style={{ '--bar-width': '40%', animationDelay: '0.3s' }}></div>
                      </div>
                    </div>
                    <div className="glass rounded-lg p-4 border border-white/10">
                      <div className="text-xs text-gray-400 mb-2">Scope 3</div>
                      <div className="text-xl font-bold mb-2">892.1t</div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div className="data-bar bg-gradient-to-r from-pink-500 to-pink-600 rounded-full" style={{ '--bar-width': '100%', animationDelay: '0.6s' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Status indicator */}
                  <div className="flex items-center justify-between glass rounded-lg p-4 border border-green-500/30 bg-green-500/5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center scale-hover">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-semibold">Audit Ready</div>
                        <div className="text-xs text-gray-400">100% data quality</div>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                    </svg>
                  </div>
                </div>
                
                {/* Floating stat cards */}
                <div className="absolute -top-6 -left-6 glass rounded-lg p-4 border border-white/10 backdrop-blur-xl reveal stagger-1">
                  <div className="text-3xl font-bold gradient-text">98%</div>
                  <div className="text-xs text-gray-400">Pass Rate</div>
                </div>
                
                <div className="absolute -bottom-6 -right-6 glass rounded-lg p-4 border border-white/10 backdrop-blur-xl reveal stagger-2">
                  <div className="text-3xl font-bold gradient-text">10min</div>
                  <div className="text-xs text-gray-400">Setup</div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -z-10 top-10 right-10 w-32 h-32 border-2 border-purple-500/30 hexagon"></div>
                <div className="absolute -z-10 bottom-10 left-10 w-24 h-24 border-2 border-blue-500/30 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative py-16 glass border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="reveal stagger-1 text-center">
              <div className="text-5xl font-bold mb-2">
                <span className="gradient-text">$500K</span>
              </div>
              <div className="text-sm text-gray-400">Maximum Penalty</div>
              <div className="mt-3 h-1 w-20 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
            </div>
            <div className="reveal stagger-2 text-center">
              <div className="text-5xl font-bold mb-2">
                <span className="gradient-text">Aug 2026</span>
              </div>
              <div className="text-sm text-gray-400">Reporting Deadline</div>
              <div className="mt-3 h-1 w-20 mx-auto bg-gradient-to-r from-purple-500 to-pink-600 rounded-full"></div>
            </div>
            <div className="reveal stagger-3 text-center">
              <div className="text-5xl font-bold mb-2">
                <span className="gradient-text">15+</span>
              </div>
              <div className="text-sm text-gray-400">Scope 3 Categories</div>
              <div className="mt-3 h-1 w-20 mx-auto bg-gradient-to-r from-pink-500 to-orange-600 rounded-full"></div>
            </div>
            <div className="reveal stagger-4 text-center">
              <div className="text-5xl font-bold mb-2">
                <span className="gradient-text">100%</span>
              </div>
              <div className="text-sm text-gray-400">GHG Protocol Aligned</div>
              <div className="mt-3 h-1 w-20 mx-auto bg-gradient-to-r from-orange-500 to-blue-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance Section */}
      <section id="compliance" className="py-24 relative">
        <div className="absolute inset-0 grid-pattern opacity-20"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16 reveal">
            <h2 className="text-5xl font-bold mb-6">
              Understanding
              <span className="gradient-text"> California's Laws</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              The most comprehensive corporate climate disclosure requirements in the United States
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* SB 253 Card */}
            <div className="card-3d glass rounded-2xl p-8 border border-white/10 reveal stagger-1">
              <div className="flex items-start gap-4 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500 rounded-xl blur opacity-50"></div>
                  <div className="relative w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">SB 253</h3>
                  <div className="text-sm text-blue-400">Emissions Disclosure Act</div>
                </div>
              </div>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                Annual disclosure of Scope 1, 2, and 3 greenhouse gas emissions for companies with more than $1B revenue using the GHG Protocol standard.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 group">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <span className="text-gray-300">Scope 1 & 2 reporting from 2026</span>
                </div>
                <div className="flex items-start gap-3 group">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <span className="text-gray-300">Scope 3 reporting from 2027</span>
                </div>
                <div className="flex items-start gap-3 group">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <span className="text-gray-300">Third-party assurance required</span>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-white/10">
                <button 
                  onClick={() => onNavigate('about')}
                  className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-2 group"
                >
                  Learn more about SB 253
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </div>
            
            {/* SB 261 Card */}
            <div className="card-3d glass rounded-2xl p-8 border border-white/10 reveal stagger-2">
              <div className="flex items-start gap-4 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-500 rounded-xl blur opacity-50"></div>
                  <div className="relative w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">SB 261</h3>
                  <div className="text-sm text-purple-400">Climate Risk Reporting Act</div>
                </div>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Biennial climate-related financial risk reports for companies with more than$500M revenue aligned with TCFD or ISSB frameworks.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3 group">
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <span className="text-gray-300">Physical & transition risk assessment</span>
                </div>
                <div className="flex items-start gap-3 group">
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <span className="text-gray-300">Scenario analysis required</span>
                </div>
                <div className="flex items-start gap-3 group">
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <span className="text-gray-300">CARB public docket submission</span>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-white/10">
                <button 
                  onClick={() => onNavigate('about')}
                  className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-2 group"
                >
                  Learn more about SB 261
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          {/* Who Needs to Comply */}
          <div className="mt-16 glass rounded-2xl p-10 border border-white/10 reveal">
            <h3 className="text-3xl font-bold mb-8 text-center">
              <span className="gradient-text">Who Needs to Comply?</span>
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="group card-3d glass rounded-xl p-6 border border-white/10 hover:border-blue-500/50 transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4 scale-hover">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                  </svg>
                </div>
                <h4 className="text-lg font-bold mb-2">US Entities</h4>
                <p className="text-sm text-gray-400">Public and private companies organized or incorporated in the United States</p>
              </div>
              
              <div className="group card-3d glass rounded-xl p-6 border border-white/10 hover:border-purple-500/50 transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 scale-hover">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <h4 className="text-lg font-bold mb-2">Revenue Threshold</h4>
                <p className="text-sm text-gray-400">$1B+ annual revenue (SB 253) or $500M+ (SB 261)</p>
              </div>
              
              <div className="group card-3d glass rounded-xl p-6 border border-white/10 hover:border-pink-500/50 transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center mb-4 scale-hover">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </div>
                <h4 className="text-lg font-bold mb-2">California Business</h4>
                <p className="text-sm text-gray-400">"Doing business" in California per state tax definitions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="absolute inset-0 mesh-gradient opacity-50"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16 reveal">
            <h2 className="text-5xl font-bold mb-6">
              <span className="gradient-text">Platform Capabilities</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Complete regulatory workflow from data collection to submission
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card-3d glass rounded-2xl p-8 border border-white/10 reveal stagger-1 group hover:border-blue-500/50 transition-all">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-blue-500 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">Complete Scope Coverage</h3>
              <p className="text-gray-400 mb-4 leading-relaxed">
                Measure Scope 1, 2, and all 15 Scope 3 categories with California-specific emission factors. Dual methodology for Scope 2.
              </p>
              <button className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-2 group/btn">
                Explore
                <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
            
            {/* Feature 2 */}
            <div className="card-3d glass rounded-2xl p-8 border border-white/10 reveal stagger-2 group hover:border-green-500/50 transition-all">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-green-500 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">Assurance-Ready Data</h3>
              <p className="text-gray-400 mb-4 leading-relaxed">
                Built-in data quality checks, complete audit trails, and documentation management. 98% assurance pass rate.
              </p>
              <button className="text-green-400 hover:text-green-300 font-semibold flex items-center gap-2 group/btn">
                Explore
                <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
            
            {/* Feature 3 */}
            <div className="card-3d glass rounded-2xl p-8 border border-white/10 reveal stagger-3 group hover:border-purple-500/50 transition-all">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-purple-500 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">GHG Protocol Certified</h3>
              <p className="text-gray-400 mb-4 leading-relaxed">
                Calculations align with GHG Protocol Corporate Standard and CARB templates. Generate submission-ready reports.
              </p>
              <button className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-2 group/btn">
                Explore
                <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
            
            {/* Feature 4 */}
            <div className="card-3d glass rounded-2xl p-8 border border-white/10 reveal stagger-4 group hover:border-orange-500/50 transition-all">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-orange-500 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">Automated Data Collection</h3>
              <p className="text-gray-400 mb-4 leading-relaxed">
                Connect utility accounts, ERP systems, and procurement data. Reduce manual work by 80% and eliminate spreadsheet errors.
              </p>
              <button className="text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-2 group/btn">
                Explore
                <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
            
            {/* Feature 5 */}
            <div className="card-3d glass rounded-2xl p-8 border border-white/10 reveal stagger-5 group hover:border-red-500/50 transition-all">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-red-500 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">Expert Support</h3>
              <p className="text-gray-400 mb-4 leading-relaxed">
                Dedicated carbon accounting specialists guide you through regulatory requirements and methodology choices.
              </p>
              <button className="text-red-400 hover:text-red-300 font-semibold flex items-center gap-2 group/btn">
                Explore
                <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
            
            {/* Feature 6 */}
            <div className="card-3d glass rounded-2xl p-8 border border-white/10 reveal stagger-6 group hover:border-indigo-500/50 transition-all">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-indigo-500 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">Multi-Framework Ready</h3>
              <p className="text-gray-400 mb-4 leading-relaxed">
                Reuse data for CDP, CSRD, SEC climate rule, and other frameworks. One platform for all sustainability reporting.
              </p>
              <button className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-2 group/btn">
                Explore
                <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section id="timeline" className="py-24 relative">
        <div className="absolute inset-0 grid-pattern opacity-20"></div>
        
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16 reveal">
            <h2 className="text-5xl font-bold mb-6">
              <span className="gradient-text">Compliance Timeline</span>
            </h2>
            <p className="text-xl text-gray-400">
              Key milestones for California climate disclosure
            </p>
          </div>
          
          {/* SVG Timeline Connector */}
          <svg className="absolute left-1/2 top-32 h-full w-1 -translate-x-1/2" style={{ zIndex: -1 }}>
            <line x1="0" y1="0" x2="0" y2="100%" stroke="url(#lineGradient)" strokeWidth="2" className="line-connect"/>
            <defs>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(99, 102, 241, 0.5)"/>
                <stop offset="50%" stopColor="rgba(139, 92, 246, 0.5)"/>
                <stop offset="100%" stopColor="rgba(236, 72, 153, 0.5)"/>
              </linearGradient>
            </defs>
          </svg>
          
          <div className="space-y-12">
            {/* 2026 */}
            <div className="reveal stagger-1">
              <div className="flex items-start gap-8">
                <div className="flex-shrink-0 w-32 text-right">
                  <div className="text-3xl font-bold gradient-text">2026</div>
                  <div className="text-sm text-gray-400">Aug 10</div>
                </div>
                <div className="relative">
                  <div className="absolute -left-8 top-4 w-4 h-4 bg-blue-500 rounded-full glow"></div>
                </div>
                <div className="flex-1 glass rounded-xl p-6 border border-blue-500/30 card-3d">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center scale-hover">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold">First SB 253 Reports Due</h3>
                  </div>
                  <p className="text-gray-300">
                    Scope 1 & 2 emissions for FY 2025 data. Template optional in first year. Limited assurance not required initially.
                  </p>
                </div>
              </div>
            </div>
            
            {/* 2027 */}
            <div className="reveal stagger-2">
              <div className="flex items-start gap-8">
                <div className="flex-shrink-0 w-32 text-right">
                  <div className="text-3xl font-bold gradient-text">2027</div>
                  <div className="text-sm text-gray-400">August</div>
                </div>
                <div className="relative">
                  <div className="absolute -left-8 top-4 w-4 h-4 bg-purple-500 rounded-full glow"></div>
                </div>
                <div className="flex-1 glass rounded-xl p-6 border border-purple-500/30 card-3d">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center scale-hover">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold">Scope 3 Reporting Begins</h3>
                  </div>
                  <p className="text-gray-300">
                    Full Scope 1, 2, and 3 disclosure required. Limited third-party assurance for Scopes 1 & 2. All 15 Scope 3 categories.
                  </p>
                </div>
              </div>
            </div>
            
            {/* 2030 */}
            <div className="reveal stagger-3">
              <div className="flex items-start gap-8">
                <div className="flex-shrink-0 w-32 text-right">
                  <div className="text-3xl font-bold gradient-text">2030</div>
                  <div className="text-sm text-gray-400">Starting</div>
                </div>
                <div className="relative">
                  <div className="absolute -left-8 top-4 w-4 h-4 bg-green-500 rounded-full glow"></div>
                </div>
                <div className="flex-1 glass rounded-xl p-6 border border-green-500/30 card-3d">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center scale-hover">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold">Reasonable Assurance Required</h3>
                  </div>
                  <p className="text-gray-300">
                    Higher standard of third-party verification for Scope 1 & 2. CARB may introduce reasonable assurance for Scope 3.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 gradient-animate opacity-90"></div>
        <div className="absolute inset-0 grid-pattern"></div>
        
        <div className="absolute top-20 left-20 w-32 h-32 border-2 border-white/20 hexagon geo-loader"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 border-2 border-white/20 rounded-full geo-loader" style={{ animationDirection: 'reverse' }}></div>
        
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12 reveal">
            <h2 className="text-5xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-2xl text-white/90">
              See our platform in action with a personalized demo
            </p>
          </div>
          
          <div className="glass rounded-2xl p-8 shadow-2xl border border-white/20 backdrop-blur-xl reveal">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <input type="text" placeholder="Company Name *" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all" />
                <input type="email" placeholder="Work Email *" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all" />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <input type="tel" placeholder="Phone Number *" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all" />
                <select className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all">
                  <option value="" disabled>Annual Revenue *</option>
                  <option>$500M - $1B</option>
                  <option>$1B - $5B</option>
                  <option>$5B+</option>
                </select>
              </div>
              <textarea placeholder="Tell us about your compliance needs (optional)" rows="3" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all resize-none"></textarea>
              <button 
                type="button"
                onClick={handleGetStarted}
                className="w-full magnetic-btn bg-white text-gray-900 py-4 rounded-lg font-bold text-lg hover:shadow-2xl transition-all flex items-center justify-center gap-2 group"
              >
                Schedule Demo
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </button>
            </form>
            <p className="text-sm text-white/70 mt-6 text-center">
              Our team will contact you within 24 hours. By submitting, you agree to our Terms & Privacy Policy.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-16 bg-gray-950 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
                <span className="text-xl font-bold">CarboniQ</span>
              </div>
              <p className="text-gray-400 mb-6">
                Enterprise carbon accounting for California SB 253 & SB 261 compliance
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 glass rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 glass rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 glass rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Case Studies</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">SB 253 Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Webinars</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400 text-sm">
            <p>© 2026 CarboniQ. All rights reserved.</p>
            <div className="flex gap-6">
              <span>SOC 2 Type II</span>
              <span>•</span>
              <span>GHG Protocol</span>
              <span>•</span>
              <span>CARB Listed</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
