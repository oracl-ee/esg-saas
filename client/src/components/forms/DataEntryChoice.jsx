// DATA ENTRY CHOICE - Step 2 of Multi-Step Form
// PURPOSE: Let user choose between Upload or Manual entry
// - Two big, clear options
// - Shows time estimates
// - User can switch methods anytime

import React from 'react';
import { Upload, Edit3, Clock, ArrowRight } from 'lucide-react';
import { useFormContext } from '../../context/FormContext';


const DataEntryChoice = () => {
  const { updateField, nextStep, prevStep } = useFormContext();

  const selectUpload = () => {
    updateField('root', 'dataEntryMethod', 'upload');
    // For now, skip to manual entry (we'll add upload in Phase 2)
    // In Phase 2, this will go to upload screen
    alert('Upload feature coming in Phase 2! For now, please use Manual Entry.');
  };

  const selectManual = () => {
    updateField('root', 'dataEntryMethod', 'manual');
    nextStep(); // Go to step 3 (Electricity form)
  };

  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          How would you like to enter your data?
        </h2>
        <p className="text-gray-600">
          Choose the method that works best for you
        </p>
      </div>

      {/* Two Options */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* OPTION 1: Upload Bills */}
        <button
          onClick={selectUpload}
          className="group relative bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border-2 border-blue-300 hover:border-blue-400 rounded-2xl p-8 text-left transition-all duration-200 hover:shadow-lg hover:scale-105"
        >
          {/* Badge */}
          <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
            FASTEST
          </div>

          {/* Icon */}
          <div className="mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
              <Upload className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            📤 Upload Bills
          </h3>

          {/* Description */}
          <p className="text-gray-700 mb-4">
            We'll extract data from your utility bills automatically
          </p>

          {/* Time estimate */}
          <div className="flex items-center gap-2 text-blue-700 mb-4">
            <Clock className="w-5 h-5" />
            <span className="font-semibold">5-10 minutes</span>
          </div>

          {/* Features */}
          <ul className="space-y-2 text-sm text-gray-600 mb-6">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>Upload PDF or image files</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>Automatic data extraction</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>Review and edit before saving</span>
            </li>
          </ul>

          {/* Button */}
          <div className="flex items-center justify-between text-blue-600 font-semibold group-hover:text-blue-700">
            <span>Try This</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </div>

          {/* Coming Soon Badge (Phase 2) */}
          <div className="mt-4 text-center">
            <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full">
              Coming in Phase 2
            </span>
          </div>
        </button>

        {/* OPTION 2: Manual Entry */}
        <button
          onClick={selectManual}
          className="group relative bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border-2 border-green-300 hover:border-green-400 rounded-2xl p-8 text-left transition-all duration-200 hover:shadow-lg hover:scale-105"
        >
          {/* Badge */}
          <div className="absolute top-4 right-4 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
            AVAILABLE NOW
          </div>

          {/* Icon */}
          <div className="mb-4">
            <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center">
              <Edit3 className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            ✍️ Manual Entry
          </h3>

          {/* Description */}
          <p className="text-gray-700 mb-4">
            Type in your numbers from your records
          </p>

          {/* Time estimate */}
          <div className="flex items-center gap-2 text-green-700 mb-4">
            <Clock className="w-5 h-5" />
            <span className="font-semibold">15-20 minutes</span>
          </div>

          {/* Features */}
          <ul className="space-y-2 text-sm text-gray-600 mb-6">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>Step-by-step guided forms</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>Real-time validation</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>Auto-save your progress</span>
            </li>
          </ul>

          {/* Button */}
          <div className="flex items-center justify-between text-green-600 font-semibold group-hover:text-green-700">
            <span>Enter Data</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
        <p className="text-sm text-blue-800">
          💡 <strong>Don't worry!</strong> You can switch methods anytime during the process
        </p>
      </div>

      {/* Back Button */}
      <div className="flex justify-center">
        <button
          onClick={prevStep}
          className="text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2"
        >
          ← Back to Company Profile
        </button>
      </div>
    </div>
  );
};

export default DataEntryChoice;