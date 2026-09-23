

import os
import sys

sys.path.append(os.path.dirname(__file__))
from recommender import ScholarshipRecommender

DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "scholarships.csv")


SAMPLE_PROFILES = [
    {
        "label": "Tech-focused undergraduate student",
        "interests": "computer science, artificial intelligence, robotics, coding",
        "education_level": "Undergraduate",
        "percentage": 85,
        "gender": "Female",
        "max_income": None,
        "top_n": 3,
    },
    {
        "label": "Sports enthusiast",
        "interests": "football, athletics, fitness",
        "education_level": "Undergraduate",
        "percentage": 60,
        "gender": None,
        "max_income": None,
        "top_n": 3,
    },
    {
        "label": "Postgraduate medical researcher",
        "interests": "medicine, healthcare, clinical research",
        "education_level": "Postgraduate",
        "percentage": 80,
        "gender": None,
        "max_income": 35000,
        "top_n": 3,
    },
]


def main():
    engine = ScholarshipRecommender(DATA_PATH)

    for profile in SAMPLE_PROFILES:
        print("=" * 70)
        print(f"PROFILE: {profile['label']}")
        print(f"Interests: {profile['interests']}")
        print("-" * 70)

        results = engine.recommend(
            interests=profile["interests"],
            education_level=profile["education_level"],
            percentage=profile["percentage"],
            gender=profile["gender"],
            max_income=profile["max_income"],
            top_n=profile["top_n"],
        )

        if results.empty:
            print("No matches found.")
        else:
            print(results.to_string(index=False))
        print()


if __name__ == "__main__":
    main()
