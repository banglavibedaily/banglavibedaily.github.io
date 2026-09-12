# Development image for the Bangla Vibe Daily website.
# Node 22 here matches CI, so the container behaves like the deploy pipeline
# even though the host machine runs Node 18.
FROM node:22-alpine

WORKDIR /app

COPY --chown=node:node package.json package-lock.json* ./
RUN npm install

COPY --chown=node:node . .

USER node

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
