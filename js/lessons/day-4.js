// Day 4: Caching Strategies
window.__lessonCache = window.__lessonCache || {};
window.__lessonCache[4] = {
  "day": 4,
  "week": 0,
  "title": "Caching Strategies",
  "desc": "Making sites fast with smart caching",
  "duration": "50 min",
  "coldOpen": "Your site serves same product pages thousands of times per day. Every request hits database. Can this be faster?",
  "coldRevisit": "Yes—caching. Store computed results, reuse them. Redis for data, CDN for static files, browser caching. Trade-off: complexity vs speed.",
  "content": "<h2>Why Caching Matters</h2><p>Caching = storing expensive-to-compute results for reuse. Database queries take 50-200ms. Cache lookups take 1-5ms. 40x faster.</p><h2>Caching Layers</h2><table><tr><th>Layer</th><th>Speed</th><th>Use Case</th></tr><tr><td>Browser Cache</td><td>0ms</td><td>CSS, JS, images</td></tr><tr><td>CDN Cache</td><td>20-50ms</td><td>Static files globally</td></tr><tr><td>Redis Cache</td><td>1-5ms</td><td>Database query results</td></tr><tr><td>Database</td><td>50-200ms</td><td>Source of truth</td></tr></table><h2>Example</h2><pre>// Check Redis cache first\\nconst cached = await redis.get('product:123');\\nif (cached) return JSON.parse(cached);\\n\\n// Cache miss: query database\\nconst product = await db.query('SELECT * FROM products WHERE id = 123');\\nawait redis.setex('product:123', 300, JSON.stringify(product));\\nreturn product;</pre>",
  "questions": [
    {
      "q": "What's cache invalidation?",
      "opts": [
        "Deleting cache",
        "Ensuring cached data stays fresh when source changes. Hard problem: when product price updates, invalidate cache.",
        "Cache security",
        "Backup"
      ],
      "correct": 1,
      "explain": "Cache invalidation = removing stale data. Product price changes? Clear cache so users see new price."
    }
  ],
  "essay": {
    "q": "Evaluate caching strategy for product pages.",
    "guide": "Cache product data in Redis (5-min TTL). Invalidate on updates. CDN for images."
  }
};
