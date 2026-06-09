# Politique de sécurité

> ⚠️ **Rappel** : ce dépôt est une application *volontairement vulnérable* à usage pédagogique.
> Les vulnérabilités présentes sont **intentionnelles** et ne doivent pas être signalées comme des bugs.

## Périmètre

Cette politique décrit la posture attendue **pour le code que vous écrivez/corrigez** dans le cadre du TP,
pas pour les failles déjà plantées dans le sujet.

## Definition of Done — sécurité

Avant de proposer une Pull Request (correctif), vérifier :

- [ ] Toutes les entrées utilisateur sont validées et échappées (pas de XSS, pas d'injection SQL).
- [ ] Les requêtes SQL sont **paramétrées** (aucune concaténation de chaînes).
- [ ] Le contrôle d'accès est vérifié côté serveur sur **chaque** route sensible (pas d'IDOR, pas de
      mass assignment : liste blanche des champs modifiables).
- [ ] Aucun secret n'est commité (vérifié par `gitleaks`).
- [ ] Les jetons de session sont **aléatoires** et imprévisibles.
- [ ] Aucune donnée sensible (mot de passe, secret) n'est écrite dans les logs.
- [ ] Les dépendances ne présentent pas de vulnérabilité connue bloquante (`npm audit`, Trivy).
- [ ] Les messages d'erreur renvoyés au client ne divulguent pas de détails internes (SQL, stack).
- [ ] Le linter et les tests passent (`make lint`, `make test`).

## Signalement

Dans un contexte réel, un signalement responsable se ferait par un canal privé dédié. Ici, discutez vos
trouvailles avec l'enseignant et consignez-les dans votre **rapport de triage** (Phase 4).
