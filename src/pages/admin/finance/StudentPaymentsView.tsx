// src/pages/admin/finance/StudentPaymentsView.tsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStudentPayments, usePaiements } from '@/hooks/useFinances';
import { ArrowLeft, Download, Plus, Calendar, DollarSign } from 'lucide-react';
import { paiementsApi } from '@/api/finance.api';

const StudentPaymentsView: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { studentPayments, loading, error, fetchStudentPayments } = useStudentPayments(id);
  const { downloadFacture } = usePaiements();

  useEffect(() => {
    if (id) {
      fetchStudentPayments(id);
    }
  }, [id, fetchStudentPayments]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!studentPayments) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadge = (statut: string) => {
    const styles = {
      VALIDE: 'bg-green-100 text-green-800',
      EN_ATTENTE: 'bg-yellow-100 text-yellow-800',
      REJETE: 'bg-red-100 text-red-800',
      ANNULE: 'bg-gray-100 text-gray-800',
    };
    return styles[statut as keyof typeof styles] || styles.EN_ATTENTE;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/finance/paiements')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Retour aux paiements
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Paiements - {studentPayments.prenom} {studentPayments.nom}
            </h1>
            <p className="text-gray-600 mt-1">
              {studentPayments.matricule} • {studentPayments.filiere} - {studentPayments.niveau}
            </p>
          </div>
          <button
            onClick={() => navigate(`/admin/finance/paiements/nouveau?etudiant=${id}`)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nouveau Paiement
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Frais Total</p>
            <DollarSign className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(studentPayments.frais_total)}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Montant Payé</p>
            <DollarSign className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(studentPayments.montant_paye)}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Montant Restant</p>
            <DollarSign className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(studentPayments.montant_restant)}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Progression</p>
            <Calendar className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-blue-600">{studentPayments.pourcentage_paye.toFixed(1)}%</p>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${studentPayments.pourcentage_paye}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Bourses actives */}
      {studentPayments.bourses.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Bourses et Exonérations</h2>
          <div className="space-y-3">
            {studentPayments.bourses.map((bourse) => (
              <div key={bourse.id} className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{bourse.type_bourse}</p>
                  <p className="text-sm text-gray-600">
                    {formatDate(bourse.date_debut)} - {formatDate(bourse.date_fin)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-purple-600">{bourse.pourcentage_exoneration}%</p>
                  <p className="text-sm text-gray-600">{formatCurrency(bourse.montant_bourse)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Historique des paiements */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Historique des Paiements</h2>
        </div>
        {studentPayments.paiements.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Référence
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mode
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {studentPayments.paiements.map((paiement) => (
                  <tr key={paiement.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(paiement.date_paiement)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {paiement.reference_paiement}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {paiement.type_frais}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {paiement.mode_paiement.replace('_', ' ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {formatCurrency(paiement.montant)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(paiement.statut)}`}
                      >
                        {paiement.statut.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => downloadFacture(paiement.id)}
                        className="flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Facture
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-8 text-center text-gray-500">
            Aucun paiement enregistré pour cet étudiant
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentPaymentsView;