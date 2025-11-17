# ---- Build stage ----
FROM node:20-alpine AS build
WORKDIR /app

# Add source and build
COPY . .
RUN npm i
# If your build script differs, adjust this:
RUN npm run build

# ---- Runtime stage ----
FROM nginx:1.27-alpine

# Optional: turn on gzip + tweak NGINX defaults
# You can also use /etc/nginx/nginx.conf; we'll ship our own site config below
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets
COPY --from=build /app/dist/ /usr/share/nginx/html/

# Non-root is nice to have (nginx image defaults to root). This is optional:
# RUN adduser -D -H -u 10001 webuser && chown -R webuser:webuser /var/cache/nginx /var/run /var/log/nginx /usr/share/nginx/html
# USER 10001

EXPOSE 80
# NGINX is the default CMD for this image
