import React from 'react';
import { useFormContext } from '../../context/FormContext';

const DataEntryChoice = () => {
  const { formData, updateField, nextStep, prevStep } = useFormContext();

  const handleChoice = (method) => {
    updateField('dataEntryMethod', null, method);
    nextStep();
  };

  return (
    <div className="space-y-8">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        .card-3d {
          transform-style: preserve-3d;
          transition: all 0.3s ease;
        }
        
        .card-3d:hover {
          transform: translateY(-10px) rotateX(5deg);
        }
        
        .phase-badge {
          animation: pulse 2s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>

      {/* Floating Geometric Shapes */}
      <div className="fixed top-32 left-10 w-20 h-20 opacity-10 pointer-events-none" style={{ animation: 'float 5s ease-in-out infinite' }}>
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(139, 92, 246, 0.5)" strokeWidth="2"/>
        </svg>
      </div>

      <div className="fixed bottom-32 right-10 w-24 h-24 opacity-10 pointer-events-none" style={{ animation: 'float 7s ease-in-out infinite', animationDelay: '2s' }}>
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <rect x="25" y="25" width="50" height="50" fill="none" stroke="rgba(236, 72, 153, 0.5)" strokeWidth="2" transform="rotate(45 50 50)"/>
        </svg>
      </div>

      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-4 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl blur opacity-50 animate-pulse"></div>
          <svg className="w-8 h-8 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        </div>
        <h2 className="text-4xl font-bold">
          <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Data Entry Method
          </span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Choose how you'd like to provide your emissions data
        </p>
      </div>

      {/* Choice Cards */}
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Upload Bills Option */}
        <div className="card-3d bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-orange-500/50 transition-all cursor-pointer group relative overflow-hidden"
             onClick={() => handleChoice('upload')}>
          
          {/* Phase 2 Badge */}
          <div className="absolute top-4 right-4 phase-badge">
            <div className="px-3 py-1 bg-orange-500/20 border border-orange-500/50 rounded-full">
              <span className="text-xs font-bold text-orange-400">Phase 2</span>
            </div>
          </div>

          {/* Decorative glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <div className="relative z-10 space-y-6">
            {/* Icon */}
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-orange-500 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity"></div>
              <div className="relative w-16 h-16 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                </svg>
              </div>
            </div>

            {/* Content */}
            <div>
              <h3 className="text-2xl font-bold mb-3">Upload Utility Bills</h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                Automatically extract data from your electricity, gas, and fuel bills using AI-powered document processing
              </p>
              
              {/* Features */}
              <div className="space-y-3">
                {[
                  'AI-powered data extraction',
                  'Supports PDF, images, and scans',
                  'Faster than manual entry',
                  'Automatic categorization'
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <span className="text-sm text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Coming Soon Notice */}
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                </svg>
                <div className="text-sm">
                  <p className="font-semibold text-orange-400 mb-1">Coming Soon</p>
                  <p className="text-gray-400">This feature is currently in development and will be available in Phase 2</p>
                </div>
              </div>
            </div>

            {/* Button */}
            <button
              disabled
              className="w-full py-3 bg-orange-500/20 border border-orange-500/50 rounded-xl font-semibold text-orange-400 cursor-not-allowed opacity-60"
            >
              Available in Phase 2
            </button>
          </div>
        </div>

        {/* Manual Entry Option */}
        <div className="card-3d bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-blue-500/50 transition-all cursor-pointer group relative overflow-hidden"
             onClick={() => handleChoice('manual')}>
          
          {/* Decorative glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <div className="relative z-10 space-y-6">
            {/* Icon */}
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-blue-500 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity"></div>
              <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
              </div>
            </div>

            {/* Content */}
            <div>
              <h3 className="text-2xl font-bold mb-3">Manual Data Entry</h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                Enter your emissions data directly using our guided step-by-step forms for electricity, natural gas, and vehicle fuels
              </p>
              
              {/* Features */}
              <div className="space-y-3">
                {[
                  'Simple guided forms',
                  'Step-by-step instructions',
                  'Real-time validation',
                  'Save and resume anytime'
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <span className="text-sm text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Badge */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                <div className="text-sm">
                  <p className="font-semibold text-blue-400 mb-1">Recommended</p>
                  <p className="text-gray-400">Best option for most users. Takes 10-15 minutes to complete.</p>
                </div>
              </div>
            </div>

            {/* Button */}
            <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all flex items-center justify-center gap-2 group/btn">
              Start Manual Entry
              <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="flex justify-start">
        <button
          onClick={prevStep}
          className="px-6 py-3 bg-white/5 backdrop-blur-xl rounded-xl font-semibold hover:bg-white/10 transition-all border border-white/10 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
          </svg>
          Back
        </button>
      </div>
    </div>
  );
};

export default DataEntryChoice;