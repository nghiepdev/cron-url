# Docker Image for Schedule Fetch URL using Cron triggers

> `docker pull nghiepit/cron-url`. Support non-standard syntax.

## Examples

### Every second

```sh
$ docker run -e CRON_URLS="* * * * * * https://www.gstatic.com/generate_204" nghiepit/cron-url
```

### Multiple tasks and Webhook which receives payload

```yml
# docker-compose.yml
version: '3.8'
services:
  cron-url:
    image: nghiepit/cron-url
    environment:
      TZ: Asia/Ho_Chi_Minh
      CRON_URLS: |
        */2 * * * * * https://www.gstatic.com/generate_204
        */3 * * * * * https://api.domain.com/users https://webhook.domain.net/api/users
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
