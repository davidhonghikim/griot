# kOS Ronin - External Service Adapter Templates
# Node Class: Ronin (Nomadic Starseed)

import RNS
import time
import json
from flask import Flask, request, jsonify
import paho.mqtt.client as mqtt

# --- 1. Python Service Adapter Template (Direct Reticulum Node Service) ---
class ReticulumServiceAdapter:
    def __init__(self, identity_file="service_identity.pem"):
        self.identity = RNS.Identity.from_file(identity_file) if RNS.Identity.exists(identity_file) else RNS.Identity()
        self.destination = RNS.Destination(self.identity, RNS.Destination.SINGLE, RNS.Destination.PLAIN, "example_service")
        self.destination.set_callback(self.receive)
        RNS.Transport()

    def receive(self, packet, payload):
        print(f"📨 Received payload from {packet.source}: {payload}")
        # TODO: Add response logic here

    def send(self, target_hash, message):
        dest = RNS.Destination.hash_to_string(target_hash)
        RNS.Packet(dest, json.dumps(message).encode()).send()

# --- 2. HTTP-to-Reticulum Bridge Template ---
app = Flask(__name__)
reticulum_service = ReticulumServiceAdapter()

@app.route('/api/reticulum/send', methods=['POST'])
def send_reticulum():
    data = request.json
    target = data.get('target')
    message = data.get('message')
    reticulum_service.send(target, message)
    return jsonify({"status": "sent"})

# --- 3. MQTT-to-Reticulum Gateway Template ---
def on_mqtt_message(client, userdata, msg):
    payload = json.loads(msg.payload.decode())
    target = payload.get('target')
    message = payload.get('message')
    reticulum_service.send(target, message)
    print(f"📡 Forwarded MQTT message on {msg.topic} to Reticulum target {target}")

mqtt_client = mqtt.Client()
mqtt_client.on_message = on_mqtt_message
mqtt_client.connect("localhost", 1883, 60)
mqtt_client.subscribe("reticulum/forward")
mqtt_client.loop_start()

# --- Startup ---
if __name__ == "__main__":
    print("✅ Ronin External Service Adapter running (HTTP + MQTT + Reticulum)")
    app.run(port=6000)

# ---
# ✅ Provides Python templates for:
# - Reticulum-native service nodes
# - HTTP-to-Reticulum bridges
# - MQTT-to-Reticulum gateways
# ✅ Next optional step: Implement persistent message queues and store-and-forward buffering
