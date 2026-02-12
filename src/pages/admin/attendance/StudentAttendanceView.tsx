/**
 * Page: StudentAttendanceView.tsx
 * Vue des présences d'un étudiant
 */

import { useParams } from 'react-router-dom';
import { CheckCircle2, XCircle, AlertCircle, TrendingUp, Calendar } from 'lucide-react';
import { useTauxPresenceEtudiant } from '@/hooks/useAttendance';
import { Card, Badge, Spinner } from '@/components/ui';
import { Breadcrumb, BreadcrumbItem } from '@/components/ui/Breadcrumb';

export default function StudentAttendanceView() {
  const { id } = useParams<{ id: string }>();
  const etudiantId = parseInt(id || '0');
  const { stats, isLoading } = useTauxPresenceEtudiant(etudiantId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!stats) {
    return <div className="text-center py-12 text-gray-500">Données introuvables</div>;
  }

  const getTauxColor = (taux: number): string => {
    if (taux >= 80) return 'text-green-600';
    if (taux >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbItem label="Présences" href="/admin/attendance" />
        <BreadcrumbItem label={stats.etudiant_nom} />
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">{stats.etudiant_nom}</h1>
        <p className="text-gray-500 mt-1">Matricule: {stats.etudiant_matricule}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total séances</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total_seances}</p>
            </div>
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
        </Card>

        <Card className="p-5 border-green-200 bg-green-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700">Présences</p>
              <p className="text-2xl font-bold text-green-900">{stats.presences}</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-5 border-red-200 bg-red-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-700">Absences</p>
              <p className="text-2xl font-bold text-red-900">{stats.absences}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
        </Card>

        <Card className="p-5 border-orange-200 bg-orange-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-700">Retards</p>
              <p className="text-2xl font-bold text-orange-900">{stats.retards}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-orange-500" />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Taux de présence global</h3>
          <span className={`text-3xl font-bold ${getTauxColor(stats.taux_presence)}`}>
            {stats.taux_presence.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className={`h-4 rounded-full transition-all ${
              stats.taux_presence >= 80 ? 'bg-green-600' : stats.taux_presence >= 60 ? 'bg-orange-600' : 'bg-red-600'
            }`}
            style={{ width: `${stats.taux_presence}%` }}
          />
        </div>
        {stats.taux_presence < 75 && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">
              ⚠️ Le taux de présence est inférieur à 75%. L'étudiant est à risque.
            </p>
          </div>
        )}
      </Card>

      <Card>
        <div className="p-5 border-b">
          <h3 className="text-lg font-semibold">Présences par matière</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Matière</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Présents</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Absents</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Retards</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Taux</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {stats.presences_par_matiere.map((matiere, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{matiere.matiere}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{matiere.total}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-green-600 font-medium">{matiere.presents}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-red-600 font-medium">{matiere.absents}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-orange-600 font-medium">{matiere.retards}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-bold ${getTauxColor(matiere.taux)}`}>
                      {matiere.taux.toFixed(1)}%
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}