import unittest
from evaluation.metrics import evaluate
from sustainability.scoring import assess
from explainability.contributions import contributions
class EngineTests(unittest.TestCase):
    def test_metrics(self):
        result = evaluate({'u': ['a','b']}, {'u': ['a']}, 10, k=2)
        self.assertEqual(result['precision_at_k'], .5)
        self.assertEqual(result['recall_at_k'], 1)
        self.assertEqual(result['ndcg_at_k'], 1)
        self.assertEqual(result['coverage'], .2)
    def test_unknown(self):
        self.assertIsNone(assess({})['score'])
    def test_contributions(self):
        self.assertEqual(contributions({'a': 80,'b':None}, {'a':.5,'b':.5}), {'a':80})
if __name__ == '__main__':
    unittest.main()
