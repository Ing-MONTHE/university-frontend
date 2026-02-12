/**
 * Page: JustificationsList.tsx  
 * Liste et gestion des justificatifs d'absence
 */

import { useState } from 'react';
import { CheckCircle, XCircle, Eye } from 'lucide-react';
import { useJustificatifs } from '@/hooks/useAttendance';
import { JustificatifFilters, StatutValidation } from '@/types/attendance.types';
import { Button, Card, Badge, SearchBar, Select, Spinner, Modal } from '@/components/ui';
import { Breadcrumb, BreadcrumbItem } from '@/components/ui/Breadcrumb';
import { toast } from '@/components/ui/Toast';

export default function JustificationsList() {
  const [filters, setFilters] = useState<JustificatifFilters>({ statut: 'EN_ATTENTE' });
  const [selectedJustificatif, setSelectedJustificatif] = useState<number | null>(null);
  const [commentaire, setCommentaire] = useState('');
  const [actionModal, setActionModal] = useState<{ open: boolean; action: 'valider' | 'rejeter' | null }>({
    open: false,
    action: null,
  });

  const { justificatifs, isLoading, validerJustificatif, rejeterJustificatif, isValidating, isRejecting } =
    useJustificatifs(filters);

  const handleAction = () => {
    if (!selectedJustificatif) return;

    if (actionModal.action === 'valider') {
      validerJustificatif({ id: selectedJustificatif, commentaire });
    } else if (actionModal.action === 'rejeter') {
      if (!commentaire.trim()) {
        toast.error('Le commentaire est obligatoire pour un rejet');
        return;
      }
      rejeterJustificatif({ id: selectedJustificatif, commentaire });
    }

    setActionModal({ open: false, action: null });
    setSelectedJustificatif(null);
    setCommentaire('');
  };

  const getStatutColor = (statut: StatutValidation): 'yellow' | 'green' | 'red' => {
    const colors = { EN_ATTENTE: 'yellow' as const, VALIDE: 'green' as const, REJETE: 'red' as const };
    return colors[statut];
  };

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbItem href="/admin/attendance">Présences</BreadcrumbItem>
        <BreadcrumbItem>Justificatifs</BreadcrumbItem>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Justificatifs d'absence</h1>
          <p className="text-gray-500 mt-1">Validez ou rejetez les justificatifs soumis</p>
        </div>
      </div>

      <Card className="p-5">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <SearchBar
              defaultValue={filters.search || ''}
              onSearch={(value) => setFilters({ ...filters, search: value })}
              placeholder="Rechercher un étudiant..."
            />
          </div>
            <Select
              label="Statut"
              value={filters.statut || ''}
              onChange={(value) => setFilters({ ...filters, statut: value as StatutValidation })}
              options={[
                { value: '', label: 'Tous les statuts' },
                { value: 'EN_ATTENTE', label: 'En attente' },
                { value: 'VALIDE', label: 'Validé' },
                { value: 'REJETE', label: 'Rejeté' },
              ]}
            />
        </div>
      </Card>

      <Card>
        {isLoading ? (
          <div className="p-12 text-center"><Spinner size="lg" /></div>
        ) : justificatifs.length === 0 ? (
          <div className="p-12 text-center text-gray-500">Aucun justificatif trouvé</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Étudiant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Période</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Soumis le</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {justificatifs.map((just) => (
                  <tr key={just.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{just.etudiant_nom}</div>
                        <div className="text-gray-500">{just.etudiant_matricule}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        Du {new Date(just.date_debut).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="text-sm text-gray-500">
                        Au {new Date(just.date_fin).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">({just.duree_jours} jour{just.duree_jours > 1 ? 's' : ''})</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{just.type_justificatif}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(just.date_soumission).toLocaleDateString('fr-FR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatutColor(just.statut) as any}>
                        {just.statut.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        {just.document_url && (
                          <Button variant="ghost" size="sm" onClick={() => window.open(just.document_url, '_blank')}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        )}
                        {just.statut === 'EN_ATTENTE' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedJustificatif(just.id);
                                setActionModal({ open: true, action: 'valider' });
                              }}
                            >
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedJustificatif(just.id);
                                setActionModal({ open: true, action: 'rejeter' });
                              }}
                            >
                              <XCircle className="w-4 h-4 text-red-600" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        isOpen={actionModal.open}
        onClose={() => {
          setActionModal({ open: false, action: null });
          setCommentaire('');
        }}
        title={actionModal.action === 'valider' ? 'Valider le justificatif' : 'Rejeter le justificatif'}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            {actionModal.action === 'valider'
              ? 'Êtes-vous sûr de vouloir valider ce justificatif ?'
              : 'Veuillez indiquer la raison du rejet :'}
          </p>
          <textarea
            rows={4}
            value={commentaire}
            onChange={(e) => setCommentaire(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder={actionModal.action === 'valider' ? 'Commentaire (optionnel)' : 'Raison du rejet *'}
            required={actionModal.action === 'rejeter'}
          />
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setActionModal({ open: false, action: null })}>
              Annuler
            </Button>
            <Button
              onClick={handleAction}
              disabled={isValidating || isRejecting}
              variant={actionModal.action === 'rejeter' ? 'danger' : 'primary'}
            >
              {actionModal.action === 'valider' ? 'Valider' : 'Rejeter'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}