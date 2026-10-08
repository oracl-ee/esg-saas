import React, { useState } from 'react';
import { useFormContext } from '../../context/FormContext';

const ElectricityForm = () => {
  const { formData, updateField, nextStep, prevStep } = useFormContext();
  const [localErrors, setLocalErrors] = useState({});

  const providers = [
    { id: 'PGE', name: 'Pacific Gas & Electric (PG&E)', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { id: 'SCE', name: 'Southern California Edison (SCE)', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { id: 'SDGE', name: 'San Diego Gas & Electric (SDG&E)', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { id: 'LADWP', name: 'Los Angeles Department of Water and Power (LADWP)', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { id: 'SMUD', name: 'Sacramento Municipal Utility District (SMUD)', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { id: 'Other', name: 'Other Provider', icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6' }
  ];

  const validate = () => {
    const newErrors = {};
    
    if (!formData.electricity.provider) {
      newErrors.provider = 'Please select your electricity provider';
    }
    
    if (!formData.electricity.totalKwh || formData.electricity.totalKwh <= 0) {
      newErrors.totalKwh = 'Please enter total kWh used';
    }
    
    if (formData.electricity.renewableKwh && parseFloat(formData.electricity.renewableKwh) > parseFloat(formData.electricity.totalKwh)) {
      newErrors.renewableKwh = 'Renewable kWh cannot exceed total kWh';
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
          50% { transform: translateY(-15px); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(234, 179, 8, 0.3); }
          50% { box-shadow: 0 0 40px rgba(234, 179, 8, 0.6); }
        }
        
        .provider-card {
          transition: all 0.3s ease;
        }
        
        .provider-card:hover {
          transform: translateY(-5px);
        }
        
        .provider-card.selected {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>

      {/* Floating Lightning Bolt */}
      <div className="fixed top-24 right-16 w-16 h-16 opacity-10 pointer-events-none" style={{ animation: 'float 4s ease-in-out infinite' }}>
        <svg viewBox="0 0 24 24" fill="rgba(234, 179, 8, 0.5)" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z"/>
        </svg>
      </div>

      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl mb-4 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl blur opacity-50 animate-pulse"></div>
          <svg className="w-8 h-8 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
        </div>
        <h2 className="text-4xl font-bold">
          <span className="bg-gradient-to-r from-yellow-400 to-orange-600 bg-clip-text text-transparent">
            Electricity Usage
          </span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Tell us about your electricity consumption for Scope 2 emissions
        </p>
      </div>

      {/* Main Form Card */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 space-y-8">
        
        {/* Provider Selection */}
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-300 mb-4">
            Select Your Electricity Provider *
          </label>
          
          <div className="grid md:grid-cols-2 gap-4">
            {providers.map((provider) => (
              <div
                key={provider.id}
                onClick={() => updateField('electricity', 'provider', provider.id)}
                className={`provider-card cursor-pointer bg-white/5 backdrop-blur-xl rounded-xl p-4 border transition-all ${
                  formData.electricity.provider === provider.id
                    ? 'border-yellow-500/50 bg-yellow-500/10 selected'
                    : 'border-white/10 hover:border-yellow-500/30'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    formData.electricity.provider === provider.id
                      ? 'bg-gradient-to-br from-yellow-500 to-orange-600'
                      : 'bg-white/10'
                  }`}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={provider.icon}/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-white">{provider.id}</div>
                    <div className="text-xs text-gray-400">{provider.name}</div>
                  </div>
                  {formData.electricity.provider === provider.id && (
                    <svg className="w-6 h-6 text-yellow-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {localErrors.provider && (
            <p className="text-red-400 text-sm flex items-center gap-2 mt-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              {localErrors.provider}
            </p>
          )}
        </div>

        {/* Total kWh */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-300">
            Total Electricity Used (kWh) *
          </label>
          <div className="relative">
            <input
              type="number"
              value={formData.electricity.totalKwh}
              onChange={(e) => updateField('electricity', 'totalKwh', e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all"
              placeholder="e.g., 12500"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              kWh
            </div>
          </div>
          <p className="text-xs text-gray-500 flex items-start gap-2">
            <svg className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
            </svg>
            <span>Check your most recent utility bill for annual kWh usage. Typically found in the billing summary or usage history.</span>
          </p>
          {localErrors.totalKwh && (
            <p className="text-red-400 text-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              {localErrors.totalKwh}
            </p>
          )}
        </div>

        {/* Renewable kWh (Optional) */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-300">
            Renewable Electricity (kWh) <span className="text-gray-500 font-normal">- Optional</span>
          </label>
          <div className="relative">
            <input
              type="number"
              value={formData.electricity.renewableKwh}
              onChange={(e) => updateField('electricity', 'renewableKwh', e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all"
              placeholder="e.g., 3000"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              kWh
            </div>
          </div>
          <p className="text-xs text-gray-500 flex items-start gap-2">
            <svg className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
            </svg>
            <span>If you purchase renewable energy or have solar panels, enter the amount of renewable kWh. This reduces your Scope 2 emissions.</span>
          </p>
          {localErrors.renewableKwh && (
            <p className="text-red-400 text-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              {localErrors.renewableKwh}
            </p>
          )}
        </div>

        {/* Info Box */}
        {formData.electricity.totalKwh > 0 && (
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
              </svg>
              <div className="text-sm">
                <p className="font-semibold text-blue-400 mb-1">Estimated Annual Emissions</p>
                <p className="text-gray-300">
                  Based on {formData.electricity.totalKwh.toLocaleString()} kWh, your estimated Scope 2 emissions are approximately{' '}
                  <span className="font-bold text-yellow-400">
                    {(formData.electricity.totalKwh * 0.000215).toFixed(2)} tonnes CO₂e
                  </span>
                </p>
                {formData.electricity.renewableKwh > 0 && (
                  <p className="text-green-400 mt-2">
                    Your renewable energy reduces emissions by{' '}
                    <span className="font-bold">
                      {(formData.electricity.renewableKwh * 0.000215).toFixed(2)} tonnes CO₂e
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={prevStep}
          className="px-6 py-3 bg-white/5 backdrop-blur-xl rounded-xl font-semibold hover:bg-white/10 transition-all border border-white/10 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
          </svg>
          Back
        </button>
        
        <button
          onClick={handleNext}
          className="group px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-yellow-500/50 transition-all flex items-center gap-2"
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

export default ElectricityForm;