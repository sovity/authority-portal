FROM nginx:1.25.1-alpine

RUN apk update && apk add jq esh --no-cache
COPY docker/default.conf.esh etc/nginx/conf.d/default.conf.esh

COPY dist/app /usr/share/nginx/html

ENV NGINX_BIND=""
ENV NGINX_PORT=80

HEALTHCHECK --interval=2s --timeout=5s --retries=10 \
  CMD curl -f http://${NGINX_BIND:"localhost"}:$NGINX_PORT/ || exit 1

# Before starting nginx, apply ENV vars:
# (1) Apply NGINX_BIND and NGINX_PORT to nginx.conf
# (2) Create config.json from AUTHORITY_PORTAL_FRONTEND_* ENV Vars
CMD esh -o /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf.esh && rm /etc/nginx/conf.d/default.conf.esh \
 && jq -n 'env | with_entries( select(.key | startswith("AUTHORITY_PORTAL_FRONTEND_") ) )' > /usr/share/nginx/html/assets/config/app-config.json \
 && nginx -g "daemon off;"

