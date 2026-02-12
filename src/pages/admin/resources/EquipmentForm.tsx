import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { useEquipment } from '@/hooks/useResources';
import { resourcesApi } from '@/api/resources.api';
import type { EquipmentFormData } from '@/types/resources.types';
import { EQUIPMENT_CATEGORIES, EQUIPMENT_STATUSES } from '@/types/resources.types';
import { Card } from '@/components/ui';
import { Spinner } from '@/components/ui';
import { Alert, AlertDescription } from '@/components/ui/Alert';

export default function EquipmentForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const { equipment, loading: loadingEquipment } = useEquipment(id ? parseInt(id) : null);

  const [formData, setFormData] = useState<EquipmentFormData>({
    nom: '',
    reference: '',
    categorie: 'INFORMATIQUE',
    quantite_totale: 1,
    reservable: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (equipment) {
      setFormData({
        nom: equipment.nom,
        description: equipment.description,
        reference: equipment.reference,
        categorie: equipment.categorie,
        etat: equipment.etat,
        salle: equipment.salle,
        quantite_disponible: equipment.quantite_disponible,
        quantite_totale: equipment.quantite_totale,
        date_acquisition: equipment.date_acquisition || undefined,
        valeur_acquisition: equipment.valeur_acquisition || undefined,
        dernier_entretien: equipment.dernier_entretien || undefined,
        prochain_entretien: equipment.prochain_entretien || undefined,
        reservable: equipment.reservable,
        observations: equipment.observations,
      });
    }
  }, [equipment]);

  const handleChange = (field: keyof EquipmentFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEdit && id) {
        await resourcesApi.updateEquipment(parseInt(id), formData);
      } else {
        await resourcesApi.createEquipment(formData);
      }
      navigate('/admin/resources/equipments');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  if (loadingEquipment) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/resources/equipments')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isEdit ? 'Modifier l\'équipement' : 'Nouvel équipement'}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {isEdit ? 'Modifiez les informations de l\'équipement' : 'Ajoutez un nouvel équipement à l\'inventaire'}
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="error" onClose={() => setError(null)}>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <div className="p-6 space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Informations générales
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.nom}
                  onChange={(e) => handleChange('nom', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Référence <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.reference}
                  onChange={(e) => handleChange('reference', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Catégorie <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.categorie}
                  onChange={(e) => handleChange('categorie', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  {EQUIPMENT_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  État
                </label>
                <select
                  value={formData.etat || 'DISPONIBLE'}
                  onChange={(e) => handleChange('etat', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  {EQUIPMENT_STATUSES.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6 space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Quantité et emplacement
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Quantité totale <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.quantite_totale}
                  onChange={(e) => handleChange('quantite_totale', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Quantité disponible
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.quantite_disponible || formData.quantite_totale}
                  onChange={(e) => handleChange('quantite_disponible', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.reservable}
                    onChange={(e) => handleChange('reservable', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Équipement réservable
                  </span>
                </label>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6 space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Acquisition et maintenance
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date d'acquisition
                </label>
                <input
                  type="date"
                  value={formData.date_acquisition || ''}
                  onChange={(e) => handleChange('date_acquisition', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Valeur d'acquisition (FCFA)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.valeur_acquisition || ''}
                  onChange={(e) => handleChange('valeur_acquisition', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Dernier entretien
                </label>
                <input
                  type="date"
                  value={formData.dernier_entretien || ''}
                  onChange={(e) => handleChange('dernier_entretien', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Prochain entretien
                </label>
                <input
                  type="date"
                  value={formData.prochain_entretien || ''}
                  onChange={(e) => handleChange('prochain_entretien', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Observations
                </label>
                <textarea
                  rows={3}
                  value={formData.observations || ''}
                  onChange={(e) => handleChange('observations', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/resources/equipments')}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <>
                <Spinner size="sm" className="text-white" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Enregistrer
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}