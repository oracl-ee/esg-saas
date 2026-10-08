// APP.JSX - Complete 3-View SaaS Application
// 
// Features:
// - 3-View Architecture: Landing → Forms → Dashboard (separate pages)
// - Real-time validation as user types
// - Format checking (ZIP codes, numbers, text)
// - City/ZIP code verification using Zippopotam.us API
// - "Other" industry custom input field
// - Data sanitization
// - Dark geometric theme matching landing page
// - localStorage persistence

import React, { useState, useEffect, useRef } from 'react';
import { useFormContext } from './context/FormContext';
import { Building, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import LandingPage from './pages/LandingPage';
import DataEntryChoice from './components/forms/DataEntryChoice';
import ElectricityForm from './components/forms/ElectricityForm';
import NaturalGasForm from './components/forms/NaturalGasForm';
import FuelsForm from './components/forms/FuelsForm';
import ReviewAndCalculate from './components/forms/ReviewAndCalculate';
import DashboardPage from './pages/DashboardPage';
import AboutSB253 from './pages/AboutSB253';
import FAQ from './pages/FAQ';
import ComplianceGuide from './pages/ComplianceGuide';

function App() {
  const { 
    formData, 
    updateField, 
    currentStep, 
    nextStep,
    prevStep,
    saveMessage,
    errors,
    setErrors,
    setCurrentStep 
  } = useFormContext();

  // App view state: 'landing', 'forms', or 'dashboard'
  const [appView, setAppView] = useState('landing');

  // Info page state: null, 'about', 'faq', or 'guide'
  const [infoPage, setInfoPage] = useState(null);

  // Particle canvas ref
  const canvasRef = useRef(null);

  // Local state for ZIP verification
  const [zipVerifying, setZipVerifying] = useState(false);
  const [zipVerified, setZipVerified] = useState(false);
  const [zipCityMatch, setZipCityMatch] = useState(null);

  // Check localStorage on mount
  useEffect(() => {
    const hasBooked = localStorage.getItem('esgUserBooked');
    const hasDashboard = localStorage.getItem('esgHasDashboard');
    
    if (hasDashboard === 'true') {
      setAppView('dashboard');
    } else if (hasBooked === 'true') {
      setAppView('forms');
    }
  }, []);

  // Navigation handlers
  const handleBookDemo = () => {
    setAppView('forms');
    setCurrentStep(1);
    localStorage.setItem('esgUserBooked', 'true');
    window.scrollTo(0, 0);
  };

  const handleGoToDashboard = () => {
    setAppView('dashboard');
    localStorage.setItem('esgHasDashboard', 'true');
    window.scrollTo(0, 0);
  };

  const handleReturnToForms = () => {
    setAppView('forms');
    setCurrentStep(6); // Go back to review page
    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
    setAppView('landing');
    setCurrentStep(0);
    localStorage.removeItem('esgUserBooked');
    localStorage.removeItem('esgHasDashboard');
    localStorage.removeItem('esgFormData');
    localStorage.removeItem('esgCurrentStep');
    window.scrollTo(0, 0);
  };

  // Info page navigation handlers
  const handleNavigateToInfo = (page) => {
    setInfoPage(page);
    window.scrollTo(0, 0);
  };

  const handleBackFromInfo = () => {
    setInfoPage(null);
    window.scrollTo(0, 0);
  };

  // Particle system for forms (only when appView === 'forms')
  useEffect(() => {
    if (appView !== 'forms') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 80;
    
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 1.2;
        this.vy = (Math.random() - 0.5) * 1.2;
        this.size = Math.random() * 2.5 + 1;
      }
      
      update() {
        this.x += this.vx;
        this.y += this.vy;
        
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
      
      draw() {
        ctx.fillStyle = 'rgba(99, 102, 241, 0.4)';
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
          
          if (distance < 120) {
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.3 * (1 - distance / 120)})`;
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
  }, [appView]);

  // ZIP verification using Zippopotam.us API
  const verifyZipCode = async (zipCode, city) => {
    if (!zipCode || zipCode.length !== 5 || !city || city.trim().length < 2) {
      setZipVerified(false);
      setZipCityMatch(null);
      return;
    }

    setZipVerifying(true);

    try {
      const response = await fetch(`https://api.zippopotam.us/us/${zipCode}`);
      
      if (!response.ok) {
        setZipVerified(false);
        setZipCityMatch(null);
        const newErrors = { ...errors };
        newErrors['company.zipCode'] = 'Invalid ZIP code - not found in database';
        setErrors(newErrors);
        setZipVerifying(false);
        return;
      }

      const data = await response.json();
      const places = data.places || [];
      const cityLower = city.trim().toLowerCase();
      
      const cityMatch = places.some(place => 
        place['place name'].toLowerCase() === cityLower
      );

      setZipVerified(true);
      setZipCityMatch(cityMatch);

      const newErrors = { ...errors };
      
      if (!cityMatch && places.length > 0) {
        const correctCity = places[0]['place name'];
        newErrors['company.city'] = `ZIP ${zipCode} is in ${correctCity}, not ${city}`;
        delete newErrors['company.zipCode'];
      } else {
        delete newErrors['company.city'];
        delete newErrors['company.zipCode'];
      }
      
      setErrors(newErrors);

    } catch (error) {
      console.error('ZIP verification error:', error);
      setZipVerified(false);
      setZipCityMatch(null);
    }

    setZipVerifying(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.company.zipCode && formData.company.city) {
        verifyZipCode(formData.company.zipCode, formData.company.city);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [formData.company.zipCode, formData.company.city]);

  // VALIDATION HELPERS
  const isValidZip = (zip) => {
    return /^\d{5}$/.test(zip);
  };

  const isValidCompanyName = (name) => {
    if (name.trim().length < 2) return false;
    const validPattern = /^[a-zA-Z0-9\s&\-.,']+$/;
    return validPattern.test(name);
  };

  const isValidCity = (city) => {
    const validPattern = /^[a-zA-Z\s\-']+$/;
    return city.trim().length >= 2 && validPattern.test(city);
  };

  const isValidEmployeeCount = (count) => {
    const num = parseInt(count);
    return !isNaN(num) && num > 0 && num <= 1000000 && Number.isInteger(num);
  };

  // REAL-TIME VALIDATION
  const validateFieldRealtime = (section, field, value) => {
    const newErrors = { ...errors };
    const errorKey = `${section}.${field}`;
    delete newErrors[errorKey];

    if (field === 'name' && value.trim().length > 0) {
      if (value.trim().length < 2) {
        newErrors[errorKey] = 'Company name must be at least 2 characters';
      } else if (!isValidCompanyName(value)) {
        newErrors[errorKey] = 'Company name contains invalid characters';
      } else if (value.trim().length > 100) {
        newErrors[errorKey] = 'Company name is too long (max 100 characters)';
      }
    }

    if (field === 'city' && value.trim().length > 0) {
      if (!isValidCity(value)) {
        newErrors[errorKey] = 'City name should contain only letters';
      } else if (value.trim().length > 50) {
        newErrors[errorKey] = 'City name is too long';
      }
    }

    if (field === 'zipCode' && value.length > 0) {
      if (value.length !== 5) {
        newErrors[errorKey] = 'ZIP code must be exactly 5 digits';
      } else if (!/^\d+$/.test(value)) {
        newErrors[errorKey] = 'ZIP code must contain only numbers';
      }
    }

    if (field === 'employees' && value) {
      const num = parseInt(value);
      if (isNaN(num)) {
        newErrors[errorKey] = 'Must be a number';
      } else if (num <= 0) {
        newErrors[errorKey] = 'Must be at least 1 employee';
      } else if (num > 1000000) {
        newErrors[errorKey] = 'Number seems too high - please verify';
      } else if (!Number.isInteger(parseFloat(value))) {
        newErrors[errorKey] = 'Must be a whole number (no decimals)';
      }
    }

    if (field === 'industryOther' && value.trim().length > 0) {
      if (value.trim().length < 2) {
        newErrors[errorKey] = 'Industry must be at least 2 characters';
      } else if (value.trim().length > 50) {
        newErrors[errorKey] = 'Industry name is too long';
      }
    }

    setErrors(newErrors);
  };

  // FINAL VALIDATION
  const validateCompanyProfile = () => {
    const newErrors = {};
    
    if (!formData.company.name?.trim()) {
      newErrors['company.name'] = 'Company name is required';
    } else if (!isValidCompanyName(formData.company.name)) {
      newErrors['company.name'] = 'Company name contains invalid characters';
    } else if (formData.company.name.trim().length < 2) {
      newErrors['company.name'] = 'Company name must be at least 2 characters';
    } else if (formData.company.name.trim().length > 100) {
      newErrors['company.name'] = 'Company name is too long (max 100 characters)';
    }
    
    if (!formData.company.industry) {
      newErrors['company.industry'] = 'Please select an industry';
    }

    if (formData.company.industry === 'Other') {
      if (!formData.company.industryOther?.trim()) {
        newErrors['company.industryOther'] = 'Please specify your industry';
      } else if (formData.company.industryOther.trim().length < 2) {
        newErrors['company.industryOther'] = 'Industry must be at least 2 characters';
      }
    }
    
    if (!formData.company.employees) {
      newErrors['company.employees'] = 'Number of employees is required';
    } else if (!isValidEmployeeCount(formData.company.employees)) {
      newErrors['company.employees'] = 'Enter a valid number of employees (1-1,000,000)';
    }
    
    if (!formData.company.city?.trim()) {
      newErrors['company.city'] = 'City is required';
    } else if (!isValidCity(formData.company.city)) {
      newErrors['company.city'] = 'City name should contain only letters';
    }
    
    if (!formData.company.zipCode?.trim()) {
      newErrors['company.zipCode'] = 'ZIP code is required';
    } else if (!isValidZip(formData.company.zipCode)) {
      newErrors['company.zipCode'] = 'Enter a valid 5-digit California ZIP code (e.g., 94102)';
    } else if (!zipVerified) {
      newErrors['company.zipCode'] = 'Please wait for ZIP code verification';
    } else if (zipCityMatch === false) {
      newErrors['company.city'] = 'City and ZIP code do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // INPUT HANDLERS
  const handleFieldChange = (section, field, value) => {
    let sanitizedValue = value;

    if (field === 'zipCode') {
      sanitizedValue = value.replace(/\D/g, '').slice(0, 5);
    }

    if (field === 'employees') {
      sanitizedValue = value.replace(/\D/g, '');
    }

    if (field === 'city') {
      sanitizedValue = value.replace(/[^a-zA-Z\s\-']/g, '');
    }

    if (field === 'name') {
      sanitizedValue = value.replace(/\s{2,}/g, ' ');
    }

    updateField(section, field, sanitizedValue);
    validateFieldRealtime(section, field, sanitizedValue);
  };

  const handleContinue = () => {
    if (validateCompanyProfile()) {
      nextStep();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isFieldValid = (section, field) => {
    const errorKey = `${section}.${field}`;
    const value = formData[section]?.[field];
    
    if (field === 'zipCode') {
      return !errors[errorKey] && value && value.length === 5 && zipVerified && zipCityMatch !== false;
    }

    if (field === 'city') {
      return !errors[errorKey] && value && value.trim().length > 0 && isValidCity(value) && zipCityMatch !== false;
    }

    if (!errors[errorKey] && value && value.toString().trim().length > 0) {
      if (field === 'name') return isValidCompanyName(value);
      if (field === 'employees') return isValidEmployeeCount(value);
      if (field === 'industry') return value.length > 0;
      if (field === 'industryOther') return value.trim().length >= 2;
      return true;
    }
    return false;
  };

  // RENDER: Information Pages
  if (infoPage === 'about') {
    return <AboutSB253 onBack={handleBackFromInfo} />;
  }
  if (infoPage === 'faq') {
    return <FAQ onBack={handleBackFromInfo} />;
  }
  if (infoPage === 'guide') {
    return <ComplianceGuide onBack={handleBackFromInfo} />;
  }

  // RENDER: Landing Page (Full Screen)
  if (appView === 'landing') {
    return <LandingPage onBookDemo={handleBookDemo} onNavigate={handleNavigateToInfo} />;
  }

  // RENDER: Dashboard (Full Screen - Separate Page)
  if (appView === 'dashboard') {
    return (
      <DashboardPage 
        onBack={handleReturnToForms}
        onLogout={handleLogout}
      />
    );
  }

  // RENDER: Forms (Steps 1-6 Only - NO Step 7!)
  if (appView === 'forms') {
    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <div className="min-h-screen py-12 px-4 relative overflow-hidden">
          {/* Particle Canvas Background */}
          <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none"
            style={{ background: 'transparent' }}
          />

          {/* Floating Geometric Shapes */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            {/* Large Hexagon */}
            <div className="absolute top-20 left-10 w-24 h-24 opacity-20 animate-float-slow">
              <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" fill="none" stroke="url(#grad1)" strokeWidth="2"/>
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: 'rgb(99, 102, 241)', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: 'rgb(139, 92, 246)', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Medium Circle */}
            <div className="absolute top-1/4 right-20 w-20 h-20 opacity-15 animate-float-medium" style={{ animationDelay: '1s' }}>
              <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" fill="none" stroke="url(#grad2)" strokeWidth="2"/>
                <defs>
                  <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: 'rgb(139, 92, 246)', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: 'rgb(236, 72, 153)', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Diamond Square */}
            <div className="absolute top-1/2 left-1/4 w-16 h-16 opacity-20 animate-float-fast" style={{ animationDelay: '2s' }}>
              <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <rect x="25" y="25" width="50" height="50" fill="none" stroke="url(#grad3)" strokeWidth="2" transform="rotate(45 50 50)"/>
                <defs>
                  <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: 'rgb(236, 72, 153)', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: 'rgb(249, 115, 22)', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Small Hexagon */}
            <div className="absolute bottom-1/4 right-1/3 w-14 h-14 opacity-25 animate-float-medium" style={{ animationDelay: '0.5s' }}>
              <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <polygon points="50,10 85,30 85,70 50,90 15,70 15,30" fill="none" stroke="url(#grad4)" strokeWidth="2"/>
                <defs>
                  <linearGradient id="grad4" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: 'rgb(59, 130, 246)', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: 'rgb(99, 102, 241)', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Small Circle */}
            <div className="absolute top-2/3 left-1/2 w-12 h-12 opacity-20 animate-float-slow" style={{ animationDelay: '1.5s' }}>
              <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="40" fill="none" stroke="url(#grad5)" strokeWidth="2"/>
                <defs>
                  <linearGradient id="grad5" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: 'rgb(167, 139, 250)', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: 'rgb(139, 92, 246)', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Triangle */}
            <div className="absolute bottom-1/3 left-20 w-18 h-18 opacity-15 animate-float-fast" style={{ animationDelay: '2.5s' }}>
              <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <polygon points="50,10 90,80 10,80" fill="none" stroke="url(#grad6)" strokeWidth="2"/>
                <defs>
                  <linearGradient id="grad6" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: 'rgb(59, 130, 246)', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: 'rgb(139, 92, 246)', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Large Circle Right */}
            <div className="absolute top-1/3 right-10 w-28 h-28 opacity-10 animate-float-medium" style={{ animationDelay: '3s' }}>
              <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="48" fill="none" stroke="url(#grad7)" strokeWidth="1.5"/>
                <defs>
                  <linearGradient id="grad7" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: 'rgb(99, 102, 241)', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: 'rgb(236, 72, 153)', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Pentagon */}
            <div className="absolute bottom-20 right-1/4 w-16 h-16 opacity-20 animate-float-slow" style={{ animationDelay: '1.8s' }}>
              <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <polygon points="50,5 95,35 75,85 25,85 5,35" fill="none" stroke="url(#grad8)" strokeWidth="2"/>
                <defs>
                  <linearGradient id="grad8" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: 'rgb(236, 72, 153)', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: 'rgb(139, 92, 246)', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          <style>{`
            @keyframes float-slow {
              0%, 100% { transform: translate(0, 0) rotate(0deg); }
              25% { transform: translate(10px, -15px) rotate(5deg); }
              50% { transform: translate(-5px, -30px) rotate(-3deg); }
              75% { transform: translate(-10px, -15px) rotate(3deg); }
            }
            
            @keyframes float-medium {
              0%, 100% { transform: translate(0, 0) rotate(0deg); }
              33% { transform: translate(15px, -20px) rotate(8deg); }
              66% { transform: translate(-10px, -25px) rotate(-5deg); }
            }
            
            @keyframes float-fast {
              0%, 100% { transform: translate(0, 0) rotate(0deg); }
              25% { transform: translate(12px, -18px) rotate(10deg); }
              50% { transform: translate(-8px, -35px) rotate(-8deg); }
              75% { transform: translate(-15px, -20px) rotate(6deg); }
            }
            
            .animate-float-slow {
              animation: float-slow 8s ease-in-out infinite;
            }
            
            .animate-float-medium {
              animation: float-medium 6s ease-in-out infinite;
            }
            
            .animate-float-fast {
              animation: float-fast 5s ease-in-out infinite;
            }
          `}</style>

          <div className="max-w-3xl mx-auto relative z-10">
            
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-2">
                CarboniQ
              </h1>
              <p className="text-gray-400">
                SB 253 Compliance Made Simple
              </p>
            </div>

            {/* Progress Bar (Steps 1-6 Only) */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-300">
                  Step {currentStep} of 6
                </span>
                <span className="text-sm text-gray-400">
                  {Math.round((currentStep / 6) * 100)}% Complete
                </span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2.5">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${(currentStep / 6) * 100}%` }}
                />
              </div>
            </div>

            {/* Save Message */}
            {saveMessage && (
              <div className="mb-4 text-center animate-fadeIn">
                <span className="inline-block text-sm text-green-400 bg-green-500/10 px-4 py-2 rounded-full border border-green-500/30">
                  ✓ {saveMessage}
                </span>
              </div>
            )}

            {/* Form Card */}
            <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-8">
              
              {/* Step 1: Company Profile */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <Building className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        Welcome! Let's set up your company profile
                      </h2>
                      <p className="text-sm text-gray-400">This takes about 3 minutes</p>
                    </div>
                  </div>

                  {/* Company Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Company Name *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.company.name || ''}
                        onChange={(e) => handleFieldChange('company', 'name', e.target.value)}
                        className={`w-full px-4 py-3 bg-white/5 border rounded-lg focus:ring-2 text-white placeholder-gray-500 focus:outline-none transition ${
                          errors['company.name'] 
                            ? 'border-red-500 focus:ring-red-500/50 pr-10' 
                            : isFieldValid('company', 'name')
                            ? 'border-green-500 focus:ring-green-500/50 pr-10'
                            : 'border-white/10 focus:ring-blue-500/50'
                        }`}
                        placeholder="Acme Manufacturing Inc."
                        maxLength="100"
                      />
                      {isFieldValid('company', 'name') && (
                        <CheckCircle className="absolute right-3 top-3.5 w-5 h-5 text-green-400" />
                      )}
                    </div>
                    {errors['company.name'] && (
                      <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors['company.name']}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      {formData.company.name?.length || 0}/100 characters
                    </p>
                  </div>

                  {/* Industry */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Industry *
                    </label>
                    <div className="relative">
                      <select
                        value={formData.company.industry || ''}
                        onChange={(e) => handleFieldChange('company', 'industry', e.target.value)}
                        className={`w-full px-4 py-3 bg-white/5 border rounded-lg focus:ring-2 text-white focus:outline-none transition appearance-none ${
                          errors['company.industry'] 
                            ? 'border-red-500 focus:ring-red-500/50' 
                            : isFieldValid('company', 'industry')
                            ? 'border-green-500 focus:ring-green-500/50'
                            : 'border-white/10 focus:ring-blue-500/50'
                        }`}
                      >
                        <option value="" className="bg-gray-900">Select industry...</option>
                        <option value="Manufacturing" className="bg-gray-900">Manufacturing</option>
                        <option value="Technology" className="bg-gray-900">Technology</option>
                        <option value="Retail" className="bg-gray-900">Retail</option>
                        <option value="Food & Beverage" className="bg-gray-900">Food & Beverage</option>
                        <option value="Healthcare" className="bg-gray-900">Healthcare</option>
                        <option value="Professional Services" className="bg-gray-900">Professional Services</option>
                        <option value="Construction" className="bg-gray-900">Construction</option>
                        <option value="Transportation" className="bg-gray-900">Transportation & Logistics</option>
                        <option value="Other" className="bg-gray-900">Other (please specify)</option>
                      </select>
                      {isFieldValid('company', 'industry') && formData.company.industry !== 'Other' && (
                        <CheckCircle className="absolute right-10 top-3.5 w-5 h-5 text-green-400 pointer-events-none" />
                      )}
                    </div>
                    {errors['company.industry'] && (
                      <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors['company.industry']}
                      </p>
                    )}
                  </div>

                  {/* Industry Other (Conditional) */}
                  {formData.company.industry === 'Other' && (
                    <div className="animate-fadeIn">
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Please specify your industry *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.company.industryOther || ''}
                          onChange={(e) => handleFieldChange('company', 'industryOther', e.target.value)}
                          className={`w-full px-4 py-3 bg-white/5 border rounded-lg focus:ring-2 text-white placeholder-gray-500 focus:outline-none transition ${
                            errors['company.industryOther'] 
                              ? 'border-red-500 focus:ring-red-500/50 pr-10' 
                              : isFieldValid('company', 'industryOther')
                              ? 'border-green-500 focus:ring-green-500/50 pr-10'
                              : 'border-white/10 focus:ring-blue-500/50'
                          }`}
                          placeholder="e.g., Aerospace, Agriculture, Mining..."
                          maxLength="50"
                        />
                        {isFieldValid('company', 'industryOther') && (
                          <CheckCircle className="absolute right-3 top-3.5 w-5 h-5 text-green-400" />
                        )}
                      </div>
                      {errors['company.industryOther'] && (
                        <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors['company.industryOther']}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Employees & Reporting Year */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Number of Employees *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          inputMode="numeric"
                          value={formData.company.employees || ''}
                          onChange={(e) => handleFieldChange('company', 'employees', e.target.value)}
                          className={`w-full px-4 py-3 bg-white/5 border rounded-lg focus:ring-2 text-white placeholder-gray-500 focus:outline-none transition ${
                            errors['company.employees'] 
                              ? 'border-red-500 focus:ring-red-500/50 pr-10' 
                              : isFieldValid('company', 'employees')
                              ? 'border-green-500 focus:ring-green-500/50 pr-10'
                              : 'border-white/10 focus:ring-blue-500/50'
                          }`}
                          placeholder="250"
                        />
                        {isFieldValid('company', 'employees') && (
                          <CheckCircle className="absolute right-3 top-3.5 w-5 h-5 text-green-400" />
                        )}
                      </div>
                      {errors['company.employees'] && (
                        <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors['company.employees']}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        Whole numbers only (1-1,000,000)
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Reporting Year *
                      </label>
                      <select
                        value={formData.company.reportingYear || '2024'}
                        onChange={(e) => handleFieldChange('company', 'reportingYear', e.target.value)}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500/50 text-white focus:outline-none transition"
                      >
                        <option value="2024" className="bg-gray-900">2024</option>
                        <option value="2023" className="bg-gray-900">2023</option>
                        <option value="2022" className="bg-gray-900">2022</option>
                      </select>
                    </div>
                  </div>

                  {/* City & ZIP */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        City *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.company.city || ''}
                          onChange={(e) => handleFieldChange('company', 'city', e.target.value)}
                          className={`w-full px-4 py-3 bg-white/5 border rounded-lg focus:ring-2 text-white placeholder-gray-500 focus:outline-none transition ${
                            errors['company.city'] 
                              ? 'border-red-500 focus:ring-red-500/50 pr-10' 
                              : isFieldValid('company', 'city')
                              ? 'border-green-500 focus:ring-green-500/50 pr-10'
                              : 'border-white/10 focus:ring-blue-500/50'
                          }`}
                          placeholder="San Francisco"
                          maxLength="50"
                        />
                        {zipVerifying && formData.company.city && (
                          <Loader className="absolute right-3 top-3.5 w-5 h-5 text-blue-400 animate-spin" />
                        )}
                        {!zipVerifying && isFieldValid('company', 'city') && (
                          <CheckCircle className="absolute right-3 top-3.5 w-5 h-5 text-green-400" />
                        )}
                      </div>
                      {errors['company.city'] && (
                        <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors['company.city']}
                        </p>
                      )}
                      {zipVerified && zipCityMatch && !errors['company.city'] && (
                        <p className="mt-1 text-sm text-green-400 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          City and ZIP code verified ✓
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        ZIP Code *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          inputMode="numeric"
                          value={formData.company.zipCode || ''}
                          onChange={(e) => handleFieldChange('company', 'zipCode', e.target.value)}
                          className={`w-full px-4 py-3 bg-white/5 border rounded-lg focus:ring-2 text-white placeholder-gray-500 focus:outline-none transition ${
                            errors['company.zipCode'] 
                              ? 'border-red-500 focus:ring-red-500/50 pr-10' 
                              : isFieldValid('company', 'zipCode')
                              ? 'border-green-500 focus:ring-green-500/50 pr-10'
                              : 'border-white/10 focus:ring-blue-500/50'
                          }`}
                          placeholder="94102"
                          maxLength="5"
                        />
                        {zipVerifying && formData.company.zipCode?.length === 5 && (
                          <Loader className="absolute right-3 top-3.5 w-5 h-5 text-blue-400 animate-spin" />
                        )}
                        {!zipVerifying && isFieldValid('company', 'zipCode') && (
                          <CheckCircle className="absolute right-3 top-3.5 w-5 h-5 text-green-400" />
                        )}
                      </div>
                      {errors['company.zipCode'] && (
                        <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors['company.zipCode']}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">5 digits</p>
                    </div>
                  </div>

                  {/* Continue Button */}
                  <button
                    onClick={handleContinue}
                    disabled={zipVerifying}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                      zipVerifying
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:shadow-purple-500/50'
                    }`}
                  >
                    {zipVerifying ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader className="w-5 h-5 animate-spin" />
                        Verifying ZIP...
                      </span>
                    ) : (
                      'Continue →'
                    )}
                  </button>
                </div>
              )}

              {/* Step 2: Data Entry Choice */}
              {currentStep === 2 && <DataEntryChoice />}

              {/* Step 3: Electricity */}
              {currentStep === 3 && <ElectricityForm />}

              {/* Step 4: Natural Gas */}
              {currentStep === 4 && <NaturalGasForm />}

              {/* Step 5: Vehicle Fuels */}
              {currentStep === 5 && <FuelsForm />}

              {/* Step 6: Review & Calculate */}
              {currentStep === 6 && (
                <ReviewAndCalculate onCalculate={handleGoToDashboard} />
              )}

            </div>

            {/* Footer */}
            <div className="mt-6 text-center text-sm text-gray-400">
              Need help? <a href="#" className="text-blue-400 hover:text-blue-300 hover:underline">Contact Support</a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default App;