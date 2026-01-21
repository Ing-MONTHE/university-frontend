# 🎓 University Management System - Frontend

Système de gestion universitaire moderne développé avec React 19, TypeScript, Tailwind CSS v4 et DaisyUI.

## 🚀 Technologies

- **React 19.2** - Bibliothèque UI
- **TypeScript 5.7** - Typage statique
- **Vite 6.0** - Build tool et dev server
- **Tailwind CSS 4.1** - Framework CSS utility-first
- **DaisyUI 4.12** - Composants UI basés sur Tailwind
- **React Router 7** - Routing
- **Axios** - Client HTTP
- **React Icons** - Bibliothèque d'icônes
- **date-fns** - Manipulation de dates

## 📦 Installation

### Prérequis

- Node.js 18+ ou 20+
- npm ou yarn

### Étapes
```bash
# Cloner le repository
git clone https://github.com/VotreUsername/university-frontend.git

# Entrer dans le dossier
cd university-frontend

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Configurer les variables d'environnement
# Éditer .env et définir VITE_API_BASE_URL

# Lancer le serveur de développement
npm run dev
```

## ⚙️ Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine :
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=University Management
```

## 📁 Structure du projet
```
src/
├── api/              # Services API et client Axios
├── types/            # Types TypeScript
├── hooks/            # Custom React hooks
├── context/          # Context API (Auth, etc.)
├── components/       # Composants réutilisables
│   ├── ui/          # Composants UI de base
│   ├── layout/      # Layout (Sidebar, Header)
│   └── shared/      # Composants partagés
├── pages/           # Pages de l'application
│   ├── auth/        # Authentification
│   ├── dashboard/   # Tableau de bord
│   ├── academic/    # Structure académique
│   ├── students/    # Gestion étudiants
│   ├── evaluations/ # Notes et évaluations
│   └── schedule/    # Emploi du temps
├── utils/           # Utilitaires
└── routes/          # Configuration des routes
```

## 🎯 Fonctionnalités

### Phase 1 - Infrastructure ✅
- [x] Configuration du projet
- [x] Client API avec intercepteurs JWT
- [x] Types TypeScript de base
- [ ] Contexte d'authentification
- [ ] Système de routing

### Phase 2 - Authentification
- [ ] Page de connexion
- [ ] Gestion des tokens JWT
- [ ] Routes protégées

### Phase 3 - Structure Académique
- [ ] Gestion des Facultés (CRUD)
- [ ] Gestion des Départements (CRUD)
- [ ] Gestion des Filières (CRUD)
- [ ] Gestion des Matières (CRUD)

### Phase 4 - Étudiants & Enseignants
- [ ] Liste et détails des étudiants
- [ ] Gestion des enseignants
- [ ] Système d'inscriptions

### Phase 5 - Évaluations
- [ ] Gestion des évaluations
- [ ] Saisie des notes
- [ ] Délibérations et résultats

### Phase 6 - Emploi du temps
- [ ] Visualisation de l'emploi du temps
- [ ] Gestion des cours
- [ ] Détection de conflits
- [ ] Export PDF/Excel

## 🛠️ Scripts disponibles
```bash
# Développement
npm run dev

# Build de production
npm run build

# Preview du build
npm run preview

# Linter
npm run lint

# Type checking
npm run type-check
```

## 🔗 Backend

Ce frontend consomme l'API du backend Django.

**Repository Backend :** [university-backend](https://github.com/Ing-MONTHE/University_Management)

**URL API par défaut :** `http://localhost:8000/api`

## 📝 Convention de code

- **TypeScript strict mode** activé
- **ESLint** pour le linting
- **Prettier** pour le formatage (optionnel)
- **Composants fonctionnels** avec hooks
- **Naming conventions :**
  - Composants : PascalCase (`Button.tsx`)
  - Hooks : camelCase avec préfixe `use` (`useAuth.ts`)
  - Types : PascalCase avec suffixe `Type` ou `Interface`

## 🎨 Thèmes DaisyUI

Thèmes disponibles : `light`, `cupcake`

Pour changer le thème, modifiez `tailwind.config.ts`.

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT.

## 👤 Auteur

**Votre Nom**

- GitHub: [Ing-MONTHE](https://github.com/Ing-MONTHE)

## 🙏 Remerciements

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [DaisyUI](https://daisyui.com/)