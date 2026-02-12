/**
 * Page: AttendanceSheetView.tsx
 * Vue et marquage des présences d'une feuille
 * ⭐ PAGE PRINCIPALE DU MODULE
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Check,
  X,
  Clock,
  Save,
  Lock,
  ArrowLeft,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { useFeuillePresence } from '@/hooks/useAttendance';
import { StatutPresence, Presence } from '@/types/attendance.types';
import { Button, Card, Badge, Spinner } from '@/components/ui';
import { Breadcrumb, BreadcrumbItem } from '@/components/ui/Breadcrumb';
import { toast } from '@/components/ui/Toast';

export default function AttendanceSheetView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const feuilleId = parseInt(id || '0');

  const {
    feuille,
    presences,
    isLoading,
    isLoadingPresences,
    marquerPresences,
    marquerToutPresent,
    marquerToutAbsent,
    refetchPresences,
    isMarquage,
  } = useFeuillePresence(feuilleId);

  // État local des présences (pour la sauvegarde auto)
  const [localPresences, setLocalPresences] = useState<Map<number, Partial<Presence>>>(
    new Map()
  );
  const [hasChanges, setHasChanges] = useState(false);
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);

  // Initialiser les présences locales
  useEffect(() => {
    if (presences.length > 0) {
      const map = new Map();
      presences.forEach((p) => {
        map.set(p.etudiant, {
          etudiant_id: p.etudiant,
          statut: p.statut,
          heure_arrivee: p.heure_arrivee,
          remarque: p.remarque,
        });
      });
      setLocalPresences(map);
    }
  }, [presences]);

  // Sauvegarde automatique après 2 secondes d'inactivité
  useEffect(() => {
    if (hasChanges && !feuille?.statut || feuille?.statut === 'OUVERTE') {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }

      const timer = setTimeout(() => {
        savePresences();
      }, 2000);

      setAutoSaveTimer(timer);

      return () => {
        if (timer) clearTimeout(timer);
      };
    }
  }, [localPresences, hasChanges]);

  /**
   * Marquer le statut d'un étudiant
   */
  const handleMarkStatut = (etudiantId: number, statut: StatutPresence) => {
    const current = localPresences.get(etudiantId) || { etudiant_id: etudiantId };

    setLocalPresences((prev) => {
      const newMap = new Map(prev);
      newMap.set(etudiantId, {
        ...current,
        statut,
        heure_arrivee: statut === 'RETARD' ? new Date().toTimeString().slice(0, 5) : undefined,
      });
      return newMap;
    });

    setHasChanges(true);
  };

  /**
   * Sauvegarder les présences
   */
  const savePresences = () => {
    const data = {
      presences: Array.from(localPresences.values()).map((p) => ({
        etudiant_id: p.etudiant_id!,
        statut: p.statut!,
        heure_arrivee: p.heure_arrivee,
        remarque: p.remarque,
      })),
    };

    marquerPresences(data, {
      onSuccess: () => {
        setHasChanges(false);
        refetchPresences();
      },
    });
  };

  /**
   * Marquer tout le monde présent
   */
  const handleMarkAllPresent = () => {
    marquerToutPresent(undefined, {
      onSuccess: () => {
        refetchPresences();
        setHasChanges(false);
      },
    });
  };

  /**
   * Marquer tout le monde absent
   */
  const handleMarkAllAbsent = () => {
    marquerToutAbsent(undefined, {
      onSuccess: () => {
        refetchPresences();
        setHasChanges(false);
      },
    });
  };

  /**
   * Obtenir la couleur du badge selon le statut
   */
  const getStatutBadge = (statut: StatutPresence) => {
    const badges = {
      PRESENT: { color: 'green', icon: CheckCircle2, label: 'Présent' },
      ABSENT: { color: 'red', icon: XCircle, label: 'Absent' },
      RETARD: { color: 'orange', icon: AlertCircle, label: 'Retard' },
    };
    return badges[statut] || badges.ABSENT;
  };

  /**
   * Calculer les statistiques en temps réel
   */
  const stats = {
    total: presences.length,
    presents: Array.from(localPresences.values()).filter((p) => p.statut === 'PRESENT').length,
    absents: Array.from(localPresences.values()).filter((p) => p.statut === 'ABSENT').length,
    retards: Array.from(localPresences.values()).filter((p) => p.statut === 'RETARD').length,
  };

  const tauxPresence = stats.total > 0 ? ((stats.presents / stats.total) * 100).toFixed(1) : '0';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!feuille) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Feuille de présence introuvable</p>
      </div>
    );
  }

  const isFermee = feuille.statut === 'FERMEE';

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbItem label="Présences" href="/admin/attendance" />
        <BreadcrumbItem label={feuille.cours_nom} />
      </Breadcrumb>

      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/admin/attendance')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{feuille.cours_nom}</h1>
            <p className="text-sm text-gray-500">
              {new Date(feuille.date_cours).toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
              {' • '}
              {feuille.heure_debut} - {feuille.heure_fin}
              {' • '}
              {feuille.enseignant_nom}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {hasChanges && !isFermee && (
            <Badge color="yellow">
              <Clock className="w-3 h-3 mr-1" />
              Sauvegarde auto...
            </Badge>
          )}
          <Badge color={isFermee ? 'gray' : 'blue'}>
            {isFermee ? (
              <>
                <Lock className="w-3 h-3 mr-1" />
                Fermée
              </>
            ) : (
              'Ouverte'
            )}
          </Badge>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total étudiants</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Users className="w-8 h-8 text-gray-400" />
          </div>
        </Card>

        <Card className="p-5 border-green-200 bg-green-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700">Présents</p>
              <p className="text-2xl font-bold text-green-900">{stats.presents}</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-5 border-red-200 bg-red-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-700">Absents</p>
              <p className="text-2xl font-bold text-red-900">{stats.absents}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
        </Card>

        <Card className="p-5 border-orange-200 bg-orange-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-700">En retard</p>
              <p className="text-2xl font-bold text-orange-900">{stats.retards}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-orange-500" />
          </div>
        </Card>
      </div>

      {/* Taux de présence */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Taux de présence</h3>
          <span className="text-3xl font-bold text-blue-600">{tauxPresence}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${tauxPresence}%` }}
          />
        </div>
      </Card>

      {/* Actions en masse */}
      {!isFermee && (
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Actions rapides</p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllPresent}
                disabled={isMarquage}
              >
                <Check className="w-4 h-4 mr-2" />
                Tout présent
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAbsent}
                disabled={isMarquage}
              >
                <X className="w-4 h-4 mr-2" />
                Tout absent
              </Button>
              <Button size="sm" onClick={savePresences} disabled={!hasChanges || isMarquage}>
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Liste des étudiants */}
      <Card>
        <div className="p-5 border-b">
          <h3 className="text-lg font-semibold">Liste des étudiants</h3>
        </div>

        {isLoadingPresences ? (
          <div className="p-12 text-center">
            <Spinner />
          </div>
        ) : (
          <div className="divide-y">
            {presences.map((presence) => {
              const localData = localPresences.get(presence.etudiant);
              const currentStatut = localData?.statut || presence.statut;
              const badgeInfo = getStatutBadge(currentStatut);
              const BadgeIcon = badgeInfo.icon;

              return (
                <div
                  key={presence.id}
                  className="p-5 hover:bg-gray-50 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                      {presence.etudiant_nom.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{presence.etudiant_nom}</p>
                      <p className="text-sm text-gray-500">{presence.etudiant_matricule}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge color={badgeInfo.color as any}>
                      <BadgeIcon className="w-3 h-3 mr-1" />
                      {badgeInfo.label}
                    </Badge>

                    {!isFermee && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleMarkStatut(presence.etudiant, 'PRESENT')}
                          className={`p-2 rounded-lg transition-all ${
                            currentStatut === 'PRESENT'
                              ? 'bg-green-100 text-green-700 ring-2 ring-green-300'
                              : 'hover:bg-gray-100 text-gray-400'
                          }`}
                          title="Présent"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleMarkStatut(presence.etudiant, 'RETARD')}
                          className={`p-2 rounded-lg transition-all ${
                            currentStatut === 'RETARD'
                              ? 'bg-orange-100 text-orange-700 ring-2 ring-orange-300'
                              : 'hover:bg-gray-100 text-gray-400'
                          }`}
                          title="En retard"
                        >
                          <Clock className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleMarkStatut(presence.etudiant, 'ABSENT')}
                          className={`p-2 rounded-lg transition-all ${
                            currentStatut === 'ABSENT'
                              ? 'bg-red-100 text-red-700 ring-2 ring-red-300'
                              : 'hover:bg-gray-100 text-gray-400'
                          }`}
                          title="Absent"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Observations */}
      {feuille.observations && (
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Observations</h3>
          <p className="text-gray-600">{feuille.observations}</p>
        </Card>
      )}
    </div>
  );
}