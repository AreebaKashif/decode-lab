# 🎓 AI Scholarship Recommendation System

A simple, explainable **content-based recommendation system** that suggests
scholarships to a student based on their interests, education level,
academic percentage, gender, and family income — built in Python using
rule-based logic and TF-IDF + Cosine Similarity pattern matching.

> Built as an AI/ML mini-project to demonstrate **logic building, pattern
> matching, and recommendation system concepts.**

---

## ✨ Features

- 📋 Takes user input (interests, education level, marks, gender, income)
- 🧠 Two-stage recommendation logic:
  1. **Rule-based filtering** — hard eligibility checks (education level,
     minimum percentage, gender eligibility, income cap)
  2. **Similarity matching** — TF-IDF vectorization + Cosine Similarity
     to rank scholarships by how well they match the student's interests
- 🏆 Displays a ranked list of top-N recommended scholarships with a
  match score (%)
- 💻 Interactive CLI app + non-interactive demo script
- 🧪 Unit-tested with `pytest`
- 📊 Includes a ready-to-use dataset of 50 sample scholarships

---

## 🗂️ Project Structure

```
scholarship-project/
├── data/
│   └── scholarships.csv        # Dataset of 50 sample scholarships
├── src/
│   ├── recommender.py          # Core recommendation engine (the "AI" logic)
│   ├── app.py                  # Interactive CLI application
│   └── demo.py                 # Non-interactive demo (sample profiles)
├── tests/
│   └── test_recommender.py     # Unit tests
├── docs/
│   └── AI_Scholarship_Recommendation.pptx   # Project presentation
├── requirements.txt
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/ai-scholarship-recommendation.git
cd ai-scholarship-recommendation
```

### 2. Install dependencies
```bash
pip install -r requirements.txt
```

### 3. Run the interactive app
```bash
python src/app.py
```

You'll be asked for your interests, education level, marks, gender, and
income, and the system will print your top matching scholarships.

### 4. Or run the quick demo (no typing required)
```bash
python src/demo.py
```

### 5. Run tests
```bash
python -m pytest tests/
```

---

## 🧠 How the Recommendation Logic Works

```
User Input (interests, level, marks, gender, income)
              │
              ▼
   ┌─────────────────────┐
   │  1. Rule-Based Filter │  → removes scholarships the user is NOT
   │     (eligibility)     │     eligible for (level, % cutoff, gender, income)
   └─────────────────────┘
              │
              ▼
   ┌─────────────────────┐
   │ 2. TF-IDF Vectorizer │  → converts scholarship keywords + user
   │   (text → numbers)   │     interests into numeric vectors
   └─────────────────────┘
              │
              ▼
   ┌─────────────────────┐
   │ 3. Cosine Similarity │  → measures how "close" the user's interests
   │   (pattern matching) │     are to each scholarship's profile
   └─────────────────────┘
              │
              ▼
     Ranked Top-N Scholarships
     (sorted by Match Score %)
```

This mirrors how real-world **content-based recommender systems**
(e.g. Netflix "because you watched...", Spotify "similar songs") work —
just at a beginner-friendly scale.

---

## 📊 Dataset

`data/scholarships.csv` contains 50 sample scholarships with the
following columns:

| Column | Description |
|---|---|
| `Scholarship_ID` | Unique ID |
| `Scholarship_Name` | Name of the scholarship |
| `Field_of_Study` | e.g. Computer Science, Medicine, Law |
| `Education_Level` | Undergraduate / Postgraduate |
| `Category` | Merit-Based / Need-Based / Sports / Diversity |
| `Min_Percentage` | Minimum academic percentage required |
| `Max_Family_Income_USD` | Income cap for need-based eligibility |
| `Amount_USD` | Scholarship award amount |
| `Country` | Country/region offering it |
| `Gender_Eligibility` | All / Male / Female |
| `Keywords` | Free-text keywords used for similarity matching |

> This is a **synthetic/sample dataset** created for learning purposes —
> it does not represent real scholarship offers.

---

## 🛣️ Possible Future Enhancements

- Web UI using Streamlit or Flask
- Collaborative filtering using historical application data
- User accounts to save/track applications
- Deadline reminders and email notifications
- Expanded real-world scholarship dataset via web scraping/APIs

---

## 🛠️ Tech Stack

- **Python 3**
- **pandas** — data handling
- **scikit-learn** — TF-IDF vectorization & cosine similarity
- **pytest** — testing

---

## 📄 License

This project is licensed under the MIT License — see [LICENSE](LICENSE).

---

## 🙋 Author

Made as part of an AI Scholarship / academic mini-project.
Feel free to fork, star ⭐, and improve!
