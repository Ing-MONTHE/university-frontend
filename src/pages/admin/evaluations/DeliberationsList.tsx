/**
 * Page Liste des Sessions de Délibération
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, FileText, Download } from 'lucide-react';
import { useSessionsDeliberation, useGenererPVDeliberation } from '@/hooks/useEvaluations';
import { useFilieres } from '@/hooks/useFilieres';
import type { SessionDeliberationFilters } from '@/types/evaluation.types';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';
import Pagination from '@/components/ui/Pagination';
import Spinner from '@/components/ui/Spinner';
import { DEFAULT_PAGE_SIZE } from '@/config/constants';
import { STATUT_SESSION_CHOICES } from '@/types/evaluation.types';

export default function DeliberationsList() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<SessionDeliberationFilters>({
    page: 1,
    page_size: DEFAULT_PAGE_SIZE,
  });

  const { data, isLoading } = useSessionsDeliberation(filters);
  const { data: filieres } = useFilieres({ page_size: 100 });
  const genererPV = useGenererPVDeliberation();

  const getStatutBadge = (statut: string) => {
    const config = STATUT_SESSION_CHOICES.find(s => s.value === statut);
    return config ? <Badge variant={config.color as any}>{config.label}</Badge> : null;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-indigo-600" />
              </div>
              Sessions de Délibération
            </h1>
            <p className="text-gray-600 mt-1">{data?.count || 0} session(s)</p>
          </div>

          <Button onClick={() => navigate('/admin/evaluations/deliberations/new')}>
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle Session
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Select
            label="Filière"
            value={filters.filiere || ''}
            onChange={(e) => setFilters({ ...filters, filiere: e.target.value ? Number(e.target.value) : undefined })}
          >
            <option value="">Toutes</option>
            {filieres?.results.map(f => (
              <option key={f.id} value={f.id}>{f.code}</option>
            ))}
          </Select>

          <Select
            label="Semestre"
            value={filters.semestre || ''}
            onChange={(e) => setFilters({ ...filters, semestre: e.target.value ? Number(e.target.value) : undefined })}
          >
            <option value="">Tous</option>
            <option value={1}>Semestre 1</option>
            <option value={2}>Semestre 2</option>
          </Select>

          <Select
            label="Statut"
            value={filters.statut || ''}
            onChange={(e) => setFilters({ ...filters, statut: e.target.value as any })}
          >
            <option value="">Tous</option>
            {STATUT_SESSION_CHOICES.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="lg" />
          </div>
        ) : !data?.results.length ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucune session trouvée</p>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">Filière</th>
                  <th className="px-6 py-3 text-center">Niveau</th>
                  <th className="px-6 py-3 text-center">Semestre</th>
                  <th className="px-6 py-3 text-center">Date</th>
                  <th className="px-6 py-3 text-center">Statut</th>
                  <th className="px-6 py-3 text-center">Progression</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {data.results.map(session => (
                  <tr key={session.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{session.filiere_details?.nom}</td>
                    <td className="px-6 py-4 text-center">{session.niveau}</td>
                    <td className="px-6 py-4 text-center">{session.semestre}</td>
                    <td className="px-6 py-4 text-center">
                      {new Date(session.date_session).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getStatutBadge(session.statut)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant="info">
                        {session.etudiants_traites || 0}/{session.total_etudiants || 0}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => navigate(`/admin/evaluations/deliberations/${session.id}`)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {session.pv_deliberation && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => genererPV.mutate(session.id)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {data && data.count > DEFAULT_PAGE_SIZE && (
              <div className="px-6 py-4 border-t">
                <Pagination
                  currentPage={filters.page || 1}
                  totalPages={Math.ceil(data.count / DEFAULT_PAGE_SIZE)}
                  onPageChange={(page) => setFilters({ ...filters, page })}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}