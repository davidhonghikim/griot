import pytest
from vector_store_api import VectorStoreAPI

@pytest.fixture(scope="module")
def api():
    return VectorStoreAPI("http://localhost:8080")

def test_schema_creation(api):
    dummy_schema = {
        "class": "TestEntity",
        "description": "Test Entity for Pytest",
        "vectorizer": "text2vec-openai",
        "properties": [
            {"name": "test_id", "dataType": ["string"]},
            {"name": "description", "dataType": ["text"]}
        ]
    }
    api.ensure_schema([dummy_schema])
    existing_classes = api.client.schema.get()["classes"]
    class_names = [c["class"] for c in existing_classes]
    assert "TestEntity" in class_names

def test_upsert_and_query(api):
    obj = {
        "id": "test_001",
        "metadata": {
            "test_id": "test_001",
            "description": "This is a test object for querying."
        },
        "vector": [0.1, 0.2, 0.3, 0.4]
    }
    api.upsert_vectors("TestEntity", [obj])
    query_result = api.query_vectors("TestEntity", obj["vector"], top_k=1)
    assert "data" in query_result
    assert len(query_result["data"]["Get"]["TestEntity"]) >= 1

def test_delete(api):
    api.delete_vectors("TestEntity", ["test_001"])
    query_result = api.query_vectors("TestEntity", [0.1, 0.2, 0.3, 0.4], top_k=1)
    assert "data" in query_result
    if "TestEntity" in query_result["data"]["Get"]:
        assert len(query_result["data"]["Get"]["TestEntity"]) == 0

def test_export(api, tmp_path):
    export_path = tmp_path / "test_export.json"
    api.export_vectors("TestEntity", str(export_path))
    assert export_path.exists()
    with open(export_path, "r") as f:
        data = f.read()
        assert "data" in data
