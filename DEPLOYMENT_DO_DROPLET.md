# DigitalOcean Droplet Deployment Guide

This is the recommended deployment path for `lead_cleaner` as of 2026-06-05.

## Recommended Stack

- Hosting: DigitalOcean Droplet
- Domain registrar: Namecheap
- OS: Ubuntu 24.04 LTS
- Runtime: Node.js 22 LTS
- Process manager: PM2
- Reverse proxy: Nginx
- SSL: Let's Encrypt via Certbot

## Recommended Droplet Size

For this Next.js app, start with:

- Basic Droplet
- 2 GB RAM
- 1 vCPU
- 50 GB SSD

Why:

- Safer than 1 GB for `npm install`, `next build`, PM2, and Nginx on one box
- Still reasonably cheap for an MVP
- Easy to scale up later

If traffic stays very small, 1 GB may work, but 2 GB is the safer launch choice.

## Domain Plan

- Buy `leadcleaner.xyz` on Namecheap
- Point the domain to the Droplet public IP using `A` records

Suggested DNS records:

- `@` -> `<your_droplet_ip>`
- `www` -> `<your_droplet_ip>`

Use a low TTL while setting up, then increase it later if you want.

## App Assumptions

This repo uses:

- Next.js
- `npm run build`
- `npm run start`

Current app port plan:

- Next.js app runs on `3000`
- Nginx listens on `80` and `443`

## 1. Create the Droplet

Choose:

- Ubuntu 24.04 LTS
- Basic plan
- 2 GB RAM
- Datacenter region closest to your users
- SSH key login preferred over password login

After creation, note the public IP.

## 2. Point the Domain

In Namecheap DNS:

- create `A` record for `@`
- create `A` record for `www`
- both should point to the Droplet IP

Wait for DNS propagation.

## 3. SSH into the Server

```bash
ssh root@YOUR_DROPLET_IP
```

## 4. Create a Deploy User

```bash
adduser deploy
usermod -aG sudo deploy
rsync --archive --chown=deploy:deploy ~/.ssh /home/deploy
```

Then reconnect:

```bash
ssh deploy@YOUR_DROPLET_IP
```

## 5. Update the Server

```bash
sudo apt update
sudo apt upgrade -y
```

## 6. Install Node.js 22

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```

## 7. Install PM2, Nginx, and Git

```bash
sudo npm install -g pm2
sudo apt install -y nginx git
```

Optional but recommended:

```bash
sudo apt install -y ufw
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## 8. Clone the Repo

```bash
cd /var/www
sudo mkdir -p /var/www
sudo chown -R deploy:deploy /var/www
cd /var/www
git clone YOUR_GITHUB_REPO_URL lead_cleaner
cd lead_cleaner
```

If the repo is private, use SSH deploy keys or GitHub CLI.

## 9. Install Dependencies and Build

```bash
npm install
npm run build
```

## 10. Environment Variables

Create a `.env.production` file in the project root.

Suggested values:

```env
NEXT_PUBLIC_SITE_URL=https://leadcleanr.com
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=leadcleanr.com
NEXT_PUBLIC_GA_ID=
ERROR_TRACKING_WEBHOOK_URL=
```

Notes:

- Leave analytics variables empty if you are not using them yet
- If your final domain is `leadcleaner.xyz`, set `NEXT_PUBLIC_SITE_URL=https://leadcleaner.xyz`
- Update metadata later if you permanently change branding/domain

## 11. Start the App with PM2

Run the app on port `3000`:

```bash
pm2 start npm --name leadcleanr -- start
pm2 save
pm2 startup
```

After `pm2 startup`, copy and run the command PM2 prints.

Useful PM2 commands:

```bash
pm2 status
pm2 logs leadcleanr
pm2 restart leadcleanr
pm2 stop leadcleanr
```

## 12. Configure Nginx

Create an Nginx site file:

```bash
sudo nano /etc/nginx/sites-available/leadcleanr
```

Paste this:

```nginx
server {
    listen 80;
    server_name leadcleanr.com www.leadcleanr.com leadcleaner.xyz www.leadcleaner.xyz;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable it:

```bash
sudo ln -s /etc/nginx/sites-available/leadcleanr /etc/nginx/sites-enabled/leadcleanr
sudo nginx -t
sudo systemctl restart nginx
```

Optional cleanup:

```bash
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

## 13. Add SSL with Certbot

Install Certbot:

```bash
sudo apt install -y certbot python3-certbot-nginx
```

Issue certificates:

```bash
sudo certbot --nginx -d leadcleaner.xyz -d www.leadcleaner.xyz
```

If you launch on `leadcleanr.com` instead, replace the domains accordingly.

Test renewal:

```bash
sudo certbot renew --dry-run
```

## 14. Deploy Updates Later

For future deploys:

```bash
cd /var/www/lead_cleaner
git pull origin main
npm install
npm run build
pm2 restart leadcleanr
```

## 15. Basic Monitoring Commands

```bash
pm2 logs leadcleanr
pm2 monit
sudo systemctl status nginx
df -h
free -h
```

## 16. Launch Checklist

- Domain points to the Droplet IP
- `npm run build` succeeds on the server
- PM2 app is running
- Nginx is proxying to port `3000`
- SSL is active
- Homepage loads on the real domain
- `/tools/csv-lead-cleaner` loads correctly
- `robots.txt` works
- `sitemap.xml` works
- contact emails can be added later

## 17. Final Recommendation

Use:

- DigitalOcean Basic Droplet
- 2 GB RAM
- Ubuntu 24.04
- Namecheap domain
- PM2 + Nginx + Certbot

This is the best balance of cost, control, and reliability for the current MVP.
