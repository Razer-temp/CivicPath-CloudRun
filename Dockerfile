# --- Build Stage ---
FROM node:20-slim AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build arguments for Vite environment variables
# These must be prefixed with VITE_ to be picked up by Vite
ARG VITE_GOOGLE_TRANSLATE_API_KEY
ARG VITE_GOOGLE_MAPS_API_KEY
ARG GEMINI_API_KEY

# Set as environment variables for the build process
ENV VITE_GOOGLE_TRANSLATE_API_KEY=$VITE_GOOGLE_TRANSLATE_API_KEY
ENV VITE_GOOGLE_MAPS_API_KEY=$VITE_GOOGLE_MAPS_API_KEY
ENV GEMINI_API_KEY=$GEMINI_API_KEY

# Run build
RUN npm run build

# --- Production Stage ---
FROM nginx:alpine

# Copy build output to nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8080 (Cloud Run default)
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
