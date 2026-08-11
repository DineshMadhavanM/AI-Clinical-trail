import React, { useState } from 'react';
import { Save, Plus, Trash2, User, Activity, Dna, Pill, CheckCircle2, Building2, Phone } from 'lucide-react';
import { Patient, Biomarker, Treatment, Comorbidity, LabValue } from '../../types';
import { apiService } from '../../services/api';

interface PatientFormProps {
  initialData?: Partial<Patient>;
  onSuccess?: (patient: Patient) => void;
}

export const PatientForm: React.FC<PatientFormProps> = ({ initialData, onSuccess }) => {
  const [patientName, setPatientName] = useState<string>(initialData?.patient_name || 'Rahul Sharma');
  const [phoneNumber, setPhoneNumber] = useState<string>(initialData?.phone_number || '+91 98765 43210');
  const [hospitalName, setHospitalName] = useState<string>(initialData?.hospital_name || 'Tata Memorial Hospital, Mumbai');
  const [treatingPhysician, setTreatingPhysician] = useState<string>(initialData?.treating_physician || 'Dr. Vikram Adani, MD Oncology');
  
  const [age, setAge] = useState<number>(initialData?.age || 55);
  const [gender, setGender] = useState<string>(initialData?.gender || 'Male');
  const [country, setCountry] = useState<string>(initialData?.country || 'India');
  const [stateCity, setStateCity] = useState<string>(initialData?.state_city || 'Mumbai');
  const [primaryCondition, setPrimaryCondition] = useState<string>(initialData?.primary_condition || 'Non-Small Cell Lung Cancer');
  const [diseaseStage, setDiseaseStage] = useState<string>(initialData?.disease_stage || 'Stage III');
  const [priorTrial, setPriorTrial] = useState<string>(initialData?.prior_trial_participation || 'No');
  const [allergies, setAllergies] = useState<string>(initialData?.allergies || 'Penicillin');
  const [notes, setNotes] = useState<string>(initialData?.unstructured_notes || '');

  // Biomarkers
  const [biomarkers, setBiomarkers] = useState<Biomarker[]>(
    initialData?.biomarkers || [{ marker_name: 'EGFR', status: 'Positive' }]
  );

  // Treatments
  const [treatments, setTreatments] = useState<Treatment[]>(
    initialData?.treatments || [{ treatment_name: 'Chemotherapy', treatment_type: 'prior' }]
  );

  const [saving, setSaving] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleAddBiomarker = () => {
    setBiomarkers([...biomarkers, { marker_name: 'HER2', status: 'Negative' }]);
  };

  const handleRemoveBiomarker = (idx: number) => {
    setBiomarkers(biomarkers.filter((_, i) => i !== idx));
  };

  const handleAddTreatment = () => {
    setTreatments([...treatments, { treatment_name: 'Immunotherapy', treatment_type: 'prior' }]);
  };

  const handleRemoveTreatment = (idx: number) => {
    setTreatments(treatments.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const payload: Partial<Patient> = {
        patient_name: patientName,
        phone_number: phoneNumber,
        hospital_name: hospitalName,
        treating_physician: treatingPhysician,
        age: Number(age),
        gender,
        country,
        state_city: stateCity,
        primary_condition: primaryCondition,
        disease_stage: diseaseStage,
        prior_trial_participation: priorTrial,
        allergies,
        unstructured_notes: notes,
        biomarkers,
        treatments,
      };

      const saved = await apiService.createPatient(payload);
      setSavedSuccess(true);
      if (onSuccess) onSuccess(saved);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Patient Personal & Institutional Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Building2 className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide">1. Patient Identification & Hospital Affiliation</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Patient Full Name</label>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:border-cyan-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Contact Phone Number</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="e.g. +91 98765 43210"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:border-cyan-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Affiliated Hospital / Medical Center</label>
            <input
              type="text"
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
              placeholder="e.g. Tata Memorial Hospital, Mumbai"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:border-cyan-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Treating Physician / Oncologist</label>
            <input
              type="text"
              value={treatingPhysician}
              onChange={(e) => setTreatingPhysician(e.target.value)}
              placeholder="e.g. Dr. Vikram Adani, MD"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Demographics Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
          <User className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide">2. Demographics & Location</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Age (Years)</label>
            <input
              type="number"
              min={0}
              max={120}
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:border-cyan-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Biological Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:border-cyan-500 focus:outline-none"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="All">All / Unspecified</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Country</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">State / City</label>
            <input
              type="text"
              value={stateCity}
              onChange={(e) => setStateCity(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Disease Diagnosis Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide">3. Disease Diagnosis & Staging</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-400 mb-1">Primary Disease / Condition</label>
            <input
              type="text"
              value={primaryCondition}
              onChange={(e) => setPrimaryCondition(e.target.value)}
              placeholder="e.g. Non-Small Cell Lung Cancer, Breast Cancer..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:border-cyan-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Disease Stage</label>
            <select
              value={diseaseStage}
              onChange={(e) => setDiseaseStage(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:border-cyan-500 focus:outline-none"
            >
              <option value="Stage I">Stage I</option>
              <option value="Stage II">Stage II</option>
              <option value="Stage III">Stage III</option>
              <option value="Stage IV">Stage IV / Metastatic</option>
              <option value="N/A">Not Applicable</option>
            </select>
          </div>
        </div>
      </div>

      {/* Biomarkers Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Dna className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide">4. Genetic & Tumor Biomarkers</h3>
          </div>
          <button
            type="button"
            onClick={handleAddBiomarker}
            className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 bg-purple-950/60 px-2.5 py-1 rounded-lg border border-purple-800/40 font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Biomarker
          </button>
        </div>

        <div className="space-y-2">
          {biomarkers.map((bm, idx) => (
            <div key={idx} className="flex items-center gap-3 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <input
                type="text"
                value={bm.marker_name}
                onChange={(e) => {
                  const updated = [...biomarkers];
                  updated[idx].marker_name = e.target.value;
                  setBiomarkers(updated);
                }}
                placeholder="Biomarker Name (e.g. EGFR, HER2)"
                className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
              />
              <select
                value={bm.status}
                onChange={(e) => {
                  const updated = [...biomarkers];
                  updated[idx].status = e.target.value as any;
                  setBiomarkers(updated);
                }}
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
              >
                <option value="Positive">Positive (+)</option>
                <option value="Negative">Negative (-)</option>
                <option value="Mutated">Mutated</option>
                <option value="Unknown">Unknown</option>
              </select>
              <button
                type="button"
                onClick={() => handleRemoveBiomarker(idx)}
                className="text-slate-500 hover:text-rose-400 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-between pt-2">
        {savedSuccess && (
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Patient Profile Saved & Ready for Trial Matching!</span>
          </div>
        )}
        <div className="ml-auto">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-cyan-950/50 transition-all hover:scale-[1.01]"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving Profile...' : 'Save & Prepare Matching'}
          </button>
        </div>
      </div>
    </form>
  );
};
