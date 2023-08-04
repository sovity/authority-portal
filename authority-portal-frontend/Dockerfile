# Stage 1: Install node modules
FROM node:lts as npm-install

WORKDIR /app
COPY ./package*.json /app/
RUN npm install

# Stage 2: Build Project
FROM node:lts as build

WORKDIR /app
COPY --from=npm-install /app/node_modules /app/node_modules
COPY ./ /app/
RUN npm run ng build --no-progress --configuration=production

# Stage 3: Serve app with nginx
FROM nginx:1.23.4-alpine

RUN apk update && apk add jq esh --no-cache

COPY --from=build /app/dist/app /usr/share/nginx/html/app
COPY --from=build /app/src/assets /usr/share/nginx/html/assets
# COPY docker/default.conf.esh etc/nginx/conf.d/default.conf.esh
COPY ./nginx.conf /etc/nginx

WORKDIR /app

## add permissions
RUN chown -R nginx:nginx /app && chmod -R 755 /app && \
        chown -R nginx:nginx /var/cache/nginx && \
        chown -R nginx:nginx /var/log/nginx && \
        chown -R nginx:nginx /etc/nginx/conf.d
RUN touch /var/run/nginx.pid && \
        chown -R nginx:nginx /var/run/nginx.pid

## switch to non-root user
USER nginx


EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

