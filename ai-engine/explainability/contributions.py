def contributions(components, weights):
    active = {k: v for k, v in components.items() if v is not None}
    denominator = sum(weights.get(k, 0) for k in active)
    if denominator <= 0:
        raise ValueError('Positive active weights required')
    return {k: v * weights.get(k, 0) / denominator for k, v in active.items()}
