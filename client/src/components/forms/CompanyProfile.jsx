import React, { useState, useEffect } from 'react';
import { useFormContext } from '../../context/FormContext';

const CompanyProfile = () => {
  const { formData, updateField, nextStep, errors, setErrors } = useFormContext();
  const [localErrors, setLocalErrors] = useState({});
  const [cityInfo, setCityInfo] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Verify city and ZIP using Zippopotam API
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.company.zipCode?.length === 5) {
        setIsVerifying(true);
        fetch(`https://api.zippopotam.us/us/${formData.company.zipCode}`)
          .then(res => res.json())
          .then(data => {
            if (data.places?.[0]) {
              setCityInfo({
                city: data.places[0]['place name'],
                state: data.places[0]['state abbreviation']
              });
            }
            setIsVerifying(false);
          })
          .catch(() => {
            setCityInfo(null);
            setIsVerifying(false);
          });
      } else {
        setCityInfo(null);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [formData.company.zipCode]);

  const validate = () => {
    const newErrors = {};
    
    if (!formData.company.name?.trim()) {
      newErrors.name = 'Company name is required';
    }
    
    if (!formData.company.industry) {
      newErrors.industry = 'Please select an industry';
    }
    
    if (formData.company.industry === 'Other' && !formData.company.industryOther?.trim()) {
      newErrors.industryOther = 'Please specify your industry';
    }
    
    if (!formData.company.employees) {
      newErrors.employees = 'Please select employee count';
    }
    
    if (!formData.company.city?.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!formData.company.zipCode || formData.company.zipCode.length !== 5) {
      newErrors.zipCode = 'Valid 5-digit ZIP code required';
    }
    
    setLocalErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      nextStep();
    }
  };

  return (
    <div className="space-y-8">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); }
          50% { box-shadow: 0 0 40px rgba(99, 102, 241, 0.6); }
        }
        
        .input-glow:focus {
          animation: glow-pulse 2s ease-in-out infinite;
        }
        
        .card-3d {
          transform-style: preserve-3d;
          transition: transform 0.3s ease;
        }
        
        .card-3d:hover {
          transform: translateY(-5px);
        }
      `}</style>

      {/* Floating Geometric Shape */}
      <div className="fixed top-20 right-10 w-24 h-24 opacity-10 pointer-events-none" style={{ animation: 'float 6s ease-in-out infinite' }}>
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <polygon points="50,10 90,30 90,70 50,90 10,70 10,30" fill="none" stroke="rgba(99, 102, 241, 0.5)" strokeWidth="2"/>
        </svg>
      </div>

      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur opacity-50 animate-pulse"></div>
          <svg className="w-8 h-8 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
          </svg>
        </div>
        <h2 className="text-4xl font-bold">
          <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Company Profile
          </span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Tell us about your organization to begin your California SB 253 emissions assessment
        </p>
      </div>

      {/* Form Card */}
      <div className="card-3d bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
        <div className="space-y-6">
          {/* Company Name */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300">
              Company Name *
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.company.name}
                onChange={(e) => updateField('company', 'name', e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all input-glow"
                placeholder="Enter your company name"
              />
              {formData.company.name && !localErrors.name && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                </div>
              )}
            </div>
            {localErrors.name && (
              <p className="text-red-400 text-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
                {localErrors.name}
              </p>
            )}
          </div>

          {/* Industry */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300">
              Industry *
            </label>
            <select
              value={formData.company.industry}
              onChange={(e) => updateField('company', 'industry', e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all input-glow"
            >
              <option value="" className="bg-gray-900">Select your industry</option>
              <option value="Technology" className="bg-gray-900">Technology</option>
              <option value="Manufacturing" className="bg-gray-900">Manufacturing</option>
              <option value="Retail" className="bg-gray-900">Retail</option>
              <option value="Healthcare" className="bg-gray-900">Healthcare</option>
              <option value="Finance" className="bg-gray-900">Finance</option>
              <option value="Energy" className="bg-gray-900">Energy</option>
              <option value="Transportation" className="bg-gray-900">Transportation</option>
              <option value="Real Estate" className="bg-gray-900">Real Estate</option>
              <option value="Other" className="bg-gray-900">Other</option>
            </select>
            {localErrors.industry && (
              <p className="text-red-400 text-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
                {localErrors.industry}
              </p>
            )}
          </div>

          {/* Industry Other (conditional) */}
          {formData.company.industry === 'Other' && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300">
                Please Specify *
              </label>
              <input
                type="text"
                value={formData.company.industryOther}
                onChange={(e) => updateField('company', 'industryOther', e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all input-glow"
                placeholder="Enter your industry"
              />
              {localErrors.industryOther && (
                <p className="text-red-400 text-sm flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                  {localErrors.industryOther}
                </p>
              )}
            </div>
          )}

          {/* Employee Count */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300">
              Number of Employees *
            </label>
            <select
              value={formData.company.employees}
              onChange={(e) => updateField('company', 'employees', e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all input-glow"
            >
              <option value="" className="bg-gray-900">Select employee count</option>
              <option value="1-10" className="bg-gray-900">1-10</option>
              <option value="11-50" className="bg-gray-900">11-50</option>
              <option value="51-200" className="bg-gray-900">51-200</option>
              <option value="201-500" className="bg-gray-900">201-500</option>
              <option value="501-1000" className="bg-gray-900">501-1,000</option>
              <option value="1000+" className="bg-gray-900">1,000+</option>
            </select>
            {localErrors.employees && (
              <p className="text-red-400 text-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
                {localErrors.employees}
              </p>
            )}
          </div>

          {/* Location - City & ZIP */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300">
                City *
              </label>
              <input
                type="text"
                value={formData.company.city}
                onChange={(e) => updateField('company', 'city', e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all input-glow"
                placeholder="Los Angeles"
              />
              {localErrors.city && (
                <p className="text-red-400 text-sm flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                  {localErrors.city}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300">
                ZIP Code *
              </label>
              <div className="relative">
                <input
                  type="text"
                  maxLength="5"
                  value={formData.company.zipCode}
                  onChange={(e) => updateField('company', 'zipCode', e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all input-glow"
                  placeholder="90210"
                />
                {isVerifying && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <svg className="w-5 h-5 text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                )}
                {cityInfo && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                  </div>
                )}
              </div>
              {cityInfo && (
                <p className="text-green-400 text-sm flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  Verified: {cityInfo.city}, {cityInfo.state}
                </p>
              )}
              {localErrors.zipCode && (
                <p className="text-red-400 text-sm flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                  {localErrors.zipCode}
                </p>
              )}
            </div>
          </div>

          {/* Reporting Year */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300">
              Reporting Year
            </label>
            <input
              type="text"
              value={formData.company.reportingYear}
              readOnly
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500">Current reporting year</p>
          </div>
        </div>
      </div>

      {/* Navigation Button */}
      <div className="flex justify-end">
        <button
          onClick={handleNext}
          className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all flex items-center gap-2"
        >
          Continue
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CompanyProfile;