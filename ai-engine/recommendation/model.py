"""Optional offline hybrid model. No separate service is needed for the web fallback."""
from __future__ import annotations
import json
from pathlib import Path
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class HybridRecommender:
    def __init__(self, products: list[dict]):
        self.products = products
        self.frame = pd.DataFrame(products)
        self.vectorizer = TfidfVectorizer(stop_words='english', ngram_range=(1, 2))
        self.vectors = self.vectorizer.fit_transform([f"{p['name']} {p['category']} {p['brand']} {p['description']} {p['materials']}" for p in products])
        self.interactions = None

    def fit_interactions(self, events: pd.DataFrame):
        """Accept observed user_id, product_id, weight; never fabricate users."""
        required = {'user_id', 'product_id', 'weight'}
        if not required.issubset(events.columns):
            raise ValueError(f'Missing columns: {required - set(events.columns)}')
        if len(events) < 20 or events.user_id.nunique() < 3:
            self.interactions = None
            return {'mode': 'cold-start', 'reason': 'Insufficient real interactions'}
        events = events[events.product_id.isin(self.frame.id)]
        self.interactions = events.pivot_table(index='user_id', columns='product_id', values='weight', aggfunc='sum', fill_value=0)
        return {'mode': 'hybrid', 'users': len(self.interactions)}

    def recommend(self, query: str, budget: float | None = None, user_id: str | None = None, k: int = 10):
        if k < 1 or (budget is not None and budget <= 0):
            raise ValueError('Budget and k must be positive')
        content = cosine_similarity(self.vectorizer.transform([query]), self.vectors).ravel()
        collaborative = np.zeros(len(self.products))
        mode = 'cold-start-content'
        if self.interactions is not None and user_id in self.interactions.index:
            matrix = self.interactions
            similarities = cosine_similarity(matrix.loc[[user_id]], matrix).ravel()
            similarities[matrix.index.get_loc(user_id)] = 0
            scores = similarities @ matrix.to_numpy() / max(similarities.sum(), 1e-9)
            lookup = dict(zip(matrix.columns, scores))
            collaborative = np.array([lookup.get(p['id'], 0) for p in self.products])
            if collaborative.max() > 0:
                collaborative /= collaborative.max()
                mode = 'hybrid-content-collaborative'
        score = content * (0.75 if mode.startswith('hybrid') else 1) + collaborative * 0.25
        output = []
        for idx in np.argsort(-score):
            p = self.products[int(idx)]
            if budget is not None and p['price'] > budget:
                continue
            if query.strip() and content[idx] == 0:
                continue
            output.append({'product_id': p['id'], 'score': round(float(score[idx]), 5), 'content': float(content[idx]), 'collaborative': float(collaborative[idx]), 'mode': mode})
            if len(output) == k:
                break
        return output

if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--query', default='cotton clothing')
    parser.add_argument('--budget', type=float)
    parser.add_argument('--interactions', help='CSV with observed user_id, product_id, weight')
    parser.add_argument('--user')
    args = parser.parse_args()
    model = HybridRecommender(json.loads((Path(__file__).parents[1] / 'catalog.json').read_text(encoding='utf-8')))
    if args.interactions:
        model.fit_interactions(pd.read_csv(args.interactions))
    print(json.dumps(model.recommend(args.query, args.budget, args.user), indent=2))
