import { useEffect, useState } from 'react';
import { FaUserGraduate, FaChalkboardTeacher, FaUniversity, FaBook } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { etudiantService, faculteService } from '../services/api';

// Interfaces pour les données
interface StatCard {
  title: string;
  value: number;
  icon: any;
  color: string;
  bgColor: string;
} // Nous definissons la structure de notre carte de statistique

interface StudentData {
  id: number;
  matricule: string;
  user: {
    first_name: string;
    last_name: string;
    email: string;
  };
  created_at: string;
}

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEtudiants: 0,
    totalEnseignants: 0,
    totalFacultes: 0,
    totalCours: 0,
  });
  const [recentStudents, setRecentStudents] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger les données
  useEffect(() => {
    const fetchData = async () => { //Fonction asynchrone pour appeler les API
      try {
        // Récupérer les statistiques
        const statsResponse = await etudiantService.getStatistiques(); //Appelle l'API Django pour recuperer les stats
        const facultesResponse = await faculteService.getAll(); //Attends la reponse
        
        setStats({
          totalEtudiants: statsResponse.data.total || 0,
          totalEnseignants: 0, // TODO: Récupérer la vraie valeur
          totalFacultes: facultesResponse.data.results?.length || 0,
          totalCours: 0, // TODO: Récupérer la vraie valeur
        }); // Mettre a jour l'etat avec les données recues

        // Récupérer les étudiants récents
        const etudiantsResponse = await etudiantService.getAll({ page_size: 5, ordering: '-created_at' });
        setRecentStudents(etudiantsResponse.data.results || []);
        
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []); // S'execute une fois qu chargement du composant, et tableau de dependances vide

  // Données pour les cartes de statistiques
  const statCards: StatCard[] = [
    {
      title: 'Total Étudiants',
      value: stats.totalEtudiants,
      icon: FaUserGraduate,
      color: 'text-green-600',
      bgColor: 'bg-green-500',
    },
    {
      title: 'Total Enseignants',
      value: stats.totalEnseignants,
      icon: FaChalkboardTeacher,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500',
    },
    {
      title: 'Total Facultés',
      value: stats.totalFacultes,
      icon: FaUniversity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-500',
    },
    {
      title: 'Total Cours',
      value: stats.totalCours,
      icon: FaBook,
      color: 'text-orange-600',
      bgColor: 'bg-orange-500',
    },
  ];

  // Données pour le graphique de participation
  const participationData = [
    { name: 'Jan', valeur: 0 },
    { name: 'Fév', valeur: 0 },
    { name: 'Mar', valeur: 0 },
    { name: 'Avr', valeur: 0 },
    { name: 'Mai', valeur: 0 },
    { name: 'Jun', valeur: 0 },
    { name: 'Juil', valeur: 0 },
    { name: 'Août', valeur: 0 },
    { name: 'Sept', valeur: 0 },
    { name: 'Oct', valeur: 0 },
    { name: 'Nov', valeur: 0 },
    { name: 'Dec', valeur: 0 },
  ];

  // Données pour le graphique circulaire
  const pieData = [
    { name: 'Informatique', value: 100 },
    { name: 'Médecine', value: 100 },
    { name: 'Droit', value: 100 },
    { name: 'Économie', value: 100 },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

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

  return (
    <div className="space-y-6">
      {/* Titre */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Tableau de bord</h1>
        <p className="text-gray-600">Vue d'ensemble de votre système</p>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-800">{card.value}</p>
                </div>
                <div className={`w-14 h-14 ${card.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className="text-2xl text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique de participation */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Évolution des inscriptions
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={participationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="valeur" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Graphique circulaire */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Répartition par filière
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry: any) => `${entry.name} ${(entry.percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Liste des étudiants récents */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Étudiants récemment inscrits
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Matricule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom complet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date d'inscription
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentStudents.length > 0 ? (
                recentStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.matricule}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.user.first_name} {student.user.last_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(student.created_at).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    Aucun étudiant récent
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;