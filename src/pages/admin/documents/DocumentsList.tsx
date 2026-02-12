/**
 * Page de liste des documents générés
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, FileText, Download, Mail, Trash2, Filter } from 'lucide-react';
import { useDocuments } from '@/hooks/useDocuments';
import { useStudents } from '@/hooks/useStudents';
import {
  Document,
  DocumentFilters,
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

export default function DocumentsList() {
  const { getAllDocuments, downloadPdf, deleteDocument, resendEmail, loading, error } = useDocuments();
  const { getAllStudents } = useStudents();
  
  const [documents, setDocuments] = useState<Document[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  
  const [filters, setFilters] = useState<DocumentFilters>({
    search: '',
    type_document: undefined,
    etudiant_id: undefined,
    date_debut: undefined,
    date_fin: undefined,
    email_envoye: undefined,
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<number | null>(null);
  const [students, setStudents] = useState<any[]>([]);

  // Charger les documents
  useEffect(() => {
    loadDocuments();
  }, [currentPage, filters]);

  // Charger les étudiants pour le filtre
  useEffect(() => {
    loadStudents();
  }, []);

  const loadDocuments = async () => {
    try {
      const result = await getAllDocuments({
        ...filters,
        page: currentPage,
        page_size: pageSize,
      });
      setDocuments(result.results);
      setTotalCount(result.count);
    } catch (err) {
      console.error('Erreur chargement documents:', err);
    }
  };

  const loadStudents = async () => {
    try {
      const result = await getAllStudents({ page_size: 1000 });
      setStudents(result.results);
    } catch (err) {
      console.error('Erreur chargement étudiants:', err);
    }
  };

  const handleDownloadPdf = async (doc: Document) => {
    try {
      await downloadPdf(doc.id, `${doc.type_document}-${doc.etudiant.matricule}.pdf`);
    } catch (err) {
      console.error('Erreur téléchargement PDF:', err);
    }
  };

  const handleResendEmail = async (id: number) => {
    try {
      await resendEmail(id);
      alert('Email envoyé avec succès !');
      loadDocuments();
    } catch (err) {
      console.error("Erreur envoi email:", err);
    }
  };

  const handleDelete = async () => {
    if (!selectedDocId) return;
    
    try {
      await deleteDocument(selectedDocId);
      setDeleteModalOpen(false);
      setSelectedDocId(null);
      loadDocuments();
    } catch (err) {
      console.error('Erreur suppression:', err);
    }
  };

  const columns = [
    {
      key: 'type_document',
      label: 'Type',
      render: (doc: Document) => (
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-600" />
          <span className="font-medium">{DocumentTypeLabels[doc.type_document]}</span>
        </div>
      ),
    },
    {
      key: 'etudiant',
      label: 'Étudiant',
      render: (doc: Document) => (
        <div>
          <p className="font-medium">{doc.etudiant.nom} {doc.etudiant.prenom}</p>
          <p className="text-sm text-gray-500">{doc.etudiant.matricule}</p>
        </div>
      ),
    },
    {
      key: 'date_generation',
      label: 'Date de génération',
      render: (doc: Document) => formatDate(doc.date_generation),
    },
    {
      key: 'genere_par',
      label: 'Généré par',
      render: (doc: Document) => doc.genere_par.username,
    },
    {
      key: 'email_envoye',
      label: 'Email',
      render: (doc: Document) => (
        <Badge variant={doc.email_envoye ? 'success' : 'warning'}>
          {doc.email_envoye ? 'Envoyé' : 'Non envoyé'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (doc: Document) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDownloadPdf(doc)}
            title="Télécharger PDF"
          >
            <Download className="w-4 h-4" />
          </Button>
          
          {!doc.email_envoye && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleResendEmail(doc.id)}
              title="Envoyer par email"
            >
              <Mail className="w-4 h-4" />
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedDocId(doc.id);
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
          <h1 className="text-2xl font-bold text-gray-900">Documents Générés</h1>
          <p className="text-gray-600 mt-1">Gérez les documents administratifs</p>
        </div>
        <Link to="/admin/documents/generate">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Générer un document
          </Button>
        </Link>
      </div>

      {/* Filtres */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <SearchBar
              value={filters.search || ''}
              onChange={(value) => setFilters({ ...filters, search: value })}
              placeholder="Rechercher un document..."
              className="max-w-md"
            />
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtres
              {showFilters && ' (Masquer)'}
            </Button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
              <Select
                label="Type de document"
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
              />

              <Select
                label="Étudiant"
                value={filters.etudiant_id?.toString() || ''}
                onChange={(value) => setFilters({
                  ...filters,
                  etudiant_id: value ? parseInt(value) : undefined
                })}
                options={[
                  { value: '', label: 'Tous les étudiants' },
                  ...students.map(s => ({
                    value: s.id.toString(),
                    label: `${s.nom} ${s.prenom} (${s.matricule})`,
                  })),
                ]}
              />

              <Select
                label="Statut email"
                value={filters.email_envoye?.toString() || ''}
                onChange={(value) => setFilters({
                  ...filters,
                  email_envoye: value === '' ? undefined : value === 'true'
                })}
                options={[
                  { value: '', label: 'Tous' },
                  { value: 'true', label: 'Envoyé' },
                  { value: 'false', label: 'Non envoyé' },
                ]}
              />

              <Button
                variant="outline"
                onClick={() => setFilters({
                  search: '',
                  type_document: undefined,
                  etudiant_id: undefined,
                  email_envoye: undefined,
                })}
              >
                Réinitialiser
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <Card>
          <div className="text-center py-12 text-red-600">
            {error}
          </div>
        </Card>
      ) : (
        <Card>
          <DataTable
            columns={columns}
            data={documents}
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
        title="Supprimer le document"
        message="Êtes-vous sûr de vouloir supprimer ce document ? Cette action est irréversible."
        confirmLabel="Supprimer"
        variant="danger"
      />
    </div>
  );
}