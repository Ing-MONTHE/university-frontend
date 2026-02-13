/**
 * Page Session de Délibération ⭐
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, CheckCircle, Download } from 'lucide-react';
import { useForm } from 'react-hook-form';
import {
  useSessionDeliberation,
  useCreateSessionDeliberation,
  useUpdateDecisionJury,
  useValiderSession,
  useCloturerSession,
  useGenererPVDeliberation,
} from '@/hooks/useEvaluations';
import { useFilieres } from '@/hooks/useFilieres';
import { useAnneeAcademiques } from '@/hooks/useAnneeAcademiques';
import { useTeachers } from '@/hooks/useTeachers';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import { DECISION_JURY_CHOICES, MENTION_CHOICES } from '@/types/evaluation.types';
import type { SessionDeliberationCreate, DecisionJuryUpdate } from '@/types/evaluation.types';

export default function DeliberationSession() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const { data: session, isLoading } = useSessionDeliberation(Number(id));
  const { data: filieres } = useFilieres({ page_size: 100 });
  const { data: annees } = useAnneeAcademiques();
  const { data: enseignants } = useTeachers({ page_size: 1000 });
  
  const createMutation = useCreateSessionDeliberation();
  const updateDecision = useUpdateDecisionJury();
  const validerMutation = useValiderSession();
  const cloturerMutation = useCloturerSession();
  const genererPV = useGenererPVDeliberation();

  const { register, handleSubmit, formState: { errors } } = useForm<SessionDeliberationCreate>();

  const [decisions, setDecisions] = useState<Record<number, DecisionJuryUpdate>>({});

  const onSubmit = async (data: SessionDeliberationCreate) => {
    try {
      await createMutation.mutateAsync(data);
      navigate('/admin/evaluations/deliberations');
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  const handleDecisionChange = (decisionId: number, field: keyof DecisionJuryUpdate, value: any) => {
    setDecisions(prev => ({
      ...prev,
      [decisionId]: {
        ...prev[decisionId],
        [field]: value,
      },
    }));
  };

  const handleSaveDecision = async (decisionId: number) => {
    if (decisions[decisionId]) {
      await updateDecision.mutateAsync({
        id: decisionId,
        data: decisions[decisionId],
      });
    }
  };

  const handleValider = async () => {
    if (id) {
      await validerMutation.mutateAsync(Number(id));
    }
  };

  const handleCloturer = async () => {
    if (id) {
      await cloturerMutation.mutateAsync(Number(id));
    }
  };

  const handleGenererPV = () => {
    if (id) {
      genererPV.mutate(Number(id));
    }
  };

  if (isLoading && isEdit) {
    return <div className="flex justify-center items-center h-64"><Spinner size="lg" /></div>;
  }

  if (!isEdit) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="secondary" onClick={() => navigate('/admin/evaluations/deliberations')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-2xl font-bold">Nouvelle Session de Délibération</h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Select label="Filière" {...register('filiere_id', { required: true, valueAsNumber: true })}>
                <option value="">Sélectionner</option>
                {filieres?.results.map(f => (
                  <option key={f.id} value={f.id}>{f.code} - {f.nom}</option>
                ))}
              </Select>

              <Input label="Niveau" {...register('niveau', { required: true })} placeholder="Ex: L3" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Select label="Semestre" {...register('semestre', { required: true, valueAsNumber: true })}>
                <option value={1}>Semestre 1</option>
                <option value={2}>Semestre 2</option>
              </Select>

              <Select label="Année académique" {...register('annee_academique_id', { required: true, valueAsNumber: true })}>
                <option value="">Sélectionner</option>
                {annees?.results.map(a => (
                  <option key={a.id} value={a.id}>{a.code}</option>
                ))}
              </Select>

              <Input label="Date" type="date" {...register('date_session', { required: true })} />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Création...' : 'Créer la session'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="secondary" onClick={() => navigate('/admin/evaluations/deliberations')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Session de Délibération</h1>
              <p className="text-gray-600">
                {session?.filiere_details?.nom} - Semestre {session?.semestre}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {session?.statut === 'BROUILLON' && (
              <Button onClick={handleValider}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Valider
              </Button>
            )}
            {session?.statut === 'VALIDEE' && (
              <Button onClick={handleCloturer} variant="secondary">
                Clôturer
              </Button>
            )}
            <Button onClick={handleGenererPV} variant="secondary">
              <Download className="w-4 h-4 mr-2" />
              Générer PV
            </Button>
          </div>
        </div>

        <div className="flex gap-3">
          <Badge variant={session?.statut === 'CLOTUREE' ? 'success' : 'warning'}>
            {session?.statut}
          </Badge>
          <Badge variant="info">
            {session?.etudiants_traites || 0}/{session?.total_etudiants || 0} traités
          </Badge>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Étudiant</th>
              <th className="px-6 py-3 text-center">Moyenne</th>
              <th className="px-6 py-3 text-center">Crédits</th>
              <th className="px-6 py-3 text-center">Décision</th>
              <th className="px-6 py-3 text-center">Mention</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {session?.decisions?.map((decision) => (
              <tr key={decision.id}>
                <td className="px-6 py-4">
                  {decision.etudiant_details?.nom} {decision.etudiant_details?.prenom}
                  <div className="text-sm text-gray-500">{decision.etudiant_details?.matricule}</div>
                </td>
                <td className="px-6 py-4 text-center font-semibold">
                  {decision.moyenne_generale.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-center">{decision.credits_obtenus}</td>
                <td className="px-6 py-4 text-center">
                  <select
                    value={decisions[decision.id]?.decision || decision.decision}
                    onChange={(e) => handleDecisionChange(decision.id, 'decision', e.target.value)}
                    className="px-3 py-1 border rounded"
                  >
                    {DECISION_JURY_CHOICES.map(d => (
                      <option key={d.value} value={d.value}>{d.label}</option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 text-center">
                  <select
                    value={decisions[decision.id]?.mention || decision.mention}
                    onChange={(e) => handleDecisionChange(decision.id, 'mention', e.target.value)}
                    className="px-3 py-1 border rounded"
                  >
                    <option value="">Aucune</option>
                    {MENTION_CHOICES.map(m => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 text-center">
                  <Button size="sm" onClick={() => handleSaveDecision(decision.id)}>
                    <Save className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}