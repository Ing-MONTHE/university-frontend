// src/pages/admin/analytics/KPIView.tsx

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, Calendar, BarChart3 } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, Button, Breadcrumb, Badge } from '@/components/ui';
import { useKPIDetail } from '@/hooks/useAnalytics';

export default function KPIView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { kpiDetail, loading, error, loadKPIDetail } = useKPIDetail(id || null);
  const [comparaisonType, setComparaisonType] = useState<'mois' | 'trimestre' | 'annee'>('mois');

  useEffect(() => {
    if (id) {
      loadKPIDetail({ comparaison_type: comparaisonType });
    }
  }, [id, comparaisonType, loadKPIDetail]);

  if (loading && !kpiDetail) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du KPI...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  if (!kpiDetail) {
    return null;
  }

  const { kpi, historique, comparaisons, drill_down } = kpiDetail;

  const variation = kpi.valeur_precedente
    ? ((kpi.valeur_actuelle - kpi.valeur_precedente) / kpi.valeur_precedente) * 100
    : 0;

  const trend = variation > 0 ? 'up' : variation < 0 ? 'down' : 'stable';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Breadcrumb
          items={[
            { label: 'Analytics', href: '/admin/analytics' },
            { label: 'KPIs', href: '/admin/analytics' },
            { label: kpi.nom },
          ]}
        />
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin/analytics')}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{kpi.nom}</h1>
              <p className="text-gray-600 mt-1">{kpi.description}</p>
            </div>
          </div>
          <Badge variant="info">{kpi.categorie}</Badge>
        </div>
      </div>

      {/* Valeur actuelle */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Valeur actuelle</p>
              <p className="text-4xl font-bold text-gray-900">
                {kpi.valeur_actuelle.toLocaleString()} {kpi.unite}
              </p>
              {kpi.objectif && (
                <p className="text-sm text-gray-600 mt-2">
                  Objectif: {kpi.objectif.toLocaleString()} {kpi.unite}
                </p>
              )}
            </div>
            {variation !== 0 && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                trend === 'up' ? 'bg-green-50' : 'bg-red-50'
              }`}>
                {trend === 'up' ? (
                  <TrendingUp className="w-8 h-8 text-green-600" />
                ) : (
                  <TrendingDown className="w-8 h-8 text-red-600" />
                )}
                <div>
                  <p className={`text-2xl font-bold ${
                    trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {trend === 'up' ? '+' : ''}{variation.toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-600">vs période précédente</p>
                </div>
              </div>
            )}
          </div>
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
            <span>Code: {kpi.code}</span>
            <span>•</span>
            <span>Dernière mise à jour: {new Date(kpi.date_calcul).toLocaleString('fr-FR')}</span>
          </div>
        </div>
      </Card>

      {/* Historique */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Évolution dans le temps</h2>
            <div className="flex items-center gap-2">
              {['mois', 'trimestre', 'annee'].map((type) => (
                <button
                  key={type}
                  onClick={() => setComparaisonType(type as typeof comparaisonType)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    comparaisonType === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {type === 'mois' ? 'Mois' : type === 'trimestre' ? 'Trimestre' : 'Année'}
                </button>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={historique}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="periode" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="valeur"
                stroke="#3b82f6"
                strokeWidth={3}
                name={kpi.nom}
                dot={{ fill: '#3b82f6', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Comparaisons */}
      {comparaisons && comparaisons.length > 0 && (
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Comparaison de périodes</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {comparaisons.map((comp, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600 mb-2">{comp.periode}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {comp.valeur.toLocaleString()} {kpi.unite}
                  </p>
                  <div className={`flex items-center gap-1 mt-2 text-sm ${
                    comp.variation > 0 ? 'text-green-600' : comp.variation < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {comp.variation > 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : comp.variation < 0 ? (
                      <TrendingDown className="w-4 h-4" />
                    ) : null}
                    <span>
                      {comp.variation > 0 ? '+' : ''}{comp.variation.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Drill-down */}
      {drill_down && drill_down.length > 0 && (
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Détails par catégorie</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={drill_down}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="label" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar
                  dataKey="valeur"
                  fill="#3b82f6"
                  name={kpi.nom}
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {drill_down.map((item, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-gray-900">{item.label}</p>
                    <span className="text-sm text-gray-500">
                      {item.pourcentage.toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {item.valeur.toLocaleString()} {kpi.unite}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}