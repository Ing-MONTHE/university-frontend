// src/pages/admin/finance/FinanceDashboard.tsx

import React, { useEffect, useState } from 'react';
import { useFinanceStats } from '@/hooks/useFinances';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

const FinanceDashboard: React.FC = () => {
  const { stats, loading, error, fetchStats } = useFinanceStats();
  const [selectedPeriod, setSelectedPeriod] = useState('current');

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          <AlertCircle className="inline mr-2" />
          {error}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const StatCard = ({ title, value, icon: Icon, trend, color }: any) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className={`text-sm mt-2 flex items-center ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              {Math.abs(trend)}%
            </p>
          )}
        </div>
        <div className={`p-4 rounded-full ${color}`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Financier</h1>
          <p className="text-gray-600 mt-1">Vue d'ensemble des finances de l'université</p>
        </div>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="current">Année en cours</option>
          <option value="month">Ce mois</option>
          <option value="quarter">Ce trimestre</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Payé"
          value={formatCurrency(stats.total_paye)}
          icon={DollarSign}
          trend={12.5}
          color="bg-green-500"
        />
        <StatCard
          title="Total Impayé"
          value={formatCurrency(stats.total_impaye)}
          icon={AlertCircle}
          trend={-8.2}
          color="bg-red-500"
        />
        <StatCard
          title="À Percevoir"
          value={formatCurrency(stats.total_a_percevoir)}
          icon={TrendingUp}
          color="bg-blue-500"
        />
        <StatCard
          title="Nombre de Paiements"
          value={stats.nombre_paiements.toLocaleString()}
          icon={CheckCircle}
          color="bg-purple-500"
        />
      </div>

      {/* Students Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Statut des Étudiants</h2>
            <Users className="w-6 h-6 text-gray-600" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                <span className="font-medium text-gray-900">Étudiants à jour</span>
              </div>
              <span className="text-2xl font-bold text-green-600">{stats.nombre_etudiants_a_jour}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                <span className="font-medium text-gray-900">Étudiants en retard</span>
              </div>
              <span className="text-2xl font-bold text-red-600">{stats.nombre_etudiants_en_retard}</span>
            </div>
          </div>
        </div>

        {/* Payment Methods Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Répartition par Mode de Paiement</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={stats.repartition_modes_paiement}
                dataKey="montant"
                nameKey="mode"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={(entry) => `${entry.mode}: ${entry.count}`}
              >
                {stats.repartition_modes_paiement.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Evolution Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Évolution des Paiements</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stats.evolution_paiements}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mois" />
            <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
            <Tooltip formatter={(value: any) => formatCurrency(value)} />
            <Legend />
            <Line type="monotone" dataKey="montant" stroke="#3B82F6" strokeWidth={2} name="Montant" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top Impayés */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Top 10 des Impayés</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Matricule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom Complet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant Dû
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.top_impayes.map((etudiant) => (
                <tr key={etudiant.etudiant_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {etudiant.matricule}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {etudiant.etudiant_nom} {etudiant.etudiant_prenom}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">
                    {formatCurrency(etudiant.montant_du)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                      Voir détails
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FinanceDashboard;