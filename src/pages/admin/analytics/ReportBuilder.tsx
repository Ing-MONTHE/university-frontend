// src/pages/admin/analytics/ReportBuilder.tsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, FileText, Calendar, Filter, Settings } from 'lucide-react';
import {
  Card,
  Button,
  Breadcrumb,
  Input,
  Select,
  Tabs,
} from '@/components/ui';
import { useRapports, useKPIs } from '@/hooks/useAnalytics';
import type { RapportFormData, RapportType, RapportFormat } from '@/types/analytics.types';

export default function ReportBuilder() {
  const navigate = useNavigate();
  const { genererRapport, loading } = useRapports();
  const { kpis, loadKPIs } = useKPIs();

  const [formData, setFormData] = useState<RapportFormData>({
    titre: '',
    type: 'personnalise',
    description: '',
    format: 'pdf',
    kpis: [],
    filtres: {},
  });

  const [selectedKPIs, setSelectedKPIs] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    loadKPIs();
  }, [loadKPIs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data: RapportFormData = {
        ...formData,
        kpis: Array.from(selectedKPIs),
      };
      await genererRapport(data);
      navigate('/admin/analytics/reports');
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  const handleKPIToggle = (kpiId: string) => {
    const newSelected = new Set(selectedKPIs);
    if (newSelected.has(kpiId)) {
      newSelected.delete(kpiId);
    } else {
      newSelected.add(kpiId);
    }
    setSelectedKPIs(newSelected);
  };

  const typeOptions: { value: RapportType; label: string }[] = [
    { value: 'academique', label: 'Académique' },
    { value: 'financier', label: 'Financier' },
    { value: 'assiduite', label: 'Assiduité' },
    { value: 'ressources', label: 'Ressources' },
    { value: 'personnalise', label: 'Personnalisé' },
  ];

  const formatOptions: { value: RapportFormat; label: string }[] = [
    { value: 'pdf', label: 'PDF' },
    { value: 'excel', label: 'Excel (XLSX)' },
    { value: 'csv', label: 'CSV' },
  ];

  const tabs = [
    { id: 'general', label: 'Informations générales', icon: FileText },
    { id: 'kpis', label: 'Indicateurs (KPIs)', icon: Settings },
    { id: 'filtres', label: 'Filtres', icon: Filter },
    { id: 'planification', label: 'Planification', icon: Calendar },
  ];

  // Grouper les KPIs par catégorie
  const kpisByCategory = kpis.reduce((acc, kpi) => {
    if (!acc[kpi.categorie]) {
      acc[kpi.categorie] = [];
    }
    acc[kpi.categorie].push(kpi);
    return acc;
  }, {} as Record<string, typeof kpis>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Breadcrumb
          items={[
            { label: 'Analytics', href: '/admin/analytics' },
            { label: 'Rapports', href: '/admin/analytics/reports' },
            { label: 'Créateur de rapport' },
          ]}
        />
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin/analytics/reports')}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Créateur de rapport</h1>
              <p className="text-gray-600 mt-1">Créez un rapport analytics personnalisé</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar avec tabs */}
          <div className="lg:col-span-1">
            <Card>
              <div className="p-4">
                <div className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                          activeTab === tab.id
                            ? 'bg-blue-50 text-blue-600 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </Card>
          </div>

          {/* Contenu principal */}
          <div className="lg:col-span-3">
            <Card>
              <div className="p-6">
                {/* Tab: Informations générales */}
                {activeTab === 'general' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Informations générales
                      </h2>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Titre du rapport *
                      </label>
                      <Input
                        value={formData.titre}
                        onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                        placeholder="Ex: Rapport mensuel des performances académiques"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type de rapport
                      </label>
                      <Select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as RapportType })}
                        options={typeOptions}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Format d'export
                      </label>
                      <Select
                        value={formData.format}
                        onChange={(e) => setFormData({ ...formData, format: e.target.value as RapportFormat })}
                        options={formatOptions}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description (optionnel)
                      </label>
                      <textarea
                        value={formData.description || ''}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ajoutez une description détaillée du rapport..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date de début
                        </label>
                        <Input
                          type="date"
                          value={formData.periode_debut || ''}
                          onChange={(e) => setFormData({ ...formData, periode_debut: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date de fin
                        </label>
                        <Input
                          type="date"
                          value={formData.periode_fin || ''}
                          onChange={(e) => setFormData({ ...formData, periode_fin: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab: KPIs */}
                {activeTab === 'kpis' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        Sélection des indicateurs
                      </h2>
                      <p className="text-gray-600 text-sm">
                        Choisissez les KPIs à inclure dans votre rapport
                      </p>
                    </div>

                    {Object.entries(kpisByCategory).map(([categorie, categoryKpis]) => (
                      <div key={categorie}>
                        <h3 className="text-lg font-medium text-gray-900 mb-3 capitalize">
                          {categorie}
                        </h3>
                        <div className="space-y-2">
                          {categoryKpis.map((kpi) => (
                            <label
                              key={kpi.id}
                              className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                              <input
                                type="checkbox"
                                checked={selectedKPIs.has(kpi.id)}
                                onChange={() => handleKPIToggle(kpi.id)}
                                className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                              />
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">{kpi.nom}</div>
                                {kpi.description && (
                                  <div className="text-sm text-gray-600 mt-1">
                                    {kpi.description}
                                  </div>
                                )}
                                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                  <span>Code: {kpi.code}</span>
                                  <span>Unité: {kpi.unite}</span>
                                </div>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}

                    {Object.keys(kpisByCategory).length === 0 && (
                      <div className="text-center py-12 text-gray-500">
                        Aucun KPI disponible
                      </div>
                    )}
                  </div>
                )}

                {/* Tab: Filtres */}
                {activeTab === 'filtres' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        Filtres de données
                      </h2>
                      <p className="text-gray-600 text-sm">
                        Affinez les données à inclure dans le rapport
                      </p>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                      <p className="text-gray-600 text-sm">
                        Les filtres avancés seront disponibles dans une prochaine version.
                        Pour l'instant, utilisez les dates de période définies dans l'onglet "Informations générales".
                      </p>
                    </div>
                  </div>
                )}

                {/* Tab: Planification */}
                {activeTab === 'planification' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        Planification automatique
                      </h2>
                      <p className="text-gray-600 text-sm">
                        Programmez la génération automatique de ce rapport
                      </p>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                      <p className="text-yellow-800 text-sm">
                        <strong>Fonctionnalité à venir :</strong> La planification automatique des rapports sera disponible dans une prochaine version.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/analytics/reports')}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={loading || !formData.titre || selectedKPIs.size === 0}>
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Génération...' : 'Générer le rapport'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}