const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.3 x 7.5 in

// ---------- Palette: "Midnight Executive" ----------
const NAVY = "1E2761";
const ICE = "CADCFC";
const WHITE = "FFFFFF";
const ACCENT = "F2A93B"; // warm gold accent for highlight/CTA elements
const DARKTEXT = "1B1B2F";
const MUTED = "6B7280";
const CARD_BG = "F5F7FC";

const FONT_HEAD = "Cambria";
const FONT_BODY = "Calibri";

const SLIDE_W = 13.3;
const SLIDE_H = 7.5;


function addFooter(slide, pageNum) {
  slide.addText("AI Scholarship Recommendation System", {
    x: 0.5, y: 7.15, w: 6, h: 0.3, fontFace: FONT_BODY,
    fontSize: 9, color: MUTED, align: "left",
  });
  slide.addText(String(pageNum), {
    x: 12.6, y: 7.15, w: 0.4, h: 0.3, fontFace: FONT_BODY,
    fontSize: 9, color: MUTED, align: "right",
  });
}

function iconCircle(slide, x, y, diameter, bg, char, charColor, charSize) {
  slide.addShape("ellipse", { x, y, w: diameter, h: diameter, fill: { color: bg }, line: { type: "none" } });
  slide.addText(char, {
    x, y, w: diameter, h: diameter, align: "center", valign: "middle",
    fontFace: FONT_BODY, fontSize: charSize || 20, color: charColor, bold: true,
  });
}

// =================================================================
// SLIDE 1 — TITLE
// =================================================================
{
  const slide = pres.addSlide();
  slide.background = { color: NAVY };

  // Decorative circles motif
  slide.addShape("ellipse", { x: 10.6, y: -1.4, w: 4.5, h: 4.5, fill: { color: "263876" }, line: { type: "none" } });
  slide.addShape("ellipse", { x: 11.7, y: 5.0, w: 3, h: 3, fill: { color: "263876" }, line: { type: "none" } });
  slide.addShape("ellipse", { x: -1.2, y: 5.6, w: 3.2, h: 3.2, fill: { color: "263876" }, line: { type: "none" } });

  iconCircle(slide, 0.7, 0.75, 0.75, ACCENT, "🎓", DARKTEXT, 30);

  slide.addText("AI SCHOLARSHIP RECOMMENDATION", {
    x: 0.7, y: 2.55, w: 10.5, h: 1.5, fontFace: FONT_HEAD, fontSize: 44,
    color: WHITE, bold: true, align: "left", lineSpacingMultiple: 1.02,
  });
  slide.addText("A content-based recommendation system that matches students to\nscholarships using logic building, pattern matching & similarity scoring", {
    x: 0.7, y: 3.95, w: 9.5, h: 0.9, fontFace: FONT_BODY, fontSize: 16,
    color: ICE, align: "left", lineSpacingMultiple: 1.15,
  });

  slide.addText("Python  •  Pandas  •  Scikit-learn  •  TF-IDF  •  Cosine Similarity", {
    x: 0.7, y: 6.35, w: 9, h: 0.4, fontFace: FONT_BODY, fontSize: 13,
    color: ACCENT, bold: true, align: "left",
  });
}

// =================================================================
// SLIDE 2 — GOAL / PROBLEM STATEMENT
// =================================================================
{
  const slide = pres.addSlide();
  slide.background = { color: WHITE };

  slide.addText("The Goal", { x: 0.6, y: 0.5, w: 8, h: 0.7, fontFace: FONT_HEAD, fontSize: 32, color: NAVY, bold: true });
  slide.addShape("rect", { x: 0.6, y: 1.25, w: 0.9, h: 0.06, fill: { color: ACCENT }, line: { type: "none" } });

  slide.addText(
    "Create a simple recommendation system that takes a student's preferences and interests, and intelligently suggests the scholarships that best fit their profile — reducing hours of manual searching to a few seconds.",
    { x: 0.6, y: 1.7, w: 6.6, h: 2.1, fontFace: FONT_BODY, fontSize: 16, color: DARKTEXT, align: "left", lineSpacingMultiple: 1.3 }
  );

  // Stat callouts
  const stats = [
    { num: "50+", label: "Scholarships in dataset" },
    { num: "5", label: "User input criteria" },
    { num: "<1s", label: "To generate matches" },
  ];
  let sx = 0.6;
  stats.forEach((s) => {
    slide.addShape("roundRect", { x: sx, y: 4.1, w: 2.1, h: 1.5, rectRadius: 0.08, fill: { color: CARD_BG }, line: { type: "none" } });
    slide.addText(s.num, { x: sx, y: 4.25, w: 2.1, h: 0.7, align: "center", fontFace: FONT_HEAD, fontSize: 30, bold: true, color: NAVY });
    slide.addText(s.label, { x: sx + 0.1, y: 4.95, w: 1.9, h: 0.5, align: "center", fontFace: FONT_BODY, fontSize: 11, color: MUTED });
    sx += 2.3;
  });

  // Right illustration panel
  slide.addShape("roundRect", { x: 7.7, y: 1.6, w: 5.0, h: 5.1, rectRadius: 0.12, fill: { color: NAVY }, line: { type: "none" } });
  iconCircle(slide, 8.15, 2.1, 0.6, ACCENT, "🎯", DARKTEXT, 24);
  slide.addText("Why it matters", { x: 8.9, y: 2.12, w: 3.6, h: 0.55, fontFace: FONT_HEAD, fontSize: 17, bold: true, color: WHITE, valign: "middle" });

  const why = [
    "Thousands of scholarships exist, but students rarely know which ones fit them",
    "Manual searching is slow, repetitive, and easy to miss opportunities in",
    "A guided, logic-driven match increases successful applications",
  ];
  let wy = 3.05;
  why.forEach((t) => {
    slide.addShape("ellipse", { x: 8.15, y: wy + 0.05, w: 0.14, h: 0.14, fill: { color: ACCENT }, line: { type: "none" } });
    slide.addText(t, { x: 8.5, y: wy - 0.15, w: 3.9, h: 0.9, fontFace: FONT_BODY, fontSize: 12.5, color: ICE, lineSpacingMultiple: 1.2 });
    wy += 1.15;
  });

  addFooter(slide, 2);
}

// =================================================================
// SLIDE 3 — KEY REQUIREMENTS
// =================================================================
{
  const slide = pres.addSlide();
  slide.background = { color: WHITE };

  slide.addText("Key Requirements", { x: 0.6, y: 0.5, w: 8, h: 0.7, fontFace: FONT_HEAD, fontSize: 32, color: NAVY, bold: true });
  slide.addShape("rect", { x: 0.6, y: 1.25, w: 0.9, h: 0.06, fill: { color: ACCENT }, line: { type: "none" } });

  const reqs = [
    { icon: "⌨️", title: "Take user input", desc: "Collects interests, education level, marks, gender, and family income through a simple CLI flow." },
    { icon: "🔎", title: "Match preferences", desc: "Uses rule-based logic for hard eligibility checks, plus similarity scoring for interest matching." },
    { icon: "📃", title: "Display recommendations", desc: "Returns a ranked top-N list of scholarships with a clear match score for each." },
  ];

  let x = 0.6;
  reqs.forEach((r) => {
    slide.addShape("roundRect", { x, y: 1.9, w: 3.95, h: 4.6, rectRadius: 0.1, fill: { color: CARD_BG }, line: { type: "none" } });
    iconCircle(slide, x + 0.35, 2.25, 0.8, NAVY, r.icon, WHITE, 28);
    slide.addText(r.title, { x: x + 0.35, y: 3.25, w: 3.3, h: 0.6, fontFace: FONT_HEAD, fontSize: 17, bold: true, color: NAVY });
    slide.addText(r.desc, { x: x + 0.35, y: 3.85, w: 3.3, h: 2.3, fontFace: FONT_BODY, fontSize: 12.5, color: DARKTEXT, lineSpacingMultiple: 1.3 });
    x += 4.25;
  });

  addFooter(slide, 3);
}

// =================================================================
// SLIDE 4 — KEY SKILLS DEMONSTRATED
// =================================================================
{
  const slide = pres.addSlide();
  slide.background = { color: NAVY };

  slide.addText("Key Skills Demonstrated", { x: 0.6, y: 0.5, w: 9, h: 0.7, fontFace: FONT_HEAD, fontSize: 32, color: WHITE, bold: true });
  slide.addShape("rect", { x: 0.6, y: 1.25, w: 0.9, h: 0.06, fill: { color: ACCENT }, line: { type: "none" } });

  const skills = [
    { icon: "🧩", title: "Logic Building", desc: "Rule-based filters for education level, marks cutoff, gender & income eligibility." },
    { icon: "🧠", title: "Pattern Matching", desc: "TF-IDF turns text into vectors; cosine similarity finds the closest matches." },
    { icon: "⭐", title: "Recommendation Concepts", desc: "Content-based filtering ranks results the way real-world recommender engines do." },
  ];

  let x = 0.6;
  skills.forEach((s) => {
    slide.addShape("roundRect", { x, y: 2.1, w: 3.95, h: 4.3, rectRadius: 0.1, fill: { color: "263876" }, line: { type: "none" } });
    iconCircle(slide, x + 0.35, 2.5, 0.8, ACCENT, s.icon, DARKTEXT, 28);
    slide.addText(s.title, { x: x + 0.35, y: 3.5, w: 3.3, h: 0.6, fontFace: FONT_HEAD, fontSize: 16, bold: true, color: WHITE });
    slide.addText(s.desc, { x: x + 0.35, y: 4.1, w: 3.3, h: 2.1, fontFace: FONT_BODY, fontSize: 12.5, color: ICE, lineSpacingMultiple: 1.3 });
    x += 4.25;
  });

  addFooter(slide, 4);
}

// =================================================================
// SLIDE 5 — SYSTEM ARCHITECTURE / FLOW DIAGRAM
// =================================================================
{
  const slide = pres.addSlide();
  slide.background = { color: WHITE };

  slide.addText("How the System Works", { x: 0.6, y: 0.45, w: 9, h: 0.7, fontFace: FONT_HEAD, fontSize: 32, color: NAVY, bold: true });
  slide.addShape("rect", { x: 0.6, y: 1.2, w: 0.9, h: 0.06, fill: { color: ACCENT }, line: { type: "none" } });

  const steps = [
    { n: "1", t: "User Input", d: "Interests, level,\nmarks, gender, income" },
    { n: "2", t: "Rule-Based Filter", d: "Removes scholarships\nuser isn't eligible for" },
    { n: "3", t: "TF-IDF Vectorize", d: "Converts keywords &\ninterests to numbers" },
    { n: "4", t: "Cosine Similarity", d: "Scores closeness of\ninterests to each option" },
    { n: "5", t: "Ranked Results", d: "Top-N scholarships\nby match score %" },
  ];

  const boxW = 2.15, gap = 0.28, startX = 0.6, y = 2.5, boxH = 2.0;
  steps.forEach((s, i) => {
    const x = startX + i * (boxW + gap);
    const fill = i === steps.length - 1 ? ACCENT : NAVY;
    const textColor = i === steps.length - 1 ? DARKTEXT : WHITE;
    slide.addShape("roundRect", { x, y, w: boxW, h: boxH, rectRadius: 0.1, fill: { color: fill }, line: { type: "none" } });
    slide.addText(s.n, { x: x + 0.12, y: y + 0.1, w: 0.6, h: 0.5, fontFace: FONT_HEAD, fontSize: 22, bold: true, color: textColor });
    slide.addText(s.t, { x: x + 0.12, y: y + 0.65, w: boxW - 0.24, h: 0.5, fontFace: FONT_HEAD, fontSize: 13.5, bold: true, color: textColor });
    slide.addText(s.d, { x: x + 0.12, y: y + 1.15, w: boxW - 0.24, h: 0.8, fontFace: FONT_BODY, fontSize: 10.5, color: textColor, lineSpacingMultiple: 1.15 });

    if (i < steps.length - 1) {
      slide.addText("→", { x: x + boxW - 0.03, y: y + boxH / 2 - 0.35, w: gap + 0.35, h: 0.7, align: "center", valign: "middle", fontFace: FONT_BODY, fontSize: 24, bold: true, color: MUTED });
    }
  });

  slide.addShape("roundRect", { x: 0.6, y: 5.05, w: 12.1, h: 1.5, rectRadius: 0.1, fill: { color: CARD_BG }, line: { type: "none" } });
  slide.addText("This mirrors real-world content-based recommenders (e.g. \u201cbecause you watched\u2026\u201d) — just applied to scholarships, at a scale that's easy to understand and extend.", {
    x: 0.9, y: 5.2, w: 11.5, h: 1.2, fontFace: FONT_BODY, fontSize: 13.5, italic: true, color: NAVY, valign: "middle", lineSpacingMultiple: 1.3,
  });

  addFooter(slide, 5);
}

// =================================================================
// SLIDE 6 — DATASET
// =================================================================
{
  const slide = pres.addSlide();
  slide.background = { color: WHITE };

  slide.addText("The Dataset", { x: 0.6, y: 0.45, w: 8, h: 0.7, fontFace: FONT_HEAD, fontSize: 32, color: NAVY, bold: true });
  slide.addShape("rect", { x: 0.6, y: 1.2, w: 0.9, h: 0.06, fill: { color: ACCENT }, line: { type: "none" } });

  slide.addText("data/scholarships.csv  —  50 sample scholarship records", {
    x: 0.6, y: 1.4, w: 8, h: 0.4, fontFace: FONT_BODY, fontSize: 13, color: MUTED, italic: true,
  });

  const rows = [
    ["Scholarship_Name", "Text", "Name of the scholarship"],
    ["Field_of_Study", "Text", "e.g. Computer Science, Medicine, Law"],
    ["Education_Level", "Category", "Undergraduate / Postgraduate"],
    ["Category", "Category", "Merit-Based / Need-Based / Sports / Diversity"],
    ["Min_Percentage", "Number", "Minimum marks required to qualify"],
    ["Max_Family_Income_USD", "Number", "Income ceiling for need-based aid"],
    ["Amount_USD", "Number", "Scholarship award amount"],
    ["Gender_Eligibility", "Category", "All / Male / Female"],
    ["Keywords", "Text", "Used for TF-IDF similarity matching"],
  ];

  const tableRows = [
    [
      { text: "Column", options: { bold: true, color: WHITE, fill: { color: NAVY }, fontSize: 12 } },
      { text: "Type", options: { bold: true, color: WHITE, fill: { color: NAVY }, fontSize: 12 } },
      { text: "Description", options: { bold: true, color: WHITE, fill: { color: NAVY }, fontSize: 12 } },
    ],
  ];
  rows.forEach((r, i) => {
    const bg = i % 2 === 0 ? WHITE : CARD_BG;
    tableRows.push([
      { text: r[0], options: { color: DARKTEXT, fill: { color: bg }, fontSize: 11 } },
      { text: r[1], options: { color: DARKTEXT, fill: { color: bg }, fontSize: 11 } },
      { text: r[2], options: { color: DARKTEXT, fill: { color: bg }, fontSize: 11 } },
    ]);
  });

  slide.addTable(tableRows, {
    x: 0.6, y: 1.95, w: 8.0, h: 5.0,
    colW: [2.6, 1.3, 4.1],
    border: { type: "solid", color: "E2E5EE", pt: 0.5 },
    autoPage: false,
    valign: "middle",
    margin: [3, 6, 3, 6],
  });

  // Right side sample record card
  slide.addShape("roundRect", { x: 8.95, y: 1.95, w: 3.75, h: 5.0, rectRadius: 0.1, fill: { color: NAVY }, line: { type: "none" } });
  slide.addText("SAMPLE RECORD", { x: 9.2, y: 2.15, w: 3.3, h: 0.35, fontFace: FONT_BODY, fontSize: 11, bold: true, color: ACCENT });
  const sample = [
    "National Merit Tech Scholarship",
    "Field: Computer Science",
    "Level: Undergraduate",
    "Category: Merit-Based",
    "Min %: 85",
    "Amount: $5,000",
    "Country: USA",
    "Keywords: programming, AI,\nsoftware, coding, technology",
  ];
  let sy = 2.65;
  sample.forEach((line, i) => {
    slide.addText(line, {
      x: 9.2, y: sy, w: 3.3, h: i === 0 ? 0.6 : 0.4,
      fontFace: FONT_BODY, fontSize: i === 0 ? 14 : 11.5,
      bold: i === 0, color: i === 0 ? WHITE : ICE, lineSpacingMultiple: 1.2,
    });
    sy += i === 0 ? 0.65 : 0.42;
  });

  addFooter(slide, 6);
}

// =================================================================
// SLIDE 7 — RECOMMENDATION LOGIC (CODE SNIPPET STYLE)
// =================================================================
{
  const slide = pres.addSlide();
  slide.background = { color: WHITE };

  slide.addText("The Recommendation Logic", { x: 0.6, y: 0.45, w: 9, h: 0.7, fontFace: FONT_HEAD, fontSize: 30, color: NAVY, bold: true });
  slide.addShape("rect", { x: 0.6, y: 1.2, w: 0.9, h: 0.06, fill: { color: ACCENT }, line: { type: "none" } });

  // Left: explanation
  const points = [
    { t: "Rule-Based Filtering", d: "Hard eligibility checks: education level, minimum percentage, gender, income cap." },
    { t: "TF-IDF Vectorization", d: "Scholarship keywords + user interests are converted into weighted numeric vectors." },
    { t: "Cosine Similarity", d: "Measures the angle between vectors — closer to 1.0 means a stronger interest match." },
    { t: "Weighted Ranking", d: "Eligible scholarships are sorted by match score; top-N are returned to the user." },
  ];
  let py = 1.75;
  points.forEach((p, i) => {
    iconCircle(slide, 0.6, py, 0.45, NAVY, String(i + 1), WHITE, 16);
    slide.addText(p.t, { x: 1.25, y: py - 0.05, w: 4.9, h: 0.4, fontFace: FONT_HEAD, fontSize: 14.5, bold: true, color: NAVY });
    slide.addText(p.d, { x: 1.25, y: py + 0.35, w: 4.9, h: 0.75, fontFace: FONT_BODY, fontSize: 11.5, color: DARKTEXT, lineSpacingMultiple: 1.25 });
    py += 1.28;
  });

  // Right: code card
  slide.addShape("roundRect", { x: 6.15, y: 1.75, w: 6.55, h: 5.2, rectRadius: 0.1, fill: { color: "12163A" }, line: { type: "none" } });
  slide.addShape("ellipse", { x: 6.45, y: 2.0, w: 0.16, h: 0.16, fill: { color: "FF5F56" }, line: { type: "none" } });
  slide.addShape("ellipse", { x: 6.68, y: 2.0, w: 0.16, h: 0.16, fill: { color: "FFBD2E" }, line: { type: "none" } });
  slide.addShape("ellipse", { x: 6.91, y: 2.0, w: 0.16, h: 0.16, fill: { color: "27C93F" }, line: { type: "none" } });
  slide.addText("recommender.py", { x: 6.15, y: 1.95, w: 6.55, h: 0.3, align: "center", fontFace: "Courier New", fontSize: 10.5, color: "9CA3C0" });

  const code =
`vectorizer = TfidfVectorizer(stop_words="english")
tfidf_matrix = vectorizer.fit_transform(
    df["combined_text"]
)

def recommend(interests, level, pct, top_n=5):
    eligible = apply_rules(level, pct)
    user_vec = vectorizer.transform([interests])
    scores = cosine_similarity(
        user_vec, tfidf_matrix[eligible.index]
    )
    eligible["Match_Score"] = scores.flatten() * 100
    return eligible.sort_values(
        "Match_Score", ascending=False
    ).head(top_n)`;

  slide.addText(code, {
    x: 6.4, y: 2.45, w: 6.05, h: 4.3, fontFace: "Courier New", fontSize: 11.5,
    color: "D7E0FF", align: "left", valign: "top", lineSpacingMultiple: 1.25,
  });

  addFooter(slide, 7);
}

// =================================================================
// SLIDE 8 — SAMPLE OUTPUT / DEMO
// =================================================================
{
  const slide = pres.addSlide();
  slide.background = { color: WHITE };

  slide.addText("Sample Output", { x: 0.6, y: 0.45, w: 8, h: 0.7, fontFace: FONT_HEAD, fontSize: 32, color: NAVY, bold: true });
  slide.addShape("rect", { x: 0.6, y: 1.2, w: 0.9, h: 0.06, fill: { color: ACCENT }, line: { type: "none" } });

  slide.addShape("roundRect", { x: 0.6, y: 1.6, w: 5.6, h: 1.0, rectRadius: 0.08, fill: { color: CARD_BG }, line: { type: "none" } });
  slide.addText([
    { text: "User profile:  ", options: { bold: true, color: NAVY } },
    { text: "\u201ccomputer science, AI, robotics\u201d, Undergraduate, 85%, Female", options: { color: DARKTEXT } },
  ], { x: 0.85, y: 1.75, w: 5.1, h: 0.7, fontFace: FONT_BODY, fontSize: 12.5, valign: "middle", lineSpacingMultiple: 1.2 });

  const results = [
    ["Women in STEM Grant", "Computer Science", "$4,000", "45.8%"],
    ["National Merit Tech Scholarship", "Computer Science", "$5,000", "35.9%"],
    ["Girls in Robotics Grant", "Robotics", "$4,200", "25.5%"],
  ];

  const tRows = [[
    { text: "Scholarship", options: { bold: true, color: WHITE, fill: { color: NAVY }, fontSize: 12 } },
    { text: "Field", options: { bold: true, color: WHITE, fill: { color: NAVY }, fontSize: 12 } },
    { text: "Amount", options: { bold: true, color: WHITE, fill: { color: NAVY }, fontSize: 12 } },
    { text: "Match", options: { bold: true, color: WHITE, fill: { color: NAVY }, fontSize: 12 } },
  ]];
  results.forEach((r, i) => {
    const bg = i % 2 === 0 ? WHITE : CARD_BG;
    tRows.push([
      { text: r[0], options: { color: DARKTEXT, fill: { color: bg }, fontSize: 11.5 } },
      { text: r[1], options: { color: DARKTEXT, fill: { color: bg }, fontSize: 11.5 } },
      { text: r[2], options: { color: DARKTEXT, fill: { color: bg }, fontSize: 11.5 } },
      { text: r[3], options: { color: "1F8A47", bold: true, fill: { color: bg }, fontSize: 11.5 } },
    ]);
  });

  slide.addTable(tRows, {
    x: 0.6, y: 2.85, w: 5.6, h: 2.2,
    colW: [2.15, 1.55, 0.95, 0.95],
    border: { type: "solid", color: "E2E5EE", pt: 0.5 },
    valign: "middle",
    margin: [3, 6, 3, 6],
  });

  slide.addText("→ Full ranked results with match score are printed straight to the console (or returned as a DataFrame for further use).", {
    x: 0.6, y: 5.3, w: 5.6, h: 0.9, fontFace: FONT_BODY, fontSize: 11.5, italic: true, color: MUTED, lineSpacingMultiple: 1.3,
  });

  // Right: terminal mockup
  slide.addShape("roundRect", { x: 6.6, y: 1.6, w: 6.1, h: 5.35, rectRadius: 0.1, fill: { color: "12163A" }, line: { type: "none" } });
  slide.addShape("ellipse", { x: 6.9, y: 1.85, w: 0.16, h: 0.16, fill: { color: "FF5F56" }, line: { type: "none" } });
  slide.addShape("ellipse", { x: 7.13, y: 1.85, w: 0.16, h: 0.16, fill: { color: "FFBD2E" }, line: { type: "none" } });
  slide.addShape("ellipse", { x: 7.36, y: 1.85, w: 0.16, h: 0.16, fill: { color: "27C93F" }, line: { type: "none" } });
  slide.addText("terminal — python src/app.py", { x: 6.6, y: 1.8, w: 6.1, h: 0.3, align: "center", fontFace: "Courier New", fontSize: 10.5, color: "9CA3C0" });

  const terminal =
`> Finding your best-matching scholarships...

1. Women in STEM Grant
   Field: Computer Science
   Level: Undergraduate | Category: Diversity
   Amount: $4000 | Country: USA
   Match Score: 45.79%
------------------------------------------------
2. National Merit Tech Scholarship
   Field: Computer Science
   Amount: $5000 | Match Score: 35.85%
------------------------------------------------
3. Girls in Robotics Grant
   Field: Robotics
   Amount: $4200 | Match Score: 25.45%`;

  slide.addText(terminal, {
    x: 6.85, y: 2.3, w: 5.6, h: 4.5, fontFace: "Courier New", fontSize: 11,
    color: "9BE59B", align: "left", valign: "top", lineSpacingMultiple: 1.3,
  });

  addFooter(slide, 8);
}

// =================================================================
// SLIDE 9 — TECH STACK & PROJECT STRUCTURE
// =================================================================
{
  const slide = pres.addSlide();
  slide.background = { color: WHITE };

  slide.addText("Tech Stack & Project Structure", { x: 0.6, y: 0.45, w: 10, h: 0.7, fontFace: FONT_HEAD, fontSize: 30, color: NAVY, bold: true });
  slide.addShape("rect", { x: 0.6, y: 1.2, w: 0.9, h: 0.06, fill: { color: ACCENT }, line: { type: "none" } });

  const stack = [
    { icon: "🐍", t: "Python 3" },
    { icon: "🐼", t: "pandas" },
    { icon: "🔬", t: "scikit-learn" },
    { icon: "✅", t: "pytest" },
    { icon: "📁", t: "GitHub-ready" },
  ];
  let sx = 0.6;
  stack.forEach((s) => {
    slide.addShape("roundRect", { x: sx, y: 1.65, w: 2.15, h: 1.15, rectRadius: 0.08, fill: { color: CARD_BG }, line: { type: "none" } });
    slide.addText(s.icon, { x: sx, y: 1.72, w: 2.15, h: 0.5, align: "center", fontSize: 22 });
    slide.addText(s.t, { x: sx, y: 2.25, w: 2.15, h: 0.4, align: "center", fontFace: FONT_BODY, fontSize: 11.5, bold: true, color: NAVY });
    sx += 2.35;
  });

  // Folder tree card
  slide.addShape("roundRect", { x: 0.6, y: 3.15, w: 6.0, h: 3.85, rectRadius: 0.1, fill: { color: "12163A" }, line: { type: "none" } });
  slide.addText("PROJECT STRUCTURE", { x: 0.85, y: 3.35, w: 5.5, h: 0.35, fontFace: FONT_BODY, fontSize: 11, bold: true, color: ACCENT });
  const tree =
`scholarship-project/
├── data/scholarships.csv
├── src/
│   ├── recommender.py
│   ├── app.py
│   └── demo.py
├── tests/test_recommender.py
├── docs/ (this presentation)
├── requirements.txt
├── README.md
└── LICENSE`;
  slide.addText(tree, {
    x: 0.85, y: 3.75, w: 5.5, h: 3.15, fontFace: "Courier New", fontSize: 12,
    color: "D7E0FF", valign: "top", lineSpacingMultiple: 1.3,
  });

  // GitHub ready card
  slide.addShape("roundRect", { x: 6.9, y: 3.15, w: 5.8, h: 3.85, rectRadius: 0.1, fill: { color: NAVY }, line: { type: "none" } });
  iconCircle(slide, 7.2, 3.45, 0.65, ACCENT, "🐙", DARKTEXT, 24);
  slide.addText("Ready for GitHub", { x: 7.95, y: 3.5, w: 4.6, h: 0.55, fontFace: FONT_HEAD, fontSize: 16, bold: true, color: WHITE, valign: "middle" });

  const ghPoints = [
    "Clean modular code (recommender / app separated)",
    "requirements.txt for one-line setup",
    "Unit tests included (pytest)",
    "MIT LICENSE + .gitignore included",
    "README with setup & usage instructions",
  ];
  let gy = 4.35;
  ghPoints.forEach((p) => {
    slide.addShape("ellipse", { x: 7.2, y: gy + 0.06, w: 0.12, h: 0.12, fill: { color: ACCENT }, line: { type: "none" } });
    slide.addText(p, { x: 7.5, y: gy - 0.12, w: 4.9, h: 0.5, fontFace: FONT_BODY, fontSize: 12.5, color: ICE, lineSpacingMultiple: 1.15 });
    gy += 0.52;
  });

  addFooter(slide, 9);
}

// =================================================================
// SLIDE 10 — CONCLUSION / FUTURE SCOPE
// =================================================================
{
  const slide = pres.addSlide();
  slide.background = { color: NAVY };

  slide.addShape("ellipse", { x: -1.5, y: -1.5, w: 4, h: 4, fill: { color: "263876" }, line: { type: "none" } });
  slide.addShape("ellipse", { x: 11.5, y: 5.5, w: 3.5, h: 3.5, fill: { color: "263876" }, line: { type: "none" } });

  slide.addText("Conclusion & Future Scope", { x: 0.6, y: 0.55, w: 10, h: 0.7, fontFace: FONT_HEAD, fontSize: 32, color: WHITE, bold: true });
  slide.addShape("rect", { x: 0.6, y: 1.3, w: 0.9, h: 0.06, fill: { color: ACCENT }, line: { type: "none" } });

  slide.addText(
    "A working, explainable recommendation engine that combines rule-based logic with TF-IDF similarity matching — the same core idea behind production recommender systems, built at a scale that's easy to understand, present, and extend.",
    { x: 0.6, y: 1.7, w: 6.1, h: 1.8, fontFace: FONT_BODY, fontSize: 14.5, color: ICE, lineSpacingMultiple: 1.35 }
  );

  const future = [
    "Streamlit / Flask web interface",
    "Collaborative filtering from real applications",
    "Larger, real-world scholarship dataset",
    "Deadline reminders & notifications",
  ];
  slide.addText("What's next", { x: 0.6, y: 3.7, w: 4, h: 0.4, fontFace: FONT_HEAD, fontSize: 15, bold: true, color: ACCENT });
  let fy = 4.2;
  future.forEach((f) => {
    slide.addShape("ellipse", { x: 0.6, y: fy + 0.05, w: 0.12, h: 0.12, fill: { color: ACCENT }, line: { type: "none" } });
    slide.addText(f, { x: 0.9, y: fy - 0.13, w: 5.6, h: 0.45, fontFace: FONT_BODY, fontSize: 13, color: WHITE });
    fy += 0.55;
  });

  // Right thank-you card
  slide.addShape("roundRect", { x: 7.6, y: 1.9, w: 5.1, h: 3.9, rectRadius: 0.12, fill: { color: ACCENT }, line: { type: "none" } });
  slide.addText("Thank You", { x: 7.6, y: 2.5, w: 5.1, h: 0.8, align: "center", fontFace: FONT_HEAD, fontSize: 30, bold: true, color: DARKTEXT });
  slide.addText("Questions & Feedback Welcome", { x: 7.6, y: 3.3, w: 5.1, h: 0.5, align: "center", fontFace: FONT_BODY, fontSize: 14, color: DARKTEXT });
  slide.addText("github.com/<your-username>/\nai-scholarship-recommendation", { x: 7.6, y: 4.4, w: 5.1, h: 0.9, align: "center", fontFace: "Courier New", fontSize: 12, color: DARKTEXT, lineSpacingMultiple: 1.3 });

  addFooter(slide, 10);
}

pres.writeFile({ fileName: "AI_Scholarship_Recommendation.pptx" }).then(() => {
  console.log("Presentation created.");
});
