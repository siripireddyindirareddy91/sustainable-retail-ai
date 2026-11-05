"""Metrics require explicit held-out relevance labels; no accuracy is inferred."""
import json
import math
import argparse

def evaluate(recommendations, relevant, catalog_size, categories=None, k=10):
    if not relevant or catalog_size <= 0 or k <= 0:
        raise ValueError('Provide nonempty relevance labels, positive catalog size and k')
    precision, recall, ndcg, diversity = [], [], [], []
    coverage = set()
    for user, truth in relevant.items():
        truth = set(truth)
        if not truth:
            continue
        ranked = list(dict.fromkeys(recommendations.get(user, [])))[:k]
        hits = [int(p in truth) for p in ranked]
        precision.append(sum(hits) / k)
        recall.append(sum(hits) / len(truth))
        dcg = sum(hit / math.log2(i + 2) for i, hit in enumerate(hits))
        ideal = sum(1 / math.log2(i + 2) for i in range(min(k, len(truth))))
        ndcg.append(dcg / ideal if ideal else 0)
        coverage.update(ranked)
        if categories and ranked:
            diversity.append(len({categories.get(p, 'unknown') for p in ranked}) / len(ranked))
    avg = lambda values: sum(values) / len(values) if values else None
    return {'precision_at_k': avg(precision), 'recall_at_k': avg(recall), 'ndcg_at_k': avg(ndcg), 'coverage': len(coverage) / catalog_size, 'category_diversity': avg(diversity), 'users_evaluated': len(precision), 'k': k}

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('input', help='JSON containing recommendations, relevant and catalog_size')
    args = parser.parse_args()
    with open(args.input, encoding='utf-8') as stream:
        print(json.dumps(evaluate(**json.load(stream)), indent=2))
