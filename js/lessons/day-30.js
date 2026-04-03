// Day 30: Technical Roadmapping
window.__lessonCache = window.__lessonCache || {};
window.__lessonCache[30] = {
  "day": 30,
  "week": 4,
  "title": "Technical Roadmapping",
  "desc": "Aligning tech with business",
  "duration": "50 min",
  "coldOpen": "CEO wants 3-year tech roadmap. How to create?",
  "coldRevisit": "Start with business strategy. What are business goals? Map tech investments to enable them. Balance: new features, tech debt, infrastructure.",
  "content": "<h2>Roadmap Framework</h2><ol><li>Business goals (next 3 years)</li><li>Tech capabilities needed</li><li>Current state gaps</li><li>Prioritized investments</li></ol><h2>Balance</h2><p>70% business features, 20% tech debt, 10% experimentation.</p>",
  "questions": [
    {
      "q": "How to prioritize tech roadmap?",
      "opts": [
        "Newest tech",
        "Align with business goals. What tech investments enable revenue/growth/efficiency? Balance features, debt, infra.",
        "Cheapest first",
        "Random"
      ],
      "correct": 1,
      "explain": "Tech roadmap serves business goals. Every investment should map to business outcome."
    }
  ],
  "essay": {
    "q": "CEO wants to expand to 10 new countries. Create tech roadmap.",
    "guide": "Needs: i18n, multi-currency, regional hosting/CDN, compliance (GDPR, etc). Phase: highest-revenue countries first. Estimate costs, timeline."
  }
};
