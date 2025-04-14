import React, { useState } from 'react';
import { Droplet, ZapOff, Zap, Recycle, BarChart, DollarSign, FileText, CheckCircle, Activity, TrendingUp, PieChart, FileCheck } from 'lucide-react';

const App = () => {
  // Form state
  const [formData, setFormData] = useState({
    wastewaterVolume: '',
    bod: '',
    cod: '',
    tss: '',
    cleanWaterTarget: '',
    energyTarget: '',
    financialPreference: 'direct',
    wepaWaterPrice: '',
    wepaEnergyPrice: '',
    currentWaterCost: '',
    currentEnergyCost: ''
  });

  // Results state
  const [results, setResults] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    calculateResults();
    setFormSubmitted(true);
  };
  
  // Move to next step in multi-step form
  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };
  
  // Move to previous step in multi-step form
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Calculate proposal results
  const calculateResults = () => {
    // Extract form values and convert to numbers
    const {
      wastewaterVolume, bod, cod, tss, cleanWaterTarget, energyTarget,
      currentWaterCost, currentEnergyCost, wepaWaterPrice, wepaEnergyPrice
    } = formData;
    
    const volumeNum = parseFloat(wastewaterVolume);
    const bodNum = parseFloat(bod);
    const codNum = parseFloat(cod);
    const cleanWaterNum = parseFloat(cleanWaterTarget);
    const energyNum = parseFloat(energyTarget);
    const currentWaterCostNum = parseFloat(currentWaterCost);
    const currentEnergyCostNum = parseFloat(currentEnergyCost);
    const wepaWaterPriceNum = parseFloat(wepaWaterPrice || 0);
    const wepaEnergyPriceNum = parseFloat(wepaEnergyPrice || 0);
    
    // Simplified calculation logic (would be more complex in a real app)
    // Determine technology based on BOD/COD
    const technology = bodNum > 300 || codNum > 600 ? "EcoVolt Reactor" : "BlueCycle MBR";
    
    // Direct buy economics
    const capex = 1000000; // Base cost of $1M
    const opex = 100000; // Annual operating cost
    const dailyOpex = opex / 365;
    
    // Current costs per day
    const dailyWaterCost = cleanWaterNum * currentWaterCostNum;
    const dailyEnergyCost = energyNum * currentEnergyCostNum;
    const totalDailyCost = dailyWaterCost + dailyEnergyCost;
    
    // Direct buy savings
    const directBuyDailySavings = totalDailyCost - dailyOpex;
    const directBuyAnnualSavings = directBuyDailySavings * 365;
    const paybackPeriod = capex / directBuyAnnualSavings;
    const paybackMonths = Math.round(paybackPeriod * 12);
    
    // Calculate 10-year NPV with 5% discount rate
    const discountRate = 0.05;
    let npv = -capex;
    for (let year = 1; year <= 10; year++) {
      npv += directBuyAnnualSavings / Math.pow(1 + discountRate, year);
    }
    
    // WEPA calculations
    const wepaWaterDaily = cleanWaterNum * wepaWaterPriceNum;
    const wepaEnergyDaily = energyNum * wepaEnergyPriceNum;
    const wepaTotalDaily = wepaWaterDaily + wepaEnergyDaily;
    const wepaDailySavings = totalDailyCost - wepaTotalDaily;
    const wepaAnnualSavings = wepaDailySavings * 365;
    const wepaMonthlyFee = wepaTotalDaily * 30;
    
    // Calculate 10-year NPV for WEPA
    let wepaNpv = 0;
    for (let year = 1; year <= 10; year++) {
      wepaNpv += wepaAnnualSavings / Math.pow(1 + discountRate, year);
    }
    
    // Carbon footprint reduction (simplified)
    const carbonReduction = volumeNum * 0.0002; // kg CO2 per gallon
    
    setResults({
      technology,
      capex,
      opex,
      directBuyDailySavings,
      directBuyAnnualSavings,
      paybackPeriod,
      paybackMonths,
      npv,
      wepaMonthlyFee,
      wepaDailySavings,
      wepaAnnualSavings,
      wepaNpv,
      carbonReduction,
      cleanWaterOutput: cleanWaterNum,
      energyOutput: energyNum,
      wastewaterVolume: volumeNum,
      bod: bodNum,
      cod: codNum,
      tss: parseFloat(tss)
    });
  };

  // Format large numbers with commas
  const formatNumber = (num, decimals = 0) => {
    return num.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  };

  // Format currency
  const formatCurrency = (num, decimals = 0) => {
    return `$${formatNumber(num, decimals)}`;
  };

  // Render step 1 of the form
  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-teal-700">Step 1: Wastewater Characteristics</h2>
      
      <div className="space-y-4">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Daily Wastewater Volume (gallons per day)
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Droplet size={18} className="text-teal-500" />
            </div>
            <input
              type="number"
              name="wastewaterVolume"
              value={formData.wastewaterVolume}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:ring-teal-500 focus:border-teal-500"
              placeholder="e.g., 100,000"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Wastewater Characteristics
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                BOD (mg/L)
              </label>
              <input
                type="number"
                name="bod"
                value={formData.bod}
                onChange={handleChange}
                className="block w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                placeholder="e.g., 500"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                COD (mg/L)
              </label>
              <input
                type="number"
                name="cod"
                value={formData.cod}
                onChange={handleChange}
                className="block w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                placeholder="e.g., 1000"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                TSS (mg/L)
              </label>
              <input
                type="number"
                name="tss"
                value={formData.tss}
                onChange={handleChange}
                className="block w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                placeholder="e.g., 200"
                required
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="button"
          onClick={nextStep}
          className="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        >
          Next Step
        </button>
      </div>
    </div>
  );

  // Render step 2 of the form
  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-teal-700">Step 2: Desired Outputs</h2>
      
      <div className="space-y-4">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Clean Water Volume for Reuse (gallons per day)
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Recycle size={18} className="text-blue-500" />
            </div>
            <input
              type="number"
              name="cleanWaterTarget"
              value={formData.cleanWaterTarget}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:ring-teal-500 focus:border-teal-500"
              placeholder="e.g., 80,000"
              required
            />
          </div>
        </div>
        
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Energy Generation Target (kWh per day)
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Zap size={18} className="text-yellow-500" />
            </div>
            <input
              type="number"
              name="energyTarget"
              value={formData.energyTarget}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:ring-teal-500 focus:border-teal-500"
              placeholder="e.g., 500"
              required
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-between">
        <button
          type="button"
          onClick={prevStep}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={nextStep}
          className="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        >
          Next Step
        </button>
      </div>
    </div>
  );

  // Render step 3 of the form
  const renderStep3 = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-teal-700">Step 3: Financial Information</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Financial Preference
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                formData.financialPreference === 'direct' 
                  ? 'border-teal-500 bg-teal-50' 
                  : 'border-gray-200 hover:border-teal-300'
              }`}
              onClick={() => setFormData({...formData, financialPreference: 'direct'})}
            >
              <div className="flex items-center space-x-3">
                <div className="bg-teal-100 p-2 rounded-full">
                  <DollarSign size={20} className="text-teal-600" />
                </div>
                <div>
                  <h3 className="font-medium">Direct Buy</h3>
                  <p className="text-sm text-gray-500">Purchase system with upfront cost</p>
                </div>
              </div>
            </div>
            
            <div 
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                formData.financialPreference === 'wepa' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => setFormData({...formData, financialPreference: 'wepa'})}
            >
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Activity size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">WEPA</h3>
                  <p className="text-sm text-gray-500">Water Energy Purchase Agreement</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {formData.financialPreference === 'wepa' && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="font-medium text-blue-800 mb-3">WEPA Pricing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Price per gallon of treated water ($/gallon)
                </label>
                <input
                  type="number"
                  name="wepaWaterPrice"
                  value={formData.wepaWaterPrice}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 0.05"
                  step="0.01"
                  required={formData.financialPreference === 'wepa'}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Price per kWh of energy ($/kWh)
                </label>
                <input
                  type="number"
                  name="wepaEnergyPrice"
                  value={formData.wepaEnergyPrice}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 0.10"
                  step="0.01"
                  required={formData.financialPreference === 'wepa'}
                />
              </div>
            </div>
          </div>
        )}
        
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="font-medium text-gray-800 mb-3">Current Costs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Current cost per gallon of water ($/gallon)
              </label>
              <input
                type="number"
                name="currentWaterCost"
                value={formData.currentWaterCost}
                onChange={handleChange}
                className="block w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                placeholder="e.g., 0.10"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Current cost per kWh of energy ($/kWh)
              </label>
              <input
                type="number"
                name="currentEnergyCost"
                value={formData.currentEnergyCost}
                onChange={handleChange}
                className="block w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                placeholder="e.g., 0.15"
                step="0.01"
                required
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between">
        <button
          type="button"
          onClick={prevStep}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Previous
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        >
          Generate Proposal
        </button>
      </div>
    </div>
  );

  // Render the proposal results
  const renderResults = () => {
    if (!results) return null;
    
    return (
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-teal-600 to-blue-500 px-6 py-4">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <FileCheck size={28} className="mr-2" />
            Executive Summary
          </h2>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Project Overview */}
            <div className="lg:col-span-3 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Project Overview</h3>
              <p className="text-gray-700">
                The proposed system will process {formatNumber(results.wastewaterVolume)} gallons of wastewater daily 
                using the {results.technology}, producing {formatNumber(results.cleanWaterOutput)} gallons of clean water 
                and {formatNumber(results.energyOutput)} kWh of renewable energy. This aligns with your wastewater profile 
                (BOD: {results.bod} mg/L, COD: {results.cod} mg/L, TSS: {results.tss} mg/L).
              </p>
            </div>
            
            {/* Economic Highlights */}
            <div className="lg:col-span-2 bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">Economic Highlights</h3>
              <div className="space-y-4">
                <div className="bg-white p-3 rounded shadow-sm">
                  <h4 className="font-medium text-gray-800 flex items-center">
                    <DollarSign size={18} className="text-teal-600 mr-1" />
                    Direct Buy
                  </h4>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="text-sm text-gray-500">CAPEX:</div>
                    <div className="text-sm font-medium">{formatCurrency(results.capex)}</div>
                    
                    <div className="text-sm text-gray-500">OPEX:</div>
                    <div className="text-sm font-medium">{formatCurrency(results.opex)}/year</div>
                    
                    <div className="text-sm text-gray-500">Annual Savings:</div>
                    <div className="text-sm font-medium">{formatCurrency(results.directBuyAnnualSavings)}</div>
                    
                    <div className="text-sm text-gray-500">Payback:</div>
                    <div className="text-sm font-medium">~{results.paybackMonths} months</div>
                    
                    <div className="text-sm text-gray-500">10-Year NPV:</div>
                    <div className="text-sm font-medium">{formatCurrency(results.npv, 0)}</div>
                  </div>
                </div>
                
                <div className="bg-white p-3 rounded shadow-sm">
                  <h4 className="font-medium text-gray-800 flex items-center">
                    <Activity size={18} className="text-blue-600 mr-1" />
                    WEPA
                  </h4>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="text-sm text-gray-500">Monthly Fees:</div>
                    <div className="text-sm font-medium">{formatCurrency(results.wepaMonthlyFee)}</div>
                    
                    <div className="text-sm text-gray-500">Annual Savings:</div>
                    <div className="text-sm font-medium">{formatCurrency(results.wepaAnnualSavings)}</div>
                    
                    <div className="text-sm text-gray-500">10-Year NPV:</div>
                    <div className="text-sm font-medium">{formatCurrency(results.wepaNpv, 0)}</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Charts & Visualization */}
            <div className="bg-teal-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-teal-800 mb-3">Operational Capabilities</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Wastewater Treatment:</span>
                  <span className="font-medium">{formatNumber(results.wastewaterVolume)} gal/day</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-teal-600 h-2.5 rounded-full" style={{width: '100%'}}></div>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm text-gray-600">Clean Water Production:</span>
                  <span className="font-medium">{formatNumber(results.cleanWaterOutput)} gal/day</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-500 h-2.5 rounded-full" style={{width: `${(results.cleanWaterOutput / results.wastewaterVolume) * 100}%`}}></div>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm text-gray-600">Energy Generation:</span>
                  <span className="font-medium">{formatNumber(results.energyOutput)} kWh/day</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-yellow-500 h-2.5 rounded-full" style={{width: '80%'}}></div>
                </div>
                
                <div className="mt-4 p-3 bg-white rounded shadow-sm">
                  <div className="flex items-center text-green-800">
                    <Recycle size={18} className="mr-1" />
                    <span className="text-sm font-medium">Environmental Impact</span>
                  </div>
                  <p className="text-sm mt-1">
                    Carbon Reduction: ~{formatNumber(results.carbonReduction)} kg CO2/day
                  </p>
                </div>
              </div>
            </div>
            
            {/* Recommendation */}
            <div className="lg:col-span-3 bg-green-50 p-4 rounded-lg border border-green-100">
              <h3 className="text-lg font-semibold text-green-800 mb-3">Recommendation</h3>
              <p className="text-gray-700">
                {formData.financialPreference === 'wepa' ? (
                  <>
                    <span className="font-medium">WEPA</span> offers {formatCurrency(results.wepaAnnualSavings)} in annual savings 
                    with no upfront cost, ideal for immediate benefits. Direct Buy provides higher long-term value 
                    ({formatCurrency(results.npv)} NPV vs. {formatCurrency(results.wepaNpv)}) if you can invest upfront.
                  </>
                ) : (
                  <>
                    <span className="font-medium">Direct Buy</span> provides the highest long-term value 
                    ({formatCurrency(results.npv)} NPV) with a quick payback period of only {results.paybackMonths} months. 
                    WEPA is available as an alternative with no upfront costs but lower long-term savings.
                  </>
                )}
              </p>
            </div>
            
            {/* Disclaimer */}
            <div className="lg:col-span-3">
              <p className="text-xs text-gray-500 italic">
                Disclaimer: These are conceptual estimates. Contact Cambrian Innovation for precise design and costs.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 px-6 py-4 flex justify-between">
          <button
            onClick={() => setFormSubmitted(false)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Edit Inputs
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 flex items-center"
          >
            <FileText size={18} className="mr-2" />
            Export PDF
          </button>
        </div>
      </div>
    );
  };

  // Main rendering logic
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-teal-600 to-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Recycle size={32} className="text-white" />
              <h1 className="text-2xl font-bold">Cambrian Innovation</h1>
            </div>
            <div className="text-sm text-teal-100">Wastewater Recovery Specialists</div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {formSubmitted ? (
          renderResults()
        ) : (
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-teal-100 p-3 rounded-full">
                  <FileText size={24} className="text-teal-700" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Wastewater Recovery Proposal Generator</h1>
                  <p className="text-gray-600">Fill in the details below to generate your customized proposal</p>
                </div>
              </div>
              
              <div className="border-b border-gray-200 mb-6">
                <div className="flex mb-4">
                  <div className={`flex-1 pb-2 ${currentStep >= 1 ? 'border-b-2 border-teal-500' : ''}`}>
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                        currentStep >= 1 ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        1
                      </div>
                      <span className={currentStep >= 1 ? 'text-teal-600 font-medium' : 'text-gray-500'}>
                        Wastewater
                      </span>
                    </div>
                  </div>
                  <div className={`flex-1 pb-2 ${currentStep >= 2 ? 'border-b-2 border-teal-500' : ''}`}>
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                        currentStep >= 2 ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        2
                      </div>
                      <span className={currentStep >= 2 ? 'text-teal-600 font-medium' : 'text-gray-500'}>
                        Outputs
                      </span>
                    </div>
                  </div>
                  <div className={`flex-1 pb-2 ${currentStep >= 3 ? 'border-b-2 border-teal-500' : ''}`}>
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                        currentStep >= 3 ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        3
                      </div>
                      <span className={currentStep >= 3 ? 'text-teal-600 font-medium' : 'text-gray-500'}>
                        Financials
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleSubmit}>
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}
              </form>
            </div>
          </div>
        )}
        
        {/* Technology Overview */}
        {!formSubmitted && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-teal-500 px-4 py-3">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <Droplet size={20} className="mr-2" />
                  EcoVolt Reactor
                </h3>
              </div>
              <div className="p-4">
                <p className="text-gray-600 mb-4">
                  Our flagship technology converts wastewater to renewable energy using electrically-active microbes
                  that efficiently treat wastewater while extracting clean energy and water.
                </p>
                <div className="flex items-center text-teal-600 text-sm font-medium">
                  <CheckCircle size={16} className="mr-1" />
                  <span>80% BOD removal</span>
                </div>
                <div className="flex items-center text-teal-600 text-sm font-medium mt-1">
                  <CheckCircle size={16} className="mr-1" />
                  <span>High-quality biogas production</span>
                </div>
                <div className="flex items-center text-teal-600 text-sm font-medium mt-1">
                  <CheckCircle size={16} className="mr-1" />
                  <span>30-200 kW power generation</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-blue-500 px-4 py-3">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <Recycle size={20} className="mr-2" />
                  Water Reuse
                </h3>
              </div>
              <div className="p-4">
                <p className="text-gray-600 mb-4">
                  Transform your wastewater into a valuable resource with our advanced treatment systems
                  that enable water recycling and reuse within your facility.
                </p>
                <div className="flex items-center text-blue-600 text-sm font-medium">
                  <CheckCircle size={16} className="mr-1" />
                  <span>Reduce freshwater consumption</span>
                </div>
                <div className="flex items-center text-blue-600 text-sm font-medium mt-1">
                  <CheckCircle size={16} className="mr-1" />
                  <span>Lower discharge fees</span>
                </div>
                <div className="flex items-center text-blue-600 text-sm font-medium mt-1">
                  <CheckCircle size={16} className="mr-1" />
                  <span>Meet sustainability goals</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-green-500 px-4 py-3">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <Activity size={20} className="mr-2" />
                  WEPA Financing
                </h3>
              </div>
              <div className="p-4">
                <p className="text-gray-600 mb-4">
                  Our Water-Energy Purchase Agreement allows you to implement advanced treatment technology
                  with no upfront capital cost. Pay only for the clean water and energy you use.
                </p>
                <div className="flex items-center text-green-600 text-sm font-medium">
                  <CheckCircle size={16} className="mr-1" />
                  <span>Zero capital expenditure</span>
                </div>
                <div className="flex items-center text-green-600 text-sm font-medium mt-1">
                  <CheckCircle size={16} className="mr-1" />
                  <span>Predictable monthly payments</span>
                </div>
                <div className="flex items-center text-green-600 text-sm font-medium mt-1">
                  <CheckCircle size={16} className="mr-1" />
                  <span>Cambrian handles maintenance</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center space-x-2">
                <Recycle size={24} className="text-teal-400" />
                <span className="font-bold text-xl">Cambrian Innovation</span>
              </div>
              <p className="text-gray-400 mt-2">Transforming Wastewater into Value</p>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-gray-400">15 Main Street, Suite 318</p>
              <p className="text-gray-400">Watertown, MA 02472</p>
              <p className="text-teal-400 mt-2">(617) 307-1755</p>
              <p className="text-teal-400">info@cambrianinnovation.com</p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-6 pt-6 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Cambrian Innovation Inc. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;