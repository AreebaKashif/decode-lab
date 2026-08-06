"""
AI Scholarship Recommendation System
=====================================
Core recommendation engine.

Logic used (as required by the assignment):
1. Rule-based filtering  -> hard constraints (education level, min %, gender)
2. Similarity matching    -> TF-IDF + Cosine Similarity on interest keywords
3. Weighted scoring       -> combines rule score + similarity score into a
                             final ranked recommendation list

Author: (Areeba Kashif)
"""

import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


class ScholarshipRecommender:
    """Content-based scholarship recommendation engine."""

    def __init__(self, csv_path: str):
        self.df = pd.read_csv(csv_path)
        self._prepare_similarity_model()

    
    def _prepare_similarity_model(self):
       
        self.df["combined_text"] = (
            self.df["Field_of_Study"].astype(str) + " " +
            self.df["Category"].astype(str) + " " +
            self.df["Keywords"].astype(str)
        ).str.lower()

        self.vectorizer = TfidfVectorizer(stop_words="english")
        self.tfidf_matrix = self.vectorizer.fit_transform(self.df["combined_text"])

    
    def _apply_rules(self, education_level, percentage, gender, max_income):
        """Filters out scholarships the user is NOT eligible for.
        This is the 'logic building' portion of the project."""
        filtered = self.df.copy()

        if education_level:
            filtered = filtered[
                filtered["Education_Level"].str.lower() == education_level.lower()
            ]

        if percentage is not None:
            filtered = filtered[filtered["Min_Percentage"] <= percentage]

        if gender:
            filtered = filtered[
                (filtered["Gender_Eligibility"].str.lower() == "all") |
                (filtered["Gender_Eligibility"].str.lower() == gender.lower())
            ]

        if max_income is not None:
            filtered = filtered[filtered["Max_Family_Income_USD"] >= max_income]

        return filtered

   
    def _rank_by_interest(self, eligible_df, interests: str, top_n: int):
       
        if eligible_df.empty:
            empty = eligible_df.copy()
            empty["Match_Score (%)"] = []
            return empty

        user_vector = self.vectorizer.transform([interests.lower()])

       
        idxs = eligible_df.index
        sub_matrix = self.tfidf_matrix[idxs]

        scores = cosine_similarity(user_vector, sub_matrix).flatten()

        result = eligible_df.copy()
        result["Match_Score (%)"] = (scores * 100).round(2)
        result = result.sort_values(by="Match_Score (%)", ascending=False)

        return result.head(top_n)

    
    def recommend(
        self,
        interests: str,
        education_level: str = None,
        percentage: float = None,
        gender: str = None,
        max_income: float = None,
        top_n: int = 5,
    ) -> pd.DataFrame:
        
       
        eligible = self._apply_rules(education_level, percentage, gender, max_income)
        ranked = self._rank_by_interest(eligible, interests, top_n)

        display_cols = [
            "Scholarship_Name", "Field_of_Study", "Education_Level",
            "Category", "Amount_USD", "Country", "Match_Score (%)"
        ]
        return ranked[display_cols].reset_index(drop=True)
