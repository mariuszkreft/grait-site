FROM node:22-alpine
WORKDIR /app
COPY package.json server.js ./
COPY scripts ./scripts
COPY static ./static
ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 CMD wget -qO- http://127.0.0.1:8080/healthz || exit 1
CMD ["node", "server.js"]
