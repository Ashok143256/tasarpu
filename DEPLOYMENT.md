# 🚀 Admin Panel Deployment Guide for VPS

## 📋 Overview
This guide will help you deploy the "श्री तसर्पु साना किसान कृषि सहकारी संस्था लि" Admin Panel on your VPS server.

---

## 🏗️ Prerequisites

### **Server Requirements**
- **OS**: Ubuntu 20.04+ / CentOS 8+ / Debian 11+
- **RAM**: Minimum 2GB, Recommended 4GB+
- **Storage**: Minimum 20GB SSD, Recommended 50GB+
- **CPU**: 2+ cores recommended
- **Node.js**: Version 18.0+ required
- **Domain**: Custom domain (optional but recommended)

### **Software Dependencies**
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 (Process Manager)
sudo npm install -g pm2

# Install Nginx (Web Server)
sudo apt install -y nginx

# Install Git
sudo apt install -y git
```

---

## 📁 Project Setup

### **1. Clone Repository**
```bash
# Create project directory
sudo mkdir -p /var/www/tasarpoo-admin
cd /var/www/tasarpoo-admin

# Clone your project (replace with your repo URL)
git clone https://github.com/yourusername/tasarpoo-admin.git .

# Set proper permissions
sudo chown -R www-data:www-data /var/www/tasarpoo-admin
sudo chmod -R 755 /var/www/tasarpoo-admin
```

### **2. Install Dependencies**
```bash
# Install Node.js dependencies
npm install

# Build the project
npm run build

# Verify build
ls -la .next/
```

---

## 🔧 Environment Configuration

### **1. Environment Variables**
Create `.env.production` file:
```bash
# In project root directory
cd /var/www/tasarpoo-admin

# Create production environment file
nano .env.production
```

Add these variables:
```env
# Database
DATABASE_URL="file:./dev.db"

# Next.js
NODE_ENV="production"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-super-secret-key-here"

# Admin credentials (change these!)
ADMIN_EMAIL="admin@tasarpoo.com"
ADMIN_PASSWORD="your-secure-password-here"

# Server settings
PORT=3000
HOST="0.0.0.0"
```

### **2. Generate Secure Secret**
```bash
# Generate random secret for NextAuth
openssl rand -base64 32
```

---

## 🌐 Nginx Configuration

### **1. Create Nginx Config**
```bash
sudo nano /etc/nginx/sites-available/tasarpoo-admin
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;
    
    # SSL Certificates (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Static files (optional, for better performance)
    location /_next/static/ {
        alias /var/www/tasarpoo-admin/.next/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### **2. Enable Site**
```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/tasarpoo-admin /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

---

## 🔒 SSL Certificate Setup

### **1. Install Certbot**
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### **2. Get SSL Certificate**
```bash
# Obtain and install SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com --email admin@your-domain.com --agree-tos --non-interactive
```

### **3. Auto-renewal Setup**
```bash
# Test auto-renewal
sudo certbot renew --dry-run

# Add to cron (auto-renewal)
sudo crontab -e
0 12 * * * /usr/bin/certbot renew --quiet && systemctl reload nginx
```

---

## 🚀 PM2 Process Management

### **1. Create PM2 Config**
Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'tasarpoo-admin',
    script: 'npm start',
    cwd: '/var/www/tasarpoo-admin',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/pm2/tasarpoo-admin-error.log',
    out_file: '/var/log/pm2/tasarpoo-admin-out.log',
    log_file: '/var/log/pm2/tasarpoo-admin-combined.log',
    time: true
  }]
}
```

### **2. Start Application with PM2**
```bash
# Create log directory
sudo mkdir -p /var/log/pm2

# Start the application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
pm2 startup
```

---

## 🔥 Firewall Configuration

### **1. UFW Firewall Setup**
```bash
# Enable UFW
sudo ufw enable

# Allow SSH
sudo ufw allow ssh

# Allow HTTP/HTTPS
sudo ufw allow 80
sudo ufw allow 443

# Allow Node.js port (only if needed)
sudo ufw allow 3000

# Enable firewall
sudo ufw enable
```

### **2. Fail2Ban Setup (Optional)**
```bash
# Install Fail2Ban
sudo apt install -y fail2ban

# Create jail for Nginx
sudo nano /etc/fail2ban/jail.local
```

Add this configuration:
```ini
[nginx-http-auth]
enabled = true
filter = nginx-http-auth
logpath = /var/log/nginx/error.log
maxretry = 3
bantime = 3600
```

```bash
# Restart Fail2Ban
sudo systemctl restart fail2ban
```

---

## 📊 Monitoring Setup

### **1. PM2 Monitoring**
```bash
# Monitor application
pm2 monit

# View logs
pm2 logs tasarpoo-admin

# Restart application
pm2 restart tasarpoo-admin

# View status
pm2 status
```

### **2. System Monitoring (Optional)**
```bash
# Install htop
sudo apt install -y htop

# Monitor system resources
htop

# Monitor disk space
df -h

# Monitor memory
free -h
```

---

## 🔄 Deployment Script

### **Create Automated Deploy Script**
Create `deploy.sh`:
```bash
#!/bin/bash

# Deployment script for Tasarpoo Admin Panel
echo "🚀 Starting deployment..."

# Navigate to project directory
cd /var/www/tasarpoo-admin

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build application
echo "🏗 Building application..."
npm run build

# Restart application with PM2
echo "🔄 Restarting application..."
pm2 restart tasarpoo-admin

# Restart Nginx
echo "🌐 Restarting Nginx..."
sudo systemctl restart nginx

echo "✅ Deployment completed!"
echo "🌍 Admin Panel: https://your-domain.com"
echo "📊 PM2 Monitor: pm2 status"
echo "📝 Logs: pm2 logs tasarpoo-admin"
```

Make it executable:
```bash
chmod +x deploy.sh
```

### **Usage:**
```bash
# Run deployment
./deploy.sh
```

---

## 🔧 Database Setup

### **1. Initialize Database**
```bash
# Navigate to project
cd /var/www/tasarpoo-admin

# Push database schema
npm run db:push

# Seed initial data (first time only)
curl -X POST http://localhost:3000/api/admin/seed
```

### **2. Database Backup Script**
Create `backup-db.sh`:
```bash
#!/bin/bash

# Database backup script
BACKUP_DIR="/var/backups/tasarpoo-admin"
DATE=$(date +%Y%m%d_%H%M%S)
DB_FILE="/var/www/tasarpoo-admin/dev.db"

# Create backup directory
mkdir -p $BACKUP_DIR

# Copy database
cp $DB_FILE $BACKUP_DIR/dev_backup_$DATE.db

# Keep only last 7 backups
find $BACKUP_DIR -name "dev_backup_*.db" -mtime +7 -delete

echo "✅ Database backed up: $BACKUP_DIR/dev_backup_$DATE.db"
```

---

## 🔍 Testing & Verification

### **1. Local Testing**
```bash
# Test application locally
npm run dev

# Check all endpoints
curl -I http://localhost:3000/admin/login
curl -I http://localhost:3000/api/admin/announcements
```

### **2. Production Testing**
```bash
# Test domain resolution
nslookup your-domain.com

# Test SSL certificate
curl -I https://your-domain.com

# Test all admin pages
curl -I https://your-domain.com/admin/login
curl -I https://your-domain.com/admin/announcements
curl -I https://your-domain.com/admin/training-events
curl -I https://your-domain.com/admin/inquiries
```

---

## 📱 Mobile & Performance Optimization

### **1. CDN Setup (Optional)**
```nginx
# Add to Nginx config for static assets
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    add_header X-CDN-Cache "HIT";
}
```

### **2. Performance Headers**
```nginx
# Add to server block
add_header X-Content-Type-Options "nosniff";
add_header X-Frame-Options "DENY";
add_header X-XSS-Protection "1; mode=block";
```

---

## 🔐 Security Best Practices

### **1. Update System Regularly**
```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Security updates
sudo apt unattended-upgrades
```

### **2. Change Default Credentials**
```bash
# Update admin credentials
# Edit .env.production file
nano .env.production

# Change these values:
ADMIN_EMAIL="your-new-admin@tasarpoo.com"
ADMIN_PASSWORD="your-very-secure-new-password"
```

### **3. Regular Backups**
```bash
# Add to crontab for daily backups
sudo crontab -e

# Add these lines:
0 2 * * * /var/www/tasarpoo-admin/backup-db.sh
0 3 * * * /var/backups/tasarpoo-admin/s3-backup.sh  # If using S3
```

---

## 🚨 Troubleshooting

### **Common Issues & Solutions**

#### **1. Application Not Starting**
```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs tasarpoo-admin --lines 50

# Check port availability
sudo netstat -tlnp | grep :3000
```

#### **2. Nginx 502 Bad Gateway**
```bash
# Check if Node.js is running
pm2 status

# Check Nginx configuration
sudo nginx -t

# Restart services
sudo systemctl restart nginx
pm2 restart tasarpoo-admin
```

#### **3. SSL Certificate Issues**
```bash
# Check certificate status
sudo certbot certificates

# Renew certificate
sudo certbot renew --force

# Restart Nginx
sudo systemctl restart nginx
```

#### **4. High Memory Usage**
```bash
# Check memory usage
free -h

# Check Node.js processes
ps aux | grep node

# Restart PM2 if needed
pm2 restart tasarpoo-admin
```

---

## 📞 Support & Maintenance

### **Useful Commands**
```bash
# Quick restart
pm2 restart tasarpoo-admin && sudo systemctl restart nginx

# View real-time logs
pm2 logs tasarpoo-admin --lines 100 -f

# System status
sudo systemctl status nginx pm2

# Disk usage
du -sh /var/www/tasarpoo-admin

# Memory usage
free -h && ps aux --sort=-%mem | head
```

### **Monitoring URLs**
- **Admin Panel**: `https://your-domain.com/admin`
- **PM2 Monitor**: `ssh user@your-server 'pm2 monit'`
- **System Logs**: `ssh user@your-server 'journalctl -u nginx -f'`

---

## 🎉 Post-Deployment Checklist

### **✅ Security**
- [ ] Changed default admin credentials
- [ ] Set up SSL certificate
- [ ] Configured firewall
- [ ] Set up Fail2Ban
- [ ] Regular backups scheduled

### **✅ Performance**
- [ ] Enabled gzip compression
- [ ] Set up caching headers
- [ ] Configured PM2 clustering
- [ ] Monitor system resources

### **✅ Functionality**
- [ ] All admin pages accessible
- [ ] Database operations working
- [ ] File uploads working
- [ ] Email notifications configured

---

## 📞 Emergency Contacts

### **If Something Goes Wrong**
1. **Check Logs**: `pm2 logs tasarpoo-admin`
2. **Restart Services**: `./deploy.sh`
3. **Check Status**: `pm2 status`
4. **Verify Domain**: `curl -I https://your-domain.com`

### **Rollback Plan**
```bash
# If deployment fails, rollback to previous version
cd /var/www/tasarpoo-admin
git log --oneline -n 1
git checkout HEAD~1
pm2 restart tasarpoo-admin
```

---

## 🎯 Success Metrics

### **Monitor These Metrics**
- **Uptime**: Application availability
- **Response Time**: Page load speed
- **Error Rate**: 500 errors per hour
- **Memory Usage**: RAM consumption
- **CPU Usage**: Processing load
- **Database Size**: Storage growth

---

## 🚀 Final Notes

1. **Replace `your-domain.com`** with your actual domain
2. **Change default credentials** before going live
3. **Test thoroughly** in staging first
4. **Monitor regularly** for performance issues
5. **Backup frequently** to prevent data loss
6. **Keep documentation** updated with changes

Your admin panel is now ready for production deployment! 🎉