"""
AI Scholarship Recommendation System - CLI Application
========================================================
Run this file to interactively get scholarship recommendations
based on your interests, education level, marks, and income.

Usage:
    python src/app.py
"""

import os
import sys

# Allow running from project root or from inside src/
sys.path.append(os.path.dirname(__file__))

from recommender import ScholarshipRecommender

DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "scholarships.csv")


def get_float(prompt, default=None):
    val = input(prompt).strip()
    if val == "" and default is not None:
        return default
    try:
        return float(val)
    except ValueError:
        return default


def main():
    print("=" * 60)
    print("   🎓  AI SCHOLARSHIP RECOMMENDATION SYSTEM  🎓")
    print("=" * 60)
    print("Answer a few quick questions and we'll match you with")
    print("scholarships that fit your profile and interests.\n")

    interests = input(
        "1) What are your interests/fields? (e.g. coding, robotics, art): "
    ).strip()

    print("\n2) Education level:")
    print("   [1] Undergraduate")
    print("   [2] Postgraduate")
    level_choice = input("   Choose (1/2, leave blank for any): ").strip()
    education_level = {"1": "Undergraduate", "2": "Postgraduate"}.get(level_choice, None)

    percentage = get_float(
        "\n3) Your academic percentage/GPA (0-100, leave blank to skip): ", default=None
    )

    print("\n4) Gender:")
    print("   [1] Male   [2] Female   [3] Other/Prefer not to say")
    gender_choice = input("   Choose (1/2/3): ").strip()
    gender = {"1": "Male", "2": "Female", "3": "Other"}.get(gender_choice, None)

    income = get_float(
        "\n5) Approx. annual family income in USD (leave blank to skip): ", default=None
    )

    top_n = get_float("\n6) How many recommendations do you want? (default 5): ", default=5)
    top_n = int(top_n)

    print("\nFinding your best-matching scholarships...\n")

    engine = ScholarshipRecommender(DATA_PATH)
    results = engine.recommend(
        interests=interests or "general studies",
        education_level=education_level,
        percentage=percentage,
        gender=gender,
        max_income=income,
        top_n=top_n,
    )

    print("=" * 60)
    if results.empty:
        print("No matching scholarships found. Try loosening your filters.")
    else:
        print(f"TOP {len(results)} RECOMMENDED SCHOLARSHIPS FOR YOU:\n")
        for i, row in results.iterrows():
            print(f"{i + 1}. {row['Scholarship_Name']}")
            print(f"   Field        : {row['Field_of_Study']}")
            print(f"   Level        : {row['Education_Level']}  |  Category: {row['Category']}")
            print(f"   Amount       : ${row['Amount_USD']}  |  Country: {row['Country']}")
            print(f"   Match Score  : {row['Match_Score (%)']}%")
            print("-" * 60)
    print("=" * 60)


if __name__ == "__main__":
    main()
