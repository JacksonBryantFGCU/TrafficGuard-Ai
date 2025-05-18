# FL Home System

A smart home network monitoring dashboard developed for the **CEN 3037 - Computer Security** course at Florida Gulf Coast University.

This project interfaces with a router managing smart devices in a Florida home network. It allows authenticated users to view real-time network data, manage device connections, and interact with system-level information securely.

## 🔒 Project Overview

- Connects directly to the local smart router to display:
  - Connected devices
  - IP/MAC address information
  - Bandwidth usage
  - Uptime and CPU stats
- Built with a security-first approach to avoid exposing sensitive device or user data
- Designed to simulate a real-world smart home interface with secure user access

## 🛠️ Features

### ✅ Core Functionality
- Router connection interface
- Displays detailed network data
- Enforces basic authentication for access

### 🆕 Recent Updates
- 🔁 **Router Switching** – Users can now change which smart router to monitor
- 🔐 **Redesigned Login Page** – Clean, user-friendly login with authentication enhancements
- 🌙 **Dark Mode UI** – Full theme switch with improved visual accessibility
- 📌 **Fixed Navbar** – Persistent navigation bar for smoother UX

## 🧰 Tech Stack

- **Frontend**: HTML, CSS (Dark Mode styles), JavaScript
- **Backend**: Python (Flask) / Bash integration (for router queries)
- **Router Interface**: SSH or local CLI commands depending on the router model
- **Security**: Basic authentication with protected routes and local IP access control

## ⚙️ How to Run

> Ensure you're connected to the smart home network or VPN with router access enabled.

```bash
git clone https://github.com/your-username/fl-home-system.git
cd fl-home-system
# Configure environment variables and router credentials
python3 app.py
```
Access the system locally at: http://localhost:5000

Security Considerations
Router access is limited to pre-configured IP ranges

Sensitive credentials are stored using .env files (not committed)

No external data is sent outside the network

Contributor
Jackson Bryant
B.S. in Software Engineering – Florida Gulf Coast University
GitHub: @jacksonbryant-dev
Portfolio: jacksonbryantportfolio.netlify.app

Author
Chengyi Qu
Professor - Florida Gulf Coast University
