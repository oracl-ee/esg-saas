// ELECTRICITY FORM - Step 3 of Multi-Step Form
// PURPOSE: Collect Scope 2 emissions data (purchased electricity)
// - Utility provider selection
// - Total kWh consumption
// - Optional renewable energy
// - Real-time validation


import React from 'react';
import { Zap, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { useFormContext } from '../../context/FormContext';

const ElectricityForm = () => {
  const { 
    formData, 
    updateField, 
    nextStep, 
    prevStep,
    errors,
    setErrors 
  } = useFormContext();

  const validateElectricity = () => {
    const newErrors = {};

    // Utility provider required
    if (!formData.electricity.provider) {
      newErrors['electricity.provider'] = 'Please select your utility provider';
    }

    // Electricity kWh required and must be positive
    if (!formData.electricity.totalKwh) {
      newErrors['electricity.totalKwh'] = 'Electricity consumption is required';
    } else if (formData.electricity.totalKwh <= 0) {
      newErrors['electricity.totalKwh'] = 'Must be greater than 0';
    } else if (formData.electricity.totalKwh > 10000000) {
      newErrors['electricity.totalKwh'] = 'This seems very high - please verify';
    }

    // Renewable kWh cannot exceed total kWh
    if (formData.electricity.renewableKwh && 
        parseFloat(formData.electricity.renewableKwh) > parseFloat(formData.electricity.totalKwh)) {
      newErrors['electricity.renewableKwh'] = 'Renewable energy cannot exceed total electricity';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // REAL-TIME VALIDATION

  const validateFieldRealtime = (field, value) => {
    const newErrors = { ...errors };
    const errorKey = `electricity.${field}`;

    // Clear error when editing
    delete newErrors[errorKey];

    // Total kWh validation
    if (field === 'totalKwh' && value) {
      const num = parseFloat(value);
      if (isNaN(num)) {
        newErrors[errorKey] = 'Must be a number';
      } else if (num <= 0) {
        newErrors[errorKey] = 'Must be greater than 0';
      } else if (num > 10000000) {
        newErrors[errorKey] = 'This seems very high - please verify';
      }
    }

    // Renewable kWh validation
    if (field === 'renewableKwh' && value) {
      const renewable = parseFloat(value);
      const total = parseFloat(formData.electricity.totalKwh);
      
      if (isNaN(renewable)) {
        newErrors[errorKey] = 'Must be a number';
      } else if (renewable < 0) {
        newErrors[errorKey] = 'Cannot be negative';
      } else if (total && renewable > total) {
        newErrors[errorKey] = 'Cannot exceed total electricity';
      }
    }

    setErrors(newErrors);
  };
  const handleFieldChange = (field, value) => {
    // Sanitize numeric inputs
    if (field === 'totalKwh' || field === 'renewableKwh') {
      // Allow only numbers and decimal point
      value = value.replace(/[^\d.]/g, '');
      // Allow only one decimal point
      const parts = value.split('.');
      if (parts.length > 2) {
        value = parts[0] + '.' + parts.slice(1).join('');
      }
    }

    updateField('electricity', field, value);
    validateFieldRealtime(field, value);
  };

  const handleContinue = () => {
    if (validateElectricity()) {
      nextStep();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };


  const isFieldValid = (field) => {
    const errorKey = `electricity.${field}`;
    const value = formData.electricity?.[field];
    
    if (field === 'provider') {
      return !errors[errorKey] && value && value.length > 0;
    }
    
    if (field === 'totalKwh') {
      const num = parseFloat(value);
      return !errors[errorKey] && !isNaN(num) && num > 0 && num <= 10000000;
    }

    if (field === 'renewableKwh') {
      if (!value) return true; // Optional field
      const renewable = parseFloat(value);
      const total = parseFloat(formData.electricity.totalKwh);
      return !errors[errorKey] && !isNaN(renewable) && renewable >= 0 && renewable <= total;
    }

    return false;
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Zap className="w-8 h-8 text-yellow-500" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Electricity Consumption
          </h2>
          <p className="text-sm text-gray-600">Scope 2 emissions from purchased electricity</p>
        </div>
      </div>

      {/* Help Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800 flex items-start gap-2">
          <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Find this on:</strong> Your annual electricity statement or add up 12 months of bills
          </span>
        </p>
      </div>

      {/* Utility Provider */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Utility Provider *
        </label>
        <div className="space-y-2">
          {[
            { value: 'PGE', label: 'PG&E (Bay Area, Central CA)' },
            { value: 'SCE', label: 'Southern California Edison' },
            { value: 'SDGE', label: 'San Diego Gas & Electric' },
            { value: 'LADWP', label: 'Los Angeles Dept of Water & Power' },
            { value: 'SMUD', label: 'Sacramento Municipal Utility District' },
            { value: 'Other', label: 'Other Provider' }
          ].map(provider => (
            <label 
              key={provider.value}
              className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                formData.electricity.provider === provider.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name="utility"
                value={provider.value}
                checked={formData.electricity.provider === provider.value}
                onChange={(e) => handleFieldChange('provider', e.target.value)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-900">
                {provider.label}
              </span>
              {formData.electricity.provider === provider.value && (
                <CheckCircle className="w-5 h-5 text-blue-600 ml-auto" />
              )}
            </label>
          ))}
        </div>
        {errors['electricity.provider'] && (
          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors['electricity.provider']}
          </p>
        )}
      </div>

      {/* Total Electricity */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Total Electricity Consumption ({formData.company.reportingYear || '2024'}) *
        </label>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              inputMode="decimal"
              value={formData.electricity.totalKwh || ''}
              onChange={(e) => handleFieldChange('totalKwh', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                errors['electricity.totalKwh']
                  ? 'border-red-500 pr-10'
                  : isFieldValid('totalKwh')
                  ? 'border-green-500 pr-10'
                  : 'border-gray-300'
              }`}
              placeholder="50000"
            />
            {isFieldValid('totalKwh') && (
              <CheckCircle className="absolute right-3 top-3.5 w-5 h-5 text-green-500" />
            )}
          </div>
          <span className="text-gray-700 font-semibold text-lg">kWh</span>
        </div>
        {errors['electricity.totalKwh'] && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors['electricity.totalKwh']}
          </p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Kilowatt-hours (kWh) - typically shown on your annual statement
        </p>
      </div>

      {/* Renewable Energy (Optional) */}
      <div className="border-t border-gray-200 pt-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Renewable Energy <span className="text-gray-500 font-normal">(Optional)</span>
        </label>
        <p className="text-sm text-gray-600 mb-3">
          Did you purchase renewable energy or Renewable Energy Certificates (RECs)?
        </p>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              inputMode="decimal"
              value={formData.electricity.renewableKwh || ''}
              onChange={(e) => handleFieldChange('renewableKwh', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                errors['electricity.renewableKwh']
                  ? 'border-red-500 pr-10'
                  : isFieldValid('renewableKwh') && formData.electricity.renewableKwh
                  ? 'border-green-500 pr-10'
                  : 'border-gray-300'
              }`}
              placeholder="0"
            />
            {isFieldValid('renewableKwh') && formData.electricity.renewableKwh && (
              <CheckCircle className="absolute right-3 top-3.5 w-5 h-5 text-green-500" />
            )}
          </div>
          <span className="text-gray-700 font-semibold text-lg">kWh</span>
        </div>
        {errors['electricity.renewableKwh'] && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors['electricity.renewableKwh']}
          </p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Leave blank if you don't purchase renewable energy or RECs
        </p>
      </div>

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
          Continue →
        </button>
      </div>
    </div>
  );
};

export default ElectricityForm;