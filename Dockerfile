# Bundle static assets with nginx
FROM nginx:1.21.0-alpine as production

ENV NODE_ENV production

# Add your nginx.conf
COPY config/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder
COPY /build /usr/share/nginx/html

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]