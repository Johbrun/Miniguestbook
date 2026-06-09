# Apache + ModSecurity with the OWASP Core Rule Set, used as a reverse proxy.
#
# NOTE: the WAF is configured in DetectionOnly mode on purpose: it inspects traffic and
# writes alerts to the audit log, but it does NOT block anything. This gives a false sense
# of protection (security misconfiguration).
FROM owasp/modsecurity-crs:apache

# Upstream is the frontend (nginx), which itself proxies /api to the backend.
ENV BACKEND=http://frontend:80 \
    PORT=80 \
    SERVERNAME=miniguestbook \
    MODSEC_RULE_ENGINE=DetectionOnly \
    MODSEC_AUDIT_ENGINE=RelevantOnly \
    MODSEC_AUDIT_LOG=/var/log/modsec_audit.log

# Explicitly force detection-only on top of the env configuration.
COPY detection-only.conf /etc/modsecurity.d/z-detection-only.conf

EXPOSE 80
