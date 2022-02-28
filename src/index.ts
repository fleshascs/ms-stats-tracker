import fs from 'fs';
import readline from 'readline';
import fetch from 'node-fetch';
import { format, subDays } from 'date-fns';
import path from 'path';

(async () => {
  const yesterday = subDays(new Date(), 1);
  const logFileName = 'ms_' + format(yesterday, 'yyyy.MM.dd') + '.log';

  // cant just use path ./logs because of cron running app from /root dir
  // __dirname in docker resolves path: /snapshot/app/logs/ms_2022.02.27.log which doesn't work
  const filePath = path.resolve(process.env.WORKDIR || '.', './logs/' + logFileName);
  const fileStream = fs.createReadStream(filePath);

  const rl = readline.createInterface({ input: fileStream });
  const uniqueIps = [];
  for await (const line of rl) {
    const ip = line.split(' ')[3];
    if (uniqueIps.indexOf(ip) === -1) {
      uniqueIps.push(ip);
    }
  }

  if (!process.env.PROXY_API_KEY) throw new Error('PROXY_API_KEY is required');

  const response = await retry(() =>
    fetch('https://fleshas.lt/php/analytics/saveStatsUniqueIps.php', {
      method: 'post',
      body: JSON.stringify({
        apiKey: process.env.PROXY_API_KEY,
        date: format(yesterday, 'yyyy-MM-dd'),
        uniques: uniqueIps.length,
        ms: 2
      }),
      headers: { 'Content-Type': 'application/json' }
    })
  );

  console.log('response status:', response.status, 'response text:', await response.text());
})();

async function retry<T extends () => Promise<unknown>>(
  fn: T,
  retriesLeft = 3,
  interval = 1000,
  exponential = false
): Promise<ReturnType<typeof fn>> {
  try {
    return await fn();
  } catch (error) {
    if (retriesLeft) {
      await new Promise((r) => setTimeout(r, interval));
      console.log('retry', error.message);

      return retry(fn, retriesLeft - 1, exponential ? interval * 2 : interval, exponential);
    } else throw error;
  }
}
