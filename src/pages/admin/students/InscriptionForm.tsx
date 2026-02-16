import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Save, X } from 'lucide-react';
import { useCreateInscription } from '@/hooks/useStudents';
import { useStudents } from '@/hooks/useStudents';
import { useFilieres } from '@/hooks/useFilieres';
import { useAnneeAcademiques } from '@/hooks/useAnneeAcademiques';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import type { InscriptionCreate } from '@/types/student.types';

const STATUT_PAIEMENT_OPTIONS = [
  { value: 'IMPAYE', label: 'Impayé' },
  { value: 'PARTIEL', label: 'Paiement partiel' },
  { value: 'COMPLET', label: 'Paiement complet' },
];

const NIVEAU_OPTIONS = [
  { value: 1, label: 'Niveau 1' },
  { value: 2, label: 'Niveau 2' },
  { value: 3, label: 'Niveau 3' },
  { value: 4, label: 'Niveau 4' },
  { value: 5, label: 'Niveau 5' },
];

export default function InscriptionForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const createInscription = useCreateInscription();
  
  const { data: etudiants } = useStudents({ page_size: 1000 });
  const { data: filieres } = useFilieres({ page_size: 100 });
  const { data: anneesAcademiques } = useAnneeAcademiques({ page_size: 50 });

  const [formData, setFormData] = useState<InscriptionCreate>({
    etudiant_id: Number(searchParams.get('etudiant')) || 0,
    filiere_id: 0,
    annee_academique_id: 0,
    niveau: 1,
    montant_inscription: 0,
    montant_paye: 0,
    statut_paiement: 'IMPAYE',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const anneeActive = anneesAcademiques?.results.find(a => a.statut === 'ACTIVE');
    if (anneeActive && formData.annee_academique_id === 0) {
      setFormData(prev => ({ ...prev, annee_academique_id: anneeActive.id }));
    }
  }, [anneesAcademiques, formData.annee_academique_id]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.etudiant_id) newErrors.etudiant_id = 'Sélectionnez un étudiant';
    if (!formData.filiere_id) newErrors.filiere_id = 'Sélectionnez une filière';
    if (!formData.annee_academique_id) newErrors.annee_academique_id = 'Sélectionnez une année académique';
    if (!formData.montant_inscription || formData.montant_inscription <= 0) {
      newErrors.montant_inscription = 'Montant invalide';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await createInscription.mutateAsync(formData);
      const studentId = searchParams.get('etudiant');
      if (studentId) {
        navigate(`/admin/students/${studentId}`);
      } else {
        navigate('/admin/students');
      }
    } catch (error) {
      console.error('Erreur inscription:', error);
    }
  };

  const etudiantOptions = etudiants?.results.map(e => ({
    value: e.id,
    label: `${e.matricule} - ${e.nom} ${e.prenom}`,
  })) || [];

  const filiereOptions = filieres?.results.map(f => ({
    value: f.id,
    label: `${f.code} - ${f.nom}`,
  })) || [];

  const anneeOptions = anneesAcademiques?.results.map(a => ({
    value: a.id,
    label: a.annee,
  })) || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Nouvelle Inscription</h1>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          <X className="w-4 h-4 mr-2" />
          Annuler
        </Button>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div className="grid grid-cols-2 gap-6">
            <Select
              label="Étudiant *"
              options={etudiantOptions}
              value={formData.etudiant_id}
              onChange={(value) => setFormData({ ...formData, etudiant_id: Number(value) })}
              error={errors.etudiant_id}
              searchable
            />

            <Select
              label="Filière *"
              options={filiereOptions}
              value={formData.filiere_id}
              onChange={(value) => setFormData({ ...formData, filiere_id: Number(value) })}
              error={errors.filiere_id}
              searchable
            />

            <Select
              label="Année Académique *"
              options={anneeOptions}
              value={formData.annee_academique_id}
              onChange={(value) => setFormData({ ...formData, annee_academique_id: Number(value) })}
              error={errors.annee_academique_id}
            />

            <Select
              label="Niveau *"
              options={NIVEAU_OPTIONS}
              value={formData.niveau}
              onChange={(value) => setFormData({ ...formData, niveau: Number(value) })}
            />

            <Input
              label="Montant Inscription (FCFA) *"
              type="number"
              value={formData.montant_inscription}
              onChange={(e) => setFormData({ ...formData, montant_inscription: Number(e.target.value) })}
              error={errors.montant_inscription}
            />

            <Input
              label="Montant Payé (FCFA)"
              type="number"
              value={formData.montant_paye}
              onChange={(e) => setFormData({ ...formData, montant_paye: Number(e.target.value) })}
            />

            <Select
              label="Statut Paiement"
              options={STATUT_PAIEMENT_OPTIONS}
              value={formData.statut_paiement}
              onChange={(value) => setFormData({ ...formData, statut_paiement: value as any })}
            />
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
              Annuler
            </Button>
            <Button type="submit" disabled={createInscription.isPending}>
              <Save className="w-4 h-4 mr-2" />
              {createInscription.isPending ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}