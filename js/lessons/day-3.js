// Day 3: Databases & Data Storage
window.__lessonCache = window.__lessonCache || {};
window.__lessonCache[3] = {
  "day": 3,
  "week": 0,
  "title": "Databases & Data Storage",
  "desc": "SQL, NoSQL, choosing the right database",
  "duration": "55 min",
  "coldOpen": "Site is slow. Developer says 'we need MongoDB'. Your data is highly relational (customers, orders, products). Is NoSQL the answer?",
  "coldRevisit": "Probably not. NoSQL solves specific problems. Relational databases (PostgreSQL, MySQL) excel at relational data. Don't cargo-cult tech trends.",
  "content": "<h2>Why This Matters</h2><p>Your database stores everything. Wrong choice causes slow sites and expensive rewrites.</p><h2>SQL vs NoSQL</h2><p>SQL best for: structured data, relationships, transactions. NoSQL best for: massive scale, flexible schemas.</p>",
  "questions": [
    {
      "q": "Developer says SQL slow, proposes MongoDB. Users/orders/products with relationships. Response?",
      "opts": [
        "Approve MongoDB",
        "Ask: Added indexes? Optimized queries? SQL excels at relational data.",
        "Switch to PostgreSQL",
        "Add RAM"
      ],
      "correct": 1,
      "explain": "Slow SQL usually: missing indexes, N+1 queries. Fix SQL first."
    }
  ],
  "essay": {
    "q": "Evaluate MongoDB proposal for relational ecommerce data.",
    "guide": "Diagnose: Check indexes, query optimization. SQL usually right for ecommerce."
  }
};
