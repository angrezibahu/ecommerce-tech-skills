// Day 28: Week 3 Review
window.__lessonCache = window.__lessonCache || {};
window.__lessonCache[28] = {
  "day": 28,
  "week": 3,
  "title": "Week 3 Review",
  "desc": "Operations & Security",
  "duration": "45 min",
  "coldOpen": "Board asks: How healthy is our tech?",
  "coldRevisit": "Present: uptime, deployment frequency, incident count, security posture, cost trends.",
  "content": "<h2>Week 3 Takeaways</h2><ul><li>Architecture: Start simple, add complexity only when needed</li><li>Monitoring: Proactive beats reactive</li><li>Security: OWASP Top 10, fix critical first</li><li>CI/CD: Automate deploys</li><li>Incidents: Have process, practice</li><li>Costs: Monitor, optimize</li></ul>",
  "questions": [
    {
      "q": "Measure tech health?",
      "opts": [
        "Code quality",
        "DORA metrics: deploy frequency, lead time, MTTR, change failure rate. Plus: uptime, costs.",
        "Lines of code",
        "Team size"
      ],
      "correct": 1,
      "explain": "DORA metrics measure delivery performance. Combined with uptime and costs = tech health."
    }
  ],
  "essay": {
    "q": "Create quarterly tech health report for board.",
    "guide": "Metrics: uptime, deploy frequency, incidents, security issues fixed, cost trends. Narrative: progress, risks, investments needed."
  }
};
