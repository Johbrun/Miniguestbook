# Analyse STRIDE (gabarit à compléter)

Pour chaque composant du DFD, identifier les menaces STRIDE et les contre-mesures.

**STRIDE** : Spoofing, Tampering, Repudiation, Information disclosure, Denial of service,
Elevation of privilege.

## API Express

| Catégorie STRIDE | Menace identifiée | Existe-t-elle ici ? | Contre-mesure |
|------------------|-------------------|---------------------|---------------|
| Spoofing | Usurpation via jeton prévisible | _à analyser_ | jetons aléatoires |
| Tampering | Injection SQL sur la recherche | _à analyser_ | requêtes paramétrées |
| Repudiation | Actions non tracées / logs falsifiables | _à analyser_ | journalisation fiable |
| Information disclosure | IDOR sur les profils, erreurs verbeuses, secrets loggés | _à analyser_ | contrôle d'accès, erreurs génériques |
| Denial of service | Absence de rate limiting | _à analyser_ | quotas / limites |
| Elevation of privilege | Mass assignment du role, admin en dur | _à analyser_ | liste blanche, pas de secret en dur |

## SPA React

| Catégorie STRIDE | Menace identifiée | Existe-t-elle ici ? | Contre-mesure |
|------------------|-------------------|---------------------|---------------|
| Tampering | XSS stockée | _à analyser_ | assainissement + CSP |
| ... | | | |

## Stockages (SQLite, log.txt, uploads)

| Composant | Menace | Contre-mesure |
|-----------|--------|---------------|
| log.txt | Secrets en clair (Information disclosure) | ne pas logguer de secret |
| SQLite | Accès non contrôlé | contrôle d'accès applicatif |
| uploads | Upload de fichier malveillant | validation type/extension |

## Infrastructure / chaîne d'approvisionnement

| Composant | Menace | Contre-mesure |
|-----------|--------|---------------|
| Dépendances npm | Composant vulnérable (node-serialize) | SCA, mise à jour |
| Image Docker | Image non durcie (root, latest) | durcissement, scan image |
| WAF | DetectionOnly = ne bloque pas | SecRuleEngine On |
