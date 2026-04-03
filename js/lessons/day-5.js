// Day 5: CDNs & Edge Computing
window.__lessonCache = window.__lessonCache || {};
window.__lessonCache[5] = {
  "day": 5,
  "week": 0,
  "title": "CDNs & Edge Computing",
  "desc": "Serving content globally",
  "duration": "50 min",
  "coldOpen": "Australian users say site is slow. You're hosted in London. CDN costs £300/month. Worth it?",
  "coldRevisit": "Yes. London→Australia = 300ms latency per request. CDN = 20-30ms. Users get fast experience.",
  "content": "<h2>How CDNs Work</h2><p>CDN = Content Delivery Network. Copies your static files to servers worldwide.</p><h2>Without CDN</h2><pre>Sydney user → London server (300ms) × 50 resources = 15sec</pre><h2>With CDN</h2><pre>Sydney user → Sydney CDN edge (20ms) × 50 resources = 1sec</pre>",
  "questions": [
    {
      "q": "CDN for UK-only site?",
      "opts": [
        "Not needed",
        "Yes—DDoS protection, cheaper bandwidth, faster even within UK.",
        "Only for global",
        "Too expensive"
      ],
      "correct": 1,
      "explain": "CDN helps single-country sites: DDoS protection, bandwidth savings, multiple edges."
    }
  ],
  "essay": {
    "q": "Evaluate £300/month CDN for UK site expanding to US.",
    "guide": "Calculate: slow site = lost conversions. CDN pays for itself."
  }
};
