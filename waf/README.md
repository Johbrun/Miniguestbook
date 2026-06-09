# WAF — Apache + ModSecurity (OWASP CRS)

Reverse proxy placé devant l'application dans `docker-compose.yml`. Il embarque ModSecurity et
l'OWASP Core Rule Set.

## ⚠️ Mode DetectionOnly

Le moteur de règles est volontairement réglé sur **`DetectionOnly`** (`MODSEC_RULE_ENGINE` +
`detection-only.conf`). Conséquence : les attaques sont **détectées et journalisées** dans le log d'audit
ModSecurity, mais **aucune requête n'est bloquée**. C'est une mauvaise configuration classique qui donne
une fausse impression de protection.

Pour réellement bloquer (remédiation Phase 2/3), passer le moteur en `On` :

```
SecRuleEngine On
```

## Logs

Le log d'audit ModSecurity est écrit dans le conteneur (`/var/log/modsec_audit.log`). On peut le suivre :

```bash
docker compose exec waf tail -f /var/log/modsec_audit.log
```
