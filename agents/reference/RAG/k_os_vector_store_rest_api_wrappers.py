from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from vector_store_api import VectorStoreAPI

app = FastAPI()
vector_api = VectorStoreAPI("http://localhost:8080")

class UpsertObject(BaseModel):
    id: str
    class_name: str
    metadata: dict
    vector: Optional[List[float]] = None

class QueryRequest(BaseModel):
    class_name: str
    query_vector: List[float]
    top_k: int = 10
    filters: Optional[dict] = None

class DeleteRequest(BaseModel):
    class_name: str
    object_ids: List[str]

@app.post("/vector/upsert")
def upsert_vectors(objs: List[UpsertObject]):
    try:
        for obj in objs:
            vector_api.upsert_vectors(obj.class_name, [{
                "id": obj.id,
                "metadata": obj.metadata,
                "vector": obj.vector
            }])
        return {"status": "success", "count": len(objs)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/vector/query")
def query_vectors(request: QueryRequest):
    try:
        result = vector_api.query_vectors(
            request.class_name,
            request.query_vector,
            top_k=request.top_k,
            filters=request.filters
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/vector/delete")
def delete_vectors(request: DeleteRequest):
    try:
        vector_api.delete_vectors(request.class_name, request.object_ids)
        return {"status": "deleted", "count": len(request.object_ids)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/vector/export/{class_name}")
def export_vectors(class_name: str):
    try:
        output_file = f"export_{class_name}.json"
        vector_api.export_vectors(class_name, output_file)
        return {"status": "exported", "file": output_file}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
