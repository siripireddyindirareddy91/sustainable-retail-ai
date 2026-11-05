def learned_categories(events):
    weights = {'view': 1, 'wishlist': 3, 'cart': 4, 'purchase': 5}
    scores = {}
    for event in events:
        category = event['category']
        scores[category] = scores.get(category, 0) + weights.get(event['type'], 0)
    total = sum(scores.values())
    return {key: value / total for key, value in scores.items()} if total else {}
