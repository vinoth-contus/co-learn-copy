#!/usr/bin/env bash
docker build . -t co-learn-pwa

docker run \
    --rm \
    --name=co-learn-pwa \
    --env 'LOGGER_CONFIG={"appenders":{"out":{"type":"stdout","layout":{"type":"pattern","pattern":"%[[%d] [%p] %c - %G{correlationId}%] - %m%n"}}},"categories":{"default":{"appenders":["out"],"level":"info"}}}' \
    -p 3001:80 \
    co-learn-pwa:latest
