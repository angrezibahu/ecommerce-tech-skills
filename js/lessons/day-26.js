// Day 26: Incident Management
window.__lessonCache = window.__lessonCache || {};
window.__lessonCache[26] = {
  "day": 26,
  "week": 3,
  "title": "Incident Management",
  "desc": "Responding to outages",
  "duration": "50 min",
  "coldOpen": "Site is down. Now what?",
  "coldRevisit": "1) Assess impact, 2) Communicate, 3) Mitigate, 4) Fix root cause, 5) Postmortem.",
  "content": "<h2>Incident Response</h2><ol><li>Assess: What's broken? Impact?</li><li>Communicate: Status page, team alert</li><li>Mitigate: Quick fix to restore service</li><li>Root cause: Fix properly</li><li>Postmortem: What happened? Prevent recurrence</li></ol>",
  "questions": [
    {
      "q": "Site down. First step?",
      "opts": [
        "Find culprit",
        "Assess impact: How many users affected? Is it full outage or partial?",
        "Roll back",
        "Call CEO"
      ],
      "correct": 1,
      "explain": "First: understand scope and impact. Drives response urgency."
    }
  ],
  "essay": {
    "q": "Database crashed. Site down 2 hours. Create postmortem.",
    "guide": "What happened? Why? Impact? Timeline? Action items to prevent recurrence? Blameless."
  }
};
