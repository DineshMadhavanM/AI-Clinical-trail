import axios from 'axios';
import {
  Patient,
  ExtractedPatientData,
  ClinicalTrial,
  MatchResult,
  RAGQueryResponse,
} from '../types';

const API = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Patients
  extractMedicalInfo: async (clinicalText: string): Promise<ExtractedPatientData> => {
    const res = await API.post('/patients/extract-text', { clinical_text: clinicalText });
    return res.data;
  },

  uploadMedicalDocument: async (file: File): Promise<ExtractedPatientData> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await API.post('/patients/upload-document', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  createPatient: async (patientData: Partial<Patient>): Promise<Patient> => {
    const res = await API.post('/patients', patientData);
    return res.data;
  },

  getPatients: async (): Promise<Patient[]> => {
    const res = await API.get('/patients');
    return res.data;
  },

  getPatientById: async (id: number): Promise<Patient> => {
    const res = await API.get(`/patients/${id}`);
    return res.data;
  },

  confirmPatientTrial: async (patientId: number, trialId: string, trialTitle: string): Promise<Patient> => {
    const res = await API.post(`/patients/${patientId}/confirm-trial`, { trial_id: trialId, trial_title: trialTitle });
    return res.data;
  },

  // Trials
  getTrials: async (params?: Record<string, any>): Promise<ClinicalTrial[]> => {
    const res = await API.get('/trials', { params });
    return res.data;
  },

  getTrialById: async (id: string): Promise<ClinicalTrial> => {
    const res = await API.get(`/trials/${id}`);
    return res.data;
  },

  createTrial: async (trialData: Partial<ClinicalTrial>): Promise<ClinicalTrial> => {
    const res = await API.post('/trials', trialData);
    return res.data;
  },

  deleteTrial: async (id: string): Promise<any> => {
    const res = await API.delete(`/trials/${id}`);
    return res.data;
  },

  // AI Matching
  matchPatient: async (patientId: number, topK: number = 10): Promise<MatchResult[]> => {
    const res = await API.post('/matching', { patient_id: patientId, top_k: topK });
    return res.data;
  },

  matchTrialToPatients: async (trialId: string, topK: number = 10): Promise<any[]> => {
    const res = await API.post('/matching/trial-candidates', { trial_id: trialId, top_k: topK });
    return res.data;
  },

  // RAG Assistant
  queryRAGAssistant: async (trialId: string, question: string): Promise<RAGQueryResponse> => {
    const res = await API.post('/api/chat', { trial_id: trialId, question });
    return res.data;
  },

  // Admin Stats
  getAdminStats: async (): Promise<any> => {
    const res = await API.get('/admin/stats');
    return res.data;
  },

  seedDataset: async (): Promise<any> => {
    const res = await API.post('/admin/seed-dataset');
    return res.data;
  },
};
