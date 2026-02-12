/**
 * Page: AttendanceForm.tsx
 * Formulaire de création de feuille de présence
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useFeuillesPresence } from '@/hooks/useAttendance';
import { CreateFeuillePresenceDTO } from '@/types/attendance.types';
import { Button, Card, Input, Select } from '@/components/ui';
import { Breadcrumb, BreadcrumbItem } from '@/components/ui/Breadcrumb';
import { DatePicker } from '@/components/ui/DatePicker';

export default function AttendanceForm() {
  const navigate = useNavigate();
  const { createFeuille, isCreating } = useFeuillesPresence();

  const [formData, setFormData] = useState<CreateFeuillePresenceDTO>({
    cours: 0,
    date_cours: '',
    heure_debut: '',
    heure_fin: '',
    observations: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  /**
   * Validation du formulaire
   */
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.cours) {
      newErrors.cours = 'Le cours est requis';
    }
    if (!formData.date_cours) {
      newErrors.date_cours = 'La date est requise';
    }
    if (!formData.heure_debut) {
      newErrors.heure_debut = 'L\'heure de début est requise';
    }
    if (!formData.heure_fin) {
      newErrors.heure_fin = 'L\'heure de fin est requise';
    }
    if (formData.heure_debut && formData.heure_fin && formData.heure_fin <= formData.heure_debut) {
      newErrors.heure_fin = 'L\'heure de fin doit être après l\'heure de début';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Soumettre le formulaire
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    createFeuille(formData, {
      onSuccess: (data) => {
        navigate(`/admin/attendance/${data.id}`);
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbItem label="Présences" href="/admin/attendance" />
        <BreadcrumbItem label="Nouvelle feuille" />
      </Breadcrumb>

      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/attendance')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Créer une feuille de présence
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              La liste des étudiants sera générée automatiquement
            </p>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit}>
        <Card className="p-6">
          <div className="space-y-6">
            {/* Cours */}
            <Select
              label="Cours *"
              name="cours"
              value={formData.cours}
              onChange={(e) =>
                setFormData({ ...formData, cours: parseInt(e.target.value) })
              }
              error={errors.cours}
              required
              options={[
                { value: '', label: 'Sélectionner un cours' },
                // TODO: Charger la liste des cours depuis l'API
              ]}
              hint="Sélectionnez le cours pour lequel créer la feuille"
            />

            {/* Date */}
            <DatePicker
              label="Date du cours *"
              value={formData.date_cours}
              onChange={(value) =>
                setFormData({ ...formData, date_cours: value })
              }
              error={errors.date_cours}
              required
            />

            {/* Heures */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Heure de début *"
                type="time"
                value={formData.heure_debut}
                onChange={(e) =>
                  setFormData({ ...formData, heure_debut: e.target.value })
                }
                error={errors.heure_debut}
                required
              />

              <Input
                label="Heure de fin *"
                type="time"
                value={formData.heure_fin}
                onChange={(e) =>
                  setFormData({ ...formData, heure_fin: e.target.value })
                }
                error={errors.heure_fin}
                required
              />
            </div>

            {/* Observations */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observations
              </label>
              <textarea
                rows={4}
                value={formData.observations}
                onChange={(e) =>
                  setFormData({ ...formData, observations: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Notes ou remarques sur le cours..."
              />
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/attendance')}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={isCreating}>
            <Save className="w-4 h-4 mr-2" />
            {isCreating ? 'Création...' : 'Créer la feuille'}
          </Button>
        </div>
      </form>
    </div>
  );
}