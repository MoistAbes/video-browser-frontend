# === Build Angular ===
FROM node:20 AS build
WORKDIR /app

COPY package.json ./
RUN npm install
COPY . .
RUN npm rebuild esbuild
RUN npm run build --configuration=production

# === Serve with Nginx ===
FROM nginx:stable-alpine

RUN rm -rf /usr/share/nginx/html/*

# Skopiuj zawartość builda Angulara (z podkatalogu browser)
COPY --from=build /app/dist/video-browser-app-frontend/browser/. /usr/share/nginx/html/
RUN chown -R nginx:nginx /usr/share/nginx/html
RUN chmod -R 755 /usr/share/nginx/html


COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
