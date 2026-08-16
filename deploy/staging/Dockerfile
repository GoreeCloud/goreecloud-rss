FROM nginx:1.29.8-alpine

COPY deploy/staging/nginx.conf /etc/nginx/nginx.conf
COPY dist/ /usr/share/nginx/html/

EXPOSE 8080

USER 101:101

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O - http://127.0.0.1:8080/healthz >/dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]
