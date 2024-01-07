FROM oven/bun:alpine AS production

LABEL maintainer="Nghiep <me@nghiep.dev>"

WORKDIR /app

COPY . .

RUN bun install

CMD ["bun", "index.ts"]