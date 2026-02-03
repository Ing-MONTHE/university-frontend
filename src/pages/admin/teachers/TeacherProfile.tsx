/**
 * Profil Enseignant - Style Module Académique
 */

import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Award,
  BookOpen,
  Calendar,
  Clock,
  Download,
  Upload,
} from 'lucide-react';
import { useTeacher, useTeacherAttributions, useTeacherChargeHoraire } from '@/hooks/useTeachers';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';

export default function TeacherProfilePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  const { data: teacher, isLoading } = useTeacher(Number(id));
  const { data: attributionsData } = useTeacherAttributions(Number(id));
  const { data: chargeHoraire } = useTeacherChargeHoraire(Number(id));

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <p className="text-center text-red-600">Enseignant non trouvé</p>
      </div>
    );
  }

  const getGradeColor = (grade: string) => {
    const colors: Record<string, string> = {
      ASSISTANT: 'bg-blue-100 text-blue-700',
      MC: 'bg-purple-100 text-purple-700',
      PROFESSEUR: 'bg-green-100 text-green-700',
    };
    return colors[grade] || 'bg-gray-100 text-gray-700';
  };

  const getStatutColor = (statut: string) => {
    const colors: Record<string, string> = {
      ACTIF: 'bg-green-100 text-green-700',
      INACTIF: 'bg-red-100 text-red-700',
      EN_CONGE: 'bg-yellow-100 text-yellow-700',
      RETIRE: 'bg-gray-100 text-gray-700',
    };
    return colors[statut] || 'bg-gray-100 text-gray-700';
  };

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: User },
    { id: 'info', label: 'Informations', icon: BookOpen },
    { id: 'subjects', label: 'Matières assignées', icon: Award },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <button
          onClick={() => navigate('/admin/teachers')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à la liste
        </button>

        <div className="flex items-start gap-6">
          <img
            src={teacher.photo_url || '/default-avatar.png'}
            alt={teacher.prenom}
            className="w-24 h-24 rounded-full object-cover border-4 border-gray-100"
          />

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {teacher.nom} {teacher.prenom}
                </h1>
                <p className="text-lg text-gray-600 mt-1">{teacher.specialite}</p>
                <p className="text-sm text-gray-500 font-mono mt-1">{teacher.matricule}</p>
              </div>
              <Button
                variant="primary"
                onClick={() => navigate(`/admin/teachers/${id}/edit`)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Modifier
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div>
                <p className="text-sm text-gray-600">Grade</p>
                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getGradeColor(teacher.grade)}`}>
                  {teacher.grade_display || teacher.grade}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Département</p>
                <p className="font-medium text-gray-900">{teacher.departement_nom}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Statut</p>
                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatutColor(teacher.statut)}`}>
                  {teacher.statut_display || teacher.statut}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date recrutement</p>
                <p className="font-medium text-gray-900">
                  {new Date(teacher.date_embauche).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Onglet Vue d'ensemble */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-purple-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Matières enseignées</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {teacher.nb_matieres || 0}
                      </p>
                    </div>
                    <BookOpen className="w-10 h-10 text-purple-600" />
                  </div>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Charge horaire</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {chargeHoraire?.charge_horaire.total || 0}h
                      </p>
                    </div>
                    <Clock className="w-10 h-10 text-blue-600" />
                  </div>
                </div>

                <div className="bg-green-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Étudiants</p>
                      <p className="text-2xl font-bold text-green-600">
                        {teacher.nb_etudiants || 0}
                      </p>
                    </div>
                    <User className="w-10 h-10 text-green-600" />
                  </div>
                </div>
              </div>

              {/* Charge horaire détaillée */}
              {chargeHoraire && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Charge horaire détaillée
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">CM</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {chargeHoraire.charge_horaire.cm}h
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">TD</p>
                      <p className="text-2xl font-bold text-green-600">
                        {chargeHoraire.charge_horaire.td}h
                      </p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">TP</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {chargeHoraire.charge_horaire.tp}h
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Total</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {chargeHoraire.charge_horaire.total}h
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Onglet Informations */}
          {activeTab === 'info' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Informations personnelles
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600">Nom complet</p>
                    <p className="font-medium text-gray-900">
                      {teacher.nom} {teacher.prenom}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Matricule</p>
                    <p className="font-medium text-gray-900 font-mono">{teacher.matricule}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date de naissance</p>
                    <p className="font-medium text-gray-900">
                      {new Date(teacher.date_naissance).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Sexe</p>
                    <p className="font-medium text-gray-900">
                      {teacher.sexe === 'M' ? 'Masculin' : 'Féminin'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Nationalité</p>
                    <p className="font-medium text-gray-900">{teacher.nationalite}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{teacher.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Téléphone</p>
                    <p className="font-medium text-gray-900">{teacher.telephone}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">Adresse</p>
                    <p className="font-medium text-gray-900">{teacher.adresse || '-'}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Informations académiques
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600">Grade</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getGradeColor(teacher.grade)}`}>
                      {teacher.grade_display || teacher.grade}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Spécialité</p>
                    <p className="font-medium text-gray-900">{teacher.specialite}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Département</p>
                    <p className="font-medium text-gray-900">{teacher.departement_nom}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date de recrutement</p>
                    <p className="font-medium text-gray-900">
                      {new Date(teacher.date_embauche).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Statut</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatutColor(teacher.statut)}`}>
                      {teacher.statut_display || teacher.statut}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Onglet Matières */}
          {activeTab === 'subjects' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Matières assignées ({attributionsData?.count || 0})
              </h3>
              {attributionsData && attributionsData.attributions.length > 0 ? (
                <div className="space-y-4">
                  {attributionsData.attributions.map((attr: any) => (
                    <div
                      key={attr.id}
                      className="border border-gray-200 rounded-lg p-6"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {attr.matiere_details.code} - {attr.matiere_details.nom}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {attr.matiere_details.filiere?.nom || 'Sans filière'}
                          </p>
                        </div>
                        <span className="text-sm font-medium text-purple-600">
                          {attr.type_enseignement_display}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Volume horaire</p>
                          <p className="font-medium text-gray-900">
                            {attr.volume_horaire_assigne}h
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Année académique</p>
                          <p className="font-medium text-gray-900">
                            {attr.annee_academique_details.libelle}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Crédits</p>
                          <p className="font-medium text-gray-900">
                            {attr.matiere_details.credits}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-12">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  Aucune matière assignée pour le moment
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
