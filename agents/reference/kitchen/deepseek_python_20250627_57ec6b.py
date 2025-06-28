# kitchen/rag_engine.py
from llama_index import VectorStoreIndex

class RecipeIndex:
    def __init__(self):
        self.index = VectorStoreIndex.from_documents(
            load_all_recipes()  # Parses /recipes/**/*.yaml
        )
    
    def search(self, query):
        return self.index.query(
            "Find recipes for noir films using lora:noir_style_v2"
        )