// Day 27: Cloud Cost Optimization
window.__lessonCache = window.__lessonCache || {};
window.__lessonCache[27] = {
  "day": 27,
  "week": 3,
  "title": "Cloud Cost Optimization",
  "desc": "Managing infrastructure spend",
  "duration": "50 min",
  "coldOpen": "Cloud costs up 50%. Where's the money going?",
  "coldRevisit": "Check: over-provisioned servers, unused resources, inefficient queries, no auto-scaling, development environments running 24/7.",
  "content": "<h2>Cost Culprits</h2><ul><li>Over-provisioned: Server too powerful</li><li>Always-on dev/staging</li><li>No auto-scaling</li><li>Unused databases</li><li>Expensive data transfer</li></ul><h2>Quick Wins</h2><p>Shut down non-prod at night. Rightsize instances. Use reserved/spot instances.</p>",
  "questions": [
    {
      "q": "Cloud costs doubled. First check?",
      "opts": [
        "Switch providers",
        "Audit: What resources exist? What's actually used? Are dev/staging running 24/7?",
        "Optimize code",
        "Reduce features"
      ],
      "correct": 1,
      "explain": "Audit first. Often: unused resources, over-provisioned instances, always-on non-prod."
    }
  ],
  "essay": {
    "q": "AWS bill up 50% (£10k→£15k/month). Investigate and optimize.",
    "guide": "Tag resources. Find: unused databases, oversized EC2, 24/7 dev. Shut down non-prod off-hours. Rightsize. Reserved instances."
  }
};
