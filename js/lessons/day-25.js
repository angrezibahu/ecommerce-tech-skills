// Day 25: CI/CD & Deployment
window.__lessonCache = window.__lessonCache || {};
window.__lessonCache[25] = {
  "day": 25,
  "week": 3,
  "title": "CI/CD & Deployment",
  "desc": "Automated testing and deployment",
  "duration": "50 min",
  "coldOpen": "Deployment takes 3 hours, manual. Can this be automated?",
  "coldRevisit": "Yes. CI/CD automates: test, build, deploy. Deploys become safe, frequent, fast (minutes not hours).",
  "content": "<h2>CI/CD Pipeline</h2><pre>1. Code commit\\n2. Automated tests run\\n3. Build production bundle\\n4. Deploy to staging\\n5. Deploy to production</pre><h2>Benefits</h2><ul><li>Fast: Minutes not hours</li><li>Safe: Tests catch bugs</li><li>Frequent: Deploy multiple times/day</li></ul>",
  "questions": [
    {
      "q": "What's CI/CD?",
      "opts": [
        "Cloud hosting",
        "Continuous Integration/Deployment. Automate testing and deployment.",
        "Database tool",
        "Monitoring"
      ],
      "correct": 1,
      "explain": "CI/CD = automated pipeline from code commit to production deploy."
    }
  ],
  "essay": {
    "q": "Current deployment: 3 hours, manual, error-prone. Design CI/CD.",
    "guide": "GitHub Actions: run tests, build, deploy staging, manual approval, deploy prod. 10-15 min total."
  }
};
