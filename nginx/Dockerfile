FROM nginx:latest

EXPOSE 443

COPY ./conf/nginx.conf /etc/nginx/nginx.conf
COPY cert/nginx.crt /etc/nginx/cert/nginx.crt
COPY cert/nginx.key /etc/nginx/cert/nginx.key