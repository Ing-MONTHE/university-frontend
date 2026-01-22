import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaUniversity,
  FaBook,
  FaArrowUp,
  FaArrowDown,
} from 'react-icons/fa';

const Dashboard = () => {
  const stats = [
    {
      title: 'Étudiants',
      value: '1,234',
      icon: FaUserGraduate,
      gradient: 'from-blue-500 to-blue-700',
      change: '+12%',
      trend: 'up',
    },
    {
      title: 'Enseignants',
      value: '89',
      icon: FaChalkboardTeacher,
      gradient: 'from-green-500 to-green-700',
      change: '+5%',
      trend: 'up',
    },
    {
      title: 'Facultés',
      value: '8',
      icon: FaUniversity,
      gradient: 'from-purple-500 to-purple-700',
      change: '0%',
      trend: 'neutral',
    },
    {
      title: 'Cours',
      value: '156',
      icon: FaBook,
      gradient: 'from-orange-500 to-orange-700',
      change: '-3%',
      trend: 'down',
    },
  ];

  return (
    <div className="space-y-10">
      {/* En-tête avec espace */}
      <div className="space-y-3">
        <h1 className="text-4xl font-bold text-gray-900">Bienvenue sur votre Dashboard</h1>
        <p className="text-lg text-gray-600">
          Voici un aperçu complet de votre système de gestion universitaire
        </p>
      </div>

      {/* Stats cards - BIEN ESPACÉES */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} padding="lg" className="hover:shadow-xl transition-shadow duration-300">
              <div className="space-y-6">
                {/* Icône et titre */}
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                      {stat.title}
                    </p>
                    <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center shadow-lg`}
                  >
                    <Icon className="text-3xl text-white" />
                  </div>
                </div>

                {/* Évolution */}
                <div className="flex items-center gap-2">
                  {stat.trend === 'up' && (
                    <>
                      <FaArrowUp className="text-green-500" />
                      <Badge variant="success" size="sm">
                        {stat.change}
                      </Badge>
                    </>
                  )}
                  {stat.trend === 'down' && (
                    <>
                      <FaArrowDown className="text-red-500" />
                      <Badge variant="danger" size="sm">
                        {stat.change}
                      </Badge>
                    </>
                  )}
                  {stat.trend === 'neutral' && (
                    <Badge variant="secondary" size="sm">
                      {stat.change}
                    </Badge>
                  )}
                  <span className="text-sm text-gray-500">vs mois dernier</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Contenu supplémentaire - ESPACÉ */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <Card title="Activités récentes" padding="lg" className="min-h-80">
          <div className="flex items-center justify-center h-60 text-gray-400">
            <p>Aucune activité récente à afficher</p>
          </div>
        </Card>

        <Card title="Statistiques mensuelles" padding="lg" className="min-h-80">
          <div className="flex items-center justify-center h-60 text-gray-400">
            <p>Graphiques à venir...</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;