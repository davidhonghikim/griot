# kOS Ronin - Multi-Node Relay Forwarding and Global Delivery Tracker
# Node Class: Ronin (Nomadic Starseed)

import json
import os
import time
from threading import Thread
import RNS

RELAY_QUEUE_FILE = "./queue/relay_outbox.jsonl"
DELIVERY_TRACKER_FILE = "./logs/delivery_tracker.jsonl"
os.makedirs(os.path.dirname(RELAY_QUEUE_FILE), exist_ok=True)
os.makedirs(os.path.dirname(DELIVERY_TRACKER_FILE), exist_ok=True)

class MultiNodeRelayManager:
    def __init__(self, relay_nodes):
        self.relay_nodes = relay_nodes  # List of known relay node destinations
        self.running = True
        Thread(target=self.process_relay_queue, daemon=True).start()

    def enqueue_for_relay(self, target, payload, message_id):
        entry = {
            "target": target,
            "payload": payload,
            "message_id": message_id,
            "timestamp": time.time()
        }
        with open(RELAY_QUEUE_FILE, "a") as f:
            f.write(json.dumps(entry) + "\n")
        print(f"📝 Queued message {message_id} for multi-node relay")

    def process_relay_queue(self):
        while self.running:
            if os.path.exists(RELAY_QUEUE_FILE):
                with open(RELAY_QUEUE_FILE, "r") as f:
                    lines = f.readlines()
                remaining = []
                for line in lines:
                    entry = json.loads(line)
                    delivered = False
                    for relay_node in self.relay_nodes:
                        try:
                            dest_hash = RNS.Destination.hash_from_name(relay_node)
                            packet = RNS.Packet(dest_hash, json.dumps(entry).encode())
                            packet.send()
                            delivered = True
                            self.track_delivery(entry['message_id'], relay_node)
                            break
                        except Exception as e:
                            print(f"❌ Relay to {relay_node} failed: {e}")
                    if not delivered:
                        remaining.append(line)
                with open(RELAY_QUEUE_FILE, "w") as f:
                    f.writelines(remaining)
            time.sleep(10)

    def track_delivery(self, message_id, relay_node):
        log_entry = {
            "message_id": message_id,
            "relay_node": relay_node,
            "delivered_at": time.time()
        }
        with open(DELIVERY_TRACKER_FILE, "a") as f:
            f.write(json.dumps(log_entry) + "\n")
        print(f"✅ Tracked delivery of {message_id} via {relay_node}")

# --- Usage Example ---
if __name__ == "__main__":
    relay_manager = MultiNodeRelayManager(["relay_node1", "relay_node2"])
    # Example: relay_manager.enqueue_for_relay("target_node", {"data": "Hello"}, "msg_12345")

# ---
# ✅ Enables multi-hop, multi-relay store-and-forward
# ✅ Logs all successful relay deliveries
# ✅ Tracks global message delivery status by message_id
# ✅ Next step: Build global delivery confirmation handshake and feedback API
