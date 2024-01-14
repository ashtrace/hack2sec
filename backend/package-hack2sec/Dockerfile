FROM node:latest

WORKDIR /app

COPY ./app /app
RUN npm install

ENV ACCESS_TOKEN_SECRET=<your JWT access token secret here>
ENV REFRESH_TOKEN_SECRET=<your JWT refresh token secret here>
ENV PASSWORD_RESET_TOKEN_SECRET=<your Password reset token secret here>
ENV PASSWORD_RESET_TOKEN_VALIDITY=30m
ENV DATABASE_URI=mongodb://hack2sec-mongodb-server:27017/hack2sec?retryWrites=true
ENV MINIO_CHALLENGE_BUCKET_NAME=hack2sec
ENV RBAC_ADMIN_ID=<unique id here, eg: 65aa8d5e27092546f7951234>
ENV RBAC_FACULTY_ID=<unique id here, eg: 65aa8d5e27092546f7951234>
ENV RBAC_USER_ID=<unique id here, eg: 65aa8d5e27092546f7951234>
ENV FACULTY_PASSWORD_LENGTH=15
ENV ADMIN_EMAIL_ADDRESS=<local administrator email address>
ENV GOOGLE_OAUTH2_CLIENT_ID=<if gmail is used, else change to OAuth secret of your mail provider>
ENV GOOGLE_OAUTH2_CLIENT_SECRET=<if gmail is used, else change to OAuth secret of your mail provider>
ENV GOOGLE_OAUTH2_REDIRECT_URI=<if gmail is used, else change to OAuth secret of your mail provider>
ENV GMAIL_API_REFRESH_TOKEN=<if gmail is used, else change to OAuth secret of your mail provider>

CMD node server.js
