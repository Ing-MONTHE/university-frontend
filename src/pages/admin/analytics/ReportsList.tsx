// src/pages/admin/analytics/ReportsList.tsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Download,
  Eye,
  Trash2,
  Plus,
  FileText,
  Filter,
  Search,
  Calendar,
} from 'lucide-react';
import {
  Card,
  Button,
  Breadcrumb,
  DataTable,
  Badge,
  SearchBar,
  ConfirmModal,
} from '@/components/ui';
import { useRapports } from '@/hooks/useAnalytics';
import type { Rapport, RapportType, RapportFormat } from '@/types/analytics.types';

export default function ReportsList() {
  const navigate = useNavigate();
  const { rapports, loading, error, loadRapports, deleteRapport, downloadRapport } = useRapports();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<RapportType | 'all'>('all');
  const [formatFilter, setFormatFilter] = useState<RapportFormat | 'all'>('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRapport, setSelectedRapport] = useState<Rapport | null>(null);

  useEffect(() => {
    const params: any = {};
    if (typeFilter !== 'all') params.type = typeFilter;
    if (formatFilter !== 'all') params.format = formatFilter;
    loadRapports(params);
  }, [typeFilter, formatFilter, loadRapports]);

  const handleDelete = async () => {
    if (!selectedRapport) return;
    try {
      await deleteRapport(selectedRapport.id);
      setDeleteModalOpen(false);
      setSelectedRapport(null);
    } catch (error) {
      console.error('Error deleting rapport:', error);
    }
  };

  const handleDownload = async (rapport: Rapport) => {
    try {
      await downloadRapport(rapport);
    } catch (error) {
      console.error('Error downloading rapport:', error);
    }
  };

  const filteredRapports = rapports.filter((rapport) =>
    rapport.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rapport.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const typeOptions: { value: RapportType | 'all'; label: string }[] = [
    { value: 'all', label: 'Tous les types' },
    { value: 'academique', label: 'Académique' },
    { value: 'financier', label: 'Financier' },
    { value: 'assiduite', label: 'Assiduité' },
    { value: 'ressources', label: 'Ressources' },
    { value: 'personnalise', label: 'Personnalisé' },
  ];

  const formatOptions: { value: RapportFormat | 'all'; label: string }[] = [
    { value: 'all', label: 'Tous les formats' },
    { value: 'pdf', label: 'PDF' },
    { value: 'excel', label: 'Excel' },
    { value: 'csv', label: 'CSV' },
  ];

  const columns = [
    {
      key: 'titre',
      label: 'Titre',
      render: (rapport: Rapport) => (
        <div>
          <p className="font-medium text-gray-900">{rapport.titre}</p>
          {rapport.description && (
            <p className="text-sm text-gray-500 mt-1">{rapport.description}</p>
          )}
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      render: (rapport: Rapport) => (
        <Badge variant={getTypeBadgeVariant(rapport.type)}>
          {getTypeLabel(rapport.type)}
        </Badge>
      ),
    },
    {
      key: 'format',
      label: 'Format',
      render: (rapport: Rapport) => (
        <Badge variant="outline">
          {rapport.format.toUpperCase()}
        </Badge>
      ),
    },
    {
      key: 'periode',
      label: 'Période',
      render: (rapport: Rapport) => (
        <div className="text-sm text-gray-600">
          {rapport.periode_debut && rapport.periode_fin ? (
            <>
              {new Date(rapport.periode_debut).toLocaleDateString('fr-FR')} -{' '}
              {new Date(rapport.periode_fin).toLocaleDateString('fr-FR')}
            </>
          ) : (
            'N/A'
          )}
        </div>
      ),
    },
    {
      key: 'created_at',
      label: 'Date de création',
      render: (rapport: Rapport) => (
        <div className="text-sm text-gray-600">
          {new Date(rapport.created_at).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      ),
    },
    {
      key: 'created_by',
      label: 'Créé par',
      render: (rapport: Rapport) => (
        <div className="text-sm text-gray-600">
          {rapport.created_by_name || rapport.created_by}
        </div>
      ),
    },
    {
      key: 'statut',
      label: 'Statut',
      render: (rapport: Rapport) => (
        <Badge variant={getStatutBadgeVariant(rapport.statut)}>
          {getStatutLabel(rapport.statut)}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (rapport: Rapport) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleDownload(rapport)}
            title="Télécharger"
          >
            <Download className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setSelectedRapport(rapport);
              setDeleteModalOpen(true);
            }}
            title="Supprimer"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Breadcrumb
          items={[
            { label: 'Analytics', href: '/admin/analytics' },
            { label: 'Rapports' },
          ]}
        />
        <div className="mt-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Rapports</h1>
            <p className="text-gray-600 mt-1">
              Gérez et téléchargez vos rapports analytics
            </p>
          </div>
          <Button onClick={() => navigate('/admin/analytics/reports/builder')}>
            <Plus className="w-4 h-4 mr-2" />
            Nouveau rapport
          </Button>
        </div>
      </div>

      {/* Filtres */}
      <Card>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Rechercher un rapport..."
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as RapportType | 'all')}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {typeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <select
                value={formatFilter}
                onChange={(e) => setFormatFilter(e.target.value as RapportFormat | 'all')}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {formatOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Table */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <Card>
        <DataTable
          data={filteredRapports}
          columns={columns}
          loading={loading}
          emptyMessage="Aucun rapport trouvé"
        />
      </Card>

      {/* Modal de confirmation de suppression */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedRapport(null);
        }}
        onConfirm={handleDelete}
        title="Supprimer le rapport"
        message={`Êtes-vous sûr de vouloir supprimer le rapport "${selectedRapport?.titre}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="danger"
      />
    </div>
  );
}

// Helpers
function getTypeLabel(type: RapportType): string {
  const labels: Record<RapportType, string> = {
    academique: 'Académique',
    financier: 'Financier',
    assiduite: 'Assiduité',
    ressources: 'Ressources',
    personnalise: 'Personnalisé',
  };
  return labels[type];
}

function getTypeBadgeVariant(type: RapportType): 'default' | 'success' | 'warning' | 'error' | 'info' {
  const variants: Record<RapportType, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
    academique: 'info',
    financier: 'success',
    assiduite: 'warning',
    ressources: 'default',
    personnalise: 'default',
  };
  return variants[type];
}

function getStatutLabel(statut: string): string {
  const labels: Record<string, string> = {
    en_attente: 'En attente',
    genere: 'Généré',
    erreur: 'Erreur',
  };
  return labels[statut] || statut;
}

function getStatutBadgeVariant(statut: string): 'default' | 'success' | 'warning' | 'error' {
  const variants: Record<string, 'default' | 'success' | 'warning' | 'error'> = {
    en_attente: 'warning',
    genere: 'success',
    erreur: 'error',
  };
  return variants[statut] || 'default';
}