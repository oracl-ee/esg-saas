import React from 'react';
import { useFormContext } from '../../context/FormContext';
import { 
  CheckCircle, 
  Edit2, 
  AlertCircle,
  Zap,
  Flame,
  Car,
  Building,
  Calculator
} from 'lucide-react';

const ReviewAndCalculate = ({ onCalculate }) => {
  const { formData, setCurrentStep, prevStep } = useFormContext();

  const handleCalculate = () => {
    // Navigate to separate dashboard view
    if (onCalculate) {
      onCalculate();
    }
  };

  const editStep = (step) => {
    setCurrentStep(step);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-400 text-sm backdrop-blur-sm">
            <CheckCircle className="w-4 h-4" />
            <span>Step 6 of 6</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Review & Calculate
            </span>
          </h1>
          <p className="text-xl text-gray-400">
            Review your data before calculating emissions
          </p>
        </div>

        {/* Company Information */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 group hover:bg-white/10 transition-all duration-300">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Step 1</div>
                <div className="text-lg font-semibold">Company Information</div>
              </div>
            </div>
            <button
              onClick={() => editStep(1)}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all duration-300 text-sm"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-400">Company Name</div>
              <div className="font-medium">{formData.company?.name || 'Not provided'}</div>
            </div>
            <div>
              <div className="text-gray-400">Industry</div>
              <div className="font-medium">{formData.company?.industry || 'Not provided'}</div>
            </div>
            <div>
              <div className="text-gray-400">Location</div>
              <div className="font-medium">
                {formData.company?.city && formData.company?.state 
                  ? `${formData.company.city}, ${formData.company.state} ${formData.company.zipCode}`
                  : 'Not provided'}
              </div>
            </div>
            <div>
              <div className="text-gray-400">Employee Count</div>
              <div className="font-medium">{formData.company?.employees || 'Not provided'}</div>
            </div>
          </div>
        </div>

        {/* Electricity Data */}
        {formData.electricity?.totalKwh && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 group hover:bg-white/10 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">Step 3</div>
                  <div className="text-lg font-semibold">Electricity Usage</div>
                </div>
              </div>
              <button
                onClick={() => editStep(3)}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all duration-300 text-sm"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-gray-400">Annual Usage</div>
                <div className="font-medium text-xl">{parseFloat(formData.electricity.totalKwh).toLocaleString()} kWh</div>
              </div>
              <div>
                <div className="text-gray-400">Utility Provider</div>
                <div className="font-medium">{formData.electricity.provider || 'Not specified'}</div>
              </div>
              {formData.electricity.renewableKwh > 0 && (
                <div>
                  <div className="text-gray-400">Renewable Energy</div>
                  <div className="font-medium flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    {formData.electricity.renewableKwh} kWh ({formData.electricity.renewablePercentage}%)
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Natural Gas Data */}
        {formData.naturalGas?.usesGas === true && formData.naturalGas?.amount && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 group hover:bg-white/10 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">Step 4</div>
                  <div className="text-lg font-semibold">Natural Gas Usage</div>
                </div>
              </div>
              <button
                onClick={() => editStep(4)}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all duration-300 text-sm"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-400">Annual Usage</div>
                <div className="font-medium text-xl">
                  {parseFloat(formData.naturalGas.amount).toLocaleString()} {formData.naturalGas.unit || 'therms'}
                </div>
              </div>
              <div>
                <div className="text-gray-400">Unit Type</div>
                <div className="font-medium capitalize">{formData.naturalGas.unit || 'therms'}</div>
              </div>
            </div>
          </div>
        )}

        {/* Vehicle Fuels Data */}
        {formData.fuels?.usesVehicles === true && (formData.fuels?.gasoline > 0 || formData.fuels?.diesel > 0 || formData.fuels?.propane > 0) && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 group hover:bg-white/10 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl">
                  <Car className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">Step 5</div>
                  <div className="text-lg font-semibold">Vehicle Fuels</div>
                </div>
              </div>
              <button
                onClick={() => editStep(5)}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all duration-300 text-sm"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              {formData.fuels.gasoline > 0 && (
                <div>
                  <div className="text-gray-400">Gasoline</div>
                  <div className="font-medium text-xl">{parseFloat(formData.fuels.gasoline).toLocaleString()} gal</div>
                </div>
              )}
              {formData.fuels.diesel > 0 && (
                <div>
                  <div className="text-gray-400">Diesel</div>
                  <div className="font-medium text-xl">{parseFloat(formData.fuels.diesel).toLocaleString()} gal</div>
                </div>
              )}
              {formData.fuels.propane > 0 && (
                <div>
                  <div className="text-gray-400">Propane</div>
                  <div className="font-medium text-xl">{parseFloat(formData.fuels.propane).toLocaleString()} gal</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Data Quality Check */}
        <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/20 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <AlertCircle className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">Data Quality Check</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Company information complete</span>
                </div>
                {formData.electricity?.totalKwh && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Electricity data provided</span>
                  </div>
                )}
                {formData.naturalGas?.usesGas === true && formData.naturalGas?.amount && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Natural gas data provided</span>
                  </div>
                )}
                {formData.fuels?.usesVehicles === true && (formData.fuels?.gasoline > 0 || formData.fuels?.diesel > 0 || formData.fuels?.propane > 0) && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Vehicle fuel data provided</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Calculate Button */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-75 group-hover:opacity-100 blur transition duration-500"></div>
          <button
            onClick={handleCalculate}
            className="relative w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 rounded-2xl p-6 transition-all duration-300"
          >
            <div className="flex items-center justify-center gap-3">
              <Calculator className="w-8 h-8" />
              <span className="text-2xl font-bold">Calculate Emissions</span>
            </div>
            <div className="text-sm opacity-80 mt-2">
              Generate your comprehensive SB 253 emissions report
            </div>
          </button>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-8">
          <button
            onClick={prevStep}
            className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all duration-300"
          >
            ← Back
          </button>
          
          <div className="text-sm text-gray-400">
            All data will be saved securely
          </div>
        </div>

      </div>
    </div>
  );
};

export default ReviewAndCalculate;