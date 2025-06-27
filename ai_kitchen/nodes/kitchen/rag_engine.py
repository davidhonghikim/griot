"""Retrieval-augmented generator (RAG) engine for recipes and semantic knowledge.
"""
from __future__ import annotations

from pathlib import Path
from typing import List

try:
    from llama_index import VectorStoreIndex, download_loader  # type: ignore
except ModuleNotFoundError:  # optional dependency
    VectorStoreIndex = None  # type: ignore

def load_all_recipes(directory: str | Path = Path(__file__).parents[3] / "recipes"):
    """Load all *.yaml recipes under *directory* and return list[str] docs."""
    directory = Path(directory)
    files: List[str] = [f.read_text() for f in directory.rglob("*.yaml")]
    return files


class RecipeIndex:
    def __init__(self):
        if VectorStoreIndex is None:
            raise RuntimeError("llama_index not installed – install 'llama-index' to enable RAG")
        documents = load_all_recipes()
        self.index = VectorStoreIndex.from_documents(documents)  # type: ignore[arg-type]

    def search(self, query: str):
        return self.index.query(query)
