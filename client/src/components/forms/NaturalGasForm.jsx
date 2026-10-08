import React, { useState } from 'react';
import { useFormContext } from '../../context/FormContext';

const NaturalGasForm = () => {
  const { formData, updateField, nextStep, prevStep } = useFormContext();
  const [localErrors, setLocalErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    
    if (formData.naturalGas.usesGas === null) {
      newErrors.usesGas = 'Please indicate if you use natural gas';
    }
    
    if (formData.naturalGas.usesGas === true) {
      if (!formData.naturalGas.amount || formData.naturalGas.amount <= 0) {
        newErrors.amount = 'Please enter the amount of natural gas used';
      }
      if (!formData.naturalGas.unit) {
        newErrors.unit = 'Please select a unit of measurement';
      }
    }
    
    setLocalErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      nextStep();
    }
  };

  const getEmissionFactor = () => {
    const factors = {
      therms: 0.0053,
      kwh: 0.00018,
      cubicMeters: 0.002
    };
    return factors[formData.naturalGas.unit] || 0;
  };

  const calculateEmissions = () => {
    if (formData.naturalGas.amount && formData.naturalGas.unit) {
      return (formData.naturalGas.amount * getEmissionFactor()).toFixed(2);
    }
    return 0;
  };

  return (
    <div className="space-y-8">
      <style>{`
        @keyframes flame {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 1; }
          50% { transform: translateY(-10px) scale(1.1); opacity: 0.8; }
        }
        
        .option-card {
          transition: all 0.3s ease;
        }
        
        .option-card:hover {
          transform: translateY(-5px);
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(239, 68, 68, 0.3); }
          50% { box-shadow: 0 0 40px rgba(239, 68, 68, 0.6); }
        }
        
        .option-card.selected {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>

      {/* Floating Flame Icon */}
      <div className="fixed top-28 left-12 w-12 h-12 opacity-10 pointer-events-none" style={{ animation: 'flame 3s ease-in-out infinite' }}>
        <svg viewBox="0 0 24 24" fill="rgba(239, 68, 68, 0.5)" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2c1.5 3 4 5 4 8 0 2.2-1.8 4-4 4s-4-1.8-4-4c0-3 2.5-5 4-8zm0 18c-3.3 0-6-2.7-6-6 0-1.5.6-3 1.5-4.2C8.4 11 10 12 12 12s3.6-1 4.5-2.2c.9 1.2 1.5 2.7 1.5 4.2 0 3.3-2.7 6-6 6z"/>
        </svg>
      </div>

      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl mb-4 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl blur opacity-50 animate-pulse"></div>
          <svg className="w-8 h-8 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"/>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"/>
          </svg>
        </div>
        <h2 className="text-4xl font-bold">
          <span className="bg-gradient-to-r from-red-400 to-orange-600 bg-clip-text text-transparent">
            Natural Gas Usage
          </span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Report your natural gas consumption for Scope 1 emissions
        </p>
      </div>

      {/* Main Form Card */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 space-y-8">
        
        {/* Do You Use Natural Gas? */}
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-300 mb-4">
            Does your facility use natural gas? *
          </label>
          
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { value: true, label: 'Yes', icon: 'M5 13l4 4L19 7', color: 'green' },
              { value: false, label: 'No', icon: 'M6 18L18 6M6 6l12 12', color: 'red' },
              { value: 'unsure', label: 'Not Sure', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: 'yellow' }
            ].map((option) => (
              <div
                key={option.label}
                onClick={() => updateField('naturalGas', 'usesGas', option.value)}
                className={`option-card cursor-pointer bg-white/5 backdrop-blur-xl rounded-xl p-6 border transition-all ${
                  formData.naturalGas.usesGas === option.value
                    ? `border-${option.color}-500/50 bg-${option.color}-500/10 selected`
                    : 'border-white/10 hover:border-' + option.color + '-500/30'
                }`}
              >
                <div className="text-center space-y-3">
                  <div className={`w-12 h-12 mx-auto rounded-lg flex items-center justify-center ${
                    formData.naturalGas.usesGas === option.value
                      ? `bg-gradient-to-br from-${option.color}-500 to-${option.color}-600`
                      : 'bg-white/10'
                  }`}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={option.icon}/>
                    </svg>
                  </div>
                  <div className="font-semibold text-white">{option.label}</div>
                </div>
              </div>
            ))}
          </div>
          
          {localErrors.usesGas && (
            <p className="text-red-400 text-sm flex items-center gap-2 mt-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              {localErrors.usesGas}
            </p>
          )}
        </div>

        {/* Conditional: If Yes, show amount and unit */}
        {formData.naturalGas.usesGas === true && (
          <>
            {/* Unit Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300">
                Unit of Measurement *
              </label>
              <select
                value={formData.naturalGas.unit}
                onChange={(e) => updateField('naturalGas', 'unit', e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all"
              >
                <option value="" className="bg-gray-900">Select unit</option>
                <option value="therms" className="bg-gray-900">Therms (most common)</option>
                <option value="kwh" className="bg-gray-900">kWh</option>
                <option value="cubicMeters" className="bg-gray-900">Cubic Meters (m³)</option>
              </select>
              {localErrors.unit && (
                <p className="text-red-400 text-sm flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                  {localErrors.unit}
                </p>
              )}
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300">
                Amount Used (Annual) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.naturalGas.amount}
                  onChange={(e) => updateField('naturalGas', 'amount', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all"
                  placeholder="e.g., 5000"
                />
                {formData.naturalGas.unit && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                    {formData.naturalGas.unit === 'therms' && 'therms'}
                    {formData.naturalGas.unit === 'kwh' && 'kWh'}
                    {formData.naturalGas.unit === 'cubicMeters' && 'm³'}
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 flex items-start gap-2">
                <svg className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                </svg>
                <span>Check your gas utility bill for annual usage. Most US bills show therms.</span>
              </p>
              {localErrors.amount && (
                <p className="text-red-400 text-sm flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                  {localErrors.amount}
                </p>
              )}
            </div>

            {/* Emissions Estimate */}
            {formData.naturalGas.amount > 0 && formData.naturalGas.unit && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                  </svg>
                  <div className="text-sm">
                    <p className="font-semibold text-red-400 mb-1">Estimated Scope 1 Emissions</p>
                    <p className="text-gray-300">
                      Your natural gas usage of {formData.naturalGas.amount.toLocaleString()}{' '}
                      {formData.naturalGas.unit === 'therms' && 'therms'}
                      {formData.naturalGas.unit === 'kwh' && 'kWh'}
                      {formData.naturalGas.unit === 'cubicMeters' && 'm³'} results in approximately{' '}
                      <span className="font-bold text-red-400">
                        {calculateEmissions()} tonnes CO₂e
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* If No or Not Sure */}
        {(formData.naturalGas.usesGas === false || formData.naturalGas.usesGas === 'unsure') && (
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 text-center">
            <svg className="w-12 h-12 text-blue-400 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
            </svg>
            <p className="text-blue-400 font-semibold mb-2">
              {formData.naturalGas.usesGas === false ? 'No Natural Gas Usage' : 'Not Sure About Natural Gas?'}
            </p>
            <p className="text-gray-300 text-sm">
              {formData.naturalGas.usesGas === false 
                ? "That's fine! We'll move on to the next emission source."
                : "Check with your facilities or accounting team. You can skip this for now and continue with other emission sources."
              }
            </p>
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
          className="group px-8 py-4 bg-gradient-to-r from-red-500 to-orange-600 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-red-500/50 transition-all flex items-center gap-2"
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

export default NaturalGasForm;