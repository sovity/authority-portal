# Stage 1: Install node modules
FROM node:lts as npm-install

WORKDIR /app
COPY ./fake-backend/package*.json /app/
RUN npm install

# Stage 2: Serve Fake Backend
FROM node:lts
WORKDIR /app
COPY --from=npm-install /app/node_modules /app/node_modules
COPY ./fake-backend/ /app/
# RUN npm run start
CMD ["npm", "run", "start"]
