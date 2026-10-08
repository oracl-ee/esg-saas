import React, { useState } from 'react';
import { useFormContext } from '../../context/FormContext';

const FuelsForm = () => {
  const { formData, updateField, nextStep, prevStep } = useFormContext();
  const [localErrors, setLocalErrors] = useState({});

  const fuelTypes = [
    { id: 'gasoline', name: 'Gasoline', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z', color: 'blue', emissionFactor: 0.00887 },
    { id: 'diesel', name: 'Diesel', icon: 'M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2', color: 'indigo', emissionFactor: 0.01022 },
    { id: 'propane', name: 'Propane', icon: 'M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z', color: 'green', emissionFactor: 0.00582 }
  ];

  const validate = () => {
    const newErrors = {};
    
    if (formData.fuels.usesVehicles === null) {
      newErrors.usesVehicles = 'Please indicate if you use company vehicles';
    }
    
    if (formData.fuels.usesVehicles === true) {
      const hasAnyFuel = formData.fuels.gasoline > 0 || formData.fuels.diesel > 0 || formData.fuels.propane > 0;
      if (!hasAnyFuel) {
        newErrors.general = 'Please enter fuel usage for at least one fuel type';
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

  const calculateTotalEmissions = () => {
    const gasoline = (formData.fuels.gasoline || 0) * 0.00887;
    const diesel = (formData.fuels.diesel || 0) * 0.01022;
    const propane = (formData.fuels.propane || 0) * 0.00582;
    return (gasoline + diesel + propane).toFixed(2);
  };

  return (
    <div className="space-y-8">
      <style>{`
        @keyframes drive {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100vw); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6); }
        }
        
        .fuel-card:hover {
          transform: translateY(-5px);
        }
      `}</style>

      {/* Animated Vehicle Icon */}
      <div className="fixed top-1/3 w-12 h-12 opacity-10 pointer-events-none" style={{ animation: 'drive 15s linear infinite' }}>
        <svg viewBox="0 0 24 24" fill="rgba(59, 130, 246, 0.5)" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 11l1.5-4.5h11L19 11m-1.5 5h-11a1 1 0 01-1-1V9a1 1 0 011-1h11a1 1 0 011 1v6a1 1 0 01-1 1zM8.5 17a2 2 0 100-4 2 2 0 000 4zm7 0a2 2 0 100-4 2 2 0 000 4z"/>
        </svg>
      </div>

      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl blur opacity-50 animate-pulse"></div>
          <svg className="w-8 h-8 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
          </svg>
        </div>
        <h2 className="text-4xl font-bold">
          <span className="bg-gradient-to-r from-blue-400 to-indigo-600 bg-clip-text text-transparent">
            Vehicle Fuels
          </span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Report fuel consumption from company-owned or leased vehicles for Scope 1 emissions
        </p>
      </div>

      {/* Main Form Card */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 space-y-8">
        
        {/* Do You Use Vehicles? */}
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-300 mb-4">
            Does your company own or lease vehicles? *
          </label>
          
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { value: true, label: 'Yes', icon: 'M5 13l4 4L19 7', color: 'green' },
              { value: false, label: 'No', icon: 'M6 18L18 6M6 6l12 12', color: 'red' }
            ].map((option) => (
              <div
                key={option.label}
                onClick={() => updateField('fuels', 'usesVehicles', option.value)}
                className={`cursor-pointer bg-white/5 backdrop-blur-xl rounded-xl p-6 border transition-all hover:transform hover:-translate-y-1 ${
                  formData.fuels.usesVehicles === option.value
                    ? `border-${option.color}-500/50 bg-${option.color}-500/10`
                    : 'border-white/10 hover:border-' + option.color + '-500/30'
                }`}
                style={formData.fuels.usesVehicles === option.value ? { animation: 'pulse-glow 2s ease-in-out infinite' } : {}}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    formData.fuels.usesVehicles === option.value
                      ? `bg-gradient-to-br from-${option.color}-500 to-${option.color}-600`
                      : 'bg-white/10'
                  }`}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={option.icon}/>
                    </svg>
                  </div>
                  <div className="font-semibold text-white text-lg">{option.label}</div>
                </div>
              </div>
            ))}
          </div>
          
          {localErrors.usesVehicles && (
            <p className="text-red-400 text-sm flex items-center gap-2 mt-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              {localErrors.usesVehicles}
            </p>
          )}
        </div>

        {/* Conditional: If Yes, show fuel inputs */}
        {formData.fuels.usesVehicles === true && (
          <>
            <div className="space-y-6">
              <p className="text-gray-400 text-sm">
                Enter annual fuel consumption in gallons for each fuel type used. Leave blank if not applicable.
              </p>

              {localErrors.general && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <p className="text-red-400 text-sm flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                    {localErrors.general}
                  </p>
                </div>
              )}

              {/* Fuel Type Cards */}
              {fuelTypes.map((fuel) => (
                <div key={fuel.id} className={`fuel-card bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10 hover:border-${fuel.color}-500/30 transition-all`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-${fuel.color}-500 to-${fuel.color}-600`}>
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={fuel.icon}/>
                      </svg>
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="text-lg font-bold text-white">{fuel.name}</h3>
                        <p className="text-xs text-gray-400">Common for {fuel.id === 'gasoline' ? 'cars, SUVs, light trucks' : fuel.id === 'diesel' ? 'heavy trucks, buses, some cars' : 'forklifts, fleet vehicles'}</p>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex-1 relative">
                          <input
                            type="number"
                            value={formData.fuels[fuel.id] || ''}
                            onChange={(e) => updateField('fuels', fuel.id, e.target.value)}
                            className={`w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-${fuel.color}-500/50 focus:border-${fuel.color}-500/50 transition-all`}
                            placeholder="0"
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                            gallons
                          </div>
                        </div>
                        
                        {formData.fuels[fuel.id] > 0 && (
                          <div className="text-right">
                            <div className={`text-sm font-bold text-${fuel.color}-400`}>
                              {(formData.fuels[fuel.id] * fuel.emissionFactor).toFixed(2)} t
                            </div>
                            <div className="text-xs text-gray-500">CO₂e</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Emissions */}
            {(formData.fuels.gasoline > 0 || formData.fuels.diesel > 0 || formData.fuels.propane > 0) && (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                  </svg>
                  <div className="text-sm">
                    <p className="font-semibold text-blue-400 mb-1">Total Vehicle Fuel Emissions (Scope 1)</p>
                    <p className="text-gray-300">
                      Your total vehicle fuel consumption results in approximately{' '}
                      <span className="font-bold text-blue-400 text-lg">
                        {calculateTotalEmissions()} tonnes CO₂e
                      </span>
                    </p>
                    <div className="mt-3 space-y-1">
                      {formData.fuels.gasoline > 0 && (
                        <div className="text-xs text-gray-400">
                          Gasoline: {formData.fuels.gasoline.toLocaleString()} gal → {(formData.fuels.gasoline * 0.00887).toFixed(2)} t CO₂e
                        </div>
                      )}
                      {formData.fuels.diesel > 0 && (
                        <div className="text-xs text-gray-400">
                          Diesel: {formData.fuels.diesel.toLocaleString()} gal → {(formData.fuels.diesel * 0.01022).toFixed(2)} t CO₂e
                        </div>
                      )}
                      {formData.fuels.propane > 0 && (
                        <div className="text-xs text-gray-400">
                          Propane: {formData.fuels.propane.toLocaleString()} gal → {(formData.fuels.propane * 0.00582).toFixed(2)} t CO₂e
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* If No */}
        {formData.fuels.usesVehicles === false && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 text-center">
            <svg className="w-12 h-12 text-green-400 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            <p className="text-green-400 font-semibold mb-2">No Vehicle Fuel Usage</p>
            <p className="text-gray-300 text-sm">
              Perfect! No vehicle fuel emissions to report. Let's review your complete emissions assessment.
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
          className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all flex items-center gap-2"
        >
          Review Results
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default FuelsForm;