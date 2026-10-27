FROM nginx:1.27-alpine
ENV PORT=10000
COPY . /usr/share/nginx/html
RUN mkdir -p /etc/nginx/templates \
 && mv /usr/share/nginx/html/nginx.conf.template /etc/nginx/templates/default.conf.template
EXPOSE 10000
