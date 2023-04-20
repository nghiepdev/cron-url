import cron from 'node-cron';

function validateUrl(url) {
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
    };
  })
  .filter(({expression, url}) => {
    return validateUrl(url) && cron.validate(expression);
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
