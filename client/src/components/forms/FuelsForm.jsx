// FUELS FORM - Step 5 of Multi-Step Form
// PURPOSE: Collect Scope 1 emissions data (vehicle & equipment fuels)
// - Yes/No gate for vehicle usage
// - Gasoline, Diesel, Propane inputs
// - All optional if they don't use vehicles
// - Real-time validation
import React from 'react';
import { Fuel, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { useFormContext } from '../../context/FormContext';

const FuelsForm = () => {
  const { 
    formData, 
    updateField, 
    nextStep, 
    prevStep,
    errors,
    setErrors 
  } = useFormContext();

  const validateFuels = () => {
    const newErrors = {};

    // Must select if they use vehicles
    if (formData.fuels.usesVehicles === null) {
      newErrors['fuels.usesVehicles'] = 'Please select an option';
    }

    // If they use vehicles, at least one fuel amount should be positive (or all can be 0)
    // We'll allow 0 for all since they might use electric vehicles
    if (formData.fuels.usesVehicles === true) {
      const gasoline = parseFloat(formData.fuels.gasoline) || 0;
      const diesel = parseFloat(formData.fuels.diesel) || 0;
      const propane = parseFloat(formData.fuels.propane) || 0;

      // Check for negative values
      if (gasoline < 0) {
        newErrors['fuels.gasoline'] = 'Cannot be negative';
      }
      if (diesel < 0) {
        newErrors['fuels.diesel'] = 'Cannot be negative';
      }
      if (propane < 0) {
        newErrors['fuels.propane'] = 'Cannot be negative';
      }

      // Check for unreasonably high values
      if (gasoline > 1000000) {
        newErrors['fuels.gasoline'] = 'This seems very high - please verify';
      }
      if (diesel > 1000000) {
        newErrors['fuels.diesel'] = 'This seems very high - please verify';
      }
      if (propane > 1000000) {
        newErrors['fuels.propane'] = 'This seems very high - please verify';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateFieldRealtime = (field, value) => {
    const newErrors = { ...errors };
    const errorKey = `fuels.${field}`;

    // Clear error when editing
    delete newErrors[errorKey];

    if (value && (field === 'gasoline' || field === 'diesel' || field === 'propane')) {
      const num = parseFloat(value);
      if (isNaN(num)) {
        newErrors[errorKey] = 'Must be a number';
      } else if (num < 0) {
        newErrors[errorKey] = 'Cannot be negative';
      } else if (num > 1000000) {
        newErrors[errorKey] = 'This seems very high - please verify';
      }
    }

    setErrors(newErrors);
  };

  

  const handleUsesVehiclesChange = (value) => {
    updateField('fuels', 'usesVehicles', value);
    
    // Clear fuel amounts if they select No
    if (value === false) {
      updateField('fuels', 'gasoline', '');
      updateField('fuels', 'diesel', '');
      updateField('fuels', 'propane', '');
      
      // Clear all fuel errors
      const newErrors = { ...errors };
      delete newErrors['fuels.gasoline'];
      delete newErrors['fuels.diesel'];
      delete newErrors['fuels.propane'];
      setErrors(newErrors);
    }
    
    // Clear the usesVehicles error
    const newErrors = { ...errors };
    delete newErrors['fuels.usesVehicles'];
    setErrors(newErrors);
  };

  const handleFieldChange = (field, value) => {
    // Sanitize numeric inputs
    if (field === 'gasoline' || field === 'diesel' || field === 'propane') {
      // Allow only numbers and decimal point
      value = value.replace(/[^\d.]/g, '');
      // Allow only one decimal point
      const parts = value.split('.');
      if (parts.length > 2) {
        value = parts[0] + '.' + parts.slice(1).join('');
      }
    }

    updateField('fuels', field, value);
    validateFieldRealtime(field, value);
  };

  const handleContinue = () => {
    if (validateFuels()) {
      nextStep();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };


  const isFieldValid = (field) => {
    const errorKey = `fuels.${field}`;
    const value = formData.fuels?.[field];
    
    if (!value) return false; // Empty is not valid (but also not invalid)
    
    const num = parseFloat(value);
    return !errors[errorKey] && !isNaN(num) && num >= 0 && num <= 1000000;
  };

  
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Fuel className="w-8 h-8 text-red-500" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Vehicle & Equipment Fuels
          </h2>
          <p className="text-sm text-gray-600">Scope 1 emissions from company vehicles and equipment</p>
        </div>
      </div>

      {/* Do You Use Vehicles? */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Does your business use company vehicles or fuel-powered equipment? *
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleUsesVehiclesChange(true)}
            className={`py-4 px-6 rounded-lg border-2 font-semibold transition-all ${
              formData.fuels.usesVehicles === true
                ? 'border-blue-600 bg-blue-50 text-blue-700'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
            }`}
          >
            <div className="text-3xl mb-2">🚗</div>
            <div>Yes</div>
          </button>

          <button
            onClick={() => handleUsesVehiclesChange(false)}
            className={`py-4 px-6 rounded-lg border-2 font-semibold transition-all ${
              formData.fuels.usesVehicles === false
                ? 'border-gray-600 bg-gray-50 text-gray-700'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
            }`}
          >
            <div className="text-3xl mb-2">🚫</div>
            <div>No</div>
          </button>
        </div>
        {errors['fuels.usesVehicles'] && (
          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors['fuels.usesVehicles']}
          </p>
        )}
      </div>

      {/* IF YES: Show Fuel Input Fields */}
      {formData.fuels.usesVehicles === true && (
        <div className="space-y-5 animate-fadeIn">
          
          {/* Help Banner */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800 flex items-start gap-2">
              <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Find this on:</strong> Fuel card statements, receipts, or fleet management records. 
                Leave blank (or enter 0) if you don't use that specific fuel type.
              </span>
            </p>
          </div>

          {/* Gasoline */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Gasoline ({formData.company.reportingYear || '2024'})
            </label>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  inputMode="decimal"
                  value={formData.fuels.gasoline || ''}
                  onChange={(e) => handleFieldChange('gasoline', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    errors['fuels.gasoline']
                      ? 'border-red-500 pr-10'
                      : isFieldValid('gasoline')
                      ? 'border-green-500 pr-10'
                      : 'border-gray-300'
                  }`}
                  placeholder="0 (skip if none)"
                />
                {isFieldValid('gasoline') && (
                  <CheckCircle className="absolute right-3 top-3.5 w-5 h-5 text-green-500" />
                )}
              </div>
              <span className="text-gray-700 font-semibold text-lg min-w-[70px]">gallons</span>
            </div>
            {errors['fuels.gasoline'] && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors['fuels.gasoline']}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Total gallons of regular gasoline used for the year
            </p>
          </div>

          {/* Diesel */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Diesel ({formData.company.reportingYear || '2024'})
            </label>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  inputMode="decimal"
                  value={formData.fuels.diesel || ''}
                  onChange={(e) => handleFieldChange('diesel', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    errors['fuels.diesel']
                      ? 'border-red-500 pr-10'
                      : isFieldValid('diesel')
                      ? 'border-green-500 pr-10'
                      : 'border-gray-300'
                  }`}
                  placeholder="0 (skip if none)"
                />
                {isFieldValid('diesel') && (
                  <CheckCircle className="absolute right-3 top-3.5 w-5 h-5 text-green-500" />
                )}
              </div>
              <span className="text-gray-700 font-semibold text-lg min-w-[70px]">gallons</span>
            </div>
            {errors['fuels.diesel'] && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors['fuels.diesel']}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Total gallons of diesel fuel used for the year
            </p>
          </div>

          {/* Propane/LPG */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Propane/LPG ({formData.company.reportingYear || '2024'})
            </label>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  inputMode="decimal"
                  value={formData.fuels.propane || ''}
                  onChange={(e) => handleFieldChange('propane', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    errors['fuels.propane']
                      ? 'border-red-500 pr-10'
                      : isFieldValid('propane')
                      ? 'border-green-500 pr-10'
                      : 'border-gray-300'
                  }`}
                  placeholder="0 (skip if none)"
                />
                {isFieldValid('propane') && (
                  <CheckCircle className="absolute right-3 top-3.5 w-5 h-5 text-green-500" />
                )}
              </div>
              <span className="text-gray-700 font-semibold text-lg min-w-[70px]">gallons</span>
            </div>
            {errors['fuels.propane'] && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors['fuels.propane']}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Total gallons of propane (LPG) used for the year
            </p>
          </div>
        </div>
      )}

      {/* IF NO: Confirmation Message */}
      {formData.fuels.usesVehicles === false && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-fadeIn">
          <p className="text-sm text-green-800 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span><strong>Great!</strong> No vehicle fuel emissions to report.</span>
          </p>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button
          onClick={prevStep}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
        >
          ← Back
        </button>

        <button
          onClick={handleContinue}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
        >
          Review Data →
        </button>
      </div>
    </div>
  );
};

export default FuelsForm;