# kOS Ronin - Store-and-Forward with Priority Queuing and Encryption
# Node Class: Ronin (Nomadic Starseed)

import json
import os
import time
import heapq
from threading import Thread
import RNS

QUEUE_FILE = "./queue/reticulum_outbox_priority.jsonl"
ENCRYPTION_KEY = b'secretkey1234567'  # Example key for symmetric encryption (16 bytes for AES-128)
os.makedirs(os.path.dirname(QUEUE_FILE), exist_ok=True)

class PriorityMessageQueue:
    def __init__(self):
        self.heap = []
        self.load_queue()

    def load_queue(self):
        if os.path.exists(QUEUE_FILE):
            with open(QUEUE_FILE, 'r') as f:
                for line in f:
                    entry = json.loads(line)
                    heapq.heappush(self.heap, (entry['priority'], entry))

    def save_queue(self):
        with open(QUEUE_FILE, 'w') as f:
            for priority, entry in self.heap:
                f.write(json.dumps(entry) + "\n")

    def enqueue(self, target, payload, priority=1, expire_time=3600):
        encrypted_payload = RNS.Cryptography.symmetric_encrypt(json.dumps(payload).encode(), ENCRYPTION_KEY)
        entry = {
            "target": target,
            "payload": encrypted_payload.hex(),
            "priority": priority,
            "timestamp": time.time(),
            "expire": time.time() + expire_time
        }
        heapq.heappush(self.heap, (priority, entry))
        self.save_queue()
        print(f"📝 Queued (priority {priority}) message for {target}")

    def get_next(self):
        if self.heap:
            _, entry = heapq.heappop(self.heap)
            return entry
        return None

class SecureStoreAndForward:
    def __init__(self):
        self.queue = PriorityMessageQueue()
        self.running = True
        Thread(target=self.process_queue, daemon=True).start()

    def process_queue(self):
        while self.running:
            entry = self.queue.get_next()
            if entry:
                if time.time() > entry['expire']:
                    print(f"⏰ Expired message for {entry['target']}, skipping.")
                    continue
                try:
                    dest_hash = RNS.Destination.hash_from_name(entry['target'])
                    decrypted_payload = RNS.Cryptography.symmetric_decrypt(bytes.fromhex(entry['payload']), ENCRYPTION_KEY)
                    packet = RNS.Packet(dest_hash, decrypted_payload)
                    packet.send()
                    print(f"✅ Sent priority message to {entry['target']}")
                except Exception as e:
                    print(f"❌ Failed to send: {e}")
                    self.queue.enqueue(entry['target'], json.loads(decrypted_payload.decode()), entry['priority'])
            time.sleep(5)

# --- Usage Example ---
if __name__ == "__main__":
    sf = SecureStoreAndForward()
    # Example enqueue: sf.queue.enqueue("target_node_id", {"message": "Urgent Data"}, priority=0, expire_time=1800)

# ---
# ✅ Supports priority levels
# ✅ Expiration time for each message
# ✅ Symmetric encryption of payloads
# ✅ Automatic retry on failure
# ✅ Next step: Build multi-node relay forwarding and global delivery tracking
