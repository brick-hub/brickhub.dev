FROM node:16-bullseye-slim as base

ENV NODE_ENV=production
WORKDIR /app
ADD package.json .

FROM base AS deps
ADD package-lock.json .
RUN npm install --production=false

FROM deps AS build
ADD . .
RUN npm run build

FROM deps AS prod-deps
RUN npm prune --production

FROM base AS prod
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/public ./public
COPY --from=build /app/build ./build

EXPOSE 3000
CMD ["npm", "start"]