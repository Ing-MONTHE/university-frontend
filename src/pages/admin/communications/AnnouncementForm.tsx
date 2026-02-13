import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Send } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useCommunications } from '@/hooks/useCommunications';
import type { AnnonceFormData, StatutAnnonce, TypeAnnonce } from '@/types/communications.types';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { Select } from '@/components/ui';
import { Card } from '@/components/ui';
import { Spinner } from '@/components/ui';
import { FileUpload } from '@/components/ui/FileUpload';

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ color: [] }, { background: [] }],
    ['link'],
    ['clean'],
  ],
};

const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'list',
  'bullet',
  'color',
  'background',
  'link',
];

export default function AnnouncementForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    annonce,
    loading,
    error,
    fetchAnnonceById,
    handleCreateAnnonce,
    handleUpdateAnnonce,
    clearError,
  } = useCommunications();

  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<AnnonceFormData>({
    titre: '',
    contenu: '',
    type_annonce: 'GENERALE',
    est_prioritaire: false,
    statut: 'BROUILLON',
    date_publication: '',
    date_expiration: '',
    piece_jointe: null,
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditMode && id) {
      fetchAnnonceById(Number(id));
    }
  }, [id, isEditMode]);

  useEffect(() => {
    if (isEditMode && annonce) {
      setFormData({
        titre: annonce.titre,
        contenu: annonce.contenu,
        type_annonce: annonce.type_annonce,
        est_prioritaire: annonce.est_prioritaire,
        statut: annonce.statut,
        date_publication: annonce.date_publication || '',
        date_expiration: annonce.date_expiration || '',
        piece_jointe: null,
      });
    }
  }, [annonce, isEditMode]);

  const handleChange = (field: keyof AnnonceFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (publier: boolean = false) => {
    setSaving(true);
    try {
      const dataToSubmit: AnnonceFormData = {
        ...formData,
        statut: publier ? 'PUBLIEE' : formData.statut,
      };

      if (isEditMode && id) {
        await handleUpdateAnnonce(Number(id), dataToSubmit);
      } else {
        await handleCreateAnnonce(dataToSubmit);
      }
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/admin/communications/announcements')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditMode ? 'Modifier l\'annonce' : 'Nouvelle annonce'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEditMode ? 'Modifier les informations de l\'annonce' : 'Créer une nouvelle annonce'}
            </p>
          </div>
        </div>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button onClick={clearError} className="text-red-700 hover:text-red-900">
            ×
          </button>
        </div>
      )}

      {/* Formulaire */}
      {loading && isEditMode ? (
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <Card className="p-6">
          <form className="space-y-6">
            {/* Titre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={formData.titre}
                onChange={(e) => handleChange('titre', e.target.value)}
                placeholder="Titre de l'annonce"
                required
              />
            </div>

            {/* Contenu */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contenu <span className="text-red-500">*</span>
              </label>
              <div className="border rounded-lg overflow-hidden">
                <ReactQuill
                  theme="snow"
                  value={formData.contenu}
                  onChange={(value) => handleChange('contenu', value)}
                  modules={modules}
                  formats={formats}
                  placeholder="Rédigez votre annonce ici..."
                  style={{ minHeight: '300px' }}
                />
              </div>
            </div>

            {/* Type et Priorité */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type d'annonce <span className="text-red-500">*</span>
                </label>
                <Select
                  value={formData.type_annonce}
                  onChange={(e) => handleChange('type_annonce', e.target.value as TypeAnnonce)}
                  required
                >
                  <option value="GENERALE">Générale</option>
                  <option value="ETUDIANTS">Étudiants</option>
                  <option value="ENSEIGNANTS">Enseignants</option>
                  <option value="ADMINISTRATION">Administration</option>
                  <option value="URGENTE">Urgente</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                <Select
                  value={formData.statut}
                  onChange={(e) => handleChange('statut', e.target.value as StatutAnnonce)}
                >
                  <option value="BROUILLON">Brouillon</option>
                  <option value="PUBLIEE">Publiée</option>
                  <option value="ARCHIVEE">Archivée</option>
                </Select>
              </div>
            </div>

            {/* Prioritaire */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="est_prioritaire"
                checked={formData.est_prioritaire}
                onChange={(e) => handleChange('est_prioritaire', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="est_prioritaire" className="text-sm font-medium text-gray-700">
                Marquer comme prioritaire (épinglé en haut)
              </label>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date de publication</label>
                <Input
                  type="datetime-local"
                  value={formData.date_publication}
                  onChange={(e) => handleChange('date_publication', e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">Laisser vide pour publication immédiate</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date d'expiration</label>
                <Input
                  type="datetime-local"
                  value={formData.date_expiration}
                  onChange={(e) => handleChange('date_expiration', e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">Optionnel</p>
              </div>
            </div>

            {/* Pièce jointe */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pièce jointe</label>
              <FileUpload
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                maxSize={5 * 1024 * 1024}
                onFileSelect={(file) => handleChange('piece_jointe', file)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Formats acceptés : PDF, Word, Image (max 5 MB)
              </p>
              {isEditMode && annonce?.piece_jointe && (
                <p className="text-sm text-blue-600 mt-2">
                  Fichier actuel : {annonce.piece_jointe.split('/').pop()}
                </p>
              )}
            </div>

            {/* Boutons d'action */}
            <div className="flex items-center gap-3 pt-6 border-t">
              <Button
                type="button"
                onClick={() => navigate('/admin/communications/announcements')}
                variant="outline"
              >
                Annuler
              </Button>
              <Button
                type="button"
                onClick={() => handleSubmit(false)}
                disabled={saving || !formData.titre || !formData.contenu}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
              {formData.statut === 'BROUILLON' && (
                <Button
                  type="button"
                  onClick={() => handleSubmit(true)}
                  disabled={saving || !formData.titre || !formData.contenu}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  <Send className="w-4 h-4" />
                  Enregistrer et publier
                </Button>
              )}
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}