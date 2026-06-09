# 📖 MiniGuestbook — Livre d'or de lycée

> ## ⚠️ APPLICATION VOLONTAIREMENT VULNÉRABLE
>
> Cette application a été conçue **dans un but pédagogique** pour un TP de **sécurité by design**. Elle contient des **vulnérabilités intentionnelles**.
>
> **NE JAMAIS l'exposer sur Internet ni l'utiliser en production.** Usage en environnement de laboratoire isolé **uniquement**.

Un livre d'or pour un lycée : tout le monde peut poster un message en choisissant un pseudo (sans compte). Une partie blog est éditée par des administrateurs. Deux rôles existent : **user** (réserve son pseudo, gère ses messages et son profil) et **admin** (modère les messages, gère le blog et les comptes).

## Stack

- **Backend** : Express.js + TypeScript + SQLite (`better-sqlite3`)
- **Frontend** : React + Vite + TypeScript + TailwindCSS
- **Reverse proxy** : Apache + ModSecurity (WAF)

## Arborescence

```
backend/        API Express (TypeScript)
frontend/       SPA React (Vite + Tailwind)
waf/            Reverse proxy Apache + ModSecurity
TP/             Énoncés du TP (4 phases) — pour les étudiants
_threatmodel/   Modèle de menaces (OWASP Threat Dragon) — livrable Phase 1
_teacher/       Matériel enseignant (NON versionné)
```

---

## 🚀 Déploiement avec npm (développement)

Prérequis : Node.js 20+, npm 10+.

Depuis la **racine du projet**, une seule fois :

```bash
npm run install:all         # installe racine + backend + frontend
npm run seed                # crée et remplit la base SQLite (3 admins + données de démo)
```

Puis, pour tout lancer en **une seule commande** (backend + frontend en parallèle) :

```bash
npm run dev
```

- API backend : http://localhost:3001
- SPA frontend : http://localhost:5173 (proxy `/api` → `:3001`)

Ouvrir http://localhost:5173.

<details>
<summary>Lancer les services séparément (deux terminaux)</summary>

```bash
# Terminal 1
cd backend && npm install && npm run seed && npm run dev

# Terminal 2
cd frontend && npm install && npm run dev
```

</details>

---

## 🐳 Déploiement avec docker-compose

Prérequis : Docker + Docker Compose.

```bash
docker compose up --build
```

- Point d'entrée (WAF Apache) : **http://localhost:8080**
- Le WAF relaie vers le frontend (servi par nginx) et l'API backend.

Pour tout arrêter :

```bash
docker compose down
```

> Les données SQLite, les uploads et `log.txt` sont persistés via des volumes Docker (`backend/data`, `backend/uploads`).

---

## 👤 Comptes de démonstration

Créés par le seed (mots de passe en clair ci-dessous, **pour le TP uniquement**) :

| Rôle  | Pseudo      | Email               | Mot de passe |
| ----- | ----------- | ------------------- | ------------ |
| admin | `proviseur` | proviseur@asymis.fr | `Admin2025!` |
| admin | `cpe`       | cpe@asymis.fr       | `Admin2025!` |
| admin | `intendant` | intendant@asymis.fr | `Admin2025!` |
| user  | `leo`       | leo@asymis.fr       | `Password1!` |
| user  | `marie`     | marie@asymis.fr     | `Password1!` |

---

## 🔒 Sécurité & qualité

- **Lint** : `npm run lint` (ESLint + Prettier) dans `backend/` et `frontend/`.
- **Pre-commit** : Husky exécute ESLint + Prettier + gitleaks avant chaque commit.
- **CI de base** (committée) : `.github/workflows/lint.yml` et `.gitlab-ci.yml` font le lint.
- **Scans de sécurité** : voir `make security` et le matériel enseignant `_teacher/` (non versionné).

> `node-serialize@0.0.3` sera signalé par `npm audit` / les scans SCA : **c'est volontaire** (objet du TP).

---

## 📚 TP

Les énoncés sont dans [`TP/`](TP/) (4 phases). Le modèle de menaces de départ est dans [`_threatmodel/`](_threatmodel/).
