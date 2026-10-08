import React, { createContext, useContext, useState, useEffect } from 'react';

const FormContext = createContext();

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within FormProvider');
  }
  return context;
};

export const FormProvider = ({ children }) => {
  // Load saved data from localStorage
  const savedData = localStorage.getItem('esgFormData');
  const savedStep = localStorage.getItem('esgCurrentStep');
  
  const [formData, setFormData] = useState(
    savedData ? JSON.parse(savedData) : {
      company: {
        name: '',
        industry: '',
        industryOther: '',
        city: '',
        state: '',
        zipCode: '',
        employees: '',
        reportingYear: '2024'
      },
      dataMethod: '',
      electricity: {
        provider: '',
        totalKwh: '',
        renewableKwh: '',
        renewablePercentage: 0
      },
      naturalGas: {
        usesGas: null,  // true/false/null
        amount: '',
        unit: 'therms'
      },
      fuels: {
        usesVehicles: null,  // true/false/null
        gasoline: 0,
        diesel: 0,
        propane: 0
      }
    }
  );

  const [currentStep, setCurrentStep] = useState(
    savedStep ? parseInt(savedStep) : 0
  );

  const [saveMessage, setSaveMessage] = useState('');
  const [errors, setErrors] = useState({});

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('esgFormData', JSON.stringify(formData));
    localStorage.setItem('esgCurrentStep', currentStep.toString());
  }, [formData, currentStep]);

  const updateField = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    
    // Clear error for this field
    const errorKey = `${section}.${field}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const nextStep = () => {
    // Allow progression to Step 7 (Dashboard)
    if (currentStep < 7) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const goToStep = (step) => {
    if (step >= 0 && step <= 7) {
      setCurrentStep(step);
      window.scrollTo(0, 0);
    }
  };

  const showSaveMessage = (message) => {
    setSaveMessage(message);
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const value = {
    formData,
    updateField,
    currentStep,
    setCurrentStep: goToStep,
    nextStep,
    prevStep,
    saveMessage,
    showSaveMessage,
    errors,
    setErrors
  };

  return (
    <FormContext.Provider value={value}>
      {children}
    </FormContext.Provider>
  );
};

export default FormContext;