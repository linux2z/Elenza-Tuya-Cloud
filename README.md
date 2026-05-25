<p align="center">
  <img src="client/public/assets/machines/elenza-pro/hero-placement.png" alt="Elenza Pro Espresso Machine" width="400"/>
</p>

<h1 align="center">E L E N Z A</h1>
<p align="center">
  <strong>Enterprise Smart IoT Espresso System & Telemetry Platform</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-Tuya%20IoT%20Cloud-e0b47b?style=for-the-badge&logo=iot&logoColor=black" alt="Tuya IoT Cloud Badge"/>
  <img src="https://img.shields.io/badge/Frontend-Next.js%2016%20%2F%20React-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js Badge"/>
  <img src="https://img.shields.io/badge/Backend-Node.js%20%2F%20Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js Badge"/>
  <img src="https://img.shields.io/badge/Production-AWS%20VPS%20%2F%20Nginx-232F3E?style=for-the-badge&logo=amazonwebservices&logoColor=white" alt="AWS Badge"/>
</p>

---

## 🌟 Premium Telemetry & UI Showcase

The **Elenza Pro** dashboard is designed to feel like a high-end luxury operating system—combining cinematic home-screen visuals with advanced operational telemetry and detailed thermodynamic extraction graphs.

<table align="center" border="0" cellpadding="5" cellspacing="5">
  <tr>
    <td align="center" width="50%">
      <strong>1. Home Telemetry Dashboard</strong><br/>
      <img src="client/public/assets/screenshots/home.png" alt="Home Dashboard" width="100%" style="border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);"/>
    </td>
    <td align="center" width="50%">
      <strong>2. Custom Recipe Studio</strong><br/>
      <img src="client/public/assets/screenshots/recipes.png" alt="Recipe Studio" width="100%" style="border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);"/>
    </td>
  </tr>
  <tr>
    <td align="center" width="50%">
      <strong>3. Real-Time System Analytics</strong><br/>
      <img src="client/public/assets/screenshots/stats.png" alt="System Analytics" width="100%" style="border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);"/>
    </td>
    <td align="center" width="50%">
      <strong>4. Maintenance & Diagnostics Hub</strong><br/>
      <img src="client/public/assets/screenshots/system.png" alt="Diagnostics Hub" width="100%" style="border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);"/>
    </td>
  </tr>
</table>

---

## ⚡ 1. Production Architecture Snapshot

```mermaid
graph TD
  User([Client Browser]) -->|HTTP/HTTPS Ports 80 & 443| Nginx[Nginx Reverse Proxy]
  Nginx -->|Proxy Root /| NextJS[Next.js Client: Port 3000]
  Nginx -->|Proxy REST /api| NodeAPI[Express API: Port 3001]
  Nginx -->|Proxy Sockets /socket.io| NodeAPI
  NodeAPI -->|Dynamic PID Polling| TuyaCloud([Tuya Cloud IoT API])
```

- **Live IP/Host**: `http://54.162.197.40`
- **Frontend Port**: `3000` (Next.js Production Build)
- **Backend Port**: `3001` (Pre-compiled JavaScript Engine)
- **Process Management**: **PM2** Process Manager (Auto-restart, crash recovery, persistence)
- **Reverse Proxy**: **Nginx 1.28** (Maps port 3000 client and port 3001 backend on Port 80)

---

## 🛠️ 2. Monorepo Structure

```text
Elenza/
├── client/          # Next.js 16 Luxury React Frontend
│   ├── public/      # Core design assets and placement graphics
│   └── src/         # High-precision charts, WebSockets, and state triggers
└── server/          # Node.js Express Socket Telemetry Bridge
    ├── src/         # Tuya REST and WebSockets polling endpoints
    └── dist/        # Optimized production build target
```

---

## ⚙️ 3. Server Deployment Details

### 3.1 Virtual Memory Optimization (Swap Space)
To build Next.js production bundles stably without getting OOM-killed (Out-Of-Memory) by the Linux kernel on small 1GB RAM VPS instances, a **2GB swap space** is configured on the host:
```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### 3.2 PM2 Process Configurations
Both applications run permanently in the background under PM2:
*   **Express Server**: `elenza-server` (Running `node dist/index.js` inside `/home/ubuntu/elenza/server`)
*   **Next.js Client**: `elenza-client` (Running `npm run start` inside `/home/ubuntu/elenza/client`)

PM2 lists, logs, and processes are persisted across server reboots:
```bash
pm2 status                  # Check running instances
pm2 logs                    # Check aggregated standard/error outputs
pm2 restart all             # Restart both frontend and backend
pm2 save                    # Save configuration to disk for auto-boots
```

### 3.3 Nginx Reverse Proxy Config (Dual Port HTTP/HTTPS SSL)
Located at `/etc/nginx/sites-available/default`, the reverse proxy is calibrated to support both plain text HTTP (Port 80) and secure HTTPS (Port 443) using a self-signed SSL certificate:
```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    listen 443 ssl default_server;
    listen [::]:443 ssl default_server;

    ssl_certificate /etc/ssl/certs/nginx-selfsigned.crt;
    ssl_certificate_key /etc/ssl/private/nginx-selfsigned.key;

    server_name _;

    # Frontend Client
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # REST APIs / Express Backend
    location /api/ {
        proxy_pass http://127.0.0.1:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Socket.io Live Telemetry
    location /socket.io/ {
        proxy_pass http://127.0.0.1:3001/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

---

## 🏁 4. Operational & Restart Procedures

If you need to redeploy or restart the stack remotely:

1.  **Connect to the VPS**:
    ```bash
    ssh -i missionx.key ubuntu@54.162.197.40
    ```
2.  **Pull changes & Rebuild Frontend**:
    ```bash
    cd /home/ubuntu/elenza/client
    npm run build
    pm2 restart elenza-client
    ```
3.  **Rebuild Backend**:
    ```bash
    cd /home/ubuntu/elenza/server
    npm run build
    pm2 restart elenza-server
    ```

---

## 🔒 5. GitHub Connection & Setup Best Practices

To initialize and push changes to GitHub without authentication or connection errors, follow this simple 3-step checklist:

### Step 1: Ensure your identity is set up (usually persistent)
If you ever switch systems or profiles, verify or set your user credentials:
```powershell
git config --global user.name "Zehri"
git config --global user.email "bitcoinsharjah5@gmail.com"
```

### Step 2: Enable the Credential Helper
Ensure Git remembers your logins using Windows' secure storage:
```powershell
git config --global credential.helper manager
```

### Step 3: Pushing a New Repository for the First Time
When creating a new repository, run these exact steps to ensure a smooth, error-free first push:

1. **Initialize Git in the local folder**:
   ```powershell
   git init -b main
   ```
2. **Add your files and commit them**:
   ```powershell
   git add -A
   git commit -m "Initial commit"
   ```
3. **Link your local repository to your remote GitHub repository**:
   ```powershell
   git remote add origin https://github.com/linux2z/Elenza-Tuya-Cloud.git
   ```
4. **Push to remote** (if a login popup appears, simply complete the standard web browser verification once):
   ```powershell
   git push -u origin main
   ```

Because your credentials are tied directly to Windows secure storage, you can freely create, modify, and push your hardware/software files without credential interruptions!
