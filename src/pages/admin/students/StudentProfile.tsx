// Profil détaillé d'un étudiant avec onglets

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  FileText,
  CreditCard,
  Calendar,
  Folder,
  Clock,
  Edit,
  Mail,
  Phone,
  Download,
} from 'lucide-react';
import {
  useStudent,
  useStudentInscriptions,
  useStudentBulletin,
} from '../../../hooks/useStudents';

type TabType = 'overview' | 'info' | 'notes' | 'payments' | 'attendance' | 'documents' | 'timeline';

const TABS = [
  { id: 'overview', label: 'Vue d\'ensemble', icon: User },
  { id: 'info', label: 'Informations', icon: FileText },
  { id: 'notes', label: 'Notes', icon: FileText },
  { id: 'payments', label: 'Paiements', icon: CreditCard },
  { id: 'attendance', label: 'Présences', icon: Calendar },
  { id: 'documents', label: 'Documents', icon: Folder },
  { id: 'timeline', label: 'Historique', icon: Clock },
];

const StudentProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const { data: student, isLoading } = useStudent(Number(id));
  const { data: inscriptionsData } = useStudentInscriptions(Number(id));
  const { data: bulletin } = useStudentBulletin(Number(id));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="text-center">
          <p className="text-red-600">Étudiant non trouvé</p>
        </div>
      </div>
    );
  }

  const getStatutBadge = (statut: string) => {
    const badges = {
      ACTIF: 'bg-green-100 text-green-800',
      SUSPENDU: 'bg-orange-100 text-orange-800',
      DIPLOME: 'bg-purple-100 text-purple-800',
      EXCLU: 'bg-red-100 text-red-800',
      ABANDONNE: 'bg-gray-100 text-gray-800',
    };
    return badges[statut as keyof typeof badges] || badges.ACTIF;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/students')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à la liste
        </button>
      </div>

      {/* Carte de profil */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Photo */}
            <img
              src={student.photo || '/default-avatar.png'}
              alt={student.user.first_name}
              className="w-32 h-32 rounded-full object-cover"
            />

            {/* Informations principales */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">
                {student.user.last_name} {student.user.first_name}
              </h1>
              <p className="text-lg text-gray-600 mt-1">{student.matricule}</p>
              <div className="flex items-center gap-4 mt-4">
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatutBadge(student.statut)}`}>
                  {student.statut}
                </span>
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  {student.email_personnel}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  {student.telephone}
                </div>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => navigate(`/admin/students/${id}/edit`)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Edit className="w-4 h-4" />
                Modifier
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Download className="w-4 h-4" />
                Télécharger bulletin
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-gray-200">
          <div className="flex overflow-x-auto">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contenu des onglets */}
      <div className="bg-white rounded-lg shadow p-6">
        {/* Vue d'ensemble */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Vue d'ensemble</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <p className="text-sm font-medium text-blue-600 mb-2">Moyenne Générale</p>
                <p className="text-3xl font-bold text-blue-900">--</p>
                <p className="text-sm text-blue-600 mt-1">À calculer</p>
              </div>

              <div className="bg-green-50 rounded-lg p-6">
                <p className="text-sm font-medium text-green-600 mb-2">Crédits Obtenus</p>
                <p className="text-3xl font-bold text-green-900">--</p>
                <p className="text-sm text-green-600 mt-1">À calculer</p>
              </div>

              <div className="bg-purple-50 rounded-lg p-6">
                <p className="text-sm font-medium text-purple-600 mb-2">Taux de Présence</p>
                <p className="text-3xl font-bold text-purple-900">--</p>
                <p className="text-sm text-purple-600 mt-1">À calculer</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Inscriptions</h3>
              {inscriptionsData && inscriptionsData.inscriptions.length > 0 ? (
                <div className="space-y-4">
                  {inscriptionsData.inscriptions.map((inscription) => (
                    <div key={inscription.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {inscription.filiere.nom}
                          </p>
                          <p className="text-sm text-gray-600">
                            Année académique: {inscription.annee_academique.code} - Niveau: L{inscription.niveau}
                          </p>
                        </div>
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                          inscription.statut_paiement === 'COMPLET'
                            ? 'bg-green-100 text-green-800'
                            : inscription.statut_paiement === 'PARTIEL'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {inscription.statut_paiement}
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        Payé: {inscription.montant_paye} FCFA / {inscription.montant_inscription} FCFA
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">Aucune inscription</p>
              )}
            </div>
          </div>
        )}

        {/* Informations */}
        {activeTab === 'info' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Informations complètes</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations personnelles</h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Nom complet</dt>
                    <dd className="text-base text-gray-900">{student.user.last_name} {student.user.first_name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Sexe</dt>
                    <dd className="text-base text-gray-900">{student.sexe === 'M' ? 'Masculin' : 'Féminin'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Date de naissance</dt>
                    <dd className="text-base text-gray-900">{new Date(student.date_naissance).toLocaleDateString('fr-FR')}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Lieu de naissance</dt>
                    <dd className="text-base text-gray-900">{student.lieu_naissance}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Nationalité</dt>
                    <dd className="text-base text-gray-900">{student.nationalite}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact</h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="text-base text-gray-900">{student.email_personnel}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Téléphone</dt>
                    <dd className="text-base text-gray-900">{student.telephone}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Adresse</dt>
                    <dd className="text-base text-gray-900">{student.adresse}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Ville</dt>
                    <dd className="text-base text-gray-900">{student.ville}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Pays</dt>
                    <dd className="text-base text-gray-900">{student.pays}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tuteur</h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Nom du tuteur</dt>
                    <dd className="text-base text-gray-900">{student.tuteur_nom || 'Non renseigné'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Téléphone du tuteur</dt>
                    <dd className="text-base text-gray-900">{student.tuteur_telephone || 'Non renseigné'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email du tuteur</dt>
                    <dd className="text-base text-gray-900">{student.tuteur_email || 'Non renseigné'}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        )}

        {/* Notes et résultats */}
        {activeTab === 'notes' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Notes et Résultats</h2>

            {bulletin && bulletin.notes.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Matière
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Évaluation
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Note
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Coefficient
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bulletin.notes.map((note, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {note.matiere}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {note.evaluation}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {note.note}/20
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {note.coefficient}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune note disponible</p>
              </div>
            )}
          </div>
        )}

        {/* Paiements */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Historique des paiements</h2>
            
            {inscriptionsData && inscriptionsData.inscriptions.length > 0 ? (
              <div className="space-y-4">
                {inscriptionsData.inscriptions.map((inscription) => (
                  <div key={inscription.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {inscription.annee_academique.code} - {inscription.filiere.nom}
                      </h3>
                      <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                        inscription.statut_paiement === 'COMPLET'
                          ? 'bg-green-100 text-green-800'
                          : inscription.statut_paiement === 'PARTIEL'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {inscription.statut_paiement}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Montant total</p>
                        <p className="text-lg font-semibold text-gray-900">{inscription.montant_inscription} FCFA</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Montant payé</p>
                        <p className="text-lg font-semibold text-green-600">{inscription.montant_paye} FCFA</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Reste à payer</p>
                        <p className="text-lg font-semibold text-red-600">
                          {inscription.montant_inscription - inscription.montant_paye} FCFA
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun paiement enregistré</p>
              </div>
            )}
          </div>
        )}

        {/* Présences */}
        {activeTab === 'attendance' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Présences</h2>
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Module de présence à implémenter</p>
            </div>
          </div>
        )}

        {/* Documents */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Documents</h2>
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Folder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Gestion des documents à implémenter</p>
            </div>
          </div>
        )}

        {/* Timeline */}
        {activeTab === 'timeline' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Historique</h2>
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Historique des activités à implémenter</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProfile;
