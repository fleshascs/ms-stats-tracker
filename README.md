# **MS stats tracker**

## run using cron job

```shell script
docker build -t fleshas/stats_tracker .

docker run -d -e PROXY_API_KEY=123 -v "/home/debian/ms/logs":/usr/app/logs --name stats_tracker fleshas/stats_tracker:latest
```
