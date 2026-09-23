

import os
import sys
import unittest

sys.path.append(os.path.join(os.path.dirname(__file__), "..", "src"))
from recommender import ScholarshipRecommender

DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "scholarships.csv")


class TestScholarshipRecommender(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.engine = ScholarshipRecommender(DATA_PATH)

    def test_dataset_loads(self):
        self.assertGreater(len(self.engine.df), 0)

    def test_returns_dataframe_with_expected_columns(self):
        result = self.engine.recommend(interests="coding, ai", top_n=5)
        expected_cols = {
            "Scholarship_Name", "Field_of_Study", "Education_Level",
            "Category", "Amount_USD", "Country", "Match_Score (%)"
        }
        self.assertTrue(expected_cols.issubset(set(result.columns)))

    def test_respects_top_n(self):
        result = self.engine.recommend(interests="business, finance", top_n=2)
        self.assertLessEqual(len(result), 2)

    def test_education_level_filter(self):
        result = self.engine.recommend(
            interests="ai", education_level="Postgraduate", top_n=10
        )
        self.assertTrue((result["Education_Level"] == "Postgraduate").all())

    def test_no_crash_on_impossible_filters(self):
        result = self.engine.recommend(
            interests="medicine", education_level="Undergraduate",
            percentage=1, gender="Female", max_income=1, top_n=5
        )
        # Should not raise, just return a (possibly empty) DataFrame
        self.assertIsNotNone(result)

    def test_sports_query_returns_sports_scholarships(self):
        result = self.engine.recommend(interests="football, athletics", top_n=3)
        self.assertIn("Sports", result["Category"].values)


if __name__ == "__main__":
    unittest.main()
