import weaviate
from typing import List, Dict, Optional

class VectorStoreAPI:
    def __init__(self, weaviate_url: str = "http://localhost:8080"):
        self.client = weaviate.Client(weaviate_url)

    def upsert_vectors(self, class_name: str, objects: List[Dict]):
        for obj in objects:
            self.client.data_object.create(
                data_object=obj['metadata'],
                class_name=class_name,
                uuid=obj['id'],
                vector=obj.get('vector')
            )

    def query_vectors(self, class_name: str, query_vector: List[float], top_k: int = 10, filters: Optional[Dict] = None):
        near_vector = {"vector": query_vector}
        where_filter = filters if filters else {}
        result = self.client.query.get(
            class_name,
            ["*"]
        ).with_near_vector(near_vector).with_where(where_filter).with_limit(top_k).do()
        return result

    def delete_vectors(self, class_name: str, object_ids: List[str]):
        for object_id in object_ids:
            self.client.data_object.delete(uuid=object_id, class_name=class_name)

    def export_vectors(self, class_name: str, output_path: str):
        all_data = self.client.query.get(class_name, ["*"]).with_limit(10000).do()
        with open(output_path, "w") as f:
            import json
            json.dump(all_data, f, indent=2)

    def ensure_schema(self, class_definitions: List[Dict]):
        existing = self.client.schema.get()["classes"]
        existing_classes = [cls["class"] for cls in existing]
        for cls in class_definitions:
            if cls["class"] not in existing_classes:
                self.client.schema.create(cls)

# Example Usage:
# api = VectorStoreAPI()
# api.ensure_schema([AKU_SCHEMA_JSON, SKILL_SCHEMA_JSON, ...])
# api.upsert_vectors("AKU", [{"id": "aku_1", "metadata": {...}, "vector": [...] }])
