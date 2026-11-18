# GreenLoop Hosting Guide

How GreenLoop (React + Vite frontend, Express + MongoDB backend) is hosted on AWS EC2 with CloudFormation, Nginx, PM2 and GitHub Actions.

## 1. Architecture

```
Windows PC --git push--> GitHub (main) --GitHub Actions--> AWS EC2 (Ubuntu 24.04, t2.micro)
                                                              |
                                  Browser --HTTP :80--> Nginx |-- /            -> frontend/dist (React build)
                                                              |-- /uploads/    -> backend/uploads (files on disk)
                                                              '-- /api/        -> Express on 127.0.0.1:5000 (PM2)
                                                                                      |
                                                                                      v
                                                                              MongoDB Atlas (cloud)
```

- Only ports **80** (web) and **22** (SSH, key only) are open. Port 5000 is private to the server.
- The frontend calls the relative path `/api`, so the browser only talks to one address and no CORS setup is needed.

## 2. What was inspected in the project

| Item | Finding |
|---|---|
| Frontend | `frontend/`, React 18 + Vite + Tailwind, `BrowserRouter` (needs SPA fallback), build: `npm run build` -> `frontend/dist` |
| Backend | `backend/`, Express (ESM), entry `src/index.js`, start: `npm start`, port 5000 |
| Database | MongoDB via Mongoose, env variable `MONGO_URI` |
| Environment variables | `PORT`, `NODE_ENV`, `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL` |
| Uploads | multer saves photos to `backend/uploads`, served at `/uploads` |
| Health endpoint | `GET /api/health` |

## 3. Files added to the repository

| File | Purpose |
|---|---|
| `infra/ec2-instance.yaml` | CloudFormation: EC2 instance, key pair (stored in SSM Parameter Store), security group, first-boot setup (Node 22, Nginx, PM2, 1 GB swap) |
| `infra/nginx.conf` | Serves the frontend, SPA fallback, proxies `/api/`, serves `/uploads/`, caches hashed assets |
| `backend/ecosystem.config.cjs` | PM2 config: fork mode, 1 instance, auto-restart, 300 MB memory limit |
| `.github/workflows/deploy.yml` | The CI/CD pipeline (section 5) |
| `.gitattributes` | Forces LF line endings so Windows CRLF cannot break Linux scripts |
| `backend/src/app.js` (edited) | `trust proxy` in production, so the login rate limiter sees real client IPs behind Nginx |
| `.gitignore` | Excludes `node_modules`, `dist`, `.env` files and uploaded photos |

## 4. One-time setup

### 4.1 MongoDB Atlas
1. Create a free **M0** cluster (AWS, us-east-1).
2. **Database Access**: create a user with read/write access.
3. **Network Access**: allow `0.0.0.0/0` (the server IP changes whenever the lab restarts).
4. Build the connection string and include the database name:
   `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/greenloop?retryWrites=true&w=majority`

### 4.2 JWT secret
**[RUN ON WINDOWS, PowerShell]**
```powershell
-join ((1..48) | ForEach-Object { '{0:x2}' -f (Get-Random -Maximum 256) })
```

### 4.3 AWS Academy Learner Lab keys
1. AWS Academy -> course -> Modules -> **Learner Lab** -> **Start Lab**.
2. Wait for the green dot, then **AWS Details -> Show** next to "AWS CLI".
3. Copy `aws_access_key_id`, `aws_secret_access_key`, `aws_session_token`. They expire when the lab session ends (about 4 hours).

### 4.4 GitHub Secrets
Repo -> **Settings -> Secrets and variables -> Actions -> New repository secret**:

| Secret | Value |
|---|---|
| `AWS_ACCESS_KEY_ID` | from the Learner Lab |
| `AWS_SECRET_ACCESS_KEY` | from the Learner Lab |
| `AWS_SESSION_TOKEN` | from the Learner Lab |
| `MONGO_URI` | Atlas connection string |
| `JWT_SECRET` | the generated secret |

Never commit these values or any `.env` file.

### 4.5 Git (Windows)
**[RUN ON WINDOWS, PowerShell]**
```powershell
cd "C:\Users\nitro\Desktop\Mern stack assignment - deploy\greenloop"
git add .
git commit -m "your message"
git push origin main
```

## 5. What the pipeline does on every push to `main`

1. **Build the frontend** in GitHub (Node 22, `npm ci`, `npm run build`). Building in CI avoids running out of memory on the 1 GB server.
2. **Log in to AWS** using the three AWS secrets.
3. **Pick the AMI.** The first time it looks up the latest Ubuntu 24.04. After that it reuses the same AMI, so a newer image never replaces the server (which would erase uploaded photos).
4. **Deploy the CloudFormation stack** `greenloop-stack` (creates the server on the first run, does nothing if nothing changed).
5. **Start the server if it is stopped** and read its **live** public IP from EC2. After a lab restart the IP changes and the stack output is out of date.
6. **Fetch the SSH private key** from SSM Parameter Store (nothing to download or store manually).
7. **Wait for the first-boot setup** to finish (Node, Nginx, PM2 installed).
8. **Sync code with rsync**: `backend/` (without `node_modules`, `.env`, `uploads`), `frontend/dist/`, and `nginx.conf`.
9. **Write `backend/.env`** on the server from GitHub Secrets (sent over SSH, permissions `600`, never printed in logs).
10. **Install and restart**: `npm ci --omit=dev`, `pm2 startOrReload`, `pm2 save`, install the Nginx config, `nginx -t`, reload Nginx.
11. **Health check**: calls `http://<IP>/api/health` and prints the live URL.
12. **Delete the SSH key** from the runner.

## 6. Open the site
When the workflow is green, the last step prints `GreenLoop is live at http://<IP>`. Open that address in a browser. On first start with an empty database the app seeds demo data.

## 7. Lab expiry and recovery
When the Learner Lab session ends, the server stops and the AWS keys stop working. To bring the site back:
1. Start the lab again.
2. Copy the three new keys and update the three AWS secrets in GitHub.
3. Actions -> latest run -> **Re-run all jobs** (or push a commit).

The workflow starts the server and deploys again. The **IP address changes** after a restart, so use the new URL printed by the workflow.

## 8. Server maintenance
Connect with **EC2 Instance Connect** in the AWS console, then **[RUN ON AWS EC2]**:
```bash
pm2 status                              # is the API running?
pm2 logs --lines 50                     # backend logs
pm2 restart all --update-env            # restart the API
sudo tail -f /var/log/nginx/error.log   # Nginx errors
sudo nginx -t && sudo systemctl reload nginx
cat /var/log/userdata.log               # first-boot setup log
```

## 9. Troubleshooting

| Symptom | Cause / fix |
|---|---|
| Workflow fails at "Configure AWS credentials" | Missing or expired AWS secrets. Start the lab and update them. |
| Stack stuck in `ROLLBACK_COMPLETE` | Delete the stack in the CloudFormation console, then re-run. |
| `502 Bad Gateway` | The API is down. Run `pm2 logs`. Usually a wrong `MONGO_URI` or Atlas network access not set to `0.0.0.0/0`. |
| Refreshing `/explore` gives 404 | The SPA fallback (`try_files ... /index.html`) is missing in `nginx.conf`. |
| Photos missing after a redeploy | Uploads live in `backend/uploads` on the server and survive redeploys, but not deleting the stack. |
| Health check fails | `pm2 logs --lines 50`, then check the environment variables. |

## 10. Security notes
- SSH is open to `0.0.0.0/0` because GitHub-hosted runners have no fixed IPs. Access requires the private key, which is stored only in SSM.
- The site uses plain HTTP because there is no domain. With a domain, add HTTPS using Let's Encrypt (certbot).
- If a password was ever shared in plain text (chat, screenshot), reset it and update the GitHub secret.
