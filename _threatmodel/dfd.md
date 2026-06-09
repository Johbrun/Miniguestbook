# Diagramme de flux de données (DFD)

Version texte du DFD (le DFD graphique est dans `threat-model.json`).

```
                 ┌─────────────────────── Périmètre serveur (derrière le WAF) ───────────────────────┐
                 │                                                                                    │
[Visiteur/Élève] ── HTTPS ──▶ [WAF Apache/ModSecurity*] ── HTTP ──▶ [SPA React (nginx)]              │
                 │                                                          │                         │
                 │                                                      REST /api                     │
                 │                                                          ▼                         │
                 │                                                  [API Express] ── SQL ──▶ [SQLite] │
                 │                                                       │  │                          │
                 │                                                       │  └── append ──▶ [log.txt]   │
                 │                                                       └── fichiers ──▶ [uploads/]   │
                 └────────────────────────────────────────────────────────────────────────────────────┘

(*) Le WAF est en mode DetectionOnly : il observe mais ne bloque pas.
```

## Actifs (à compléter)

| Actif | Type | Sensibilité | Remarques |
|-------|------|-------------|-----------|
| Comptes utilisateurs (pseudo, email, prénom/nom, hash mdp, role) | Donnée | Élevée | prénom/nom = admin-only |
| Messages du livre d'or | Donnée | Faible/Moyenne | publics |
| Articles de blog | Donnée | Faible | publics en lecture |
| Sessions | Donnée | Élevée | jetons |
| log.txt | Donnée | Élevée | contient des secrets (à corriger) |
| Photos / images uploadées | Fichier | Moyenne | |

## Surfaces d'attaque (à compléter)

- Formulaire de post de message (non authentifié)
- Recherche (messages, blog)
- Authentification / inscription
- Profil (mise à jour, upload)
- Cookie `prefs`
- Routes admin
- Chaîne d'approvisionnement (dépendances npm), images Docker, CI/CD
