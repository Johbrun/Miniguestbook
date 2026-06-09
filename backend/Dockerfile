FROM node:latest

WORKDIR /app

COPY . .

RUN npm install && npm run build && npm run seed

ENV ADMIN_BOOTSTRAP_PASSWORD=Sup3rAdmin!2025
ENV SESSION_SECRET=s3cr3t_guestbook_signing_key_9f1c2a7b4e8d

EXPOSE 3001

CMD ["node", "dist/index.js"]
