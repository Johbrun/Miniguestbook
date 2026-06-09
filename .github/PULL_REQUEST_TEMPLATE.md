<!-- Merci de remplir cette checklist avant de demander une revue. -->

## Description

<!-- Que fait cette PR ? Quelle vulnérabilité corrige-t-elle (le cas échéant) ? -->

## Checklist sécurité (Definition of Done)

- [ ] Entrées utilisateur validées et échappées (pas de XSS).
- [ ] Requêtes SQL **paramétrées** (aucune concaténation).
- [ ] Contrôle d'accès vérifié côté serveur (pas d'IDOR / mass assignment).
- [ ] Aucun secret commité (`gitleaks` OK).
- [ ] Jetons de session aléatoires / imprévisibles.
- [ ] Aucune donnée sensible dans les logs.
- [ ] `npm audit` / SCA sans vulnérabilité bloquante introduite.
- [ ] Messages d'erreur non verbeux côté client.
- [ ] `make lint` et `make test` passent.

## Lien avec le TP

<!-- Vulnérabilité concernée (n° + catégorie OWASP 2025), phase concernée. -->
