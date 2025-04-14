import React, { useState } from 'react';
// Removed BarChart, TrendingUp, PieChart as they were unused
import { Droplet, Zap, Recycle, DollarSign, FileText, CheckCircle, Activity, Info, AlertTriangle, ArrowRight, ArrowLeft, FileCheck } from 'lucide-react';
// Note: For actual charts, you'd import a library like Recharts or Chart.js
// import { LineChart, Line, BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from 'recharts';

const App = () => {
  // --- State Management ---
  const [formData, setFormData] = useState({
    wastewaterVolume: '',
    bod: '',
    cod: '',
    tss: '',
    cleanWaterTarget: '',
    energyTarget: '',
    financialPreference: 'direct', // Default to Direct Buy
    wepaWaterPrice: '',
    wepaEnergyPrice: '',
    currentWaterCost: '',
    currentEnergyCost: ''
  });
  const [results, setResults] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // --- Constants ---
  const CAPEX_PER_GALLON_DAILY_ECOVOLT = 25; // $10,000,000 / 400,000 GPD
  const OPEX_PERCENTAGE_OF_CAPEX = 0.10; // 10%
  const DISCOUNT_RATE = 0.05; // 5% for NPV calculation
  const YEARS_FOR_NPV = 10;

  // --- Event Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep3()) {
        calculateResults();
        setFormSubmitted(true);
        setCurrentStep(1); // Reset step for potential edits
    } else {
        alert("Please fill in all required fields for the final step.");
    }
  };

  // --- Multi-Step Form Navigation ---
   const validateStep1 = () => {
       return formData.wastewaterVolume && formData.bod && formData.cod && formData.tss;
   };
   const validateStep2 = () => {
       return formData.cleanWaterTarget && formData.energyTarget;
   };
   const validateStep3 = () => {
       const commonRequired = formData.currentWaterCost && formData.currentEnergyCost;
       if (formData.financialPreference === 'wepa') {
           return commonRequired && formData.wepaWaterPrice && formData.wepaEnergyPrice;
       }
       return commonRequired;
   };

  const nextStep = () => {
     if (currentStep === 1 && !validateStep1()) {
         alert("Please fill in all wastewater characteristics.");
         return;
     }
      if (currentStep === 2 && !validateStep2()) {
         alert("Please fill in both desired output targets.");
         return;
     }
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // --- Core Calculation Logic ---
  const calculateResults = () => {
    // 1. Extract and Parse Inputs
    const volumeNum = parseFloat(formData.wastewaterVolume) || 0;
    const bodNum = parseFloat(formData.bod) || 0;
    const codNum = parseFloat(formData.cod) || 0;
    const tssNum = parseFloat(formData.tss) || 0;
    const cleanWaterTargetNum = parseFloat(formData.cleanWaterTarget) || 0;
    const energyTargetNum = parseFloat(formData.energyTarget) || 0;
    const currentWaterCostNum = parseFloat(formData.currentWaterCost) || 0;
    const currentEnergyCostNum = parseFloat(formData.currentEnergyCost) || 0;
    const wepaWaterPriceNum = parseFloat(formData.wepaWaterPrice) || 0;
    const wepaEnergyPriceNum = parseFloat(formData.wepaEnergyPrice) || 0;

    // 2. Technology Selection Logic
    let primaryTechnology = "EcoVolt Reactor"; // Default assumption
    let technologyReasoning = "";
    let additionalTechNote = "";
    const requiresEnergyGeneration = energyTargetNum > 0;
    const requiresHighWaterQuality = (cleanWaterTargetNum / volumeNum) > 0.75 && tssNum > 100; // Example threshold for MBR

    if (bodNum > 800 || codNum > 1500) {
        primaryTechnology = "EcoVolt Reactor";
        technologyReasoning = "High organic load (BOD/COD) makes the EcoVolt Reactor ideal for maximizing energy generation while treating wastewater.";
        if (requiresHighWaterQuality) {
            additionalTechNote = "A BlueCycle MBR may be recommended as a polishing step for achieving the highest water reuse quality targets.";
        } else if (bodNum < 1500 && tssNum > 300) {
             additionalTechNote = "A Bio Viper could supplement treatment depending on specific effluent needs.";
        }
    } else if (requiresHighWaterQuality) {
        primaryTechnology = "BlueCycle MBR";
        technologyReasoning = "The high water reuse target and TSS levels suggest a BlueCycle MBR is necessary for producing high-quality effluent suitable for reuse.";
        additionalTechNote = "An upstream EcoVolt Reactor or Bio Viper would likely be included for initial BOD/COD reduction, impacting overall CAPEX.";
    } else if (bodNum > 300 || codNum > 600 || tssNum > 200) {
         primaryTechnology = "Bio Viper";
         technologyReasoning = "Moderate to high BOD/COD/TSS levels are well-suited for the Bio Viper, offering efficient treatment and sludge reduction.";
         if (requiresEnergyGeneration) {
             additionalTechNote = "If significant energy generation is a key goal, adding an EcoVolt Reactor upstream should be considered.";
         }
          if (requiresHighWaterQuality) {
             additionalTechNote = "If higher water quality is needed than Bio Viper provides, a BlueCycle MBR polishing step could be added.";
         }
    } else {
         // Lower strength wastewater - might still use BioViper or simpler aerobic
         primaryTechnology = "Bio Viper / Aerobic System";
         technologyReasoning = "Lower strength wastewater can be effectively treated using aerobic systems like the Bio Viper or potentially simpler configurations.";
          if (requiresEnergyGeneration) {
             additionalTechNote = "Energy generation with lower-strength waste often requires an EcoVolt Reactor, though yields may be lower.";
         }
    }
    // Ensure EcoVolt is mentioned if energy is targeted but not primary
    if (requiresEnergyGeneration && !primaryTechnology.includes("EcoVolt")) {
        additionalTechNote += (additionalTechNote ? " " : "") + "An EcoVolt Reactor could be integrated to meet energy generation targets.";
    }

    // 3. Economic Analysis (Based on EcoVolt CAPEX Anchor)
    const baseCapex = volumeNum * CAPEX_PER_GALLON_DAILY_ECOVOLT;
    const opexAnnual = baseCapex * OPEX_PERCENTAGE_OF_CAPEX;
    // Removed unused 'opexDaily' variable definition
    // const opexDaily = opexAnnual / 365;

    // Value of Outputs based on *Current* Costs (Avoided Costs)
    const dailyValueCleanWater = cleanWaterTargetNum * currentWaterCostNum;
    const dailyValueEnergy = energyTargetNum * currentEnergyCostNum;
    const totalDailyValueGenerated = dailyValueCleanWater + dailyValueEnergy;
    const totalAnnualValueGenerated = totalDailyValueGenerated * 365;

    // --- Direct Buy Calculations ---
    const directBuyAnnualSavings = totalAnnualValueGenerated - opexAnnual;
    let paybackPeriodYears = Infinity;
    if (directBuyAnnualSavings > 0) {
      paybackPeriodYears = baseCapex / directBuyAnnualSavings;
    }
    const paybackMonths = isFinite(paybackPeriodYears) ? Math.round(paybackPeriodYears * 12) : 'N/A (Savings do not exceed OPEX or no savings)';

    let directBuyNpv = -baseCapex;
    for (let year = 1; year <= YEARS_FOR_NPV; year++) {
      directBuyNpv += directBuyAnnualSavings / Math.pow(1 + DISCOUNT_RATE, year);
    }

    // --- WEPA Calculations ---
    const wepaDailyFeeWater = cleanWaterTargetNum * wepaWaterPriceNum;
    const wepaDailyFeeEnergy = energyTargetNum * wepaEnergyPriceNum;
    const wepaTotalDailyFee = wepaDailyFeeWater + wepaDailyFeeEnergy;
    const wepaTotalAnnualFee = wepaTotalDailyFee * 365;
    const wepaMonthlyFee = wepaTotalDailyFee * (365 / 12); // Average monthly fee

    // WEPA Savings compared to *Current* Costs
    // Estimate current costs based on target outputs
    const currentDailyWaterCost = cleanWaterTargetNum * currentWaterCostNum;
    const currentDailyEnergyCost = energyTargetNum * currentEnergyCostNum;
    const currentTotalDailyCost = currentDailyWaterCost + currentDailyEnergyCost;
    const currentTotalAnnualCost = currentTotalDailyCost * 365; // Calculate annual version for clarity

    const wepaAnnualSavings = currentTotalAnnualCost - wepaTotalAnnualFee;


    let wepaNpv = 0;
    for (let year = 1; year <= YEARS_FOR_NPV; year++) {
      wepaNpv += wepaAnnualSavings / Math.pow(1 + DISCOUNT_RATE, year); // Savings stream starts year 1
    }

    // 4. Environmental Impact (Placeholder)
    const carbonReductionKgPerDay = (energyTargetNum * 0.4) + (volumeNum * 0.0001); // Simplified


    // 5. Set Results State
    setResults({
      // Inputs
      wastewaterVolume: volumeNum,
      bod: bodNum,
      cod: codNum,
      tss: tssNum,
      cleanWaterOutput: cleanWaterTargetNum,
      energyOutput: energyTargetNum,
      currentWaterCost: currentWaterCostNum,
      currentEnergyCost: currentEnergyCostNum,
      // Technology
      primaryTechnology,
      technologyReasoning,
      additionalTechNote,
      // Economics (Direct Buy)
      baseCapex,
      opexAnnual,
      directBuyAnnualSavings,
      paybackPeriodYears, // Keep this raw value for checks
      paybackMonths,
      directBuyNpv,
      // Economics (WEPA)
      wepaMonthlyFee,
      wepaAnnualSavings,
      wepaNpv,
      wepaWaterPrice: wepaWaterPriceNum,
      wepaEnergyPrice: wepaEnergyPriceNum,
      // Operational/Environmental
      carbonReductionKgPerDay,
      waterTreatmentEfficiency: volumeNum > 0 ? (cleanWaterTargetNum / volumeNum) * 100 : 0,
      // Raw values for charts if needed later
      annualCashFlowDirectBuy: Array.from({ length: YEARS_FOR_NPV }, (_, i) => i === 0 ? -baseCapex : directBuyAnnualSavings),
      annualCashFlowWepa: Array.from({ length: YEARS_FOR_NPV }, () => wepaAnnualSavings)
    });
  };

  // --- Formatting Helpers ---
  const formatNumber = (num, decimals = 0) => {
      if (num === null || num === undefined || !isFinite(num)) return 'N/A';
      return num.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  };
  const formatCurrency = (num, decimals = 0) => {
      if (num === null || num === undefined || !isFinite(num)) return 'N/A';
      const value = parseFloat(num);
       const options = {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
      };
      if (Math.abs(value) < 0.01 && value !== 0) {
           options.minimumFractionDigits = 2;
           options.maximumFractionDigits = 4;
      }
      return value.toLocaleString('en-US', options);
  };

   // --- Rendering Functions ---

   // Step 1 Form - UNCHANGED
  const renderStep1 = () => (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-xl font-bold text-teal-700">Step 1: Wastewater Characteristics</h2>
      <p className="text-sm text-gray-600">Provide details about your facility's daily wastewater.</p>
      <div className="space-y-4">
        <div className="relative">
          <label htmlFor="wastewaterVolume" className="block text-sm font-medium text-gray-700 mb-1">
            Daily Wastewater Volume <span className="text-red-500">*</span>
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Droplet size={18} className="text-teal-500" />
            </div>
            <input type="number" name="wastewaterVolume" id="wastewaterVolume" value={formData.wastewaterVolume} onChange={handleChange} className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:ring-teal-500 focus:border-teal-500 sm:text-sm" placeholder="e.g., 400,000" required min="1"/>
             <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><span className="text-gray-500 sm:text-sm">gallons/day</span></div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Wastewater Quality <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[ { name: 'bod', label: 'BOD', placeholder: 'e.g., 1500' }, { name: 'cod', label: 'COD', placeholder: 'e.g., 3000' }, { name: 'tss', label: 'TSS', placeholder: 'e.g., 500' } ].map(char => (
                <div key={char.name}>
                    <label htmlFor={char.name} className="block text-xs text-gray-500 mb-1">{char.label} (mg/L)</label>
                    <input type="number" name={char.name} id={char.name} value={formData[char.name]} onChange={handleChange} className="block w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-teal-500 focus:border-teal-500 sm:text-sm" placeholder={char.placeholder} required min="0"/>
                </div> ))}
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-8">
        <button type="button" onClick={nextStep} disabled={!validateStep1()} className="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center">
          Next Step <ArrowRight size={18} className="ml-2" />
        </button>
      </div>
    </div>
  );

  // Step 2 Form - UNCHANGED
  const renderStep2 = () => (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-xl font-bold text-teal-700">Step 2: Desired Outputs</h2>
       <p className="text-sm text-gray-600">Specify your goals for clean water reuse and energy generation.</p>
      <div className="space-y-4">
        <div className="relative">
          <label htmlFor="cleanWaterTarget" className="block text-sm font-medium text-gray-700 mb-1">
            Clean Water Volume for Reuse <span className="text-red-500">*</span>
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"> <Recycle size={18} className="text-blue-500" /> </div>
            <input type="number" name="cleanWaterTarget" id="cleanWaterTarget" value={formData.cleanWaterTarget} onChange={handleChange} className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:ring-teal-500 focus:border-teal-500 sm:text-sm" placeholder="e.g., 320,000" required min="0" max={formData.wastewaterVolume || undefined}/>
             <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"> <span className="text-gray-500 sm:text-sm">gallons/day</span> </div>
          </div>
           {formData.wastewaterVolume && formData.cleanWaterTarget > formData.wastewaterVolume && (<p className="mt-1 text-xs text-red-600">Cannot target more clean water than daily wastewater volume.</p>)}
        </div>
        <div className="relative">
          <label htmlFor="energyTarget" className="block text-sm font-medium text-gray-700 mb-1">
            Energy Generation Target <span className="text-red-500">*</span>
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"> <Zap size={18} className="text-yellow-500" /> </div>
            <input type="number" name="energyTarget" id="energyTarget" value={formData.energyTarget} onChange={handleChange} className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:ring-teal-500 focus:border-teal-500 sm:text-sm" placeholder="e.g., 500" required min="0"/>
             <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"> <span className="text-gray-500 sm:text-sm">kWh/day</span> </div>
          </div>
           <p className="mt-1 text-xs text-gray-500">Enter 0 if energy generation is not a primary target.</p>
        </div>
      </div>
      <div className="flex justify-between mt-8">
        <button type="button" onClick={prevStep} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 flex items-center"> <ArrowLeft size={18} className="mr-2" /> Previous </button>
        <button type="button" onClick={nextStep} disabled={!validateStep2()} className="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"> Next Step <ArrowRight size={18} className="ml-2" /> </button>
      </div>
    </div>
  );

  // Step 3 Form - UNCHANGED
  const renderStep3 = () => (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-xl font-bold text-teal-700">Step 3: Financial Information</h2>
      <p className="text-sm text-gray-600">Select your preferred financing model and provide current utility costs for comparison.</p>
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2"> Financial Preference <span className="text-red-500">*</span> </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className={`p-4 border rounded-lg cursor-pointer transition-all ${ formData.financialPreference === 'direct' ? 'border-teal-500 bg-teal-50 ring-2 ring-teal-300' : 'border-gray-300 hover:border-teal-400 hover:bg-teal-50'}`} onClick={() => setFormData({...formData, financialPreference: 'direct'})}>
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${formData.financialPreference === 'direct' ? 'bg-teal-100' : 'bg-gray-100'}`}> <DollarSign size={20} className="text-teal-600" /> </div>
                  <div> <h3 className="font-semibold text-gray-800">Direct Buy</h3> <p className="text-sm text-gray-500">Purchase the system outright (CAPEX).</p> </div>
                </div>
             </div>
             <div className={`p-4 border rounded-lg cursor-pointer transition-all ${ formData.financialPreference === 'wepa' ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-300' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'}`} onClick={() => setFormData({...formData, financialPreference: 'wepa'})}>
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${formData.financialPreference === 'wepa' ? 'bg-blue-100' : 'bg-gray-100'}`}> <Activity size={20} className="text-blue-600" /> </div>
                  <div> <h3 className="font-semibold text-gray-800">WEPA</h3> <p className="text-sm text-gray-500">Pay per unit of water/energy (No CAPEX).</p> </div>
                </div>
             </div>
          </div>
        </div>
        {formData.financialPreference === 'wepa' && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 space-y-3 animate-fadeIn">
            <h3 className="font-medium text-blue-800">WEPA Pricing Inputs</h3>
             <p className="text-xs text-blue-700">Enter the agreed-upon or estimated WEPA rates.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="wepaWaterPrice" className="block text-sm text-gray-600 mb-1"> Price per gallon of treated water <span className="text-red-500">*</span> </label>
                <div className="relative rounded-md shadow-sm">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"> <span className="text-gray-500 sm:text-sm">$</span> </div>
                    <input type="number" name="wepaWaterPrice" id="wepaWaterPrice" value={formData.wepaWaterPrice} onChange={handleChange} className="block w-full pl-7 pr-12 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="e.g., 0.05" step="0.001" min="0" required={formData.financialPreference === 'wepa'}/>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"> <span className="text-gray-500 sm:text-sm">/ gallon</span> </div>
                </div>
              </div>
              <div>
                <label htmlFor="wepaEnergyPrice" className="block text-sm text-gray-600 mb-1"> Price per kWh of energy generated <span className="text-red-500">*</span> </label>
                 <div className="relative rounded-md shadow-sm">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"> <span className="text-gray-500 sm:text-sm">$</span> </div>
                    <input type="number" name="wepaEnergyPrice" id="wepaEnergyPrice" value={formData.wepaEnergyPrice} onChange={handleChange} className="block w-full pl-7 pr-12 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="e.g., 0.10" step="0.01" min="0" required={formData.financialPreference === 'wepa'}/>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"> <span className="text-gray-500 sm:text-sm">/ kWh</span> </div>
                 </div>
              </div>
            </div>
          </div>
        )}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
          <h3 className="font-medium text-gray-800">Current Utility Costs (for Savings Calculation)</h3>
           <p className="text-xs text-gray-600">Enter your current average costs for water and energy.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="currentWaterCost" className="block text-sm text-gray-600 mb-1"> Current cost per gallon of water <span className="text-red-500">*</span> </label>
              <div className="relative rounded-md shadow-sm">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"> <span className="text-gray-500 sm:text-sm">$</span> </div>
                <input type="number" name="currentWaterCost" id="currentWaterCost" value={formData.currentWaterCost} onChange={handleChange} className="block w-full pl-7 pr-12 py-2 rounded-md border border-gray-300 focus:ring-teal-500 focus:border-teal-500 sm:text-sm" placeholder="e.g., 0.08" step="0.001" min="0" required />
                 <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"> <span className="text-gray-500 sm:text-sm">/ gallon</span> </div>
              </div>
            </div>
            <div>
              <label htmlFor="currentEnergyCost" className="block text-sm text-gray-600 mb-1"> Current cost per kWh of energy <span className="text-red-500">*</span> </label>
              <div className="relative rounded-md shadow-sm">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"> <span className="text-gray-500 sm:text-sm">$</span> </div>
                <input type="number" name="currentEnergyCost" id="currentEnergyCost" value={formData.currentEnergyCost} onChange={handleChange} className="block w-full pl-7 pr-12 py-2 rounded-md border border-gray-300 focus:ring-teal-500 focus:border-teal-500 sm:text-sm" placeholder="e.g., 0.15" step="0.01" min="0" required />
                 <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"> <span className="text-gray-500 sm:text-sm">/ kWh</span> </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-8">
        <button type="button" onClick={prevStep} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 flex items-center"> <ArrowLeft size={18} className="mr-2" /> Previous </button>
        <button type="submit" disabled={!validateStep3()} className="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"> <FileCheck size={18} className="mr-2" /> Generate Proposal </button>
      </div>
    </div>
  );

  // --- Results Display ---
  const renderResults = () => {
    if (!results) return null;

    const recommendation = () => {
        // Recommendation logic - Removed unused variables directBuyBetter, preferWepa
        const preferDirect = formData.financialPreference === 'direct';

        if (preferDirect) {
            if (results.paybackMonths !== 'N/A (Savings do not exceed OPEX or no savings)' && results.paybackPeriodYears <= 5) { // Example: good payback
                 return <>Based on your preference for <span className="font-semibold">Direct Buy</span>, this option offers significant long-term value ({formatCurrency(results.directBuyNpv)} 10-Yr NPV) with an attractive payback period of approximately <span className="font-semibold">{results.paybackMonths} months</span>. This appears to be a strong financial choice.</>;
            } else {
                 return <>You selected <span className="font-semibold">Direct Buy</span>. While it offers potential long-term value ({formatCurrency(results.directBuyNpv)} 10-Yr NPV), the payback period is estimated at <span className="font-semibold">{results.paybackMonths}</span>. Consider if this aligns with your investment horizon. WEPA ({formatCurrency(results.wepaNpv)} NPV) offers an alternative with no upfront cost.</>;
            }
        } else { // Prefer WEPA
            if (results.wepaAnnualSavings > 0) {
                return <>Based on your preference for <span className="font-semibold">WEPA</span>, this model provides immediate annual savings of <span className="font-semibold">{formatCurrency(results.wepaAnnualSavings)}</span> with no upfront capital required. The 10-Year NPV is {formatCurrency(results.wepaNpv)}. Direct Buy offers potentially higher long-term NPV ({formatCurrency(results.directBuyNpv)}) but requires significant initial investment.</>;
            } else {
                 return <>You selected <span className="font-semibold">WEPA</span>. Based on the provided rates, the calculated annual savings are {formatCurrency(results.wepaAnnualSavings)}. Please review the WEPA pricing ({formatCurrency(results.wepaWaterPrice, 3)}/gal, {formatCurrency(results.wepaEnergyPrice, 2)}/kWh) compared to your current costs ({formatCurrency(results.currentWaterCost, 3)}/gal, {formatCurrency(results.currentEnergyCost, 2)}/kWh) to ensure viability. Direct Buy may offer better long-term value if CAPEX is feasible.</>;
            }
        }
    };

    // Removed unused PlaceholderChart definition

    // Component for formatted economic highlights
    const EconomicHighlight = ({ title, value, colorClass, unit, note }) => (
         <div className="bg-white p-4 rounded shadow-sm border border-gray-200 text-center h-full flex flex-col justify-center">
            <h4 className="font-medium text-gray-700 mb-1 text-sm">{title}</h4>
            <div className={`text-3xl font-bold ${colorClass}`}>{value}</div>
            {unit && <div className="text-xs text-gray-500">{unit}</div>}
            {note && <div className="text-xs text-gray-400 mt-1">{note}</div>}
        </div>
    );


    return (
      <div className="bg-white rounded-lg shadow-xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-blue-500 px-6 py-5">
          <h2 className="text-3xl font-bold text-white flex items-center"> <FileCheck size={32} className="mr-3" /> Customized Wastewater Recovery Proposal </h2>
           <p className="text-teal-100 mt-1">Prepared for Your Facility based on Provided Inputs</p>
        </div>

        {/* Executive Summary Section */}
        <div className="p-6 md:p-8 space-y-8">
          <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">Executive Summary</h3>

           {/* 1. Project Overview & Technology -UNCHANGED */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Project Overview</h4>
            <p className="text-gray-700 text-sm leading-relaxed"> This proposal outlines a Cambrian Innovation solution designed to process approximately <span className="font-medium">{formatNumber(results.wastewaterVolume)}</span> gallons of wastewater per day. Based on your inputs (BOD: {results.bod} mg/L, COD: {results.cod} mg/L, TSS: {results.tss} mg/L) and desired outputs, the recommended primary technology is the <span className="font-semibold">{results.primaryTechnology}</span>. <br /><em>Reasoning: {results.technologyReasoning}</em> {results.additionalTechNote && <><br /><span className="text-indigo-700"><Info size={14} className="inline mr-1" /> {results.additionalTechNote}</span></>} The system aims to produce <span className="font-medium">{formatNumber(results.cleanWaterOutput)}</span> gallons/day of clean water for reuse and generate <span className="font-medium">{formatNumber(results.energyOutput)}</span> kWh/day of renewable energy. </p>
          </div>

           {/* 2. Economic Highlights - UNCHANGED */}
           <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="text-lg font-semibold text-blue-800 mb-3">Economic Highlights</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded shadow-sm border border-gray-100 space-y-2">
                        <h5 className="font-semibold text-gray-800 flex items-center"> <DollarSign size={18} className="text-teal-600 mr-2" /> Direct Buy Option </h5>
                        <div className="text-sm space-y-1"> <p><span className="text-gray-500 w-28 inline-block">Est. CAPEX:</span> <span className="font-medium">{formatCurrency(results.baseCapex)}</span></p> <p><span className="text-gray-500 w-28 inline-block">Est. Annual OPEX:</span> <span className="font-medium">{formatCurrency(results.opexAnnual)}</span></p> <p><span className="text-gray-500 w-28 inline-block">Annual Savings:</span> <span className="font-medium text-green-700">{formatCurrency(results.directBuyAnnualSavings)}</span></p> <p><span className="text-gray-500 w-28 inline-block">Payback Period:</span> <span className="font-medium">~{results.paybackMonths}</span></p> <p><span className="text-gray-500 w-28 inline-block">10-Year NPV:</span> <span className="font-medium">{formatCurrency(results.directBuyNpv)}</span></p> </div>
                    </div>
                    <div className="bg-white p-4 rounded shadow-sm border border-gray-100 space-y-2">
                       <h5 className="font-semibold text-gray-800 flex items-center"> <Activity size={18} className="text-blue-600 mr-2" /> WEPA Option </h5>
                        <div className="text-sm space-y-1"> <p><span className="text-gray-500 w-28 inline-block">Est. CAPEX:</span> <span className="font-medium">{formatCurrency(0)} (Financed)</span></p> <p><span className="text-gray-500 w-28 inline-block">Est. Monthly Fee:</span> <span className="font-medium">{formatCurrency(results.wepaMonthlyFee)}</span></p> <p><span className="text-gray-500 w-28 inline-block">Annual Savings:</span> <span className="font-medium text-green-700">{formatCurrency(results.wepaAnnualSavings)}</span></p> <p><span className="text-gray-500 w-28 inline-block">10-Year NPV:</span> <span className="font-medium">{formatCurrency(results.wepaNpv)}</span></p> <p className="text-xs text-gray-500 pt-1">(Based on WEPA rates: {formatCurrency(results.wepaWaterPrice, 3)}/gal, {formatCurrency(results.wepaEnergyPrice, 2)}/kWh)</p> </div>
                    </div>
                </div>
           </div>

            {/* 3. Operational Capabilities & Financial Visualizations - Structure UNCHANGED, one component removed */}
            <div className="space-y-6">
                 <h4 className="text-lg font-semibold text-gray-800 mb-1">Operational & Financial Visualizations</h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                     <div className="bg-white p-4 rounded shadow-sm border border-gray-200 text-center col-span-1 md:col-span-2 lg:col-span-1 h-full flex flex-col justify-center">
                         <h4 className="font-medium text-gray-700 mb-2 text-sm">Annual Savings Comparison</h4>
                         <div className="flex justify-around items-center flex-grow mt-2">
                             <div className="text-center"> <div className="text-3xl font-bold text-green-700">{formatCurrency(results.directBuyAnnualSavings)}</div> <div className="text-xs text-gray-500">Direct Buy / Year</div> </div>
                             <div className="text-center"> <div className="text-3xl font-bold text-emerald-700">{formatCurrency(results.wepaAnnualSavings)}</div> <div className="text-xs text-gray-500">WEPA / Year</div> </div>
                         </div>
                         <p className="text-xs text-gray-400 mt-3">Net savings after system OPEX (Direct Buy) or compared to current costs (WEPA).</p>
                     </div>
                     <EconomicHighlight title="Payback Period (Direct Buy)" value={isFinite(results.paybackPeriodYears) ? `${results.paybackMonths} months` : results.paybackMonths} colorClass="text-teal-600" unit={isFinite(results.paybackPeriodYears) ? `~${formatNumber(results.paybackPeriodYears, 1)} Years` : null} note={!isFinite(results.paybackPeriodYears) ? "(Savings may not cover OPEX or CAPEX)" : null} />
                     <div className="bg-white p-4 rounded shadow-sm border border-gray-200 text-center col-span-1 md:col-span-2 lg:col-span-1 h-full flex flex-col justify-center">
                         <h4 className="font-medium text-gray-700 mb-2 text-sm">10-Year NPV Comparison</h4>
                         <div className="flex justify-around items-center flex-grow mt-2">
                              <div className="text-center"> <div className="text-3xl font-bold text-teal-600">{formatCurrency(results.directBuyNpv)}</div> <div className="text-xs text-gray-500">Direct Buy NPV</div> </div>
                             <div className="text-center"> <div className="text-3xl font-bold text-blue-600">{formatCurrency(results.wepaNpv)}</div> <div className="text-xs text-gray-500">WEPA NPV</div> </div>
                         </div>
                         <p className="text-xs text-gray-400 mt-3">Net Present Value @ {DISCOUNT_RATE * 100}% discount rate.</p>
                     </div>
                     <EconomicHighlight title="Water Treatment Efficiency" value={`${formatNumber(results.waterTreatmentEfficiency, 1)}%`} colorClass="text-blue-600" unit={`(${formatNumber(results.cleanWaterOutput)} / ${formatNumber(results.wastewaterVolume)} gal/day)`} note="Targeted clean water reuse" />
                     <EconomicHighlight title="Daily Energy Generation" value={formatNumber(results.energyOutput)} colorClass="text-yellow-600" unit="kWh / day" note="Targeted renewable energy" />
                     <EconomicHighlight title="Environmental Impact" value={formatNumber(results.carbonReductionKgPerDay)} colorClass="text-green-600" unit="kg CO₂ eq. / day" note="Estimated reduction (simplified)" />
                 </div>
            </div>

          {/* 4. Recommendation - UNCHANGED */}
           <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="text-lg font-semibold text-green-800 mb-3">Recommendation</h4>
              <p className="text-gray-700 text-sm leading-relaxed"> {recommendation()} Consider your organization's capital availability and risk tolerance when making the final decision. </p>
           </div>

          {/* 5. Disclaimer - UNCHANGED */}
          <div className="pt-4 border-t mt-6">
             <h4 className="text-md font-semibold text-gray-700 mb-2 flex items-center"><AlertTriangle size={16} className="text-orange-500 mr-2" /> Important Disclaimer</h4>
            <p className="text-xs text-gray-500 italic leading-relaxed"> The financial figures (CAPEX, OPEX, savings, NPV, payback) presented in this proposal are <span className="font-semibold">preliminary estimates</span>. The base CAPEX is anchored to the reference cost of <span className="font-semibold">{formatCurrency(10000000)} for a 400,000 gallon per day EcoVolt Reactor system</span> ({formatCurrency(CAPEX_PER_GALLON_DAILY_ECOVOLT)} per gallon of daily capacity) and scaled linearly based on your provided daily wastewater volume. <br />Actual project costs will vary based on: <ul className="list-disc list-inside ml-4 my-1"> <li>The final selection and combination of technologies (EcoVolt, Bio Viper, BlueCycle MBR, filtration, digestion, etc.).</li> <li>Specific wastewater characteristics beyond BOD, COD, TSS.</li> <li>Required effluent quality and specific reuse applications.</li> <li>Site-specific conditions (geotechnical, existing infrastructure, utilities, space constraints).</li> <li>Permitting requirements and local regulations.</li> </ul> <span className="font-semibold">A detailed engineering study and consultation with Cambrian Innovation are required for a formal quote and precise system design.</span> These estimates are provided for initial planning and comparison purposes only. </p>
          </div>
        </div>

        {/* Footer Actions - UNCHANGED */}
        <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
           <button onClick={() => { setFormSubmitted(false); setResults(null); }} className="px-5 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 text-sm font-medium flex items-center"> <ArrowLeft size={16} className="mr-2" /> Edit Inputs </button>
           <p className="text-xs text-gray-500 hidden sm:block">Generated: {new Date().toLocaleString()}</p>
          <button onClick={() => window.print()} className="px-5 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 text-sm font-medium flex items-center"> <FileText size={16} className="mr-2" /> Export / Print Proposal </button>
        </div>
      </div>
    );
  }; // End of renderResults function

 // --- Main Component Render ---
 // ... (rest of the component structure: header, main logic for form/results, footer, style tag) ...
 // This part remains the same as the previous full code version


   // Main rendering logic
 return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Header */}
      <header className="bg-gradient-to-r from-teal-700 to-blue-700 text-white shadow-lg sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Recycle size={30} className="text-teal-300" />
              <h1 className="text-xl md:text-2xl font-bold">Cambrian Innovation</h1>
            </div>
            <div className="text-xs md:text-sm text-teal-200 hidden sm:block">Wastewater Proposal Tool</div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 py-8">
        {formSubmitted && results ? (
          renderResults()
        ) : (
           // Form Container
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 md:p-8">
               {/* Form Header */}
              <div className="flex items-center space-x-4 mb-6 pb-4 border-b border-gray-200">
                <div className="bg-teal-100 p-3 rounded-full">
                  <FileText size={28} className="text-teal-700" />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900">Wastewater Recovery Proposal Generator</h1>
                  <p className="text-gray-600 text-sm">Enter your facility's data to generate a tailored proposal.</p>
                </div>
              </div>

              {/* Stepper UI */}
              <div className="mb-8 px-2">
                 <ol className="flex items-center w-full text-sm font-medium text-center text-gray-500">
                    {[ { step: 1, label: "Wastewater" }, { step: 2, label: "Outputs" }, { step: 3, label: "Financials" } ].map((item, index) => (
                        <li key={item.step} className={`flex md:w-full items-center ${ currentStep >= item.step ? 'text-teal-600' : ''} ${ index !== 2 ? "after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 " + (currentStep > item.step ? 'after:border-teal-100' : '') : ''}`}>
                            <span className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 mr-2 ${ currentStep >= item.step ? 'bg-teal-100' : 'bg-gray-100' }`}> { currentStep > item.step ? <CheckCircle size={16} /> : item.step } </span>
                            <span className="hidden sm:inline-block">{item.label}</span>
                         </li> ))}
                 </ol>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit}>
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}
              </form>
            </div>
          </div>
        )}

        {/* Technology Overview Cards (Show only when form is visible) */}
        {!formSubmitted && (
          <div className="mt-10 max-w-5xl mx-auto">
             <h2 className="text-lg font-semibold text-center text-gray-700 mb-6">Cambrian Innovation Core Technologies</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                 <div className="bg-teal-50 px-4 py-3 border-b border-teal-100"> <h3 className="text-lg font-semibold text-teal-800 flex items-center"><Zap size={20} className="mr-2 text-yellow-500" /> EcoVolt Reactor</h3> </div>
                 <div className="p-4 text-sm text-gray-600 space-y-2"> <p>Converts wastewater's organic load (high BOD/COD) directly into biogas for renewable energy generation using electrogenic microbes.</p> <ul className="list-disc list-inside text-xs pl-2 space-y-1"> <li>Ideal for high-strength industrial wastewater.</li> <li>Produces valuable biogas (methane).</li> <li>Reduces sludge production significantly.</li> <li>Can operate as a standalone or pre-treatment step.</li> </ul> </div>
               </div>
               <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                 <div className="bg-indigo-50 px-4 py-3 border-b border-indigo-100"> <h3 className="text-lg font-semibold text-indigo-800 flex items-center"><Droplet size={20} className="mr-2 text-indigo-500" /> Bio Viper</h3> </div>
                 <div className="p-4 text-sm text-gray-600 space-y-2"> <p>An integrated fixed-film activated sludge (IFAS) system for robust BOD/TSS removal with enhanced nutrient reduction capabilities.</p> <ul className="list-disc list-inside text-xs pl-2 space-y-1"> <li>Handles moderate to high loads and fluctuations.</li> <li>Compact footprint compared to conventional activated sludge.</li> <li>Reduced sludge yield.</li> <li>Suitable for direct discharge or pre-treatment for reuse.</li> </ul> </div>
               </div>
                <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                 <div className="bg-blue-50 px-4 py-3 border-b border-blue-100"> <h3 className="text-lg font-semibold text-blue-800 flex items-center"><Recycle size={20} className="mr-2 text-blue-500" /> BlueCycle MBR</h3> </div>
                 <div className="p-4 text-sm text-gray-600 space-y-2"> <p>A Membrane Bioreactor (MBR) providing the highest quality effluent, ideal for direct water reuse applications by removing &gt;99% BOD/TSS.</p> <ul className="list-disc list-inside text-xs pl-2 space-y-1"> <li>Produces Title 22 quality water (or similar standards).</li> <li>Physical barrier ensures consistent high quality.</li> <li>Very compact footprint.</li> <li>Often used as a final polishing step after EcoVolt or Bio Viper.</li> </ul> </div>
               </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4">
             <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
               <div className="mb-4 md:mb-0">
                 <div className="flex items-center justify-center md:justify-start space-x-2"> <Recycle size={24} className="text-teal-400" /> <span className="font-bold text-xl">Cambrian Innovation</span> </div>
                 <p className="text-gray-400 mt-2 text-sm">Transforming Wastewater into Value</p>
               </div>
               <div className="text-sm"> <p className="text-gray-400">15 Main Street, Suite 318, Watertown, MA 02472</p> <p className="text-teal-400 mt-1">(617) 307-1755 | info@cambrianinnovation.com</p> </div>
             </div>
          <div className="border-t border-gray-700 mt-6 pt-6 text-center text-gray-500 text-xs"> &copy; {new Date().getFullYear()} Cambrian Innovation Inc. All Rights Reserved. Proposal estimates are non-binding. </div>
        </div>
      </footer>

        <style jsx global>{`
            @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
             @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } header, footer, button, form, .no-print { display: none !important; } main { margin: 0 !important; padding: 0 !important; } .shadow-xl, .shadow-lg, .shadow-md { box-shadow: none !important; } .bg-gradient-to-r { background: #0D9488 !important; } .p-6, .p-8 { padding: 1rem !important; } .container { max-width: 100% !important; } .grid { display: block !important; } .grid > div { margin-bottom: 1rem !important; } }
        `}</style>
    </div>
  );
}; // End of App component

export default App; // <-- Essential export statement
