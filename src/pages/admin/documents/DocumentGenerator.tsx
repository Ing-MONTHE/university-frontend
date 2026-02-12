/**
 * Page principale - Générateur de documents
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Send, Users, User, Eye, ChevronRight } from 'lucide-react';
import { useDocuments } from '@/hooks/useDocuments';
import { useStudents } from '@/hooks/useStudents';
import {
  DocumentType,
  DocumentTypeLabels,
  DocumentGenerate,
} from '@/types/documents.types';
import {
  Button,
  Card,
  Select,
  Spinner,
  Badge,
} from '@/components/ui';

type GenerationMode = 'single' | 'multiple';

export default function DocumentGenerator() {
  const navigate = useNavigate();
  const { generateDocument, loading } = useDocuments();
  const { getAllStudents } = useStudents();
  
  const [mode, setMode] = useState<GenerationMode>('single');
  const [step, setStep] = useState(1); // 1: Type, 2: Étudiant(s), 3: Preview, 4: Génération
  
  const [selectedType, setSelectedType] = useState<DocumentType | ''>('');
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [sendEmail, setSendEmail] = useState(true);
  
  const [students, setStudents] = useState<any[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [generationSuccess, setGenerationSuccess] = useState(false);

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = students.filter(s =>
        `${s.nom} ${s.prenom} ${s.matricule}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students);
    }
  }, [searchTerm, students]);

  const loadStudents = async () => {
    try {
      const result = await getAllStudents({ page_size: 1000, statut: 'ACTIF' });
      setStudents(result.results);
      setFilteredStudents(result.results);
    } catch (err) {
      console.error('Erreur chargement étudiants:', err);
    }
  };

  const handleGenerate = async () => {
    if (!selectedType) return;
    
    const studentIds = mode === 'single' 
      ? (selectedStudent ? [selectedStudent] : [])
      : selectedStudents;
    
    if (studentIds.length === 0) {
      alert('Veuillez sélectionner au moins un étudiant');
      return;
    }

    try {
      const data: DocumentGenerate = {
        type_document: selectedType,
        etudiant_id: mode === 'single' ? studentIds[0] : studentIds,
        send_email: sendEmail,
      };

      await generateDocument(data);
      setGenerationSuccess(true);
      
      // Redirection après 2 secondes
      setTimeout(() => {
        navigate('/admin/documents');
      }, 2000);
      
    } catch (err) {
      console.error('Erreur génération:', err);
      alert('Erreur lors de la génération du document');
    }
  };

  const toggleStudentSelection = (studentId: number) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const getSelectedStudentDetails = () => {
    if (mode === 'single' && selectedStudent) {
      return students.find(s => s.id === selectedStudent);
    }
    return null;
  };

  const getSelectedStudentsDetails = () => {
    return students.filter(s => selectedStudents.includes(s.id));
  };

  if (generationSuccess) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Document généré !</h2>
          <p className="text-gray-600 mb-6">
            {mode === 'single' 
              ? 'Le document a été généré avec succès.'
              : `${selectedStudents.length} documents ont été générés avec succès.`}
          </p>
          {sendEmail && (
            <Badge variant="success" className="mb-4">Email envoyé ✓</Badge>
          )}
          <p className="text-sm text-gray-500">Redirection en cours...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Générateur de Documents</h1>
        <p className="text-gray-600 mt-1">Créez des documents administratifs pour vos étudiants</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between mb-8">
        {[
          { num: 1, label: 'Type de document' },
          { num: 2, label: 'Sélection étudiant(s)' },
          { num: 3, label: 'Confirmation' },
        ].map((s, idx) => (
          <div key={s.num} className="flex items-center flex-1">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= s.num
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {s.num}
              </div>
              <span className={`text-sm font-medium ${
                step >= s.num ? 'text-gray-900' : 'text-gray-500'
              }`}>
                {s.label}
              </span>
            </div>
            {idx < 2 && (
              <div className={`flex-1 h-0.5 mx-4 ${
                step > s.num ? 'bg-blue-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Sélection du type de document */}
      {step === 1 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Choisissez le type de document</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(DocumentTypeLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedType(key as DocumentType)}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  selectedType === key
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <FileText className={`w-5 h-5 flex-shrink-0 ${
                    selectedType === key ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                  <div>
                    <p className="font-medium text-gray-900">{label}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {getDocumentDescription(key as DocumentType)}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-end mt-6">
            <Button
              onClick={() => setStep(2)}
              disabled={!selectedType}
            >
              Suivant
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      )}

      {/* Step 2: Sélection des étudiants */}
      {step === 2 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Sélectionnez les étudiants</h2>
          
          {/* Mode de sélection */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => {
                setMode('single');
                setSelectedStudents([]);
              }}
              className={`flex-1 p-4 border-2 rounded-lg transition-all ${
                mode === 'single'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <User className={`w-6 h-6 mx-auto mb-2 ${
                mode === 'single' ? 'text-blue-600' : 'text-gray-400'
              }`} />
              <p className="font-medium text-center">Un seul étudiant</p>
            </button>
            
            <button
              onClick={() => {
                setMode('multiple');
                setSelectedStudent(null);
              }}
              className={`flex-1 p-4 border-2 rounded-lg transition-all ${
                mode === 'multiple'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Users className={`w-6 h-6 mx-auto mb-2 ${
                mode === 'multiple' ? 'text-blue-600' : 'text-gray-400'
              }`} />
              <p className="font-medium text-center">Plusieurs étudiants</p>
            </button>
          </div>

          {/* Recherche */}
          <input
            type="text"
            placeholder="Rechercher un étudiant..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
          />

          {/* Liste des étudiants */}
          <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                onClick={() => {
                  if (mode === 'single') {
                    setSelectedStudent(student.id);
                  } else {
                    toggleStudentSelection(student.id);
                  }
                }}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                  (mode === 'single' && selectedStudent === student.id) ||
                  (mode === 'multiple' && selectedStudents.includes(student.id))
                    ? 'bg-blue-50'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{student.nom} {student.prenom}</p>
                    <p className="text-sm text-gray-500">{student.matricule} • {student.email}</p>
                  </div>
                  <input
                    type={mode === 'single' ? 'radio' : 'checkbox'}
                    checked={
                      mode === 'single'
                        ? selectedStudent === student.id
                        : selectedStudents.includes(student.id)
                    }
                    onChange={() => {}}
                    className="w-4 h-4"
                  />
                </div>
              </div>
            ))}
          </div>

          {mode === 'multiple' && selectedStudents.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-900">
                {selectedStudents.length} étudiant(s) sélectionné(s)
              </p>
            </div>
          )}

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={() => setStep(1)}>
              Retour
            </Button>
            <Button
              onClick={() => setStep(3)}
              disabled={
                mode === 'single' ? !selectedStudent : selectedStudents.length === 0
              }
            >
              Suivant
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      )}

      {/* Step 3: Confirmation */}
      {step === 3 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Confirmation</h2>
          
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-700">Type de document</label>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {selectedType && DocumentTypeLabels[selectedType]}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                {mode === 'single' ? 'Étudiant sélectionné' : 'Étudiants sélectionnés'}
              </label>
              <div className="mt-2 space-y-2">
                {mode === 'single' && getSelectedStudentDetails() && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium">
                      {getSelectedStudentDetails()?.nom} {getSelectedStudentDetails()?.prenom}
                    </p>
                    <p className="text-sm text-gray-500">
                      {getSelectedStudentDetails()?.matricule}
                    </p>
                  </div>
                )}
                
                {mode === 'multiple' && getSelectedStudentsDetails().map(student => (
                  <div key={student.id} className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium">{student.nom} {student.prenom}</p>
                    <p className="text-sm text-gray-500">{student.matricule}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="sendEmail"
                checked={sendEmail}
                onChange={(e) => setSendEmail(e.target.checked)}
                className="w-4 h-4 text-blue-600"
              />
              <label htmlFor="sendEmail" className="text-sm font-medium text-gray-700">
                Envoyer le document par email
              </label>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={() => setStep(2)}>
              Retour
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Générer
                </>
              )}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

function getDocumentDescription(type: DocumentType): string {
  const descriptions: Record<DocumentType, string> = {
    [DocumentType.ATTESTATION_SCOLARITE]: 'Certificat prouvant la scolarité actuelle',
    [DocumentType.RELEVE_NOTES]: 'Relevé détaillé des notes obtenues',
    [DocumentType.CERTIFICAT_REUSSITE]: 'Certificat attestant la réussite académique',
    [DocumentType.ATTESTATION_STAGE]: 'Attestation pour stage en entreprise',
    [DocumentType.CARTE_ETUDIANT]: 'Carte d\'identité étudiant officielle',
  };
  return descriptions[type] || '';
}