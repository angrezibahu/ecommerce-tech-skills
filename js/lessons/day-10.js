// Day 10: Core Web Vitals & Performance
window.__lessonCache = window.__lessonCache || {};
window.__lessonCache[10] = {
  "day": 10,
  "week": 1,
  "title": "Core Web Vitals & Performance",
  "desc": "LCP, INP, CLS and business impact",
  "duration": "55 min",
  "coldOpen": "Your SEO agency says Google is penalizing your site for poor Core Web Vitals. Your product pages are slow, but conversions haven't dropped. Do you prioritize this? How much should you spend?",
  "coldRevisit": "Core Web Vitals are a confirmed Google ranking factor. But more importantly: 1-second delay reduces conversions by 7% (Amazon data). Speed IS revenue. Field data (real users) matters more than lab scores.",
  "content": "<h2>Why This Matters to You</h2><p>Page speed directly impacts revenue. Amazon found that every 100ms of latency costs them 1% in sales. Google uses Core Web Vitals as a ranking factor. But the real impact is user experience: slow sites lose customers. Understanding Core Web Vitals helps you prioritize performance investments effectively.</p><h2>1. The Three Core Web Vitals</h2><p>Google measures three key metrics from real user data. These are the Core Web Vitals:</p><table><tr><th>Metric</th><th>Measures</th><th>Good Threshold</th><th>What It Means</th></tr><tr><td><strong>LCP</strong><br>(Largest Contentful Paint)</td><td>Loading performance</td><td>&lt; 2.5 seconds</td><td>How quickly the main content appears</td></tr><tr><td><strong>INP</strong><br>(Interaction to Next Paint)</td><td>Interactivity</td><td>&lt; 200ms</td><td>How quickly the site responds to clicks/taps</td></tr><tr><td><strong>CLS</strong><br>(Cumulative Layout Shift)</td><td>Visual stability</td><td>&lt; 0.1</td><td>How much the page jumps around while loading</td></tr></table><div class=\"info-box\"><div class=\"info-title\">💡 Field Data vs. Lab Data</div><p><strong>Lab data</strong> (Lighthouse, PageSpeed Insights): Tests in perfect conditions, useful for debugging.<br><strong>Field data</strong> (Chrome User Experience Report): Real users, real connections, real devices—this is what Google uses for ranking.</p></div><h2>2. LCP: Largest Contentful Paint</h2><p>LCP measures how long it takes for the largest visible element to appear. For ecommerce, this is usually the hero image or main product image.</p><h3>Common LCP Problems</h3><table><tr><th>Problem</th><th>Impact</th><th>Solution</th></tr><tr><td>Huge image files (5MB product photo)</td><td>Slow download</td><td>Optimize images: use WebP format, responsive images, compress to &lt;200KB</td></tr><tr><td>Image not prioritized</td><td>Downloads last</td><td>Add fetchpriority=\"high\" to hero/product image</td></tr><tr><td>Render-blocking CSS/JS</td><td>Image can't display until CSS loads</td><td>Inline critical CSS, defer non-critical JavaScript</td></tr><tr><td>Slow server response</td><td>HTML takes 3+ seconds</td><td>Use CDN, cache HTML, optimize database queries</td></tr></table><h3>Optimizing LCP: Practical Example</h3><pre>&lt;!-- Bad: Large image, no optimization --&gt;\n&lt;img src=\"product-huge.jpg\" alt=\"Product\"&gt;\n\n&lt;!-- Good: Optimized with modern format, priority hint --&gt;\n&lt;img \n  src=\"product-800w.webp\"\n  srcset=\"product-400w.webp 400w,\n          product-800w.webp 800w,\n          product-1200w.webp 1200w\"\n  sizes=\"(max-width: 600px) 400px,\n         (max-width: 1200px) 800px,\n         1200px\"\n  alt=\"Blue wireless headphones\"\n  fetchpriority=\"high\"\n  width=\"800\"\n  height=\"600\"\n&gt;</pre><div class=\"exercise\"><h4>🔧 Quick LCP Check</h4><ol><li>Open Chrome DevTools → Lighthouse</li><li>Run audit on your product page</li><li>Check LCP score—what's the largest element?</li><li>Is it optimized? What's the image file size?</li></ol></div><h2>3. INP: Interaction to Next Paint</h2><p>INP measures how quickly your site responds when users click buttons, open menus, or interact. This replaced FID (First Input Delay) in 2024.</p><h3>What Causes Slow INP?</h3><ul><li><strong>Heavy JavaScript:</strong> Blocking the main thread with computation</li><li><strong>Large DOM:</strong> 5000+ elements make updates slow</li><li><strong>Third-party scripts:</strong> Chat widgets, analytics blocking interactions</li><li><strong>No loading states:</strong> User doesn't know site is working</li></ul><h3>Improving INP</h3><pre>// Bad: Heavy work on click blocks interaction\nbutton.addEventListener('click', () => {\n  // Synchronous processing blocks UI\n  const result = processHugeDataset();\n  updateUI(result);\n});\n\n// Good: Show immediate feedback, defer heavy work\nbutton.addEventListener('click', async () => {\n  button.disabled = true;\n  button.textContent = 'Processing...';\n  \n  // Defer heavy work\n  const result = await processHugeDataset();\n  \n  updateUI(result);\n  button.disabled = false;\n  button.textContent = 'Complete';\n});</pre><div class=\"warning-box\"><div class=\"warning-title\">⚠️ The Add to Cart Test</div><p>Click 'Add to Cart' on your site. How long until you see feedback? If it's more than 200ms, INP is poor. Users perceive delays over 100ms as sluggish.</p></div><h2>4. CLS: Cumulative Layout Shift</h2><p>CLS measures how much the page layout shifts unexpectedly as it loads. Ever tried to click a button, but an ad loaded and you clicked the wrong thing? That's CLS.</p><h3>Common CLS Problems</h3><table><tr><th>Cause</th><th>Example</th><th>Fix</th></tr><tr><td>Images without dimensions</td><td>Content jumps down when image loads</td><td>Always specify width and height attributes</td></tr><tr><td>Ads without reserved space</td><td>Content shifts when ad loads</td><td>Reserve space with min-height container</td></tr><tr><td>Web fonts loading</td><td>Text shifts when font loads</td><td>Use font-display: swap and similar font fallbacks</td></tr><tr><td>Dynamically injected content</td><td>Banners appear, pushing content down</td><td>Reserve space or add above viewport</td></tr></table><h3>Fixing CLS: Image Example</h3><pre>&lt;!-- Bad: No dimensions, causes layout shift --&gt;\n&lt;img src=\"product.jpg\" alt=\"Product\"&gt;\n\n&lt;!-- Good: Dimensions prevent shift --&gt;\n&lt;img \n  src=\"product.jpg\" \n  alt=\"Product\"\n  width=\"800\"\n  height=\"600\"\n&gt;\n\n&lt;!-- Modern: Aspect ratio box --&gt;\n&lt;div style=\"aspect-ratio: 4/3\"&gt;\n  &lt;img src=\"product.jpg\" alt=\"Product\" style=\"width:100%;height:100%;object-fit:cover\"&gt;\n&lt;/div&gt;</pre><h2>5. Measuring Core Web Vitals</h2><h3>Tools for Measurement</h3><table><tr><th>Tool</th><th>Data Type</th><th>Best For</th></tr><tr><td><strong>PageSpeed Insights</strong></td><td>Lab + Field</td><td>Overview of performance</td></tr><tr><td><strong>Chrome DevTools Lighthouse</strong></td><td>Lab</td><td>Local debugging</td></tr><tr><td><strong>Search Console (Core Web Vitals report)</strong></td><td>Field</td><td>Google's actual ranking data</td></tr><tr><td><strong>Web Vitals Extension</strong></td><td>Real-time</td><td>Testing as you browse</td></tr><tr><td><strong>Real User Monitoring (RUM)</strong></td><td>Field (your own)</td><td>Production monitoring</td></tr></table><div class=\"info-box\"><div class=\"info-title\">💡 Field Data is King</div><p>Lab scores (Lighthouse 100/100) are nice, but Google ranks you based on field data—real users over 28 days. Focus on improving field data from Search Console.</p></div><h2>6. Performance Budget Strategy</h2><p>Set limits before building, prevent performance regression.</p><h3>Example Performance Budget</h3><pre>Performance Budget:\n┌─────────────────────────────┬──────────┬────────┐\n│ Metric                      │ Target   │ Max    │\n├─────────────────────────────┼──────────┼────────┤\n│ LCP                         │ &lt; 2.0s   │ 2.5s   │\n│ INP                         │ &lt; 100ms  │ 200ms  │\n│ CLS                         │ &lt; 0.05   │ 0.1    │\n│ Total Page Weight           │ &lt; 1MB    │ 2MB    │\n│ JavaScript Bundle           │ &lt; 200KB  │ 300KB  │\n│ Number of Requests          │ &lt; 50     │ 75     │\n│ Time to Interactive         │ &lt; 3.5s   │ 5s     │\n└─────────────────────────────┴──────────┴────────┘</pre><h2>7. The Business Case for Performance</h2><table><tr><th>Company</th><th>Improvement</th><th>Business Impact</th></tr><tr><td>Amazon</td><td>-100ms latency</td><td>+1% revenue</td></tr><tr><td>Walmart</td><td>-1s load time</td><td>+2% conversions</td></tr><tr><td>Pinterest</td><td>-40% wait time</td><td>+15% SEO traffic, +15% signups</td></tr><tr><td>Mobify</td><td>-100ms load time</td><td>+1.11% conversion</td></tr></table><div class=\"warning-box\"><div class=\"warning-title\">⚠️ The 3-Second Rule</div><p>53% of mobile users abandon sites that take longer than 3 seconds to load (Google research). Every second counts. If your LCP is 4 seconds, you're losing half your mobile traffic before they see your product.</p></div><h2>8. Prioritizing Performance Work</h2><h3>High-Impact, Low-Effort Wins</h3><ol><li><strong>Image optimization:</strong> Compress images, convert to WebP (1-2 hours)</li><li><strong>Add dimensions to images:</strong> Fixes CLS (1 hour)</li><li><strong>Enable text compression:</strong> Gzip/Brotli at server level (30 minutes)</li><li><strong>Use a CDN:</strong> Cloudflare free tier works (2 hours setup)</li><li><strong>Defer offscreen images:</strong> Native lazy loading (1 hour)</li></ol><h3>Higher Effort, High Impact</h3><ol><li><strong>Code splitting:</strong> Load only necessary JavaScript (1 week)</li><li><strong>Database optimization:</strong> Faster server response times (ongoing)</li><li><strong>Third-party script audit:</strong> Remove unnecessary analytics/widgets (2 days)</li></ol>",
  "questions": [
    {
      "q": "Your Lighthouse score is 98/100, but Search Console shows most users have poor Core Web Vitals. What's happening?",
      "opts": [
        "Search Console is wrong",
        "Lighthouse tests in lab conditions (fast connection, powerful device). Field data shows real users on slow connections and old phones—that's what matters for SEO.",
        "Lighthouse score is what Google uses",
        "Users have bad internet"
      ],
      "correct": 1,
      "explain": "Lab data (Lighthouse) is perfect conditions. Field data (Search Console) is real users. Google ranks based on field data. A 98 lab score means nothing if real users have a poor experience."
    },
    {
      "q": "Your product page has LCP of 4.5 seconds. Where should you look first?",
      "opts": [
        "JavaScript bundle size",
        "The main product image—check file size, format (use WebP), add fetchpriority='high', ensure it's not render-blocked by CSS",
        "CSS file size",
        "Server location"
      ],
      "correct": 1,
      "explain": "LCP is usually the hero/product image. Most common issues: huge file size (should be <200KB), wrong format (use WebP), not prioritized. Fix images before optimizing code."
    },
    {
      "q": "Users report that clicking 'Add to Cart' feels slow, but the action completes in 150ms. What's the issue?",
      "opts": [
        "150ms is too slow, optimize server",
        "Poor INP perception—need immediate visual feedback (spinner, disable button) even if processing is fast",
        "Users are wrong, 150ms is fine",
        "Need faster hosting"
      ],
      "correct": 1,
      "explain": "INP includes perceived responsiveness. Even if backend is fast, users need immediate feedback (button state change, loading indicator). No feedback feels broken."
    },
    {
      "q": "How do you justify spending 2 weeks on performance optimization to your CEO?",
      "opts": [
        "Better SEO rankings",
        "Show data: 1-second improvement = ~7% conversion lift. Calculate revenue impact: if site makes £50k/month, 7% = £3,500/month = £42k/year. 2 weeks of dev time (~£8k) pays for itself in 10 weeks.",
        "Competitors are faster",
        "Google requires it"
      ],
      "correct": 1,
      "explain": "Business case in revenue terms. Use industry benchmarks (Amazon: 100ms = 1% revenue) or your own A/B test data. Performance improvements pay for themselves quickly."
    },
    {
      "q": "Your mobile CLS score is 0.25 (poor). What's the most common cause on ecommerce sites?",
      "opts": [
        "JavaScript errors",
        "Images and ads loading without reserved space, causing content to shift down as they load",
        "Slow server",
        "CSS issues"
      ],
      "correct": 1,
      "explain": "Most CLS comes from images without width/height attributes and ads injected without reserved space. Fix: add dimensions to all images, reserve space for ads/banners."
    }
  ],
  "essay": {
    "q": "Your site's Core Web Vitals are failing (LCP: 4.2s, INP: 350ms, CLS: 0.18). You have one sprint (2 weeks) to improve. How do you prioritize? What wins can you achieve quickly?",
    "guide": "Start with quick wins: 1) Audit main images (product/hero)—compress to <200KB, convert to WebP, add fetchpriority='high' (fixes LCP). 2) Add width/height to all images (fixes CLS). 3) Audit and remove unnecessary third-party scripts (improves all metrics). 4) Add loading states to buttons/forms (improves INP perception). Measure with Search Console field data, not just Lighthouse. Calculate business impact: if 1-second improvement = 7% conversion lift, what's the revenue gain? Present to stakeholders in business terms."
  }
};
