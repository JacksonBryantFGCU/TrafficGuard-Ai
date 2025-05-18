from flask import Flask, jsonify, request
from flask_cors import CORS
from getRouterData import get_router_data_via_ssh
from functools import wraps
import sqlite3
import os
import jwt
import datetime
from dotenv import load_dotenv

# Load .env values
load_dotenv()
EXPECTED_USERNAME = os.getenv("EXPECTED_USERNAME")
EXPECTED_PASSWORD = os.getenv("EXPECTED_PASSWORD")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

app = Flask(__name__)
CORS(app)

router_ip = ""
commands = {}

# Map of commands per router
router_commands_map = {
    "mango": {
        "cpu_usage": "top -bn1 | grep 'CPU:'",
        "memory_usage": "free",
        "wireless_clients": "iw dev wlan0 station dump",
        "firewall_rules": "iptables -L -v",
        "uptime_load": "uptime",
        "network_config": "ifconfig",
        "device_list": "cat /tmp/dhcp.leases",
        "log_output": "logread",
        "bandwidth": "cat /proc/net/dev"
    }
}

# ----------------- JWT Auth Decorator -----------------

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        # Allow preflight CORS requests through
        if request.method == 'OPTIONS':
            return f(*args, **kwargs)

        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing'}), 403
        try:
            jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token'}), 401
        return f(*args, **kwargs)
    return decorated

# ----------------- API Routes -----------------

@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if username == EXPECTED_USERNAME and password == EXPECTED_PASSWORD:
        token = jwt.encode({
            "user": username,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        }, JWT_SECRET_KEY, algorithm="HS256")

        return jsonify({"token": token, "message": "Login successful"})
    else:
        return jsonify({"message": "Unauthorized"}), 401

@app.route("/api/send_router_information", methods=["POST"])
@token_required
def send_router_info():
    data = request.get_json()
    global router_ip, commands
    router_ip = data.get("ip_address")
    router = data.get("router")
    commands = router_commands_map.get(router, {})
    return jsonify({"message": "Router info received"})

@app.route("/api/data", methods=["GET"])
@token_required
def get_data():
    try:
        network_log = get_router_data_via_ssh(router_ip, EXPECTED_USERNAME, EXPECTED_PASSWORD, commands["log_output"])
        device_list = get_router_data_via_ssh(router_ip, EXPECTED_USERNAME, EXPECTED_PASSWORD, commands["device_list"])
        general_info = get_router_data_via_ssh(router_ip, EXPECTED_USERNAME, EXPECTED_PASSWORD, commands["network_config"])

        data = {
            "message": "Data fetched successfully",
            "network_log": network_log,
            "device_list": device_list,
            "general_info": general_info
        }

        recreate_database()
        save_data_to_db(data)
        return jsonify(data)
    except Exception as e:
        return jsonify({"message": "Error fetching data", "error": str(e)}), 500

@app.route("/api/bandwidth", methods=["GET"])
@token_required
def get_bandwidth():
    try:
        output = get_router_data_via_ssh(router_ip, EXPECTED_USERNAME, EXPECTED_PASSWORD, commands["bandwidth"])
        lines = output.strip().split("\n")[2:]
        bandwidth_data = []
        for line in lines:
            parts = line.split()
            if len(parts) >= 10:
                bandwidth_data.append({
                    "interface": parts[0].strip(':'),
                    "receive_bytes": int(parts[1]),
                    "transmit_bytes": int(parts[9])
                })
        return jsonify({"status": "Success", "bandwidth": bandwidth_data})
    except Exception as e:
        return jsonify({"status": "Error", "error": str(e)})
    
@app.route("/api/devices", methods=["GET", "OPTIONS"])
@token_required
def get_devices():
    try:
        device_list = get_router_data_via_ssh(router_ip, EXPECTED_USERNAME, EXPECTED_PASSWORD, commands["device_list"])
        devices = []
        for line in device_list.strip().split("\n"):
            parts = line.split()
            if len(parts) >= 4:
                devices.append({
                    "lease_time": parts[0],
                    "mac_address": parts[1],
                    "ip_address": parts[2],
                    "hostname": parts[3] if len(parts) > 3 else "Unknown",
                })
        return jsonify({"status": "Success", "devices": devices})
    except Exception as e:
        return jsonify({"status": "Error", "error": str(e)})

@app.route("/api/logs", methods=["GET", "OPTIONS"])
@token_required
def get_logs():
    try:
        logs = get_router_data_via_ssh(router_ip, EXPECTED_USERNAME, EXPECTED_PASSWORD, commands["log_output"])
        return jsonify({"status": "Success", "logs": logs})
    except Exception as e:
        return jsonify({"status": "Error", "error": str(e)})

@app.route("/api/cpu_memory", methods=["GET", "OPTIONS"])
@token_required
def get_cpu_memory():
    try:
        cpu_output = get_router_data_via_ssh(router_ip, EXPECTED_USERNAME, EXPECTED_PASSWORD, commands["cpu_usage"])
        memory_output = get_router_data_via_ssh(router_ip, EXPECTED_USERNAME, EXPECTED_PASSWORD, commands["memory_usage"])

        cpu_data = {}
        for part in cpu_output.split():
            if "%" in part:
                key, value = part.split("%")
                cpu_data[key] = value

        memory_lines = memory_output.strip().split("\n")
        mem_data = {}
        if len(memory_lines) >= 2:
            headers = memory_lines[0].split()
            values = memory_lines[1].split()
            mem_data = dict(zip(headers, values))

        return jsonify({"status": "Success", "cpu": cpu_data, "memory": mem_data})
    except Exception as e:
        return jsonify({"status": "Error", "error": str(e)})

@app.route("/api/wireless_clients", methods=["GET", "OPTIONS"])
@token_required
def get_wireless_clients():
    try:
        wireless_clients = get_router_data_via_ssh(router_ip, EXPECTED_USERNAME, EXPECTED_PASSWORD, "iwinfo wlan0 assoclist")
        if not wireless_clients.strip():
            wireless_clients = get_router_data_via_ssh(router_ip, EXPECTED_USERNAME, EXPECTED_PASSWORD, "iw dev wlan0 station dump")
        return jsonify({"status": "Success", "wireless_clients": wireless_clients})
    except Exception as e:
        return jsonify({"status": "Error", "error": str(e)})

@app.route("/api/firewall_rules", methods=["GET", "OPTIONS"])
@token_required
def get_firewall_rules():
    try:
        rules = get_router_data_via_ssh(router_ip, EXPECTED_USERNAME, EXPECTED_PASSWORD, "iptables -L -v")
        if not rules.strip():
            rules = get_router_data_via_ssh(router_ip, EXPECTED_USERNAME, EXPECTED_PASSWORD, "cat /etc/config/firewall")
        return jsonify({"status": "Success", "firewall_rules": rules})
    except Exception as e:
        return jsonify({"status": "Error", "error": str(e)})

@app.route("/api/uptime_load", methods=["GET", "OPTIONS"])
@token_required
def get_uptime_load():
    try:
        uptime = get_router_data_via_ssh(router_ip, EXPECTED_USERNAME, EXPECTED_PASSWORD, commands["uptime_load"])
        return jsonify({"status": "Success", "uptime_load": uptime})
    except Exception as e:
        return jsonify({"status": "Error", "error": str(e)})

@app.route("/api/network_config", methods=["GET", "OPTIONS"])
@token_required
def get_network_config():
    try:
        config = get_router_data_via_ssh(router_ip, EXPECTED_USERNAME, EXPECTED_PASSWORD, commands["network_config"])
        return jsonify({"status": "Success", "network_config": config})
    except Exception as e:
        return jsonify({"status": "Error", "error": str(e)})

@app.route("/api/router-info", methods=["GET", "OPTIONS"])
@token_required
def get_router_info():
    try:
        return jsonify({
            "message": "Success",
            "router_ip": router_ip,
            "router_name": "Mango"  # Adjust dynamically if needed
        })
    except Exception as e:
        return jsonify({"message": "Error", "error": str(e)})


# ----------------- DB Helpers -----------------

def recreate_database():
    conn = sqlite3.connect('router_data.db')
    cursor = conn.cursor()
    cursor.execute("DROP TABLE IF EXISTS router_info")
    cursor.execute("""
        CREATE TABLE router_info (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            key TEXT,
            value TEXT
        )
    """)
    conn.commit()
    conn.close()

def save_data_to_db(data):
    conn = sqlite3.connect('router_data.db')
    cursor = conn.cursor()
    for key, value in data.items():
        cursor.execute("INSERT INTO router_info (key, value) VALUES (?, ?)", (key, str(value)))
    conn.commit()
    conn.close()

# ----------------- App Entry -----------------

if __name__ == "__main__":
    app.run(debug=True)
