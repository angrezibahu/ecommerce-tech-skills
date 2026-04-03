// Day 6: Load Balancing & Scaling
window.__lessonCache = window.__lessonCache || {};
window.__lessonCache[6] = {
  "day": 6,
  "week": 0,
  "title": "Load Balancing & Scaling",
  "desc": "Handling traffic spikes",
  "duration": "50 min",
  "coldOpen": "Black Friday: traffic 10x normal. Site crashed last year. Bigger server or multiple servers?",
  "coldRevisit": "Multiple servers + load balancer. Horizontal scaling > vertical scaling.",
  "content": "<h2>Scaling</h2><p>Vertical (scale up) = bigger server. Horizontal (scale out) = more servers.</p><h2>Load Balancer</h2><pre>Internet → Load Balancer → Server 1\\n→ Server 2\\n→ Server 3</pre>",
  "questions": [
    {
      "q": "What does load balancer do?",
      "opts": [
        "Makes faster",
        "Distributes traffic across servers. If one crashes, routes to healthy servers.",
        "Balances DB",
        "Cache"
      ],
      "correct": 1,
      "explain": "Load balancer = traffic distributor. Spreads requests, health checks, removes failed servers."
    }
  ],
  "essay": {
    "q": "Plan Black Friday scaling.",
    "guide": "Add load balancer + more servers. Test beforehand. Monitor. Auto-scaling ideal."
  }
};
