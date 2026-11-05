WEIGHTS = {'materials': .2, 'packaging': .15, 'durability': .15, 'energy': .1, 'repairability': .15, 'recyclability': .15, 'certifications': .05, 'carbon': .05}
def assess(attributes):
    available = {k: a['value'] for k, a in attributes.items() if k in WEIGHTS and a.get('value') is not None}
    if any(not 0 <= v <= 100 for v in available.values()):
        raise ValueError('Normalized scores must be between 0 and 100')
    denominator = sum(WEIGHTS[k] for k in available)
    return {'score': round(sum(v * WEIGHTS[k] for k, v in available.items()) / denominator) if len(available) >= 3 else None, 'completeness': round(len(available) / 8 * 100), 'version': 'sustainability-v1'}
