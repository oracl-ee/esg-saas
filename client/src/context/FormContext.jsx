/* eslint-disable react-refresh/only-export-components */

// ============================================================================
// FORM CONTEXT - Centralized State Management for Multi-Step Forms
// 
// PURPOSE: 
// - Share form data across all components
// - Auto-save to localStorage (user never loses progress)
// - Provide helper functions for updating data
// 
// TECH: React Context API + localStorage
// ============================================================================

import React, { createContext, useState, useEffect } from 'react';

// Create the context that components will consume
export const FormContext = createContext();

// Provider component that wraps the entire app
export const FormProvider = ({ children }) => {
  
  // ============================================================================
  // STATE - All form data stored in one object
  // ============================================================================
  
  const [formData, setFormData] = useState(() => {
    // Try to load saved data from localStorage when app first loads
    const saved = localStorage.getItem('california-esg-form-data');
    
    if (saved) {
      return JSON.parse(saved);
    }
    
    // Default empty form data if nothing saved
    return {
      // Step 1: Company Profile (Onboarding)
      company: {
        name: '',
        industry: '',
        employees: '',
        city: '',
        state: 'CA',
        zipCode: '',
        reportingYear: '2024',
      },
      
      // Step 2: Data Entry Method Choice
      dataEntryMethod: null,  // null | "upload" | "manual"
      
      // Step 3: Electricity Data (Scope 2)
      electricity: {
        provider: '',
        totalKwh: '',
        renewableKwh: '',
      },
      
      // Step 4: Natural Gas Data (Scope 1)
      naturalGas: {
        usesGas: null,  // null | true | false | "notSure"
        amount: '',
        unit: 'therms',  // "therms" | "kwh" | "cubicMeters"
      },
      
      // Step 5: Vehicle Fuels (Scope 1)
      fuels: {
        usesVehicles: null,  // null | true | false
        gasoline: '',
        diesel: '',
        propane: '',
      },
      
      // For upload path (Phase 2)
      uploadedFiles: [],
    };
  });

  // Current step in the wizard (1 = Company Profile, 2 = Choice, etc.)
  const [currentStep, setCurrentStep] = useState(() => {
    const saved = localStorage.getItem('california-esg-current-step');
    return saved ? parseInt(saved) : 1;
  });

  // Calculation results (null until user clicks "Calculate")
  const [calculationResult, setCalculationResult] = useState(null);

  // Validation errors for current step
  const [errors, setErrors] = useState({});

  // ============================================================================
  // AUTO-SAVE - Persist to localStorage whenever data changes
  // ============================================================================
  
  useEffect(() => {
    // Save form data to localStorage whenever it changes
    localStorage.setItem('california-esg-form-data', JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    // Save current step
    localStorage.setItem('california-esg-current-step', currentStep.toString());
  }, [currentStep]);

  // ============================================================================
  // HELPER FUNCTIONS - Make updating state easier
  // ============================================================================
  
  /**
   * Update a single field within a section
   * Example: updateField('company', 'name', 'Acme Corp')
   */
  const updateField = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    
    // Clear error for this field when user types
    if (errors[`${section}.${field}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`${section}.${field}`];
        return newErrors;
      });
    }
  };

  /**
   * Update an entire section at once
   * Example: updateSection('company', { name: 'Acme', industry: 'Tech' })
   */
  const updateSection = (section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...data
      }
    }));
  };

  /**
   * Reset everything (for "Start Over" button)
   */
  const resetForm = () => {
    const emptyData = {
      company: { name: '', industry: '', employees: '', city: '', state: 'CA', zipCode: '', reportingYear: '2024' },
      dataEntryMethod: null,
      electricity: { provider: '', totalKwh: '', renewableKwh: '' },
      naturalGas: { usesGas: null, amount: '', unit: 'therms' },
      fuels: { usesVehicles: null, gasoline: '', diesel: '', propane: '' },
      uploadedFiles: [],
    };
    
    setFormData(emptyData);
    setCurrentStep(1);
    setCalculationResult(null);
    setErrors({});
    
    localStorage.removeItem('california-esg-form-data');
    localStorage.removeItem('california-esg-current-step');
  };

  /**
   * Go to next step (with optional validation)
   */
  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
    window.scrollTo(0, 0);
  };

  /**
   * Go to previous step
   */
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };

  // ============================================================================
  // PROVIDE ALL STATE & FUNCTIONS TO CHILDREN
  // ============================================================================
  
  const value = {
    // State
    formData,
    currentStep,
    calculationResult,
    errors,
    
    // State Setters
    setFormData,
    setCurrentStep,
    setCalculationResult,
    setErrors,
    
    // Helper Functions
    updateField,
    updateSection,
    resetForm,
    nextStep,
    prevStep,
  };

  return (
    <FormContext.Provider value={value}>
      {children}
    </FormContext.Provider>
  );
};

// ============================================================================
// CUSTOM HOOK - Easy way to use the context
// ============================================================================

/**
 * Custom hook to access form context
 * Usage: const { formData, updateField } = useFormContext();
 */
export const useFormContext = () => {
  const context = React.useContext(FormContext);
  
  if (!context) {
    throw new Error('useFormContext must be used within FormProvider');
  }
  
  return context;
};