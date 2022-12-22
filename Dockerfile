FROM node:18-alpine AS production

LABEL maintainer="Nghiep <me@nghiep.dev>"

WORKDIR /app

COPY . .

RUN npm install

CMD ["node", "index.js"]