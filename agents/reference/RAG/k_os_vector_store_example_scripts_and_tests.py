import json
from vector_store_api import VectorStoreAPI

# Load sample schemas (replace with actual schema JSONs)
AKU_SCHEMA_JSON = {
    "class": "AKU",
    "description": "Atomic Knowledge Unit",
    "vectorizer": "text2vec-openai",
    "properties": [
        {"name": "aku_id", "dataType": ["string"]},
        {"name": "content", "dataType": ["text"]},
        {"name": "tags", "dataType": ["string[]"]},
        {"name": "timestamp", "dataType": ["date"]},
        {"name": "agent_id", "dataType": ["string"]}
    ]
}

# Initialize API
api = VectorStoreAPI("http://localhost:8080")

# Ensure schema
api.ensure_schema([AKU_SCHEMA_JSON])

# Example upsert
sample_aku = {
    "id": "aku_20250628_001",
    "metadata": {
        "aku_id": "aku_20250628_001",
        "content": "The kOS architecture promotes modular agent design.",
        "tags": ["architecture", "agent"],
        "timestamp": "2025-06-28T12:00:00Z",
        "agent_id": "chatgpt-4o"
    },
    "vector": [0.123, 0.456, 0.789, 0.101]
}
api.upsert_vectors("AKU", [sample_aku])

# Example query
query_vector = [0.120, 0.450, 0.780, 0.100]
result = api.query_vectors("AKU", query_vector, top_k=5)
print("Query Result:", json.dumps(result, indent=2))

# Example delete
api.delete_vectors("AKU", ["aku_20250628_001"])

# Example export
api.export_vectors("AKU", "aku_export.json")

# ----------- Unit Test (Basic) ------------
def test_upsert_and_query():
    test_aku = {
        "id": "aku_test_001",
        "metadata": {
            "aku_id": "aku_test_001",
            "content": "Unit test AKU content.",
            "tags": ["test"],
            "timestamp": "2025-06-28T13:00:00Z",
            "agent_id": "test-agent"
        },
        "vector": [0.001, 0.002, 0.003, 0.004]
    }
    api.upsert_vectors("AKU", [test_aku])
    query_result = api.query_vectors("AKU", test_aku["vector"], top_k=1)
    assert "data" in query_result, "Query response missing data key"
    print("Unit test passed: Upsert and query successful.")

if __name__ == "__main__":
    test_upsert_and_query()
