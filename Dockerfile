FROM node:22-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM node:22-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --omit=dev
COPY backend/src/ ./src/
COPY --from=frontend-build /app/frontend/dist ./static

ENV STATIC_DIR=/app/static
EXPOSE 3000
CMD ["node", "src/main.js"]
