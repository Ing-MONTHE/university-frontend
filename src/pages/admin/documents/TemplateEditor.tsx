/**
 * Page d'édition de templates avec éditeur de code
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, Eye, Code, FileText, Info } from 'lucide-react';
import { useDocuments } from '@/hooks/useDocuments';
import {
  DocumentType,
  DocumentTypeLabels,
  DocumentTemplateCreate,
} from '@/types/documents.types';
import {
  Button,
  Card,
  Select,
  Input,
  Badge,
  Spinner,
} from '@/components/ui';
import Editor from '@monaco-editor/react';

const AVAILABLE_VARIABLES = [
  '{{etudiant.nom}}',
  '{{etudiant.prenom}}',
  '{{etudiant.matricule}}',
  '{{etudiant.email}}',
  '{{etudiant.telephone}}',
  '{{etudiant.date_naissance}}',
  '{{etudiant.lieu_naissance}}',
  '{{etudiant.nationalite}}',
  '{{inscription.filiere}}',
  '{{inscription.niveau}}',
  '{{inscription.annee_academique}}',
  '{{universite.nom}}',
  '{{universite.adresse}}',
  '{{universite.telephone}}',
  '{{universite.email}}',
  '{{date_generation}}',
  '{{numero_document}}',
];

const DEFAULT_TEMPLATE = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{type_document}}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 40px auto;
            padding: 20px;
            line-height: 1.6;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
        }
        .content {
            margin: 30px 0;
        }
        .footer {
            margin-top: 60px;
            text-align: right;
        }
        .signature {
            margin-top: 80px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{universite.nom}}</h1>
        <p>{{universite.adresse}}</p>
        <p>Tél: {{universite.telephone}} | Email: {{universite.email}}</p>
    </div>
    
    <div class="content">
        <h2 style="text-align: center;">ATTESTATION DE SCOLARITÉ</h2>
        <p style="text-align: right;">N° {{numero_document}}</p>
        <p style="text-align: right;">Le {{date_generation}}</p>
        
        <p style="margin-top: 30px;">
            Le Directeur de {{universite.nom}} certifie que :
        </p>
        
        <p style="margin-left: 40px; margin-top: 20px;">
            <strong>{{etudiant.prenom}} {{etudiant.nom}}</strong><br>
            Matricule : {{etudiant.matricule}}<br>
            Né(e) le {{etudiant.date_naissance}} à {{etudiant.lieu_naissance}}<br>
            Nationalité : {{etudiant.nationalite}}
        </p>
        
        <p style="margin-top: 20px;">
            Est régulièrement inscrit(e) dans notre établissement au titre de l'année académique 
            <strong>{{inscription.annee_academique}}</strong> en <strong>{{inscription.filiere}}</strong>, 
            niveau <strong>{{inscription.niveau}}</strong>.
        </p>
        
        <p style="margin-top: 20px;">
            Cette attestation est délivrée à l'intéressé(e) pour servir et valoir ce que de droit.
        </p>
    </div>
    
    <div class="footer">
        <div class="signature">
            <p>Le Directeur</p>
            <p style="margin-top: 60px;">_____________________</p>
        </div>
    </div>
</body>
</html>`;

export default function TemplateEditor() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  
  const {
    getTemplateById,
    createTemplate,
    updateTemplate,
    previewTemplate,
    loading
  } = useDocuments();
  
  const [typeDocument, setTypeDocument] = useState<DocumentType | ''>('');
  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');
  const [contenuHtml, setContenuHtml] = useState(DEFAULT_TEMPLATE);
  const [estActif, setEstActif] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  const [loadingPreview, setLoadingPreview] = useState(false);

  useEffect(() => {
    if (isEditMode && id) {
      loadTemplate(parseInt(id));
    }
  }, [id]);

  const loadTemplate = async (templateId: number) => {
    try {
      const template = await getTemplateById(templateId);
      setTypeDocument(template.type_document);
      setNom(template.nom);
      setDescription(template.description || '');
      setContenuHtml(template.contenu_html);
      setEstActif(template.est_actif);
    } catch (err) {
      console.error('Erreur chargement template:', err);
      alert('Erreur lors du chargement du template');
    }
  };

  const handleSave = async () => {
    if (!typeDocument || !nom || !contenuHtml) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      const data: DocumentTemplateCreate = {
        type_document: typeDocument,
        nom,
        description: description || undefined,
        contenu_html: contenuHtml,
        est_actif: estActif,
      };

      if (isEditMode && id) {
        await updateTemplate(parseInt(id), data);
        alert('Template mis à jour avec succès !');
      } else {
        await createTemplate(data);
        alert('Template créé avec succès !');
      }
      
      navigate('/admin/documents/templates');
    } catch (err) {
      console.error('Erreur sauvegarde template:', err);
      alert('Erreur lors de la sauvegarde du template');
    }
  };

  const handlePreview = async () => {
    if (!isEditMode || !id) {
      // Preview local
      setPreviewHtml(contenuHtml);
      setShowPreview(true);
      return;
    }

    setLoadingPreview(true);
    try {
      const result = await previewTemplate(parseInt(id));
      setPreviewHtml(result.html);
      setShowPreview(true);
    } catch (err) {
      console.error('Erreur preview:', err);
      // Fallback vers preview local
      setPreviewHtml(contenuHtml);
      setShowPreview(true);
    } finally {
      setLoadingPreview(false);
    }
  };

  const insertVariable = (variable: string) => {
    setContenuHtml(prev => prev + variable);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditMode ? 'Modifier le template' : 'Nouveau template'}
          </h1>
          <p className="text-gray-600 mt-1">Créez ou modifiez un modèle de document</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handlePreview}
            disabled={loadingPreview}
          >
            <Eye className="w-4 h-4 mr-2" />
            {loadingPreview ? 'Chargement...' : 'Prévisualiser'}
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6">
            <h2 className="font-semibold text-lg mb-4">Configuration</h2>
            
            <div className="space-y-4">
              <Select
                label="Type de document *"
                value={typeDocument}
                onChange={(value) => setTypeDocument(value as DocumentType)}
                options={[
                  { value: '', label: 'Sélectionner...' },
                  ...Object.entries(DocumentTypeLabels).map(([key, label]) => ({
                    value: key,
                    label,
                  })),
                ]}
              />

              <Input
                label="Nom du template *"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Ex: Attestation Scolarité 2024"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Description optionnelle..."
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="estActif"
                  checked={estActif}
                  onChange={(e) => setEstActif(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="estActif" className="text-sm font-medium">
                  Template actif
                </label>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Info className="w-5 h-5" />
              Variables disponibles
            </h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {AVAILABLE_VARIABLES.map((variable) => (
                <button
                  key={variable}
                  onClick={() => insertVariable(variable)}
                  className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded border border-gray-200 transition-colors font-mono"
                >
                  {variable}
                </button>
              ))}
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-900">
                💡 Cliquez sur une variable pour l'insérer dans le code
              </p>
            </div>
          </Card>
        </div>

        {/* Éditeur de code */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <Code className="w-5 h-5" />
                Éditeur HTML/CSS
              </h2>
              <Badge variant="default">HTML</Badge>
            </div>
            
            <div className="border border-gray-300 rounded-lg overflow-hidden" style={{ height: '600px' }}>
              <Editor
                height="100%"
                defaultLanguage="html"
                value={contenuHtml}
                onChange={(value) => setContenuHtml(value || '')}
                theme="vs-light"
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  automaticLayout: true,
                }}
              />
            </div>
          </Card>
        </div>
      </div>

      {/* Modal de prévisualisation */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold text-lg">Prévisualisation</h3>
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                Fermer
              </Button>
            </div>
            <div className="flex-1 overflow-auto p-6">
              <div
                className="border border-gray-200 rounded-lg p-8 bg-white"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}