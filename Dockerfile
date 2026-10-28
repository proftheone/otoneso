FROM nginx:1.27-alpine
ENV PORT=10000
RUN apk add --no-cache nodejs npm
COPY . /usr/share/nginx/html
RUN mkdir -p /etc/nginx/templates \
 && mv /usr/share/nginx/html/nginx.conf.template /etc/nginx/templates/default.conf.template \
 && mv /usr/share/nginx/html/server /app \
 && rm -rf /app/node_modules /usr/share/nginx/html/STRIPE_INTEGRATION_TODO.md \
 && cd /app && npm ci --omit=dev --no-audit --no-fund \
 && printf '#!/bin/sh\nnode /app/checkout.js &\n' > /docker-entrypoint.d/90-checkout.sh \
 && chmod +x /docker-entrypoint.d/90-checkout.sh
EXPOSE 10000
