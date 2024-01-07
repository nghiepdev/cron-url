import cron from 'node-cron';

interface JobUrl {
  expression: string;
  url: string;
  webhook?: string;
}

function validateUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

const jobUrls: JobUrl[] = (process.env.CRON_URLS ?? '')
  .split('\n')
  .map(job => {
    const [expression] = job.match(/^.*?(?=\shttp)/) ?? [];
    const [url, webhook] = job.match(/http[^\s]*/g) ?? [];

    if (url && expression && validateUrl(url) && cron.validate(expression)) {
      return {
        expression,
        url,
        webhook: validateUrl(webhook) ? webhook : undefined,
      } satisfies JobUrl;
    }
    return undefined!;
  })
  .filter(job => !!job);

for (const {expression, url, webhook} of jobUrls) {
  cron.schedule(
    expression,
    () => {
      const response = fetch(url, {
        signal: process.env.FETCH_TIMEOUT
          ? AbortSignal.timeout(Number(process.env.FETCH_TIMEOUT))
          : null,
      });
      if (webhook) {
        response.then(res => {
          console.info(
            `${new Date().toLocaleString()} - ${expression} - Posting payload to ${webhook}`
          );
          fetch(webhook, {
            method: 'POST',
            body: res.body,
          });
        });
      }
      console.info(
        `${new Date().toLocaleString()} - ${expression} - Fetching ${url}`
      );
    },
    {timezone: process.env.TZ}
  );
}

if (jobUrls.length === 0) {
  console.info('No jobs!');
}
