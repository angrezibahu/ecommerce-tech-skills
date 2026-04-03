// Day 1: How the Web Works
window.__lessonCache = window.__lessonCache || {};
window.__lessonCache[1] = {
  "day": 1,
  "week": 0,
  "title": "How the Web Works",
  "desc": "DNS, HTTP, browsers, and the request-response cycle",
  "duration": "45 min",
  "coldOpen": "Your site is slow in Asia but fast in Europe. Marketing wants to expand to Japan. Engineering says it'll be expensive. What's happening and what are your options?",
  "coldRevisit": "Distance matters: speed of light limits. Europe server to Japan = 200ms+ latency per request. Solutions: CDN (content delivery network) caches content globally, or regional servers. Trade-off: complexity vs performance.",
  "content": "<h2>Why This Matters</h2><p>Every time a user visits your site, dozens of technical steps happen in milliseconds. Understanding this helps you diagnose issues ('why is checkout slow?') and evaluate proposals ('we need a CDN').</p><h2>1. What Happens When You Visit a Website</h2><pre>User types: www.example.com\n\n1. DNS Lookup (20-100ms)\n   Browser asks: \"What's the IP address for example.com?\"\n   DNS server responds: \"93.184.216.34\"\n\n2. TCP Connection (50-200ms depending on distance)\n   Browser connects to server at that IP address\n   Handshake: SYN → SYN-ACK → ACK\n\n3. TLS/SSL Handshake (50-200ms)\n   Establish secure HTTPS connection\n   Exchange encryption keys\n\n4. HTTP Request (1-5ms)\n   Browser: GET /index.html\n\n5. Server Processing (10-500ms)\n   Server finds file or runs code\n   Generates HTML response\n\n6. HTTP Response (transfer time depends on file size)\n   Server sends HTML back to browser\n\n7. Browser Rendering\n   Parse HTML, fetch CSS/JS/images\n   Repeat steps 1-6 for each resource\n   Render page to screen\n\nTotal: 200ms to 2+ seconds depending on distance and optimization</pre><h2>2. The DNS System</h2><p>DNS (Domain Name System) translates human-readable names to IP addresses.</p><table><tr><th>Step</th><th>What Happens</th><th>Time</th></tr><tr><td>Browser cache</td><td>Check if we recently looked up this domain</td><td>0ms (instant)</td></tr><tr><td>OS cache</td><td>Check operating system's DNS cache</td><td>~1ms</td></tr><tr><td>Router cache</td><td>Check local router</td><td>~5ms</td></tr><tr><td>ISP DNS</td><td>Ask your internet provider's DNS server</td><td>~20ms</td></tr><tr><td>Root/TLD servers</td><td>If not cached, query authoritative servers</td><td>~100ms</td></tr></table><div class=\"info-box\"><div class=\"info-title\">💡 Why DNS Matters</div><p>Slow DNS = slow site. Use fast DNS providers (Cloudflare: 1.1.1.1, Google: 8.8.8.8) and set appropriate cache times (TTL). Changing DNS can take 24-48 hours to propagate globally.</p></div><h2>3. HTTP: The Protocol of the Web</h2><pre>// HTTP Request\nGET /products/headphones HTTP/1.1\nHost: shop.example.com\nUser-Agent: Mozilla/5.0...\nAccept: text/html\nCookie: session=abc123\n\n// HTTP Response\nHTTP/1.1 200 OK\nContent-Type: text/html\nContent-Length: 15234\nSet-Cookie: cart=xyz789\n\n&lt;html&gt;&lt;body&gt;Product page...&lt;/body&gt;&lt;/html&gt;</pre><h3>HTTP Status Codes You Should Know</h3><table><tr><th>Code</th><th>Meaning</th><th>Example</th></tr><tr><td>200</td><td>Success</td><td>Page loaded successfully</td></tr><tr><td>301</td><td>Permanent redirect</td><td>Site moved to new domain</td></tr><tr><td>404</td><td>Not found</td><td>Page doesn't exist</td></tr><tr><td>500</td><td>Server error</td><td>Code crashed, database down</td></tr><tr><td>503</td><td>Service unavailable</td><td>Server overloaded or maintenance</td></tr></table><h2>4. Distance and Latency</h2><p>Speed of light physics creates unavoidable delays:</p><pre>Latency by Distance (one-way):\n┌──────────────────────────┬──────────┐\n│ Route                    │ Time     │\n├──────────────────────────┼──────────┤\n│ Same city                │ 1-5ms    │\n│ Same country             │ 10-30ms  │\n│ Transatlantic (US-EU)    │ 80-100ms │\n│ US to Asia               │ 150-200ms│\n│ Round-trip (multiply×2)  │ Double   │\n└──────────────────────────┴──────────┘\n\nExample: London server, Tokyo user\n- DNS lookup: 200ms roundtrip\n- TCP handshake: 400ms (2 roundtrips)\n- TLS handshake: 600ms (3 roundtrips)\n- HTTP request/response: 400ms\nTotal: 1.6 seconds before content even loads!</pre><div class=\"warning-box\"><div class=\"warning-title\">⚠️ The Geographic Problem</div><p>Serving global users from one server location means slow experiences for distant users. This is why CDNs exist—serve content from servers physically close to users.</p></div><h2>5. HTTPS and Security</h2><p>HTTPS encrypts communication between browser and server:</p><ul><li><strong>Without HTTPS (HTTP):</strong> Anyone between you and server can read/modify data</li><li><strong>With HTTPS:</strong> Encrypted, authenticated, can't be tampered with</li></ul><p><strong>Why HTTPS matters:</strong></p><ul><li>Google ranks HTTPS sites higher</li><li>Browsers show 'Not Secure' warning without it</li><li>Required for modern features (geolocation, camera access)</li><li>Protects customer data (passwords, payment info)</li></ul><h2>6. The Browser's Job</h2><pre>Browser receives HTML:\n\n1. Parse HTML → Build DOM tree\n2. Find &lt;link rel=\"stylesheet\"&gt; → Fetch CSS\n3. Find &lt;script&gt; tags → Fetch JavaScript\n4. Find &lt;img&gt; tags → Fetch images\n5. Apply CSS → Calculate layout\n6. Execute JavaScript → Modify DOM\n7. Paint pixels to screen\n\nEach external resource (CSS, JS, image) = new HTTP request\n50 resources = 50 requests = slow page if not optimized</pre>",
  "questions": [
    {
      "q": "Your site is hosted in London. Tokyo users report it's very slow. What's the primary cause?",
      "opts": [
        "Server is slow",
        "Distance: Light takes ~100ms one-way London→Tokyo. Each request = 200ms+ roundtrip. Solution: CDN or regional server.",
        "Internet connection",
        "Browser issue"
      ],
      "correct": 1,
      "explain": "Physics problem: speed of light creates unavoidable latency. Far users experience slow load times. CDN solves this by serving content from geographically close servers."
    },
    {
      "q": "What does DNS do?",
      "opts": [
        "Hosts websites",
        "Translates domain names (example.com) to IP addresses (93.184.216.34) that computers use to connect",
        "Provides security",
        "Speeds up websites"
      ],
      "correct": 1,
      "explain": "DNS is the phone book of the internet. Humans use names (example.com), computers use IP addresses (93.184.216.34). DNS translates between them."
    },
    {
      "q": "Customer says checkout is slow. You check: HTML loads in 100ms, but page takes 5 seconds to appear. What's likely wrong?",
      "opts": [
        "Server is slow",
        "Too many external resources (CSS, JS, images). Browser makes separate request for each. 50 resources = 50 requests. Need to optimize: combine files, use CDN, lazy load.",
        "DNS is slow",
        "Database issue"
      ],
      "correct": 1,
      "explain": "Fast HTML but slow page = too many resources. Each CSS/JS/image file requires separate HTTP request. Waterfall of requests slows page. Solution: bundle files, use CDN, optimize images."
    },
    {
      "q": "Why is HTTPS important beyond security?",
      "opts": [
        "Makes site faster",
        "Required for SEO (Google ranking boost), modern browser features, avoids 'Not Secure' warnings, and customer trust. Not optional for ecommerce.",
        "Only for payments",
        "Optional nice-to-have"
      ],
      "correct": 1,
      "explain": "HTTPS is mandatory for modern web: Google ranking factor, browsers show warnings without it, required for features like geolocation, and essential for customer trust in ecommerce."
    },
    {
      "q": "What's the relationship between distance and latency?",
      "opts": [
        "No relationship",
        "Speed of light limits: ~100ms London→Tokyo one-way. Each request = multiple roundtrips (DNS, TCP, TLS, HTTP). Far users = slow site unless you use CDN.",
        "Only affects downloads",
        "Software can fix it"
      ],
      "correct": 1,
      "explain": "Physics: light travels ~200,000km/sec in fiber. London→Tokyo = 20,000km = 100ms one-way. Each request needs multiple roundtrips. CDN puts servers closer to users to reduce distance."
    }
  ],
  "essay": {
    "q": "Your site serves UK customers from a London server. Marketing wants to expand to US and Australia. Engineering says you need a CDN and estimates £300/month. How do you evaluate if this is necessary? What's the customer experience without it?",
    "guide": "Current: London server serves UK well (10-20ms latency). Without CDN: US users: 80ms+ per request × multiple requests = 2-3 second slowdown. Australia users: 150ms+ = 4-5 second slowdown. Impact: slow sites = abandoned carts, poor experience, negative reviews. With CDN: Serve from edge servers in US/Australia (20-30ms latency). Cost: £300/mo vs lost sales. Calculate: if 1% conversion loss from slow US site, and US represents £50k/month revenue, that's £500/month lost. CDN pays for itself. Alternative: Regional servers (more expensive: £500+/month). Recommendation: Start with CDN (Cloudflare/CloudFront), measure latency improvement, calculate conversion impact."
  }
};
