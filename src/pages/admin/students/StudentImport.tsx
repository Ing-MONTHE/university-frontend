// Import d'étudiants via CSV

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Download, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useImportStudentsCSV } from '../../../hooks/useStudents';
import studentApi from '../../../api/student.api';

const StudentImport: React.FC = () => {
  const navigate = useNavigate();
  const importCSV = useImportStudentsCSV();

  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [importResult, setImportResult] = useState<{
    crees: number;
    doublons: number;
    erreurs: Array<{ ligne: number; erreur: string }>;
    total_lignes: number;
  } | null>(null);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'text/csv') {
      setFile(droppedFile);
      setImportResult(null);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImportResult(null);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    try {
      const result = await importCSV.mutateAsync(file);
      setImportResult(result);
    } catch (error) {
      console.error('Erreur lors de l\'import:', error);
    }
  };

  const handleDownloadTemplate = () => {
    studentApi.downloadCSVTemplate();
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
        <h1 className="text-3xl font-bold text-gray-900">Import CSV d'étudiants</h1>
        <p className="text-gray-600 mt-2">
          Importez plusieurs étudiants à la fois via un fichier CSV
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Instructions */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Instructions</h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">1. Télécharger le template</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Téléchargez le fichier CSV template avec les colonnes correctes
                </p>
                <button
                  onClick={handleDownloadTemplate}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full justify-center"
                >
                  <Download className="w-4 h-4" />
                  Télécharger template
                </button>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">2. Remplir les données</h3>
                <p className="text-sm text-gray-600">
                  Remplissez le fichier CSV avec les informations des étudiants
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">3. Importer</h3>
                <p className="text-sm text-gray-600">
                  Glissez-déposez ou sélectionnez votre fichier CSV pour l'importer
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="text-sm font-medium text-yellow-800 mb-2">Format requis</h4>
              <ul className="text-xs text-yellow-700 space-y-1">
                <li>• Fichier CSV encodé en UTF-8</li>
                <li>• Email unique pour chaque étudiant</li>
                <li>• Format de date: YYYY-MM-DD</li>
                <li>• Téléphone au format international</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Zone d'import */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Importer le fichier</h2>

            {/* Zone drag & drop */}
            <div
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                isDragging
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                Glissez-déposez votre fichier CSV ici
              </p>
              <p className="text-sm text-gray-600 mb-4">ou</p>
              <label className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
                <Upload className="w-4 h-4" />
                Sélectionner un fichier
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Fichier sélectionné */}
            {file && (
              <div className="mt-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Upload className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-600">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setFile(null);
                        setImportResult(null);
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleImport}
                  disabled={importCSV.isPending}
                  className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {importCSV.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Import en cours...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Importer
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Résultats de l'import */}
            {importResult && (
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Résultats de l'import</h3>

                {/* Résumé */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                      <div>
                        <p className="text-2xl font-bold text-green-900">{importResult.crees}</p>
                        <p className="text-sm text-green-600">Créés</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-8 h-8 text-orange-600" />
                      <div>
                        <p className="text-2xl font-bold text-orange-900">{importResult.doublons}</p>
                        <p className="text-sm text-orange-600">Doublons</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <XCircle className="w-8 h-8 text-red-600" />
                      <div>
                        <p className="text-2xl font-bold text-red-900">{importResult.erreurs.length}</p>
                        <p className="text-sm text-red-600">Erreurs</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Liste des erreurs */}
                {importResult.erreurs.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-red-900 mb-3">
                      Détails des erreurs
                    </h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {importResult.erreurs.map((erreur, index) => (
                        <div key={index} className="text-sm text-red-800 bg-white rounded p-2">
                          <span className="font-medium">Ligne {erreur.ligne}:</span> {erreur.erreur}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Succès message */}
                {importResult.erreurs.length === 0 && importResult.crees > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <p className="text-green-800">
                        Import réussi ! {importResult.crees} étudiant(s) ont été créés avec succès.
                      </p>
                    </div>
                  </div>
                )}

                {/* Boutons d'action */}
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setFile(null);
                      setImportResult(null);
                    }}
                    className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Importer un autre fichier
                  </button>
                  <button
                    onClick={() => navigate('/admin/students')}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Voir la liste des étudiants
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentImport;
