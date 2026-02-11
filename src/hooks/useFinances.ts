// src/hooks/useFinances.ts

import { useState, useEffect, useCallback } from 'react';
import {
  fraisScolariteApi,
  paiementsApi,
  boursesApi,
  financeApi,
  etudiantsApi,
} from '../api/finance.api';
import {
  FraisScolarite,
  FraisScolariteFormData,
  Paiement,
  PaiementFormData,
  Bourse,
  BourseFormData,
  FinanceStatistiques,
  StudentPaymentInfo,
  Etudiant,
} from '../types/finance.types';

// ============ HOOK POUR FRAIS DE SCOLARITÉ ============

export const useFraisScolarite = () => {
  const [frais, setFrais] = useState<FraisScolarite[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFrais = useCallback(async (params?: any) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fraisScolariteApi.getAll(params);
      setFrais(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des frais');
    } finally {
      setLoading(false);
    }
  }, []);

  const createFrais = async (data: FraisScolariteFormData) => {
    setLoading(true);
    setError(null);
    try {
      const newFrais = await fraisScolariteApi.create(data);
      setFrais((prev) => [...prev, newFrais]);
      return newFrais;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la création');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateFrais = async (id: string, data: Partial<FraisScolariteFormData>) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await fraisScolariteApi.update(id, data);
      setFrais((prev) => prev.map((f) => (f.id === id ? updated : f)));
      return updated;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteFrais = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await fraisScolariteApi.delete(id);
      setFrais((prev) => prev.filter((f) => f.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la suppression');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    frais,
    loading,
    error,
    fetchFrais,
    createFrais,
    updateFrais,
    deleteFrais,
  };
};

// ============ HOOK POUR PAIEMENTS ============

export const usePaiements = () => {
  const [paiements, setPaiements] = useState<Paiement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPaiements = useCallback(async (params?: any) => {
    setLoading(true);
    setError(null);
    try {
      const data = await paiementsApi.getAll(params);
      setPaiements(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des paiements');
    } finally {
      setLoading(false);
    }
  }, []);

  const createPaiement = async (data: PaiementFormData) => {
    setLoading(true);
    setError(null);
    try {
      const newPaiement = await paiementsApi.create(data);
      setPaiements((prev) => [...prev, newPaiement]);
      return newPaiement;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la création');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePaiement = async (id: string, data: Partial<PaiementFormData>) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await paiementsApi.update(id, data);
      setPaiements((prev) => prev.map((p) => (p.id === id ? updated : p)));
      return updated;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePaiement = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await paiementsApi.delete(id);
      setPaiements((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la suppression');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const downloadFacture = async (id: string) => {
    try {
      const blob = await paiementsApi.getFacturePDF(id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `facture_${id}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du téléchargement');
      throw err;
    }
  };

  return {
    paiements,
    loading,
    error,
    fetchPaiements,
    createPaiement,
    updatePaiement,
    deletePaiement,
    downloadFacture,
  };
};

// ============ HOOK POUR BOURSES ============

export const useBourses = () => {
  const [bourses, setBourses] = useState<Bourse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBourses = useCallback(async (params?: any) => {
    setLoading(true);
    setError(null);
    try {
      const data = await boursesApi.getAll(params);
      setBourses(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des bourses');
    } finally {
      setLoading(false);
    }
  }, []);

  const createBourse = async (data: BourseFormData) => {
    setLoading(true);
    setError(null);
    try {
      const newBourse = await boursesApi.create(data);
      setBourses((prev) => [...prev, newBourse]);
      return newBourse;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la création');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateBourse = async (id: string, data: Partial<BourseFormData>) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await boursesApi.update(id, data);
      setBourses((prev) => prev.map((b) => (b.id === id ? updated : b)));
      return updated;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteBourse = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await boursesApi.delete(id);
      setBourses((prev) => prev.filter((b) => b.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la suppression');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    bourses,
    loading,
    error,
    fetchBourses,
    createBourse,
    updateBourse,
    deleteBourse,
  };
};

// ============ HOOK POUR STATISTIQUES ============

export const useFinanceStats = () => {
  const [stats, setStats] = useState<FinanceStatistiques | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async (params?: any) => {
    setLoading(true);
    setError(null);
    try {
      const data = await financeApi.getStatistiques(params);
      setStats(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  }, []);

  return { stats, loading, error, fetchStats };
};

// ============ HOOK POUR PAIEMENTS ÉTUDIANT ============

export const useStudentPayments = (etudiantId?: string) => {
  const [studentPayments, setStudentPayments] = useState<StudentPaymentInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudentPayments = useCallback(
    async (id?: string) => {
      const targetId = id || etudiantId;
      if (!targetId) return;

      setLoading(true);
      setError(null);
      try {
        const data = await financeApi.getStudentPayments(targetId);
        setStudentPayments(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    },
    [etudiantId]
  );

  useEffect(() => {
    if (etudiantId) {
      fetchStudentPayments();
    }
  }, [etudiantId, fetchStudentPayments]);

  return { studentPayments, loading, error, fetchStudentPayments };
};

// ============ HOOK POUR RECHERCHE ÉTUDIANTS ============

export const useEtudiants = () => {
  const [etudiants, setEtudiants] = useState<Etudiant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchEtudiants = async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await etudiantsApi.search(query);
      setEtudiants(data);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la recherche');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchAllEtudiants = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await etudiantsApi.getAll();
      setEtudiants(data);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du chargement');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    etudiants,
    loading,
    error,
    searchEtudiants,
    fetchAllEtudiants,
  };
};