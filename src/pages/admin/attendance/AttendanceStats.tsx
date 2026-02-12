/**
 * Page: AttendanceStats.tsx
 * Statistiques globales des présences
 */

import { BarChart3, TrendingUp, TrendingDown, Users, AlertCircle } from 'lucide-react';
import { useStatistiquesPresences } from '@/hooks/useAttendance';
import { Card, Spinner, Badge } from '@/components/ui';
import { Breadcrumb, BreadcrumbItem } from '@/components/ui/Breadcrumb';

export default function AttendanceStats() {
  const { stats, isLoading } = useStatistiquesPresences();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!stats) {
    return <div className="text-center py-12 text-gray-500">Statistiques indisponibles</div>;
  }

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbItem label="Présences" href="/admin/attendance" />
        <BreadcrumbItem label="Statistiques" />
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Statistiques des présences</h1>
        <p className="text-gray-500 mt-1">Vue d'ensemble des présences et de l'assiduité</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total feuilles</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total_feuilles}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-gray-400" />
          </div>
        </Card>

        <Card className="p-5 border-blue-200 bg-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700">Feuilles ouvertes</p>
              <p className="text-2xl font-bold text-blue-900">{stats.feuilles_ouvertes}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-5 border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">Feuilles fermées</p>
              <p className="text-2xl font-bold text-gray-900">{stats.feuilles_fermees}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-gray-500" />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Taux de présence moyen global</h3>
          <span className="text-3xl font-bold text-blue-600">
            {stats.taux_presence_moyen.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-blue-600 h-4 rounded-full transition-all"
            style={{ width: `${stats.taux_presence_moyen}%` }}
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="p-5 border-b bg-green-50">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-green-900">Étudiants les plus assidus</h3>
            </div>
          </div>
          <div className="divide-y">
            {stats.top_etudiants_assidus.slice(0, 5).map((etudiant, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-sm">
                    {idx + 1}
                  </div>
                  <div className="text-sm font-medium text-gray-900">{etudiant.etudiant_nom}</div>
                </div>
                <Badge color="green">{etudiant.taux_presence.toFixed(1)}%</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="p-5 border-b bg-red-50">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-red-600" />
              <h3 className="text-lg font-semibold text-red-900">Étudiants à surveiller</h3>
            </div>
          </div>
          <div className="divide-y">
            {stats.bottom_etudiants_assidus.slice(0, 5).map((etudiant, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="text-sm font-medium text-gray-900">{etudiant.etudiant_nom}</div>
                <Badge color="red">{etudiant.taux_presence.toFixed(1)}%</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {stats.alertes_absences.length > 0 && (
        <Card>
          <div className="p-5 border-b bg-orange-50">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-semibold text-orange-900">Alertes: Absences répétées</h3>
            </div>
          </div>
          <div className="divide-y">
            {stats.alertes_absences.map((alerte, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="text-sm font-medium text-gray-900">{alerte.etudiant_nom}</div>
                <Badge color="orange">{alerte.nombre_absences_consecutives} absences consécutives</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <div className="p-5 border-b">
          <h3 className="text-lg font-semibold">Taux de présence par filière</h3>
        </div>
        <div className="p-6 space-y-4">
          {stats.repartition_par_filiere.map((filiere, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">{filiere.filiere}</span>
                <span className="text-sm font-bold text-blue-600">{filiere.taux_moyen.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${filiere.taux_moyen}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}