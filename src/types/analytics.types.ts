// src/types/analytics.types.ts

// ============ DASHBOARD ============
export interface DashboardData {
  kpi_summary: KPISummary;
  charts: {
    evolution_effectifs: EffectifsData[];
    repartition_sexe: SexeData[];
    taux_reussite: ReussiteData[];
    finances_mensuelles: FinanceData[];
    taux_presence: PresenceData[];
  };
  recent_activities: Activity[];
}

export interface KPISummary {
  total_etudiants: KPIValue;
  taux_reussite: KPIValue;
  total_finances: KPIValue;
  taux_presence: KPIValue;
  nouveaux_etudiants: KPIValue;
  taux_abandon: KPIValue;
}

export interface KPIValue {
  value: number;
  variation: number; // Pourcentage de variation
  label: string;
  trend: 'up' | 'down' | 'stable';
}

export interface EffectifsData {
  date: string;
  total: number;
  hommes: number;
  femmes: number;
}

export interface SexeData {
  name: string;
  value: number;
  percentage: number;
}

export interface ReussiteData {
  filiere: string;
  taux: number;
  total_etudiants: number;
  reussis: number;
}

export interface FinanceData {
  mois: string;
  revenus: number;
  depenses: number;
  net: number;
}

export interface PresenceData {
  filiere: string;
  taux: number;
}

export interface Activity {
  id: string;
  type: 'enrollment' | 'payment' | 'evaluation' | 'attendance';
  description: string;
  timestamp: string;
  user: string;
}

// ============ RAPPORTS ============
export interface Rapport {
  id: string;
  titre: string;
  type: RapportType;
  description?: string;
  created_at: string;
  created_by: string;
  created_by_name?: string;
  fichier_url: string;
  format: RapportFormat;
  periode_debut?: string;
  periode_fin?: string;
  parametres: Record<string, any>;
  statut: 'en_attente' | 'genere' | 'erreur';
}

export type RapportType = 
  | 'academique' 
  | 'financier' 
  | 'assiduite' 
  | 'ressources' 
  | 'personnalise';

export type RapportFormat = 'pdf' | 'excel' | 'csv';

export interface RapportFormData {
  titre: string;
  type: RapportType;
  description?: string;
  format: RapportFormat;
  periode_debut?: string;
  periode_fin?: string;
  kpis: string[]; // IDs des KPIs à inclure
  filtres: RapportFiltres;
  planification?: RapportPlanification;
}

export interface RapportFiltres {
  filiere_ids?: string[];
  departement_ids?: string[];
  niveau?: string;
  annee_academique_id?: string;
}

export interface RapportPlanification {
  actif: boolean;
  frequence: 'quotidien' | 'hebdomadaire' | 'mensuel';
  jour_semaine?: number; // 0-6 pour hebdomadaire
  jour_mois?: number; // 1-31 pour mensuel
  heure: string; // Format HH:mm
}

// ============ KPIs ============
export interface KPI {
  id: string;
  code: string;
  nom: string;
  description: string;
  categorie: KPICategorie;
  unite: string;
  valeur_actuelle: number;
  valeur_precedente?: number;
  objectif?: number;
  formule?: string;
  date_calcul: string;
}

export type KPICategorie = 
  | 'academique' 
  | 'financier' 
  | 'assiduite' 
  | 'ressources' 
  | 'general';

export interface KPIDetail {
  kpi: KPI;
  historique: KPIHistorique[];
  comparaisons: KPIComparaison[];
  drill_down?: DrillDownData[];
}

export interface KPIHistorique {
  date: string;
  valeur: number;
  periode: string;
}

export interface KPIComparaison {
  periode: string;
  valeur: number;
  variation: number;
}

export interface DrillDownData {
  label: string;
  valeur: number;
  pourcentage: number;
  details?: Record<string, any>;
}

// ============ FILTRES ============
export interface PeriodFilter {
  type: 'jour' | 'semaine' | 'mois' | 'annee' | 'personnalise';
  date_debut?: string;
  date_fin?: string;
}

export interface AnalyticsFilters {
  periode: PeriodFilter;
  filiere_ids?: string[];
  departement_ids?: string[];
  faculte_ids?: string[];
  annee_academique_id?: string;
}

// ============ API RESPONSES ============
export interface DashboardResponse {
  success: boolean;
  data: DashboardData;
  timestamp: string;
}

export interface RapportsListResponse {
  success: boolean;
  data: Rapport[];
  count: number;
  page: number;
  total_pages: number;
}

export interface RapportGenerateResponse {
  success: boolean;
  data: Rapport;
  message: string;
}

export interface KPIResponse {
  success: boolean;
  data: KPI[];
}

export interface KPIDetailResponse {
  success: boolean;
  data: KPIDetail;
}

// ============ EXPORT ============
export interface ExportOptions {
  format: RapportFormat;
  include_charts: boolean;
  include_raw_data: boolean;
  filename?: string;
}