// ============================================================================
// APP.JSX - Main Application Component with Advanced Validation
// 
// Features:
// - Real-time validation as user types
// - Format checking (ZIP codes, numbers, text)
// - City/ZIP code verification using Zippopotam.us API
// - "Other" industry custom input field
// - Data sanitization
// ============================================================================

import React, { useState, useEffect } from 'react';
import { useFormContext } from './context/FormContext';
import { Building, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import DataEntryChoice from './components/forms/DataEntryChoice';
import ElectricityForm from './components/forms/ElectricityForm';
import NaturalGasForm from './components/forms/NaturalGasForm';

function App() {
  const { 
    formData, 
    updateField, 
    currentStep, 
    nextStep,
    prevStep,
    saveMessage,
    errors,
    setErrors 
  } = useFormContext();

  // Local state for ZIP verification
  const [zipVerifying, setZipVerifying] = useState(false);
  const [zipVerified, setZipVerified] = useState(false);
  const [zipCityMatch, setZipCityMatch] = useState(null);

  // ============================================================================
  // ZIP CODE & CITY VERIFICATION using Zippopotam.us API
  // ============================================================================

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

  // ============================================================================
  // VALIDATION HELPERS
  // ============================================================================

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

  // ============================================================================
  // REAL-TIME VALIDATION
  // ============================================================================

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

  // ============================================================================
  // FINAL VALIDATION
  // ============================================================================

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

  // ============================================================================
  // INPUT HANDLERS
  // ============================================================================

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

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            California ESG Platform
          </h1>
          <p className="text-gray-600">
            SB 253 Compliance Made Simple
          </p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep} of 6
            </span>
            <span className="text-sm text-gray-500">
              {Math.round((currentStep / 6) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / 6) * 100}%` }}
            />
          </div>
        </div>

        {saveMessage && (
          <div className="mb-4 text-center animate-fadeIn">
            <span className="inline-block text-sm text-green-600 bg-green-50 px-4 py-2 rounded-full shadow-sm">
              ✓ {saveMessage}
            </span>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-8">
          
          {currentStep === 1 && (
            <div className="space-y-6">
              
              <div className="flex items-center gap-3 mb-6">
                <Building className="w-8 h-8 text-blue-600" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Welcome! Let's set up your company profile
                  </h2>
                  <p className="text-sm text-gray-600">This takes about 3 minutes</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Company Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.company.name || ''}
                    onChange={(e) => handleFieldChange('company', 'name', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                      errors['company.name'] 
                        ? 'border-red-500 pr-10' 
                        : isFieldValid('company', 'name')
                        ? 'border-green-500 pr-10'
                        : 'border-gray-300'
                    }`}
                    placeholder="Acme Manufacturing Inc."
                    maxLength="100"
                  />
                  {isFieldValid('company', 'name') && (
                    <CheckCircle className="absolute right-3 top-3.5 w-5 h-5 text-green-500" />
                  )}
                </div>
                {errors['company.name'] && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors['company.name']}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  {formData.company.name?.length || 0}/100 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Industry *
                </label>
                <div className="relative">
                  <select
                    value={formData.company.industry || ''}
                    onChange={(e) => handleFieldChange('company', 'industry', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none ${
                      errors['company.industry'] 
                        ? 'border-red-500' 
                        : isFieldValid('company', 'industry')
                        ? 'border-green-500'
                        : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select industry...</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Technology">Technology</option>
                    <option value="Retail">Retail</option>
                    <option value="Food & Beverage">Food & Beverage</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Professional Services">Professional Services</option>
                    <option value="Construction">Construction</option>
                    <option value="Transportation">Transportation & Logistics</option>
                    <option value="Other">Other (please specify)</option>
                  </select>
                  {isFieldValid('company', 'industry') && formData.company.industry !== 'Other' && (
                    <CheckCircle className="absolute right-10 top-3.5 w-5 h-5 text-green-500 pointer-events-none" />
                  )}
                </div>
                {errors['company.industry'] && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors['company.industry']}
                  </p>
                )}
              </div>

              {formData.company.industry === 'Other' && (
                <div className="animate-fadeIn">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Please specify your industry *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.company.industryOther || ''}
                      onChange={(e) => handleFieldChange('company', 'industryOther', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                        errors['company.industryOther'] 
                          ? 'border-red-500 pr-10' 
                          : isFieldValid('company', 'industryOther')
                          ? 'border-green-500 pr-10'
                          : 'border-gray-300'
                      }`}
                      placeholder="e.g., Aerospace, Agriculture, Mining..."
                      maxLength="50"
                    />
                    {isFieldValid('company', 'industryOther') && (
                      <CheckCircle className="absolute right-3 top-3.5 w-5 h-5 text-green-500" />
                    )}
                  </div>
                  {errors['company.industryOther'] && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors['company.industryOther']}
                    </p>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Number of Employees *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={formData.company.employees || ''}
                      onChange={(e) => handleFieldChange('company', 'employees', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                        errors['company.employees'] 
                          ? 'border-red-500 pr-10' 
                          : isFieldValid('company', 'employees')
                          ? 'border-green-500 pr-10'
                          : 'border-gray-300'
                      }`}
                      placeholder="250"
                    />
                    {isFieldValid('company', 'employees') && (
                      <CheckCircle className="absolute right-3 top-3.5 w-5 h-5 text-green-500" />
                    )}
                  </div>
                  {errors['company.employees'] && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors['company.employees']}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Whole numbers only (1-1,000,000)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Reporting Year *
                  </label>
                  <select
                    value={formData.company.reportingYear || '2024'}
                    onChange={(e) => handleFieldChange('company', 'reportingYear', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  >
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    City *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.company.city || ''}
                      onChange={(e) => handleFieldChange('company', 'city', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                        errors['company.city'] 
                          ? 'border-red-500 pr-10' 
                          : isFieldValid('company', 'city')
                          ? 'border-green-500 pr-10'
                          : 'border-gray-300'
                      }`}
                      placeholder="San Francisco"
                      maxLength="50"
                    />
                    {zipVerifying && formData.company.city && (
                      <Loader className="absolute right-3 top-3.5 w-5 h-5 text-blue-500 animate-spin" />
                    )}
                    {!zipVerifying && isFieldValid('company', 'city') && (
                      <CheckCircle className="absolute right-3 top-3.5 w-5 h-5 text-green-500" />
                    )}
                  </div>
                  {errors['company.city'] && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors['company.city']}
                    </p>
                  )}
                  {zipVerified && zipCityMatch && !errors['company.city'] && (
                    <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      City and ZIP code verified ✓
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ZIP Code *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={formData.company.zipCode || ''}
                      onChange={(e) => handleFieldChange('company', 'zipCode', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                        errors['company.zipCode'] 
                          ? 'border-red-500 pr-10' 
                          : isFieldValid('company', 'zipCode')
                          ? 'border-green-500 pr-10'
                          : 'border-gray-300'
                      }`}
                      placeholder="94102"
                      maxLength="5"
                    />
                    {zipVerifying && formData.company.zipCode?.length === 5 && (
                      <Loader className="absolute right-3 top-3.5 w-5 h-5 text-blue-500 animate-spin" />
                    )}
                    {!zipVerifying && isFieldValid('company', 'zipCode') && (
                      <CheckCircle className="absolute right-3 top-3.5 w-5 h-5 text-green-500" />
                    )}
                  </div>
                  {errors['company.zipCode'] && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors['company.zipCode']}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">5 digits</p>
                </div>
              </div>

              <button
                onClick={handleContinue}
                disabled={zipVerifying}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg ${
                  zipVerifying
                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
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

          {currentStep === 2 && (
            <DataEntryChoice />
          )}

          {currentStep === 3 && (
            <ElectricityForm />
          )}

          {currentStep === 4 && (
            <NaturalGasForm />
          )}

          {currentStep >= 5 && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Step {currentStep} - Almost Done!
              </h2>
              <p className="text-gray-600">Vehicle fuels form coming next!</p>
              <button
                onClick={prevStep}
                className="mt-6 text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Go Back
              </button>
            </div>
          )}

        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          Need help? <a href="#" className="text-blue-600 hover:underline">Contact Support</a>
        </div>
      </div>
    </div>
  );
}

export default App;