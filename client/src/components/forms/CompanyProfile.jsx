
// COMPANY PROFILE - Step 1 of Multi-Step Form
// PURPOSE: Fast onboarding (3 minutes)
// - Get basic company info
// - Non-intimidating first step
// - Save progress immediately
// TECH: React + Tailwind + FormContext

import React from 'react';
import { Building, AlertCircle } from 'lucide-react';
import { useFormContext } from '../../context/FormContext';

const CompanyProfile = () => {
  const { formData, updateField, nextStep, errors, setErrors } = useFormContext();

  const validate = () => {
    const newErrors = {};
    
    // Company name required
    if (!formData.company.name.trim()) {
      newErrors['company.name'] = 'Company name is required';
    }
    
    // Industry required
    if (!formData.company.industry) {
      newErrors['company.industry'] = 'Please select an industry';
    }
    
    // Employees required and must be positive
    if (!formData.company.employees || formData.company.employees <= 0) {
      newErrors['company.employees'] = 'Enter number of employees';
    }
    
    // City required
    if (!formData.company.city.trim()) {
      newErrors['company.city'] = 'City is required';
    }
    
    // ZIP must be 5 digits
    if (!formData.company.zipCode.trim() || !/^\d{5}$/.test(formData.company.zipCode)) {
      newErrors['company.zipCode'] = 'Enter valid 5-digit ZIP code';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validate()) {
      nextStep();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Building className="w-8 h-8 text-blue-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Welcome! Let's set up your company profile
          </h2>
          <p className="text-sm text-gray-600">This takes about 3 minutes</p>
        </div>
      </div>

      {/* Company Name */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Company Name *
        </label>
        <input
          type="text"
          value={formData.company.name}
          onChange={(e) => updateField('company', 'name', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
            errors['company.name'] ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Acme Manufacturing Inc."
        />
        {errors['company.name'] && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors['company.name']}
          </p>
        )}
      </div>

      {/* Industry */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Industry *
        </label>
        <select
          value={formData.company.industry}
          onChange={(e) => updateField('company', 'industry', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
            errors['company.industry'] ? 'border-red-500' : 'border-gray-300'
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
          <option value="Other">Other</option>
        </select>
        {errors['company.industry'] && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors['company.industry']}
          </p>
        )}
      </div>

      {/* Employees and Year */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Number of Employees *
          </label>
          <input
            type="number"
            value={formData.company.employees}
            onChange={(e) => updateField('company', 'employees', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
              errors['company.employees'] ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="250"
            min="1"
          />
          {errors['company.employees'] && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors['company.employees']}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Reporting Year *
          </label>
          <select
            value={formData.company.reportingYear}
            onChange={(e) => updateField('company', 'reportingYear', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          >
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
          </select>
        </div>
      </div>

      {/* Location */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            City *
          </label>
          <input
            type="text"
            value={formData.company.city}
            onChange={(e) => updateField('company', 'city', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
              errors['company.city'] ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="San Francisco"
          />
          {errors['company.city'] && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors['company.city']}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            ZIP Code *
          </label>
          <input
            type="text"
            value={formData.company.zipCode}
            onChange={(e) => updateField('company', 'zipCode', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
              errors['company.zipCode'] ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="94102"
            maxLength="5"
          /> bhjjvh
          {errors['company.zipCode'] && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors['company.zipCode']}
            </p>
          )}
        </div>
      </div>

      {/* Continue Button */}
      <button
        onClick={handleContinue}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition mt-6"
      >
        Continue →
      </button>
    </div>
  );
};

export default CompanyProfile;