# Docker Image for Schedule Fetch URL using Cron triggers

> `docker pull nghiepit/cron-url`. Support non-standard syntax.

## Examples

### Every second

```sh
$ docker run -e CRON_URLS="* * * * * * https://www.gstatic.com/generate_204" nghiepit/cron-url
```

### Multiple tasks

```yml
# docker-compose.yml
version: '3.8'
services:
  cron-url:
    image: nghiepit/cron-url
    environment:
      CRON_URLS: |
        */2 * * * * * https://www.gstatic.com/generate_204
        */2 * * * * * https://www.gstatic.com/generate_204
    restart: unless-stopped
```

## Cron Syntax

```
 # ┌────────────── second (optional)
 # │ ┌──────────── minute
 # │ │ ┌────────── hour
 # │ │ │ ┌──────── day of month
 # │ │ │ │ ┌────── month
 # │ │ │ │ │ ┌──── day of week
 # │ │ │ │ │ │
 # │ │ │ │ │ │
 # * * * * * *
```

## License

MIT
