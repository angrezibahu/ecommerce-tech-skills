// Lesson metadata for dashboard rendering — full content loaded lazily
var lessonsManifest = [
  {
    "day": 1,
    "week": 0,
    "title": "How the Web Works",
    "desc": "DNS, HTTP, browsers, and the request-response cycle",
    "duration": "45 min"
  },
  {
    "day": 2,
    "week": 0,
    "title": "Client-Server Architecture & APIs",
    "desc": "How frontend and backend communicate",
    "duration": "50 min"
  },
  {
    "day": 3,
    "week": 0,
    "title": "Databases & Data Storage",
    "desc": "SQL, NoSQL, choosing the right database",
    "duration": "55 min"
  },
  {
    "day": 4,
    "week": 0,
    "title": "Caching Strategies",
    "desc": "Making sites fast with smart caching",
    "duration": "50 min"
  },
  {
    "day": 5,
    "week": 0,
    "title": "CDNs & Edge Computing",
    "desc": "Serving content globally",
    "duration": "50 min"
  },
  {
    "day": 6,
    "week": 0,
    "title": "Load Balancing & Scaling",
    "desc": "Handling traffic spikes",
    "duration": "50 min"
  },
  {
    "day": 7,
    "week": 0,
    "title": "Week 1 Review",
    "desc": "Infrastructure foundations",
    "duration": "45 min"
  },
  {
    "day": 8,
    "week": 1,
    "title": "HTML5 Semantics & Accessibility",
    "desc": "Meaningful markup and inclusive design",
    "duration": "55 min"
  },
  {
    "day": 9,
    "week": 1,
    "title": "CSS Architecture & Layout",
    "desc": "Modern CSS, Flexbox, Grid, and scalable stylesheets",
    "duration": "55 min"
  },
  {
    "day": 10,
    "week": 1,
    "title": "Core Web Vitals & Performance",
    "desc": "LCP, INP, CLS and business impact",
    "duration": "55 min"
  },
  {
    "day": 11,
    "week": 1,
    "title": "JavaScript Fundamentals",
    "desc": "The language of web interactivity",
    "duration": "55 min"
  },
  {
    "day": 12,
    "week": 1,
    "title": "DOM & Event Handling",
    "desc": "How JavaScript interacts with pages",
    "duration": "50 min"
  },
  {
    "day": 13,
    "week": 1,
    "title": "Frontend Build Tools",
    "desc": "Bundlers, transpilers, workflows",
    "duration": "50 min"
  },
  {
    "day": 14,
    "week": 1,
    "title": "Frontend Frameworks",
    "desc": "React, Vue, Angular - when to use",
    "duration": "55 min"
  },
  {
    "day": 15,
    "week": 2,
    "title": "Server-Side Rendering",
    "desc": "SSR, SSG, ISR explained",
    "duration": "50 min"
  },
  {
    "day": 16,
    "week": 2,
    "title": "Authentication & Authorization",
    "desc": "Sessions, JWT, OAuth explained",
    "duration": "55 min"
  },
  {
    "day": 17,
    "week": 2,
    "title": "Payment Integration",
    "desc": "Stripe, PCI compliance, security",
    "duration": "55 min"
  },
  {
    "day": 18,
    "week": 2,
    "title": "Webhooks & Event Architecture",
    "desc": "Asynchronous integrations",
    "duration": "50 min"
  },
  {
    "day": 19,
    "week": 2,
    "title": "Message Queues & Background Jobs",
    "desc": "Async processing for reliability",
    "duration": "50 min"
  },
  {
    "day": 20,
    "week": 2,
    "title": "Search Implementation",
    "desc": "Full-text search, facets, relevance",
    "duration": "55 min"
  },
  {
    "day": 21,
    "week": 2,
    "title": "Week 2 Review & Integration Patterns",
    "desc": "Connecting systems effectively",
    "duration": "45 min"
  },
  {
    "day": 22,
    "week": 3,
    "title": "Platform Architecture",
    "desc": "Monolith vs microservices",
    "duration": "55 min"
  },
  {
    "day": 23,
    "week": 3,
    "title": "Performance Monitoring & Observability",
    "desc": "Proactive monitoring, metrics, and alerting",
    "duration": "55 min"
  },
  {
    "day": 24,
    "week": 3,
    "title": "Security Best Practices",
    "desc": "OWASP Top 10, XSS, CSRF, SQL injection",
    "duration": "55 min"
  },
  {
    "day": 25,
    "week": 3,
    "title": "CI/CD & Deployment",
    "desc": "Automated testing and deployment",
    "duration": "50 min"
  },
  {
    "day": 26,
    "week": 3,
    "title": "Incident Management",
    "desc": "Responding to outages",
    "duration": "50 min"
  },
  {
    "day": 27,
    "week": 3,
    "title": "Cloud Cost Optimization",
    "desc": "Managing infrastructure spend",
    "duration": "50 min"
  },
  {
    "day": 28,
    "week": 3,
    "title": "Week 3 Review",
    "desc": "Operations & Security",
    "duration": "45 min"
  },
  {
    "day": 29,
    "week": 4,
    "title": "Technical Leadership",
    "desc": "Managing engineers effectively",
    "duration": "50 min"
  },
  {
    "day": 30,
    "week": 4,
    "title": "Technical Roadmapping",
    "desc": "Aligning tech with business",
    "duration": "50 min"
  }
];
