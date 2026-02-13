// src/pages/admin/analytics/AnalyticsDashboard.tsx

import { useEffect, useState } from 'react';
import { Download, TrendingUp, TrendingDown, Users, Award, DollarSign, CheckSquare } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Card, Button, Breadcrumb } from '@/components/ui';
import { useAnalytics, usePeriodFilters } from '@/hooks/useAnalytics';
import type { PeriodFilter } from '@/types/analytics.types';

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export default function AnalyticsDashboard() {
  const { dashboardData, loading, error, loadDashboard, exportDashboard } = useAnalytics();
  const { createPeriodFilter } = usePeriodFilters();
  const [periodType, setPeriodType] = useState<PeriodFilter['type']>('mois');
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const filters = {
      periode: createPeriodFilter(periodType),
    };
    loadDashboard(filters);
  }, [periodType, loadDashboard, createPeriodFilter]);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const filters = {
        periode: createPeriodFilter(periodType),
      };
      await exportDashboard(filters);
    } finally {
      setIsExporting(false);
    }
  };

  const periodOptions: { value: PeriodFilter['type']; label: string }[] = [
    { value: 'jour', label: 'Aujourd\'hui' },
    { value: 'semaine', label: 'Cette semaine' },
    { value: 'mois', label: 'Ce mois' },
    { value: 'annee', label: 'Cette année' },
  ];

  if (loading && !dashboardData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des analytics...</p>
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

  if (!dashboardData) {
    return null;
  }

  const { kpi_summary, charts } = dashboardData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Breadcrumb
          items={[
            { label: 'Analytics', href: '/admin/analytics' },
            { label: 'Dashboard' },
          ]}
        />
        <div className="mt-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Analytics</h1>
            <p className="text-gray-600 mt-1">Vue d'ensemble des indicateurs clés de performance</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Filtres de période */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              {periodOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setPeriodType(option.value)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    periodType === option.value
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {/* Bouton Export */}
            <Button
              onClick={handleExport}
              disabled={isExporting}
              variant="primary"
            >
              <Download className="w-4 h-4 mr-2" />
              {isExporting ? 'Export...' : 'Exporter PDF'}
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title={kpi_summary.total_etudiants.label}
          value={kpi_summary.total_etudiants.value.toLocaleString()}
          variation={kpi_summary.total_etudiants.variation}
          trend={kpi_summary.total_etudiants.trend}
          icon={Users}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />
        <KPICard
          title={kpi_summary.taux_reussite.label}
          value={`${kpi_summary.taux_reussite.value}%`}
          variation={kpi_summary.taux_reussite.variation}
          trend={kpi_summary.taux_reussite.trend}
          icon={Award}
          iconBg="bg-green-100"
          iconColor="text-green-600"
        />
        <KPICard
          title={kpi_summary.total_finances.label}
          value={`${(kpi_summary.total_finances.value / 1000000).toFixed(1)}M FCFA`}
          variation={kpi_summary.total_finances.variation}
          trend={kpi_summary.total_finances.trend}
          icon={DollarSign}
          iconBg="bg-yellow-100"
          iconColor="text-yellow-600"
        />
        <KPICard
          title={kpi_summary.taux_presence.label}
          value={`${kpi_summary.taux_presence.value}%`}
          variation={kpi_summary.taux_presence.variation}
          trend={kpi_summary.taux_presence.trend}
          icon={CheckSquare}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
        />
      </div>

      {/* Graphiques - Ligne 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Évolution des effectifs */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution des effectifs</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={charts.evolution_effectifs}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#6b7280" />
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
                  dataKey="total"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Total"
                  dot={{ fill: '#3b82f6', r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="hommes"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Hommes"
                  dot={{ fill: '#10b981', r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="femmes"
                  stroke="#ec4899"
                  strokeWidth={2}
                  name="Femmes"
                  dot={{ fill: '#ec4899', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Répartition par sexe */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par sexe</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={charts.repartition_sexe}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {charts.repartition_sexe.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Graphiques - Ligne 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Taux de réussite par filière */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Taux de réussite par filière</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={charts.taux_reussite}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="filiere" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="taux" fill="#10b981" name="Taux de réussite (%)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Finances mensuelles */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Finances mensuelles</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={charts.finances_mensuelles}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mois" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenus"
                  stackId="1"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.6}
                  name="Revenus"
                />
                <Area
                  type="monotone"
                  dataKey="depenses"
                  stackId="2"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.6}
                  name="Dépenses"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Graphique Radar - Taux de présence */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Taux de présence par filière</h3>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={charts.taux_presence}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="filiere" stroke="#6b7280" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#6b7280" />
              <Radar
                name="Taux de présence"
                dataKey="taux"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.5}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

// Composant KPI Card
interface KPICardProps {
  title: string;
  value: string;
  variation: number;
  trend: 'up' | 'down' | 'stable';
  icon: any;
  iconBg: string;
  iconColor: string;
}

function KPICard({ title, value, variation, trend, icon: Icon, iconBg, iconColor }: KPICardProps) {
  const variationColor =
    trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600';
  const variationBg =
    trend === 'up' ? 'bg-green-50' : trend === 'down' ? 'bg-red-50' : 'bg-gray-50';
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : null;

  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className={`p-3 rounded-lg ${iconBg}`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
          {variation !== 0 && TrendIcon && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${variationBg}`}>
              <TrendIcon className={`w-4 h-4 ${variationColor}`} />
              <span className={`text-sm font-medium ${variationColor}`}>
                {Math.abs(variation)}%
              </span>
            </div>
          )}
        </div>
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
      </div>
    </Card>
  );
}