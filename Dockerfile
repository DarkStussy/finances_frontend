FROM node:19.6-alpine
WORKDIR /app
COPY package-lock.json .
COPY package.json .
RUN npm ci

COPY . .
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL $REACT_APP_API_URL

RUN npm run build
EXPOSE 3000
CMD ["npx", "serve", "build"]