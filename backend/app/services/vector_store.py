import numpy as np
from typing import List, Dict, Tuple
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import logging

logger = logging.getLogger(__name__)

class VectorStore:
    """
    Semantic vector store using TF-IDF / Sentence Embeddings
    for clinical trial eligibility semantic similarity retrieval.
    """

    def __init__(self):
        self.vectorizer = TfidfVectorizer(stop_words='english', max_features=5000)
        self.trial_ids: List[str] = []
        self.documents: List[str] = []
        self.tfidf_matrix = None
        self.use_transformer = False
        self.st_model = None

        try:
            from sentence_transformers import SentenceTransformer
            # Load lightweight biomedical/general sentence transformer model
            self.st_model = SentenceTransformer('all-MiniLM-L6-v2')
            self.use_transformer = True
            logger.info("SentenceTransformer model 'all-MiniLM-L6-v2' successfully loaded.")
        except Exception as e:
            logger.warning(f"SentenceTransformer fallback to TF-IDF vectorizer: {e}")
            self.use_transformer = False

    def index_trials(self, trials_data: List[Dict[str, str]]):
        """
        trials_data: list of dicts with 'id', 'text'
        """
        self.trial_ids = [t['id'] for t in trials_data]
        self.documents = [t['text'] for t in trials_data]

        if not self.documents:
            return

        if self.use_transformer and self.st_model:
            self.doc_embeddings = self.st_model.encode(self.documents, show_progress_bar=False)
        else:
            self.tfidf_matrix = self.vectorizer.fit_transform(self.documents)

    def calculate_similarity(self, query_text: str) -> Dict[str, float]:
        """
        Returns a mapping of trial_id -> float similarity score between 0.0 and 1.0
        """
        if not self.documents or not query_text:
            return {t_id: 0.5 for t_id in self.trial_ids}

        scores: Dict[str, float] = {}

        if self.use_transformer and self.st_model:
            query_embedding = self.st_model.encode([query_text], show_progress_bar=False)
            # Cosine similarity matrix multiplication
            sims = cosine_similarity(query_embedding, self.doc_embeddings)[0]
            for t_id, score in zip(self.trial_ids, sims):
                scores[t_id] = float(np.clip(score, 0.0, 1.0))
        else:
            query_vec = self.vectorizer.transform([query_text])
            sims = cosine_similarity(query_vec, self.tfidf_matrix)[0]
            for t_id, score in zip(self.trial_ids, sims):
                scores[t_id] = float(np.clip(score, 0.0, 1.0))

        return scores

vector_store = VectorStore()
