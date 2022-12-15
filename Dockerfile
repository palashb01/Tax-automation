FROM node:19-alpine3.16
WORKDIR /tax-automation-backend
COPY . /tax-automation-backend/
RUN set -eux \
    & apk add \
        --no-cache \
        nodejs \
        yarn
RUN yarn
CMD ["yarn","start"]
