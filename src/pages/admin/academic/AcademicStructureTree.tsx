/**
 * Page Structure Académique - Vue Arborescente
 * Affiche la hiérarchie complète : Facultés > Départements > Filières > Matières
 */

import { useState, useMemo, JSX } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  Building2, 
  Building, 
  GraduationCap, 
  BookOpen,
  Users,
  Pencil,
  Trash2,
  Download,
  Expand,
  Minimize2,
  RefreshCw,
  Search,
  FileText,
  Award,
  Clock,
} from 'lucide-react';
import { useFacultes } from '@/hooks/useFacultes';
import { useDepartements } from '@/hooks/useDepartements';
import { useFilieres } from '@/hooks/useFilieres';
import { useMatieres } from '@/hooks/useMatieres';
import type { Faculte, Departement, Filiere, Matiere } from '@/types/academic.types';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import { toast } from 'react-hot-toast';

// Types pour l'arbre
interface TreeNode {
  id: string;
  type: 'faculte' | 'departement' | 'filiere' | 'matiere';
  data: Faculte | Departement | Filiere | Matiere;
  children?: TreeNode[];
  isExpanded: boolean;
}

export default function AcademicStructureTree() {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch toutes les données
  const { data: facultesData, isLoading: loadingFacultes, refetch: refetchFacultes } = useFacultes({ page_size: 100 });
  const { data: departementsData, isLoading: loadingDepts, refetch: refetchDepts } = useDepartements({ page_size: 500 });
  const { data: filieresData, isLoading: loadingFilieres, refetch: refetchFilieres } = useFilieres({ page_size: 500 });
  const { data: matieresData, isLoading: loadingMatieres, refetch: refetchMatieres } = useMatieres({ page_size: 1000 });

  const isLoading = loadingFacultes || loadingDepts || loadingFilieres || loadingMatieres;

  // Construire l'arbre hiérarchique
  const treeData = useMemo(() => {
    if (!facultesData?.results || !departementsData?.results || !filieresData?.results || !matieresData?.results) {
      return [];
    }

    return facultesData.results.map(faculte => {
      const faculteDepartements = departementsData.results.filter(d => d.faculte === faculte.id);
      
      return {
        id: `faculte-${faculte.id}`,
        type: 'faculte' as const,
        data: faculte,
        isExpanded: expandedNodes.has(`faculte-${faculte.id}`),
        children: faculteDepartements.map(dept => {
          const deptFilieres = filieresData.results.filter(f => f.departement === dept.id);
          
          return {
            id: `dept-${dept.id}`,
            type: 'departement' as const,
            data: dept,
            isExpanded: expandedNodes.has(`dept-${dept.id}`),
            children: deptFilieres.map(filiere => {
              const filiereMatieres = matieresData.results.filter(m => 
                m.filieres && m.filieres.includes(filiere.id)
              );
              
              return {
                id: `filiere-${filiere.id}`,
                type: 'filiere' as const,
                data: filiere,
                isExpanded: expandedNodes.has(`filiere-${filiere.id}`),
                children: filiereMatieres.map(matiere => ({
                  id: `matiere-${matiere.id}`,
                  type: 'matiere' as const,
                  data: matiere,
                  isExpanded: false,
                })),
              };
            }),
          };
        }),
      };
    });
  }, [facultesData, departementsData, filieresData, matieresData, expandedNodes]);

  // Filtrer l'arbre selon la recherche
  const filteredTreeData = useMemo(() => {
    if (!searchTerm.trim()) return treeData;

    const filterNode = (node: TreeNode): TreeNode | null => {
      const searchLower = searchTerm.toLowerCase();
      const nodeData = node.data as any;
      const matchesSearch = 
        nodeData.nom?.toLowerCase().includes(searchLower) ||
        nodeData.code?.toLowerCase().includes(searchLower);

      if (node.children && node.children.length > 0) {
        const filteredChildren = node.children
          .map(child => filterNode(child))
          .filter((child): child is TreeNode => child !== null);

        if (filteredChildren.length > 0 || matchesSearch) {
          return {
            ...node,
            children: filteredChildren,
            isExpanded: true, // Auto-expand lors de la recherche
          };
        }
      }

      return matchesSearch ? node : null;
    };

    return treeData
      .map(node => filterNode(node))
      .filter((node): node is TreeNode => node !== null);
  }, [treeData, searchTerm]);

  // Calculer les statistiques globales
  const stats = useMemo(() => {
    const totalFacultes = facultesData?.results.length || 0;
    const totalDepartements = departementsData?.results.length || 0;
    const totalFilieres = filieresData?.results.length || 0;
    const totalMatieres = matieresData?.results.length || 0;

    return [
      {
        icon: Building2,
        label: 'Facultés',
        value: totalFacultes,
        gradient: 'from-blue-500 to-blue-600',
        lightBg: 'bg-blue-50',
        iconColor: 'text-blue-600',
      },
      {
        icon: Building,
        label: 'Départements',
        value: totalDepartements,
        gradient: 'from-indigo-500 to-indigo-600',
        lightBg: 'bg-indigo-50',
        iconColor: 'text-indigo-600',
      },
      {
        icon: GraduationCap,
        label: 'Filières',
        value: totalFilieres,
        gradient: 'from-purple-500 to-purple-600',
        lightBg: 'bg-purple-50',
        iconColor: 'text-purple-600',
      },
      {
        icon: BookOpen,
        label: 'Matières',
        value: totalMatieres,
        gradient: 'from-pink-500 to-pink-600',
        lightBg: 'bg-pink-50',
        iconColor: 'text-pink-600',
      },
    ];
  }, [facultesData, departementsData, filieresData, matieresData]);

  // Toggle expand/collapse
  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  // Expand all
  const expandAll = () => {
    if (!treeData || treeData.length === 0) return;
    
    const allNodeIds = new Set<string>();
    const collectIds = (nodes: TreeNode[]) => {
      nodes.forEach(node => {
        allNodeIds.add(node.id);
        if (node.children) collectIds(node.children);
      });
    };
    collectIds(treeData);
    setExpandedNodes(allNodeIds);
  };

  // Collapse all
  const collapseAll = () => {
    setExpandedNodes(new Set());
  };

  // Refresh data
  const handleRefresh = async () => {
    toast.promise(
      Promise.all([
        refetchFacultes(),
        refetchDepts(),
        refetchFilieres(),
        refetchMatieres(),
      ]),
      {
        loading: 'Actualisation des données...',
        success: 'Données actualisées avec succès',
        error: 'Erreur lors de l\'actualisation',
      }
    );
  };

  // Export PDF
  const handleExportPDF = () => {
    toast.success('Export PDF en cours de développement');
    // TODO: Implémenter l'export PDF avec jsPDF
  };

  // Render d'un nœud de l'arbre
  const renderNode = (node: TreeNode, level: number = 0): JSX.Element => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    const nodeData = node.data as any;

    const getNodeConfig = () => {
      switch (node.type) {
        case 'faculte':
          return {
            icon: Building2,
            bgColor: 'bg-blue-50 hover:bg-blue-100',
            iconColor: 'text-blue-600',
            borderColor: 'border-blue-200',
            badgeColor: 'bg-blue-100 text-blue-700',
          };
        case 'departement':
          return {
            icon: Building,
            bgColor: 'bg-indigo-50 hover:bg-indigo-100',
            iconColor: 'text-indigo-600',
            borderColor: 'border-indigo-200',
            badgeColor: 'bg-indigo-100 text-indigo-700',
          };
        case 'filiere':
          return {
            icon: GraduationCap,
            bgColor: 'bg-purple-50 hover:bg-purple-100',
            iconColor: 'text-purple-600',
            borderColor: 'border-purple-200',
            badgeColor: 'bg-purple-100 text-purple-700',
          };
        case 'matiere':
          return {
            icon: BookOpen,
            bgColor: 'bg-pink-50 hover:bg-pink-100',
            iconColor: 'text-pink-600',
            borderColor: 'border-pink-200',
            badgeColor: 'bg-pink-100 text-pink-700',
          };
      }
    };

    const config = getNodeConfig();
    const Icon = config.icon;
    return (
      <div key={node.id} className="select-none">
        <div
          className={`flex items-center justify-between gap-2 p-3 rounded-lg border ${config.borderColor} ${config.bgColor} transition-all duration-200 group mb-2`}
          style={{ marginLeft: `${level * 24}px` }}
        >
          <div className="flex items-center gap-2 flex-1 cursor-pointer" onClick={() => hasChildren && toggleNode(node.id)}>
            {/* Expand/Collapse Icon */}
            <button className="flex-shrink-0 p-1 hover:bg-white/50 rounded transition-colors">
              {hasChildren ? (
                isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                )
              ) : (
                <div className="w-4 h-4" />
              )}
            </button>

          {/* Icon */}
          <div className={`p-2 rounded-lg bg-white shadow-sm`}>
            <Icon className={`w-5 h-5 ${config.iconColor}`} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">{nodeData.nom}</span>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${config.badgeColor}`}>
                {nodeData.code}
              </span>
            </div>

            {/* Metadata selon le type */}
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
              {node.type === 'faculte' && (
                <>
                  <span className="flex items-center gap-1">
                    <Building className="w-3 h-3" />
                    {nodeData.departements_count || 0} dép.
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {nodeData.etudiants_count || 0} étud.
                  </span>
                </>
              )}
              {node.type === 'departement' && (
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3 h-3" />
                  {nodeData.filieres_count || 0} filières
                </span>
              )}
              {node.type === 'filiere' && (
                <>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    {nodeData.matieres_count || 0} matières
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {nodeData.duree_annees} an{nodeData.duree_annees > 1 ? 's' : ''}
                  </span>
                </>
              )}
              {node.type === 'matiere' && (
                <>
                  <span className="flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    Coef. {nodeData.coefficient}
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    {nodeData.credits} ECTS
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {(nodeData.volume_horaire_cm || 0) + (nodeData.volume_horaire_td || 0) + (nodeData.volume_horaire_tp || 0)}h
                  </span>
                </>
              )}
            </div>
          </div>
          </div>

          {/* Actions (visible au hover) */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                toast.success(`Édition de ${nodeData.nom}`);
              }}
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                toast.error(`Suppression de ${nodeData.nom}`);
              }}
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </Button>
          </div>

          {/* Children count badge */}
          {hasChildren && (
            <Badge variant="info" size="sm">
              {node.children!.length}
            </Badge>
          )}
        </div>

        {/* Render children */}
        {isExpanded && hasChildren && (
          <div className="space-y-0">
            {node.children!.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" message="Chargement de la structure académique..." />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-white via-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-3xl opacity-30 -mr-32 -mt-32"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-900 bg-clip-text text-transparent mb-2">
                Structure Académique
              </h1>
              <p className="text-gray-600">Vue hiérarchique complète de l'organisation académique</p>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="primary"
                onClick={handleRefresh}
              >
                <RefreshCw className="w-4 h-4" />
                Actualiser
              </Button>
              <Button
                variant="primary"
                onClick={handleExportPDF}
              >
                <Download className="w-4 h-4" />
                Export PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          
          return (
            <Card
              key={index}
              padding="md"
              variant="default"
              hoverable
              className="group relative overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <div className={`${stat.lightBg} p-2.5 rounded-lg group-hover:bg-white/20 transition-colors duration-300`}>
                    <Icon className={`w-7 h-7 ${stat.iconColor} group-hover:text-white transition-colors duration-300`} strokeWidth={2.5} />
                  </div>
                </div>
                
                <p className="text-base font-medium text-gray-600 group-hover:text-white/90 mb-2 transition-colors duration-300">
                  {stat.label}
                </p>
                <p className="text-4xl font-bold text-gray-900 group-hover:text-white tracking-tight transition-colors duration-300">
                  {stat.value}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Controls */}
      <Card padding="md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher dans la structure..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Expand/Collapse buttons */}
          <div className="flex gap-2">
            <Button
              variant="primary"
              onClick={expandAll}
            >
              <Expand className="w-4 h-4" />
              Tout développer
            </Button>
            <Button
              variant="primary"
              onClick={collapseAll}
            >
              <Minimize2 className="w-4 h-4" />
              Tout réduire
            </Button>
          </div>
        </div>
      </Card>

      {/* Tree View */}
      <Card padding="md">
        {filteredTreeData.length > 0 ? (
          <div className="space-y-1">
            {filteredTreeData.map(node => renderNode(node))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-lg font-medium">Aucun résultat trouvé</p>
            <p className="text-sm">Essayez une autre recherche ou réinitialisez les filtres</p>
          </div>
        )}
      </Card>
    </div>
  );
}