# Analyse CIDT (gabarit à compléter)

**CIDT** = Confidentialité, Intégrité, Disponibilité, Traçabilité.

Pour chaque actif, évaluer le besoin de sécurité (Faible / Moyen / Fort) et justifier.

| Actif | Confidentialité | Intégrité | Disponibilité | Traçabilité | Justification |
|-------|:---------------:|:---------:|:-------------:|:-----------:|---------------|
| Comptes utilisateurs | Fort | Fort | Moyen | Fort | _à compléter_ |
| Hash de mot de passe | Fort | Fort | Moyen | Moyen | _à compléter_ |
| Sessions / jetons | Fort | Fort | Moyen | Fort | _à compléter_ |
| Messages du livre d'or | Faible | Moyen | Moyen | Moyen | publics mais modérés |
| Articles de blog | Faible | Fort | Moyen | Moyen | intégrité éditoriale |
| log.txt | Fort | Fort | Faible | Fort | preuve + données sensibles |
| Photos / uploads | Moyen | Moyen | Faible | Faible | _à compléter_ |

## Exigences de sécurité dérivées (à rédiger)

- EX-01 : _Les mots de passe ne doivent jamais transiter ni être stockés/journalisés en clair._
- EX-02 : _Le rôle d'un compte ne peut être modifié que par un administrateur._
- EX-03 : _..._
