/**
 * Page de liste des templates de documents
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, FileText, Edit, Trash2, Eye, ToggleLeft, ToggleRight } from 'lucide-react';
import { useDocuments } from '@/hooks/useDocuments';
import {
  DocumentTemplate,
  TemplateFilters,
  DocumentType,
  DocumentTypeLabels,
} from '@/types/documents.types';
import {
  Button,
  Card,
  DataTable,
  SearchBar,
  Select,
  Badge,
  ConfirmModal,
  Spinner,
} from '@/components/ui';
import { formatDate } from '@/utils';

export default function TemplatesList() {
  const { getAllTemplates, deleteTemplate, updateTemplate, loading } = useDocuments();
  
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  
  const [filters, setFilters] = useState<TemplateFilters>({
    search: '',
    type_document: undefined,
    est_actif: undefined,
  });
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);

  useEffect(() => {
    loadTemplates();
  }, [currentPage, filters]);

  const loadTemplates = async () => {
    try {
      const result = await getAllTemplates({
        ...filters,
        page: currentPage,
        page_size: pageSize,
      });
      setTemplates(result.results);
      setTotalCount(result.count);
    } catch (err) {
      console.error('Erreur chargement templates:', err);
    }
  };

  const handleToggleActive = async (template: DocumentTemplate) => {
    try {
      await updateTemplate(template.id, {
        est_actif: !template.est_actif,
      });
      loadTemplates();
    } catch (err) {
      console.error('Erreur mise à jour statut:', err);
    }
  };

  const handleDelete = async () => {
    if (!selectedTemplateId) return;
    
    try {
      await deleteTemplate(selectedTemplateId);
      setDeleteModalOpen(false);
      setSelectedTemplateId(null);
      loadTemplates();
    } catch (err) {
      console.error('Erreur suppression:', err);
    }
  };

  const columns = [
    {
      key: 'type_document',
      label: 'Type',
      render: (template: DocumentTemplate) => (
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-600" />
          <span className="font-medium">{DocumentTypeLabels[template.type_document]}</span>
        </div>
      ),
    },
    {
      key: 'nom',
      label: 'Nom',
      render: (template: DocumentTemplate) => (
        <div>
          <p className="font-medium">{template.nom}</p>
          {template.description && (
            <p className="text-sm text-gray-500">{template.description}</p>
          )}
        </div>
      ),
    },
    {
      key: 'est_actif',
      label: 'Statut',
      render: (template: DocumentTemplate) => (
        <Badge variant={template.est_actif ? 'success' : 'default'}>
          {template.est_actif ? 'Actif' : 'Inactif'}
        </Badge>
      ),
    },
    {
      key: 'date_modification',
      label: 'Dernière modification',
      render: (template: DocumentTemplate) => formatDate(template.date_modification),
    },
    {
      key: 'cree_par',
      label: 'Créé par',
      render: (template: DocumentTemplate) => template.cree_par?.username || '-',
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (template: DocumentTemplate) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleToggleActive(template)}
            title={template.est_actif ? 'Désactiver' : 'Activer'}
          >
            {template.est_actif ? (
              <ToggleRight className="w-4 h-4 text-green-600" />
            ) : (
              <ToggleLeft className="w-4 h-4 text-gray-400" />
            )}
          </Button>
          
          <Link to={`/admin/documents/templates/${template.id}/preview`}>
            <Button
              variant="ghost"
              size="sm"
              title="Prévisualiser"
            >
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
          
          <Link to={`/admin/documents/templates/${template.id}/edit`}>
            <Button
              variant="ghost"
              size="sm"
              title="Modifier"
            >
              <Edit className="w-4 h-4" />
            </Button>
          </Link>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedTemplateId(template.id);
              setDeleteModalOpen(true);
            }}
            className="text-red-600 hover:text-red-700"
            title="Supprimer"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Templates de Documents</h1>
          <p className="text-gray-600 mt-1">Gérez les modèles de documents</p>
        </div>
        <Link to="/admin/documents/templates/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nouveau template
          </Button>
        </Link>
      </div>

      {/* Filtres */}
      <Card>
        <div className="flex items-center gap-4">
          <SearchBar
            value={filters.search || ''}
            onChange={(value) => setFilters({ ...filters, search: value })}
            placeholder="Rechercher un template..."
            className="flex-1"
          />
          
          <Select
            value={filters.type_document || ''}
            onChange={(value) => setFilters({
              ...filters,
              type_document: value as DocumentType || undefined
            })}
            options={[
              { value: '', label: 'Tous les types' },
              ...Object.entries(DocumentTypeLabels).map(([key, label]) => ({
                value: key,
                label,
              })),
            ]}
            className="w-64"
          />

          <Select
            value={filters.est_actif?.toString() || ''}
            onChange={(value) => setFilters({
              ...filters,
              est_actif: value === '' ? undefined : value === 'true'
            })}
            options={[
              { value: '', label: 'Tous les statuts' },
              { value: 'true', label: 'Actifs' },
              { value: 'false', label: 'Inactifs' },
            ]}
            className="w-48"
          />
        </div>
      </Card>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <Card>
          <DataTable
            columns={columns}
            data={templates}
            pagination={{
              currentPage,
              pageSize,
              totalCount,
              onPageChange: setCurrentPage,
            }}
          />
        </Card>
      )}

      {/* Modal de suppression */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Supprimer le template"
        message="Êtes-vous sûr de vouloir supprimer ce template ? Cette action est irréversible."
        confirmLabel="Supprimer"
        variant="danger"
      />
    </div>
  );
}