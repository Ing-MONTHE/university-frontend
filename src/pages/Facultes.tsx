import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaUniversity } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { faculteService } from '../services/api';
import Button from '../components/Button';
import ConfirmDialog from '../components/ConfirmDialog';

 // Interface pour une faculté
interface Faculte {
    id: number;
    code: string;
    nom: string;
    description?: string;
    created_at: string;
    updated_at: string;
}

const Facultes = () => {
    // ÉTATS (useState)
    
    // Liste des facultés
    const [facultes, setFacultes] = useState<Faculte[]>([]);
    
    // État de chargement
    const [loading, setLoading] = useState(true);
    
    // Modal de création/édition ouvert/fermé
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Faculté en cours d'édition (null si création)
    const [editingFaculte, setEditingFaculte] = useState<Faculte | null>(null);
    
    // Données du formulaire
    const [formData, setFormData] = useState({
        code: '',
        nom: '',
        description: '',
    });

    // Dialogue de confirmation de suppression
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [faculteToDelete, setFaculteToDelete] = useState<number | null>(null);

    // CHARGEMENT DES DONNÉES (useEffect)

    // Charger les données au montage du composant
    useEffect(() => {
        fetchFacultes();
    }, []);

   // Récupérer toutes les facultés depuis l'API Django
    const fetchFacultes = async () => {
        try {
            setLoading(true);
            const response = await faculteService.getAll();
            
            // Gérer différents formats de réponse
            setFacultes(response.data.results || response.data || []);
        } catch (error) {
            console.error('Erreur lors du chargement des facultés:', error);
            toast.error('Erreur lors du chargement des facultés');
        } finally {
            // Désactiver le chargement dans tous les cas
            setLoading(false);
        }
    };

    // GESTION DU FORMULAIRE

    // Gérer les changements dans les champs du formulaire
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        // Mettre à jour uniquement le champ modifié
        setFormData(prev => ({
        ...prev, // Copie toutes les propriétés (Spread operator)
        [name]: value // Mettre a jour seulement le champ modifié
        }));
    };

    // Ouvrir le modal de création
    const handleCreate = () => {
        setEditingFaculte(null);
        setFormData({ code: '', nom: '', description: '' });
        setIsModalOpen(true);
    };

    // Ouvrir le modal d'édition avec les données pré-remplies
    const handleEdit = (faculte: Faculte) => {
        setEditingFaculte(faculte);
        setFormData({
            code: faculte.code,
            nom: faculte.nom,
            description: faculte.description || '',
        });
        setIsModalOpen(true);
    };

    // Soumettre le formulaire (création ou modification)
    const handleSubmit = async (e: React.FormEvent) => {
            // Empêcher le rechargement de la page
            e.preventDefault();

            // Validation des champs obligatoires
            if (!formData.code || !formData.nom) {
                toast.error('Le code et le nom sont obligatoires');
            return;
            }

            try {
            if (editingFaculte) {
                // Mode édition : Mise à jour
                await faculteService.update(editingFaculte.id, formData);
                toast.success('Faculté modifiée avec succès');
            } else {
                // Mode création : Nouvelle faculté
                await faculteService.create(formData);
                toast.success('Faculté créée avec succès');
            }

            // Fermer le modal et recharger les données
            setIsModalOpen(false);
            fetchFacultes();
            } catch (error: any) {
                console.error('Erreur lors de la sauvegarde:', error);
      
                // Afficher le message d'erreur de l'API ou un message par défaut
                toast.error(error.response?.data?.detail || 'Une erreur est survenue');
            }
    };

    // GESTION DE LA SUPPRESSION
    // Ouvrir le dialogue de confirmation de suppression
    const handleDelete = (id: number) => {
        setFaculteToDelete(id);
        setShowConfirmDialog(true);
    };

    // Confirmer et exécuter la suppression
    const confirmDelete = async () => {
        if (!faculteToDelete) return;

        try {
            await faculteService.delete(faculteToDelete);
            toast.success('Faculté supprimée avec succès');
            fetchFacultes();
        } catch (error: any) {
            console.error('Erreur lors de la suppression:', error);
            toast.error(error.response?.data?.detail || 'Impossible de supprimer cette faculté');
        } finally {
            // Fermer le dialogue et réinitialiser
            setShowConfirmDialog(false);
            setFaculteToDelete(null);
        }
    };

    // AFFICHAGE CONDITIONNEL (LOADING)
    if (loading) {
        return (
        <div className="flex items-center justify-center h-full">
            <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des facultés...</p>
            </div>
        </div>
        );
    }

    // RENDU PRINCIPAL
    return (
        <div className="space-y-6">
            {/* En-tête de la page */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Facultés</h1>
                    <p className="text-gray-600">Gestion des facultés de l'université</p>
                </div>
                <Button
                    onClick={handleCreate}
                    variant="primary"
                    icon={FaPlus}
                    >
                    Nouvelle faculté
                </Button>
            </div>

            {/* Carte de statistiques */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FaUniversity className="text-2xl text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Total des facultés</p>
                        <p className="text-2xl font-bold text-gray-800">{facultes.length}</p>
                    </div>
                </div>
            </div>

            {/* Tableau des facultés */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {facultes.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Code
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nom
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Description
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date de création
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {facultes.map((faculte) => (
                                <tr key={faculte.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-medium text-gray-900">{faculte.code}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-900">{faculte.nom}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-500">
                                        {faculte.description || '-'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-500">
                                        {new Date(faculte.created_at).toLocaleDateString('fr-FR')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {/* Bouton Modifier */}
                                        <Button
                                            onClick={() => handleEdit(faculte)}
                                            variant="info"
                                            size="sm"
                                            icon={FaEdit}
                                            className="inline-flex"
                                        >
                                            Modifier
                                        </Button>
                                        
                                        {/* Bouton Supprimer */}
                                        <Button
                                            onClick={() => handleDelete(faculte.id)}
                                            variant="danger"
                                            size="sm"
                                            icon={FaTrash}
                                            className="inline-flex"
                                        >
                                            Supprimer
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : 
                (
                    // Message si aucune faculté
                    <div className="text-center py-12">
                        <FaUniversity className="mx-auto text-4xl text-gray-400 mb-4" />
                        <p className="text-gray-600 mb-2">Aucune faculté trouvée</p>
                        <button
                            onClick={handleCreate}
                            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                            >
                            Créer la première faculté
                        </button>
                    </div>
                )}
            </div>

            {/* Modal de création/édition */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 animate-fade-in">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            {editingFaculte ? 'Modifier la faculté' : 'Nouvelle faculté'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Champ Code */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Code <span className="text-red-500">*</span>
                                </label>
                                <input
                                type="text"
                                name="code"
                                value={formData.code}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                placeholder="Ex: FST"
                                required
                                />
                            </div>

                            {/* Champ Nom */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nom <span className="text-red-500">*</span>
                                </label>
                                <input
                                type="text"
                                name="nom"
                                value={formData.nom}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                placeholder="Ex: Faculté des Sciences et Techniques"
                                required
                                />
                            </div>

                            {/* Champ Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                placeholder="Description de la faculté..."
                                />
                            </div>

                            {/* Boutons du formulaire */}
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
                                    {editingFaculte ? 'Modifier' : 'Créer'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Dialogue de confirmation de suppression */}
            <ConfirmDialog
                isOpen={showConfirmDialog}
                title="Supprimer la faculté"
                message="Êtes-vous sûr de vouloir supprimer cette faculté ? Cette action est irréversible."
                confirmText="Supprimer"
                cancelText="Annuler"
                type="danger"
                onConfirm={confirmDelete}
                onCancel={() => {
                setShowConfirmDialog(false);
                setFaculteToDelete(null);
                }}
            />
        </div>
    );
};

export default Facultes;