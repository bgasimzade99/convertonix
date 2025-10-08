# 🚀 Deployment Guide - ConvertAI.pro

## Prerequisites

- Node.js 18+
- PostgreSQL 14+ or MongoDB
- Redis (optional, for caching)
- Domain name
- SSL certificate

## Environment Setup

### 1. Frontend (.env)
```bash
VITE_API_URL=https://api.convertai.pro
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
VITE_GOOGLE_CLIENT_ID=...
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
```

### 2. Backend (server/.env)
```bash
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://user:password@host:5432/convertai
JWT_SECRET=your_super_secret_key_change_this
OPENAI_API_KEY=sk-...
STRIPE_SECRET_KEY=sk_live_...
FRONTEND_URL=https://convertai.pro
```

## Deployment Options

### Option 1: Vercel + Railway (Recommended)

#### Frontend (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Backend (Railway)
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Init project
cd server
railway init

# Deploy
railway up
```

### Option 2: AWS (Full Control)

#### 1. EC2 Setup
```bash
# SSH into EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install dependencies
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs nginx postgresql redis

# Clone repo
git clone https://github.com/yourusername/convertai.git
cd convertai

# Install dependencies
npm install
cd server && npm install && cd ..

# Build frontend
npm run build

# Setup Nginx
sudo nano /etc/nginx/sites-available/convertai
```

#### Nginx Config
```nginx
server {
    listen 80;
    server_name convertai.pro www.convertai.pro;

    # Frontend
    location / {
        root /home/ubuntu/convertai/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### SSL with Let's Encrypt
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d convertai.pro -d www.convertai.pro
```

#### PM2 for Backend
```bash
npm i -g pm2
cd server
pm2 start index.js --name convertai-api
pm2 startup
pm2 save
```

### Option 3: Docker

#### Dockerfile (Frontend)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Dockerfile (Backend)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY server/package*.json ./
RUN npm ci --only=production
COPY server/ .
EXPOSE 5000
CMD ["node", "index.js"]
```

#### docker-compose.yml
```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "80:80"
    depends_on:
      - backend
  
  backend:
    build: ./server
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/convertai
    depends_on:
      - db
      - redis
  
  db:
    image: postgres:14-alpine
    environment:
      - POSTGRES_DB=convertai
      - POSTGRES_PASSWORD=password
    volumes:
      - pgdata:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
    
volumes:
  pgdata:
```

Deploy:
```bash
docker-compose up -d
```

## Database Setup

### PostgreSQL
```sql
CREATE DATABASE convertai;
CREATE USER convertai_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE convertai TO convertai_user;
```

Run migrations:
```bash
cd server
npm run migrate
```

## Monitoring & Analytics

### 1. Google Analytics
Add to `index.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### 2. Sentry (Error Tracking)
```bash
npm install @sentry/react @sentry/node
```

### 3. PM2 Monitoring
```bash
pm2 install pm2-server-monit
pm2 monitor
```

## CDN Setup (Cloudflare)

1. Add domain to Cloudflare
2. Update nameservers
3. Enable SSL/TLS (Full)
4. Enable caching
5. Enable DDoS protection

## Backup Strategy

### Automated Database Backups
```bash
# Create backup script
cat > backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -U convertai_user convertai > backup_$DATE.sql
aws s3 cp backup_$DATE.sql s3://convertai-backups/
EOF

chmod +x backup.sh

# Add to crontab (daily at 2 AM)
crontab -e
0 2 * * * /path/to/backup.sh
```

## Performance Optimization

### 1. Enable Gzip
In Nginx:
```nginx
gzip on;
gzip_vary on;
gzip_types text/plain text/css application/json application/javascript;
```

### 2. Cache Static Assets
```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. Use CDN for Assets
Upload to S3 + CloudFront

## Security Checklist

- [ ] SSL/TLS enabled
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] SQL injection protection
- [ ] XSS protection
- [ ] Environment variables secured
- [ ] Database credentials rotated
- [ ] API keys in secrets manager
- [ ] Firewall rules configured
- [ ] Regular security updates

## Launch Checklist

- [ ] Domain configured
- [ ] SSL certificate installed
- [ ] Database migrated
- [ ] Environment variables set
- [ ] API keys configured
- [ ] Analytics tracking
- [ ] Error monitoring
- [ ] Backups automated
- [ ] Performance tested
- [ ] Security audited
- [ ] Documentation updated
- [ ] Marketing page ready
- [ ] Terms & Privacy policy
- [ ] Support email configured

## Post-Launch

1. Monitor logs: `pm2 logs`
2. Check analytics daily
3. Monitor error rates (Sentry)
4. Review performance metrics
5. User feedback collection
6. Iterate and improve

## Scaling

### Horizontal Scaling
```bash
pm2 start index.js -i max  # Use all CPU cores
```

### Load Balancer (AWS)
Use Application Load Balancer with multiple EC2 instances

### Database Scaling
- Read replicas for PostgreSQL
- Connection pooling
- Query optimization
- Indexing

## Support

- Email: support@convertai.pro
- Docs: https://docs.convertai.pro
- Status: https://status.convertai.pro

---

🚀 **Ready to launch! Good luck!**

