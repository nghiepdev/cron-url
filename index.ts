import cron from 'node-cron';

interface JobUrl {
  expression: string;
  url: string;
}

function validateUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

const jobUrls = (process.env.CRON_URLS ?? '')
  .split('\n')
  .map(urlJob => {
    const [expression] = urlJob.match(/^.*(?=\shttp)/) ?? [];
    const [url] = urlJob.match(/http.*/) ?? [];
    return {
      expression,
      url,
    } satisfies Partial<JobUrl>;
  })
  .filter((job): job is JobUrl => {
    return validateUrl(job.url ?? '') && cron.validate(job.expression ?? '');
  });

for (const {expression, url} of jobUrls) {
  cron.schedule(
    expression,
    () => {
      fetch(url);
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
