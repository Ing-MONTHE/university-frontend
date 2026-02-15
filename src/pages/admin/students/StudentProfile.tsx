/**
 * Profil Étudiant - Style Module Académique
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
  Calendar,
  Award,
  Users,
  BookOpen,
  Download,
} from 'lucide-react';
import { useStudent, useStudentInscriptions } from '@/hooks/useStudents';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { Avatar } from '@/components/ui/Avatar';

export default function StudentProfilePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  const { data: student, isLoading } = useStudent(Number(id));
  const { data: inscriptionsData } = useStudentInscriptions(Number(id));

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <p className="text-center text-red-600">Étudiant non trouvé</p>
      </div>
    );
  }

  const getStatutColor = (statut: string) => {
    const colors: Record<string, string> = {
      ACTIF: 'bg-green-100 text-green-700',
      SUSPENDU: 'bg-yellow-100 text-yellow-700',
      DIPLOME: 'bg-blue-100 text-blue-700',
      EXCLU: 'bg-red-100 text-red-700',
      ABANDONNE: 'bg-gray-100 text-gray-700',
    };
    return colors[statut] || 'bg-gray-100 text-gray-700';
  };

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: User },
    { id: 'info', label: 'Informations', icon: BookOpen },
    { id: 'inscriptions', label: 'Inscriptions', icon: Award },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <button
          onClick={() => navigate('/admin/students')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à la liste
        </button>

        <div className="flex items-start gap-6">
          <Avatar
            src={student.photo_url || undefined}
            name={`${student.prenom} ${student.nom}`}
            size="2xl"
            variant="rounded"
          />

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {student.nom} {student.prenom}
                </h1>
                <p className="text-lg text-gray-600 mt-1 font-mono">{student.matricule}</p>
              </div>
              <Button
                variant="primary"
                onClick={() => navigate(`/admin/students/${id}/edit`)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Modifier
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div>
                <p className="text-sm text-gray-600">Statut</p>
                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatutColor(student.statut)}`}>
                  {student.statut_display || student.statut}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Sexe</p>
                <p className="font-medium text-gray-900">
                  {student.sexe === 'M' ? 'Masculin' : 'Féminin'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Nationalité</p>
                <p className="font-medium text-gray-900">{student.nationalite}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date de naissance</p>
                <p className="font-medium text-gray-900">
                  {new Date(student.date_naissance).toLocaleDateString('fr-FR')}
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
                      ? 'border-blue-600 text-blue-600'
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
                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Inscriptions</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {inscriptionsData?.inscriptions.length || 0}
                      </p>
                    </div>
                    <Award className="w-10 h-10 text-blue-600" />
                  </div>
                </div>

                <div className="bg-green-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Moyenne générale</p>
                      <p className="text-2xl font-bold text-green-600">-</p>
                    </div>
                    <BookOpen className="w-10 h-10 text-green-600" />
                  </div>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Crédits obtenus</p>
                      <p className="text-2xl font-bold text-purple-600">-</p>
                    </div>
                    <Award className="w-10 h-10 text-purple-600" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Dernières inscriptions
                </h3>
                {inscriptionsData?.inscriptions && inscriptionsData.inscriptions.length > 0 ? (
                  <div className="space-y-3">
                    {inscriptionsData.inscriptions.slice(0, 3).map((inscription: any) => (
                      <div
                        key={inscription.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">
                              {inscription.filiere_details?.nom || 'Filière inconnue'}
                            </p>
                            <p className="text-sm text-gray-600">
                              {inscription.annee_academique_details?.libelle}
                            </p>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            Niveau {inscription.niveau}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    Aucune inscription enregistrée
                  </p>
                )}
              </div>
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
                      {student.nom} {student.prenom}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Matricule</p>
                    <p className="font-medium text-gray-900 font-mono">{student.matricule}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date de naissance</p>
                    <p className="font-medium text-gray-900">
                      {new Date(student.date_naissance).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Lieu de naissance</p>
                    <p className="font-medium text-gray-900">{student.lieu_naissance}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Sexe</p>
                    <p className="font-medium text-gray-900">
                      {student.sexe === 'M' ? 'Masculin' : 'Féminin'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Nationalité</p>
                    <p className="font-medium text-gray-900">{student.nationalite}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{student.email_personnel || student.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Téléphone</p>
                    <p className="font-medium text-gray-900">{student.telephone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ville</p>
                    <p className="font-medium text-gray-900">{student.ville || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Pays</p>
                    <p className="font-medium text-gray-900">{student.pays || '-'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">Adresse</p>
                    <p className="font-medium text-gray-900">{student.adresse || '-'}</p>
                  </div>
                </div>
              </div>

              {(student.tuteur_nom || student.tuteur_telephone) && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Tuteur/Parent</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-600">Nom</p>
                      <p className="font-medium text-gray-900">{student.tuteur_nom || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Téléphone</p>
                      <p className="font-medium text-gray-900">{student.tuteur_telephone || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-900">{student.tuteur_email || '-'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Onglet Inscriptions */}
          {activeTab === 'inscriptions' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Historique des inscriptions ({inscriptionsData?.count || 0})
              </h3>
              {inscriptionsData?.inscriptions && inscriptionsData.inscriptions.length > 0 ? (
                <div className="space-y-4">
                  {inscriptionsData.inscriptions.map((inscription: any) => (
                    <div
                      key={inscription.id}
                      className="border border-gray-200 rounded-lg p-6"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {inscription.filiere_details?.nom || 'Filière inconnue'}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {inscription.annee_academique_details?.libelle} • Niveau {inscription.niveau}
                          </p>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(inscription.date_inscription).toLocaleDateString('fr-FR')}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Montant inscription</p>
                          <p className="font-medium text-gray-900">
                            {inscription.montant_inscription?.toLocaleString()} FCFA
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Montant payé</p>
                          <p className="font-medium text-green-600">
                            {inscription.montant_paye?.toLocaleString()} FCFA
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Reste à payer</p>
                          <p className="font-medium text-red-600">
                            {inscription.reste_a_payer?.toLocaleString()} FCFA
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-12">
                  Aucune inscription enregistrée
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}