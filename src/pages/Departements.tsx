import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSitemap } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { departementService, faculteService, enseignantService } from '../services/api';
import ConfirmDialog from '../components/ConfirmDialog';
import Button from '../components/Button';

// INTERFACES

 // Interface pour une faculté
interface Faculte {
    id: number;
    code: string;
    nom: string;
}

 // Interface pour un enseignant (simplifiée)
interface Enseignant {
    id: number;
    matricule: string;
    user: {
        first_name: string;
        last_name: string;
    };
}

 // Interface pour un département
interface Departement {
    id: number;
    code: string;
    nom: string;
    faculte: number | Faculte;
    chef?: number | Enseignant | null;
    created_at: string;
    updated_at: string;
}

const Departements = () => {
  // ÉTATS (useState)
    const [departements, setDepartements] = useState<Departement[]>([]);
    const [facultes, setFacultes] = useState<Faculte[]>([]);
    const [enseignants, setEnseignants] = useState<Enseignant[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDepartement, setEditingDepartement] = useState<Departement | null>(null);
    
    const [formData, setFormData] = useState({
        code: '',
        nom: '',
        faculte: '',
        chef: '',
    });

    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [departementToDelete, setDepartementToDelete] = useState<number | null>(null);

  // CHARGEMENT DES DONNÉES (useEffect)
    useEffect(() => {
        fetchData();
    }, []);

   // Récupérer départements, facultés ET enseignants
    const fetchData = async () => {
        try {
        setLoading(true);
        const [departementsResponse, facultesResponse, enseignantsResponse] = await Promise.all([
            departementService.getAll(),
            faculteService.getAll(),
            enseignantService.getAll(),
        ]);
        
        setDepartements(departementsResponse.data.results || departementsResponse.data || []);
        setFacultes(facultesResponse.data.results || facultesResponse.data || []);
        setEnseignants(enseignantsResponse.data.results || enseignantsResponse.data || []);
        
        } 
        catch (error) {
            console.error('Erreur:', error);
            toast.error('Erreur lors du chargement des données');
        } 
        finally {
            setLoading(false);
        }
    };

  // GESTION DU FORMULAIRE
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
        ...prev,
        [name]: value
        }));
    };

    const handleCreate = () => {
        setEditingDepartement(null);
        setFormData({ code: '', nom: '', faculte: '', chef: '' });
        setIsModalOpen(true);
    };

    const handleEdit = (departement: Departement) => {
        setEditingDepartement(departement);
    
        // Gérer faculte (objet ou ID)
        const faculteId = typeof departement.faculte === 'object' 
        ? departement.faculte.id 
        : departement.faculte;
    
        // Gérer chef (objet, ID, ou null)
        let chefId = '';
        if (departement.chef) {
        chefId = typeof departement.chef === 'object' 
            ? departement.chef.id.toString()
            : departement.chef.toString();
        }
    
        setFormData({
            code: departement.code,
            nom: departement.nom,
            faculte: faculteId.toString(),
            chef: chefId,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.code || !formData.nom || !formData.faculte) {
        toast.error('Le code, le nom et la faculté sont obligatoires');
        return;
        }

        try {
            const dataToSend: any = {
                code: formData.code,
                nom: formData.nom,
                faculte: parseInt(formData.faculte),
            };

            if (formData.chef) {
                dataToSend.chef = parseInt(formData.chef);
            } else {
                dataToSend.chef = null;
            }

            // Ajouter le chef seulement s'il est sélectionné
            if (formData.chef) {
                dataToSend.chef = parseInt(formData.chef);
            }

            if (editingDepartement) {
                await departementService.update(editingDepartement.id, dataToSend);
                toast.success('Département modifié avec succès');
            } else {
                await departementService.create(dataToSend);
                toast.success('Département créé avec succès');
            }

            setIsModalOpen(false);
            fetchData();
        } catch (error: any) {
            console.error('Erreur:', error.response?.data);
            
            const errorData = error.response?.data;
            if (errorData) {
                const errorMessage = Object.values(errorData).flat().join(', ');
                toast.error(errorMessage || 'Une erreur est survenue');
            } else {
                toast.error('Une erreur est survenue');
            }
        }
    };

    // SUPPRESSION
    const handleDelete = (id: number) => {
        setDepartementToDelete(id);
        setShowConfirmDialog(true);
    };

    const confirmDelete = async () => {
        if (!departementToDelete) return;

        try {
            await departementService.delete(departementToDelete);
            toast.success('Département supprimé avec succès');
            fetchData();
            } catch (error: any) {
                console.error('Erreur:', error);
                toast.error('Impossible de supprimer ce département');
            } finally {
                setShowConfirmDialog(false);
                setDepartementToDelete(null);
        }
    };

    // Obtenir le nom de la faculté
    const getFaculteName = (departement: Departement) => {
        if (typeof departement.faculte === 'object') {
            return `${departement.faculte.code} - ${departement.faculte.nom}`;
        }
        const faculte = facultes.find(f => f.id === departement.faculte);
        return faculte ? `${faculte.code} - ${faculte.nom}` : 'N/A';
    };

    // Obtenir le nom du chef de département
    const getChefName = (departement: Departement) => {
        if (!departement.chef) return '-';
        
        if (typeof departement.chef === 'object') {
            return `${departement.chef.user.first_name} ${departement.chef.user.last_name}`;
        }
    
        const enseignant = enseignants.find(e => e.id === departement.chef);
        return enseignant 
        ? `${enseignant.user.first_name} ${enseignant.user.last_name}` : 'N/A';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Chargement...</p>
                </div>
            </div>
        );
    }

    // RENDU
    return (
        <div className="space-y-6">
            {/* En-tête */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Départements</h1>
                    <p className="text-gray-600">Gestion des départements par faculté</p>
                </div>
                <Button
                    onClick={handleCreate}
                    variant="primary"
                    icon={FaPlus}
                    >
                    Nouveau département
                </Button>
            </div>

            {/* Statistiques */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FaSitemap className="text-2xl text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Total des départements</p>
                        <p className="text-2xl font-bold text-gray-800">{departements.length}</p>
                    </div>
                </div>
            </div>

            {/* Tableau */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {departements.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Faculté</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chef</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date création</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {departements.map((dept) => (
                                <tr key={dept.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-medium text-gray-900">{dept.code}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-900">{dept.nom}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                        {getFaculteName(dept)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-700">{getChefName(dept)}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(dept.created_at).toLocaleDateString('fr-FR')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <Button
                                            onClick={() => handleEdit(dept)}
                                            variant="info"
                                            size="sm"
                                            icon={FaEdit}
                                        >
                                            Modifier
                                        </Button>
                                        <Button
                                            onClick={() => handleDelete(dept.id)}
                                            variant="danger"
                                            size="sm"
                                            icon={FaTrash}
                                        >
                                            Supprimer
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) 
                : (
                    <div className="text-center py-12">
                        <FaSitemap className="mx-auto text-4xl text-gray-400 mb-4" />
                        <p className="text-gray-600">Aucun département</p>
                        <button onClick={handleCreate} className="mt-4 text-blue-600 hover:text-blue-700">
                        Créer le premier
                        </button>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            {editingDepartement ? 'Modifier' : 'Nouveau'} département
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Faculté */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Faculté <span className="text-red-500">*</span>
                                </label>
                                <select
                                name="faculte"
                                value={formData.faculte}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                                >
                                    <option value="">Sélectionnez une faculté</option>
                                    {facultes.map((fac) => (
                                        <option key={fac.id} value={fac.id}>
                                        {fac.code} - {fac.nom}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Code */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Code <span className="text-red-500">*</span>
                                </label>
                                <input
                                type="text"
                                name="code"
                                value={formData.code}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Ex: DINF"
                                required
                                />
                            </div>

                            {/* Nom */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nom <span className="text-red-500">*</span>
                                </label>
                                <input
                                type="text"
                                name="nom"
                                value={formData.nom}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Ex: Département d'Informatique"
                                required
                                />
                            </div>

                            {/* Chef de département */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Chef de département <span className="text-gray-400">(Optionnel)</span>
                                </label>
                                <select
                                name="chef"
                                value={formData.chef}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="">Aucun chef assigné</option>
                                    {enseignants.map((ens) => (
                                        <option key={ens.id} value={ens.id}>
                                            {ens.matricule} - {ens.user.first_name} {ens.user.last_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Boutons */}
                            <div className="flex space-x-3 pt-4">
                                <Button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    variant="secondary"
                                    fullWidth
                                >
                                    Annuler
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    fullWidth
                                >
                                    {editingDepartement ? 'Modifier' : 'Créer'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Confirmation */}
            <ConfirmDialog
                isOpen={showConfirmDialog}
                title="Supprimer le département"
                message="Êtes-vous sûr ? Cette action est irréversible."
                confirmText="Supprimer"
                cancelText="Annuler"
                type="danger"
                onConfirm={confirmDelete}
                onCancel={() => {
                    setShowConfirmDialog(false);
                    setDepartementToDelete(null);
                }}
            />
        </div>
    );
};

export default Departements;