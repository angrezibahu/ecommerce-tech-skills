// Day 20: Search Implementation
window.__lessonCache = window.__lessonCache || {};
window.__lessonCache[20] = {
  "day": 20,
  "week": 2,
  "title": "Search Implementation",
  "desc": "Full-text search, facets, relevance",
  "duration": "55 min",
  "coldOpen": "Customer searches 'blue headphones' and gets zero results. You have 50 blue headphones in stock. Search is working 'as designed'. What's wrong and how much does this cost you?",
  "coldRevisit": "Text normalization issue: 'Blue' vs 'blue', 'headphone' vs 'headphones'. Without proper tokenization, stemming, and fuzzy matching, search misses obvious matches. Every zero-result search is a lost sale. Fix: Use proper search engine (Elasticsearch, Algolia) with NLP.",
  "content": "<h2>Why This Matters</h2><p>Search directly impacts revenue. 30% of ecommerce visitors use search, and searchers convert 2-3x higher than non-searchers. Poor search (zero results, irrelevant results) = lost sales. Understanding search technology helps you evaluate when basic database queries aren't enough.</p><h2>1. Database Query vs Search Engine</h2><pre>// Database query (simple but limited)\nSELECT * FROM products \nWHERE name LIKE '%headphones%'\nORDER BY created_at DESC;\n\nProblems:\n- Case sensitive ('Headphones' !== 'headphones')\n- Exact match only (no typos: 'hedphones' = 0 results)\n- No relevance ranking (oldest first, not best match)\n- No word variations ('headphone' !== 'headphones')\n- Slow on large datasets (full table scan)\n\n// Search engine (sophisticated)\n// Handles: stemming, typos, synonyms, relevance\n// Returns blue headphones for: \n// 'blue headphones', 'Blue Headphone', 'blu hedphones', 'azure earphones'</pre><h2>2. Search Features Matrix</h2><table><tr><th>Feature</th><th>Database LIKE</th><th>Full-Text Search</th><th>Search Engine</th></tr><tr><td>Case insensitive</td><td>Manual (LOWER())</td><td>✓</td><td>✓</td></tr><tr><td>Partial matches</td><td>✓</td><td>✓</td><td>✓</td></tr><tr><td>Typo tolerance</td><td>✗</td><td>✗</td><td>✓</td></tr><tr><td>Stemming (run/running)</td><td>✗</td><td>✓</td><td>✓</td></tr><tr><td>Synonyms (big/large)</td><td>✗</td><td>✗</td><td>✓</td></tr><tr><td>Relevance ranking</td><td>✗</td><td>Basic</td><td>Advanced</td></tr><tr><td>Faceted search</td><td>Complex SQL</td><td>✗</td><td>✓</td></tr><tr><td>Speed at scale</td><td>Slow</td><td>Medium</td><td>Fast</td></tr></table><h2>3. Search Engine Options</h2><table><tr><th>Solution</th><th>Hosting</th><th>Cost</th><th>Best For</th></tr><tr><td><strong>Algolia</strong></td><td>Hosted</td><td>$1/1k searches</td><td>Fast implementation, excellent UX</td></tr><tr><td><strong>Elasticsearch</strong></td><td>Self-hosted/Cloud</td><td>$50-500/mo</td><td>Flexibility, large catalogs</td></tr><tr><td><strong>Typesense</strong></td><td>Self-hosted/Cloud</td><td>$30-200/mo</td><td>Elasticsearch alternative, simpler</td></tr><tr><td><strong>Meilisearch</strong></td><td>Self-hosted</td><td>Free/paid hosting</td><td>Open source, lightweight</td></tr><tr><td><strong>Database full-text</strong></td><td>Existing DB</td><td>Free</td><td>Small catalogs, basic needs</td></tr></table><h2>4. Implementing Algolia (Fast Setup)</h2><pre>// 1. Index your products\nconst algoliasearch = require('algoliasearch');\nconst client = algoliasearch('APP_ID', 'API_KEY');\nconst index = client.initIndex('products');\n\nconst products = await db.products.findAll();\nawait index.saveObjects(products.map(p => ({\n  objectID: p.id,\n  name: p.name,\n  description: p.description,\n  price: p.price,\n  category: p.category,\n  inStock: p.inventory > 0\n})));\n\n// 2. Frontend search (instant results)\nconst results = await index.search('blue headphones', {\n  filters: 'inStock:true',\n  facets: ['category', 'price_range'],\n  hitsPerPage: 20\n});\n\n// Results include:\n// - Matched products (with typo tolerance)\n// - Facets (categories: Electronics(45), Audio(23)...)\n// - Highlighting (shows matched terms)\n// - Response time: ~20ms</pre><h2>5. Search UX Best Practices</h2><pre>// Autocomplete (as-you-type suggestions)\nconst suggestions = await index.search(query, {\n  hitsPerPage: 5,\n  attributesToRetrieve: ['name', 'image', 'price'],\n  attributesToHighlight: ['name']\n});\n\n// Faceted search (filters)\n&lt;div&gt;\n  &lt;h3&gt;Category&lt;/h3&gt;\n  {facets.category.map(facet =&gt; (\n    &lt;label&gt;\n      &lt;input type=\"checkbox\" value={facet.value} /&gt;\n      {facet.value} ({facet.count})\n    &lt;/label&gt;\n  ))}\n&lt;/div&gt;\n\n// Zero-results handling\nif (results.hits.length === 0) {\n  // Don't show empty page\n  // Options:\n  // 1. Suggest alternative spelling\n  // 2. Show popular products\n  // 3. Show products from related categories\n  // 4. Log query for analysis (what are users searching for?)\n}</pre><h2>6. Relevance Tuning</h2><pre>// Configure searchable attributes with ranking\nindex.setSettings({\n  searchableAttributes: [\n    'name',           // Highest priority\n    'brand',\n    'category',\n    'description'     // Lowest priority\n  ],\n  customRanking: [\n    'desc(popularity)',  // Popular products rank higher\n    'asc(price)'        // Cheaper products rank higher\n  ],\n  attributesForFaceting: [\n    'category',\n    'brand',\n    'price_range',\n    'color'\n  ]\n});</pre><h2>7. Measuring Search Performance</h2><pre>// Key metrics to track\nSearch Metrics:\n┌────────────────────────────┬──────────┬─────────┐\n│ Metric                     │ Target   │ Action  │\n├────────────────────────────┼──────────┼─────────┤\n│ Zero-result searches       │ < 10%    │ Analyze │\n│ Search-to-purchase rate    │ 15-30%   │ Improve │\n│ Average results per search │ 10-100   │ Refine  │\n│ Search latency             │ < 100ms  │ Optimize│\n│ Top searches (no results)  │ Weekly   │ Review  │\n└────────────────────────────┴──────────┴─────────┘\n\n// Log zero-result searches\nif (results.nbHits === 0) {\n  await analytics.track('search-zero-results', {\n    query: query,\n    userId: user.id,\n    timestamp: Date.now()\n  });\n}</pre>",
  "questions": [
    {
      "q": "Customer searches 'blu hedphones' (typos). Database LIKE query returns zero results. What's missing?",
      "opts": [
        "Database is broken",
        "Typo tolerance (fuzzy matching). Search engines use Levenshtein distance to match similar terms. 'blu hedphones' matches 'blue headphones' with 2-edit distance.",
        "Need better database",
        "Customer error"
      ],
      "correct": 1,
      "explain": "Databases do exact matching. Search engines use fuzzy matching—tolerates 1-2 character differences. 'blu' matches 'blue', 'hedphones' matches 'headphones'. Critical for good search UX."
    },
    {
      "q": "20% of searches return zero results. How do you diagnose what's wrong?",
      "opts": [
        "Search is working correctly",
        "Log all zero-result queries, analyze patterns: Are they typos? Missing products? Wrong synonyms? Out-of-stock items? Fix: Add typo tolerance, configure synonyms, stock missing products.",
        "Users search wrong",
        "Disable search"
      ],
      "correct": 1,
      "explain": "Zero-result rate should be <10%. Log queries to identify patterns: typos (need fuzzy search), missing products (stock them), synonyms (configure: 'laptop' = 'notebook'), discontinued items (suggest alternatives)."
    },
    {
      "q": "Your product catalog has 50,000 items. Database LIKE queries are slow. What's the problem?",
      "opts": [
        "Need more RAM",
        "LIKE queries scan entire table (no index). At 50k+ products, this is slow. Solution: Use full-text index (database) or search engine (Elasticsearch/Algolia) for fast lookups.",
        "Database is too small",
        "Need SSD storage"
      ],
      "correct": 1,
      "explain": "LIKE '%term%' can't use indexes—full table scan. Slow at scale. Full-text indexes or dedicated search engines are optimized for text search: tokenization, inverted indexes, fast lookups."
    },
    {
      "q": "When does database full-text search suffice vs needing a dedicated search engine?",
      "opts": [
        "Always use search engine",
        "Database full-text OK for: <10k products, simple search (no typos/synonyms), low traffic. Need search engine for: large catalogs, typo tolerance, relevance tuning, high traffic, faceted search.",
        "Never use database search",
        "Doesn't matter"
      ],
      "correct": 1,
      "explain": "Trade-off: Database full-text is free, simple. Search engines add cost/complexity but provide typo tolerance, synonyms, relevance ranking, speed at scale. Evaluate based on catalog size and search sophistication needed."
    },
    {
      "q": "What's the business impact of search that returns zero results 30% of the time?",
      "opts": [
        "Users try again",
        "30% of searches = lost sales. Searchers are high-intent (2-3x conversion). Zero results = frustration + bounce. If 1000 searches/day, 300 zero results, 10% would buy at £50 AOV = £1,500/day lost = £45k/month.",
        "Search isn't important",
        "Users will browse instead"
      ],
      "correct": 1,
      "explain": "Searchers are high-intent buyers. Zero results = immediate bounce. Calculate: searches × zero-result rate × estimated conversion × AOV. Even conservative estimates show significant revenue loss from poor search."
    }
  ],
  "essay": {
    "q": "Your site has 10,000 products. Currently using database LIKE queries. 25% of searches return zero results, customers complain. Evaluate search engine options (Algolia, Elasticsearch, database full-text). What's the cost/benefit?",
    "guide": "Current problems: LIKE query limitations (no typo tolerance, no stemming, slow, no relevance ranking). 25% zero results = lost sales. Options: 1) Database full-text (PostgreSQL/MySQL): Free, better than LIKE, but limited typo tolerance. Good for: basic improvement, testing. 2) Elasticsearch: $50-200/mo hosting, full features, requires management. Good for: large catalogs, full control. 3) Algolia: ~$100-500/mo, instant setup, excellent UX, no management. Good for: fast implementation, focus on business. Recommendation: For 10k products + 25% zero results, Algolia worth investment. Calculate: If 1000 searches/day, 250 zero results, fixing reduces to 10% zero = 150 more successful searches. At 20% conversion × £50 AOV = £1,500/day additional revenue = £45k/month. $500/mo Algolia cost pays for itself 90x over. Pilot: Try Algolia 14-day trial, measure zero-result rate improvement and conversion impact."
  }
};
