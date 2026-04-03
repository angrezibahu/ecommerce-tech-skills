// Day 15: Server-Side Rendering
window.__lessonCache = window.__lessonCache || {};
window.__lessonCache[15] = {
  "day": 15,
  "week": 2,
  "title": "Server-Side Rendering",
  "desc": "SSR, SSG, ISR explained",
  "duration": "50 min",
  "coldOpen": "Your SEO agency says your product pages aren't being indexed properly by Google. They recommend 'server-side rendering'. Your React site currently uses client-side rendering. Is this a real problem? What's the investment required?",
  "coldRevisit": "Real problem. Client-side rendering sends empty HTML—JavaScript fills content after load. Search bots may not wait. SSR sends complete HTML immediately. Options: Next.js (React SSR framework), static site generation, or pre-rendering service. Investment: 2-4 weeks for Next.js migration.",
  "content": "<h2>Why This Matters to You</h2><p>Server-side rendering (SSR) affects SEO, performance, and user experience. The wrong rendering strategy can hide your products from Google, slow down page loads, and cost you traffic. Understanding SSR helps you evaluate technical proposals that claim to 'fix SEO' or 'improve performance'.</p><h2>1. The Three Rendering Strategies</h2><table><tr><th>Strategy</th><th>How It Works</th><th>Pros</th><th>Cons</th></tr><tr><td><strong>CSR</strong><br>(Client-Side Rendering)</td><td>Send empty HTML, JavaScript fills content</td><td>Simple to build, cheap hosting</td><td>Slow initial load, SEO challenges</td></tr><tr><td><strong>SSR</strong><br>(Server-Side Rendering)</td><td>Server generates full HTML for each request</td><td>Fast initial load, SEO-friendly</td><td>Requires server, more complex</td></tr><tr><td><strong>SSG</strong><br>(Static Site Generation)</td><td>Pre-generate HTML at build time</td><td>Fastest, cheap hosting (CDN)</td><td>Only for content that doesn't change often</td></tr></table><h2>2. Client-Side Rendering (CSR) Problem</h2><p>This is what most React/Vue apps do by default:</p><pre>&lt;!-- What Google sees (empty HTML) --&gt;\n&lt;!DOCTYPE html&gt;\n&lt;html&gt;\n&lt;head&gt;&lt;title&gt;My Shop&lt;/title&gt;&lt;/head&gt;\n&lt;body&gt;\n  &lt;div id=\"root\"&gt;&lt;/div&gt;  &lt;!-- Empty! --&gt;\n  &lt;script src=\"app.js\"&gt;&lt;/script&gt;\n&lt;/body&gt;\n&lt;/html&gt;\n\n&lt;!-- JavaScript fills content AFTER load --&gt;\n&lt;!-- If Google doesn't wait, it sees nothing --&gt;</pre><h3>CSR Timeline</h3><pre>User visits page:\n1. [0ms] Request HTML\n2. [200ms] Receive empty HTML\n3. [200ms] Download app.js (200KB)\n4. [300ms] Execute JavaScript\n5. [500ms] Fetch product data from API\n6. [700ms] Render content\n\nUser sees content at 700ms\nGoogle may not wait this long</pre><div class=\"warning-box\"><div class=\"warning-title\">⚠️ The SEO Impact</div><p>Google can execute JavaScript, but:<br>• It's slower and less reliable<br>• May not wait for API calls<br>• Indexing is delayed<br>• Social media previews don't work (Facebook/Twitter don't run JavaScript)<br><br>For ecommerce: Products not indexed = products not found = lost sales.</p></div><h2>3. Server-Side Rendering (SSR)</h2><p>Server generates complete HTML for each request:</p><pre>&lt;!-- What Google sees (complete HTML) --&gt;\n&lt;!DOCTYPE html&gt;\n&lt;html&gt;\n&lt;head&gt;&lt;title&gt;Wireless Headphones - $149&lt;/title&gt;&lt;/head&gt;\n&lt;body&gt;\n  &lt;div id=\"root\"&gt;\n    &lt;h1&gt;Wireless Headphones&lt;/h1&gt;\n    &lt;p&gt;Price: $149.99&lt;/p&gt;\n    &lt;button&gt;Add to Cart&lt;/button&gt;\n  &lt;/div&gt;\n  &lt;script src=\"app.js\"&gt;&lt;/script&gt;\n&lt;/body&gt;\n&lt;/html&gt;\n\n&lt;!-- Content visible immediately, JavaScript adds interactivity --&gt;</pre><h3>SSR Timeline</h3><pre>User visits page:\n1. [0ms] Request HTML\n2. [100ms] Server fetches product data\n3. [200ms] Server renders HTML\n4. [300ms] User receives complete HTML → content visible!\n5. [500ms] JavaScript downloads and \"hydrates\" (adds interactivity)\n\nUser sees content at 300ms (2x faster)\nGoogle sees full content immediately</pre><h2>4. Static Site Generation (SSG)</h2><p>Pre-generate HTML at build time (fastest):</p><pre># Build process (runs once)\n1. Fetch all products from database\n2. Generate HTML file for each product\n3. Output: /products/headphones.html, /products/laptop.html, etc.\n4. Deploy to CDN\n\n# User request (instant)\n1. User requests /products/headphones.html\n2. CDN serves pre-built file immediately\n3. No server rendering, no database query\n\nResult: 50-100ms response time</pre><h3>When to Use SSG</h3><ul><li><strong>Good for:</strong> Marketing pages, blog posts, product catalogs (if updated infrequently)</li><li><strong>Not good for:</strong> Personalized content, real-time data, user dashboards</li></ul><div class=\"info-box\"><div class=\"info-title\">💡 Hybrid Approach: ISR</div><p><strong>Incremental Static Regeneration (ISR):</strong> Pre-generate pages, but regenerate them periodically or on-demand. Best of both worlds:<br>• Fast like SSG (serve from CDN)<br>• Fresh like SSR (regenerate every 60 seconds)<br>• Example: Product pages regenerate when inventory changes</p></div><h2>5. Next.js: The Popular SSR Framework</h2><p>Next.js (React) makes SSR easy:</p><pre>// pages/products/[id].js\nexport default function Product({ product }) {\n  return (\n    &lt;div&gt;\n      &lt;h1&gt;{product.name}&lt;/h1&gt;\n      &lt;p&gt;Price: ${product.price}&lt;/p&gt;\n      &lt;button&gt;Add to Cart&lt;/button&gt;\n    &lt;/div&gt;\n  );\n}\n\n// This runs on the SERVER for each request\nexport async function getServerSideProps({ params }) {\n  const product = await fetch(`/api/products/${params.id}`);\n  return { props: { product } };\n}\n\n// Or use SSG (build time)\nexport async function getStaticProps({ params }) {\n  const product = await fetch(`/api/products/${params.id}`);\n  return { \n    props: { product },\n    revalidate: 60 // ISR: regenerate every 60 seconds\n  };\n}</pre><h2>6. SSR Decision Matrix</h2><table><tr><th>Page Type</th><th>Strategy</th><th>Why</th></tr><tr><td>Marketing homepage</td><td>SSG</td><td>Rarely changes, needs fast load</td></tr><tr><td>Product catalog</td><td>SSG + ISR</td><td>Frequent but not real-time changes</td></tr><tr><td>Product detail page</td><td>SSG + ISR</td><td>Need SEO, can regenerate periodically</td></tr><tr><td>Shopping cart</td><td>CSR</td><td>User-specific, no SEO needed</td></tr><tr><td>User dashboard</td><td>CSR</td><td>Behind login, personalized</td></tr><tr><td>Checkout</td><td>SSR or CSR</td><td>Behind login, but needs reliability</td></tr><tr><td>Search results</td><td>SSR</td><td>Dynamic queries, need SEO</td></tr></table><h2>7. Migration Path: CSR → SSR</h2><pre>Phase 1: Assess (1 week)\n- Which pages need SEO? (Product pages: yes. Dashboard: no.)\n- Current indexing issues?\n- Check Google Search Console for crawl errors\n\nPhase 2: Pilot (2-3 weeks)\n- Implement SSR for highest-value pages (top 20 products)\n- Use Next.js or similar framework\n- Measure: indexing speed, SEO rankings, page load time\n\nPhase 3: Rollout (4-8 weeks)\n- Migrate remaining public pages\n- Keep CSR for authenticated pages\n- Monitor Core Web Vitals\n\nPhase 4: Optimize\n- Implement ISR for product pages\n- Use CDN caching\n- Monitor server costs (SSR requires compute)</pre><h2>8. Cost Implications</h2><table><tr><th>Strategy</th><th>Hosting Cost</th><th>Dev Complexity</th><th>Example Monthly Cost</th></tr><tr><td><strong>CSR</strong></td><td>Very low (static hosting)</td><td>Simple</td><td>$5-20 (Netlify/Vercel)</td></tr><tr><td><strong>SSG</strong></td><td>Low (CDN)</td><td>Medium</td><td>$20-100</td></tr><tr><td><strong>SSR</strong></td><td>Medium-High (compute)</td><td>Complex</td><td>$100-500+ (scales with traffic)</td></tr><tr><td><strong>ISR</strong></td><td>Medium (CDN + compute)</td><td>Medium</td><td>$50-200</td></tr></table><div class=\"warning-box\"><div class=\"warning-title\">⚠️ The Server Cost Surprise</div><p>SSR requires servers to run for every request. If you have 100k daily visitors:<br>• CSR: $20/month (static files)<br>• SSR: $500+/month (compute for 100k renders)<br><br>Use ISR or SSG where possible to reduce costs.</p></div><h2>9. Debugging SSR Issues</h2><pre>Common SSR problems:\n\n1. \"window is not defined\"\n   Problem: Browser-only code runs on server\n   Fix: Check if window exists before using:\n        if (typeof window !== 'undefined') { ... }\n\n2. Hydration mismatch\n   Problem: Server HTML doesn't match client HTML\n   Fix: Ensure server and client render same output\n\n3. Slow server rendering\n   Problem: Database queries slow down HTML generation\n   Fix: Optimize queries, add caching, use ISR instead\n\n4. Increased server costs\n   Problem: SSR compute is expensive\n   Fix: Use SSG/ISR where possible, add caching layers</pre>",
  "questions": [
    {
      "q": "Your SEO agency says your React site has indexing issues because it's client-side rendered. Is this a real problem?",
      "opts": [
        "No—Google runs JavaScript now",
        "Yes—CSR sends empty HTML. Google may index it, but slowly and unreliably. Social media previews don't work. SSR or SSG sends complete HTML immediately.",
        "Only a problem for old sites",
        "Just add more meta tags"
      ],
      "correct": 1,
      "explain": "Real problem. While Google can execute JavaScript, it's slower and less reliable than getting complete HTML. Social previews (Facebook, Twitter) don't run JavaScript at all. SSR fixes this."
    },
    {
      "q": "What's the difference between SSR and SSG?",
      "opts": [
        "No difference",
        "SSR generates HTML for each request (dynamic, server required). SSG pre-generates HTML at build time (fast, CDN-friendly, but static). ISR combines both.",
        "SSR is faster",
        "SSG is for blogs only"
      ],
      "correct": 1,
      "explain": "SSR: server generates HTML per request (good for dynamic content, requires compute). SSG: generate all pages at build time (fastest, cheapest, but content is static until next build). ISR: SSG with periodic regeneration."
    },
    {
      "q": "Your product catalog has 10,000 products. Which rendering strategy makes sense?",
      "opts": [
        "CSR for speed",
        "SSG + ISR: Pre-generate all product pages at build time, regenerate when inventory changes. Serves from CDN (fast), stays fresh (SEO), low cost.",
        "SSR for every request",
        "Generate pages manually"
      ],
      "correct": 1,
      "explain": "SSG with ISR is ideal: pre-generate all pages (one-time build cost), serve from CDN (fast + cheap), regenerate periodically or on inventory updates (fresh content). SSR would be expensive at scale."
    },
    {
      "q": "Developer proposes migrating to Next.js for SSR. Timeline: 6 weeks. How do you evaluate?",
      "opts": [
        "Approve if SEO is suffering",
        "Ask: Which pages need SEO? (public product pages: yes; dashboard/cart: no). Can we migrate incrementally (public pages first)? What's the hosting cost increase? Pilot on top 20 products first?",
        "Reject—too expensive",
        "Require 3-month timeline"
      ],
      "correct": 1,
      "explain": "Don't migrate everything. Identify pages that need SEO (public content), keep CSR for authenticated pages. Pilot on high-value pages, measure results, then scale. Incremental adoption reduces risk."
    },
    {
      "q": "After implementing SSR, your hosting costs increased from $20 to $400/month. Why?",
      "opts": [
        "Vendor is overcharging",
        "SSR requires compute for every page render. Unlike CSR (static files) or SSG (pre-built), SSR runs code per request. Consider ISR to reduce costs—pre-generate pages, regenerate periodically.",
        "SSR is more expensive technology",
        "Configuration error"
      ],
      "correct": 1,
      "explain": "SSR is compute-intensive—server runs code for every request. CSR serves static files ($20/mo). SSR requires servers ($400/mo+). ISR reduces cost: pre-generate pages, serve from CDN, regenerate periodically."
    }
  ],
  "essay": {
    "q": "Your SEO agency says your product pages aren't ranking well and recommends 'server-side rendering'. Your React site uses CSR. How do you evaluate if this investment is justified? What questions do you ask? What's your migration strategy?",
    "guide": "Evaluate SEO impact: Check Google Search Console—are pages indexed? How long does indexing take? Are product pages appearing in search? Check social shares—do previews work? Questions for dev: Can we use SSG/ISR instead of full SSR (cheaper)? Can we migrate incrementally? What's the cost (development + hosting)? Strategy: 1) Pilot on top 20 products using Next.js, 2) Measure: indexing speed, SEO rankings, page load (Core Web Vitals), 3) If successful: migrate remaining public pages, 4) Keep CSR for authenticated pages (cart, dashboard). Cost: 4-6 weeks dev time (~£25k) + hosting increase (£200-400/mo). ROI: If 10,000 products × 10 searches/product/month × 5% CTR × 2% conversion × £50 AOV = significant revenue gain if not currently indexed."
  }
};
