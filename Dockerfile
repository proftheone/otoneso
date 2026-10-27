FROM nginx:1.27-alpine
ENV PORT=10000
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY . /usr/share/nginx/html
EXPOSE 10000
