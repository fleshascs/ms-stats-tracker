# **MS stats tracker**

## run using cron job

```shell script
docker build -t fleshas/stats_tracker .

docker run -d -e PROXY_API_KEY=d479087a3286a1362cc9d9fc56d733cb08c90cc3496ac6df028a01d5f92269 -v "/home/debian/ms/logs":/usr/app/logs -v "/home/debian/ms/logs":/usr/app/logs --name stats_tracker fleshas/stats_tracker:latest


docker run -d -e PROXY_API_KEY=d479087a3286a1362cc9d9fc56d733cb08c90cc3496ac6df028a01d5f92269 -v "/home/fleshas/workplace/stats-tracker/logs":/usr/app/logs --name stats_tracker fleshas/stats_tracker:latest
```
