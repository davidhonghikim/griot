# kOS Ronin - Reticulum Message Queue and Store-and-Forward Buffer
# Node Class: Ronin (Nomadic Starseed)

import json
import os
import time
from threading import Thread
import RNS

QUEUE_FILE = "./queue/reticulum_outbox.jsonl"
os.makedirs(os.path.dirname(QUEUE_FILE), exist_ok=True)

class ReticulumQueueManager:
    def __init__(self, identity_file="service_identity.pem"):
        self.identity = RNS.Identity.from_file(identity_file) if RNS.Identity.exists(identity_file) else RNS.Identity()
        self.destination = RNS.Destination(self.identity, RNS.Destination.SINGLE, RNS.Destination.PLAIN, "queue_forwarder")
        self.destination.set_callback(self.receive_ack)
        RNS.Transport()
        self.running = True
        Thread(target=self.process_queue, daemon=True).start()

    def queue_message(self, target, payload):
        entry = {"target": target, "payload": payload, "timestamp": time.time()}
        with open(QUEUE_FILE, "a") as f:
            f.write(json.dumps(entry) + "\n")
        print(f"📝 Queued message for {target}")

    def process_queue(self):
        while self.running:
            if os.path.exists(QUEUE_FILE):
                with open(QUEUE_FILE, "r") as f:
                    lines = f.readlines()
                remaining = []
                for line in lines:
                    entry = json.loads(line)
                    try:
                        dest_hash = RNS.Destination.hash_from_name(entry["target"])
                        packet = RNS.Packet(dest_hash, json.dumps(entry["payload"]).encode())
                        packet.send()
                        print(f"✅ Sent queued message to {entry['target']}")
                    except Exception as e:
                        print(f"❌ Failed to send queued message: {e}")
                        remaining.append(line)
                with open(QUEUE_FILE, "w") as f:
                    f.writelines(remaining)
            time.sleep(10)

    def receive_ack(self, packet, payload):
        print(f"🔔 Received ACK from {packet.source}: {payload}")

# --- Usage Example ---
if __name__ == "__main__":
    queue_mgr = ReticulumQueueManager()
    # Example: queue_mgr.queue_message("target_node_id", {"message": "Hello World"})

# ---
# ✅ Provides persistent disk-based queue for unsent messages
# ✅ Processes retry on next network availability
# ✅ Receives ACKs from target nodes
# ✅ Next step: Add message expiration, priority queuing, and encryption support
