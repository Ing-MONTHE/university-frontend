import { useEffect, useState } from 'react';
import { Save, Bell, Mail, Smartphone, Settings } from 'lucide-react';
import { useCommunications } from '@/hooks/useCommunications';
import type { PreferenceNotificationFormData, FrequenceDigest } from '@/types/communications.types';
import { Button } from '@/components/ui';
import { Select } from '@/components/ui';
import { Card } from '@/components/ui';
import { Spinner } from '@/components/ui';

export default function PreferencesNotifications() {
  const {
    preferences,
    loading,
    error,
    fetchPreferences,
    handleUpdatePreferences,
    clearError,
  } = useCommunications();

  const [formData, setFormData] = useState<PreferenceNotificationFormData>({
    notif_notes: true,
    notif_absences: true,
    notif_paiements: true,
    notif_bibliotheque: true,
    notif_emploi_temps: true,
    notif_annonces: true,
    notif_messages: true,
    activer_email: true,
    activer_sms: false,
    activer_push: true,
    frequence_digest: 'IMMEDIAT',
  });

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchPreferences();
  }, []);

  useEffect(() => {
    if (preferences) {
      setFormData({
        notif_notes: preferences.notif_notes,
        notif_absences: preferences.notif_absences,
        notif_paiements: preferences.notif_paiements,
        notif_bibliotheque: preferences.notif_bibliotheque,
        notif_emploi_temps: preferences.notif_emploi_temps,
        notif_annonces: preferences.notif_annonces,
        notif_messages: preferences.notif_messages,
        activer_email: preferences.activer_email,
        activer_sms: preferences.activer_sms,
        activer_push: preferences.activer_push,
        frequence_digest: preferences.frequence_digest,
      });
    }
  }, [preferences]);

  const handleChange = (field: keyof PreferenceNotificationFormData, value: boolean | FrequenceDigest) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSuccessMessage(''); // Clear success message on change
  };

  const handleSubmit = async () => {
    setSaving(true);
    setSuccessMessage('');
    try {
      await handleUpdatePreferences(formData);
      setSuccessMessage('Préférences enregistrées avec succès');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Erreur sauvegarde préférences:', err);
    } finally {
      setSaving(false);
    }
  };

  const SwitchInput = ({
    label,
    description,
    checked,
    onChange,
  }: {
    label: string;
    description: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
  }) => (
    <div className="flex items-start justify-between py-4 border-b border-gray-100 last:border-0">
      <div className="flex-1">
        <p className="font-medium text-gray-900">{label}</p>
        <p className="text-sm text-gray-500 mt-0.5">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
    </div>
  );

  return (
    <div className="space-y-6 max-w-4xl">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Préférences de notification</h1>
        <p className="text-gray-600 mt-1">
          Personnalisez les notifications que vous souhaitez recevoir et leurs canaux de diffusion
        </p>
      </div>

      {/* Message de succès */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}

      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button onClick={clearError} className="text-red-700 hover:text-red-900">
            ×
          </button>
        </div>
      )}

      {loading && !preferences ? (
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Types de notifications */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bell className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Types de notifications</h2>
                <p className="text-sm text-gray-500">Choisissez les événements pour lesquels vous souhaitez être notifié</p>
              </div>
            </div>

            <div className="space-y-0">
              <SwitchInput
                label="Notes et évaluations"
                description="Recevoir des notifications lors de la publication de nouvelles notes"
                checked={formData.notif_notes}
                onChange={(checked) => handleChange('notif_notes', checked)}
              />
              <SwitchInput
                label="Absences"
                description="Recevoir des notifications concernant les absences et retards"
                checked={formData.notif_absences}
                onChange={(checked) => handleChange('notif_absences', checked)}
              />
              <SwitchInput
                label="Paiements"
                description="Recevoir des notifications sur les échéances et paiements"
                checked={formData.notif_paiements}
                onChange={(checked) => handleChange('notif_paiements', checked)}
              />
              <SwitchInput
                label="Bibliothèque"
                description="Recevoir des notifications sur les emprunts et retours de livres"
                checked={formData.notif_bibliotheque}
                onChange={(checked) => handleChange('notif_bibliotheque', checked)}
              />
              <SwitchInput
                label="Emploi du temps"
                description="Recevoir des notifications sur les modifications d'emploi du temps"
                checked={formData.notif_emploi_temps}
                onChange={(checked) => handleChange('notif_emploi_temps', checked)}
              />
              <SwitchInput
                label="Annonces"
                description="Recevoir des notifications pour les nouvelles annonces et actualités"
                checked={formData.notif_annonces}
                onChange={(checked) => handleChange('notif_annonces', checked)}
              />
              <SwitchInput
                label="Messages"
                description="Recevoir des notifications pour les nouveaux messages privés"
                checked={formData.notif_messages}
                onChange={(checked) => handleChange('notif_messages', checked)}
              />
            </div>
          </Card>

          {/* Canaux de notification */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Settings className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Canaux de notification</h2>
                <p className="text-sm text-gray-500">Choisissez comment vous souhaitez recevoir les notifications</p>
              </div>
            </div>

            <div className="space-y-0">
              <div className="flex items-start justify-between py-4 border-b border-gray-100">
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Mail className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Notifications par email</p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Recevoir les notifications sur votre adresse email
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer ml-4">
                  <input
                    type="checkbox"
                    checked={formData.activer_email}
                    onChange={(e) => handleChange('activer_email', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-start justify-between py-4 border-b border-gray-100">
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Smartphone className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Notifications par SMS</p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Recevoir les notifications importantes par SMS
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer ml-4">
                  <input
                    type="checkbox"
                    checked={formData.activer_sms}
                    onChange={(e) => handleChange('activer_sms', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-start justify-between py-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Bell className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Notifications Push (Application)</p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Recevoir les notifications directement dans l'application
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer ml-4">
                  <input
                    type="checkbox"
                    checked={formData.activer_push}
                    onChange={(e) => handleChange('activer_push', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </Card>

          {/* Fréquence des emails */}
          {formData.activer_email && (
            <Card className="p-6">
              <div className="mb-4">
                <h2 className="text-lg font-bold text-gray-900">Fréquence des emails</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Choisissez à quelle fréquence vous souhaitez recevoir les notifications par email
                </p>
              </div>

              <Select
                value={formData.frequence_digest}
                onChange={(e) => handleChange('frequence_digest', e.target.value as FrequenceDigest)}
                className="max-w-xs"
              >
                <option value="IMMEDIAT">Immédiat (temps réel)</option>
                <option value="QUOTIDIEN">Digest quotidien (une fois par jour)</option>
                <option value="HEBDOMADAIRE">Digest hebdomadaire (une fois par semaine)</option>
              </Select>
            </Card>
          )}

          {/* Bouton de sauvegarde */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button
              onClick={handleSubmit}
              disabled={saving}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Enregistrement...' : 'Enregistrer les préférences'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}