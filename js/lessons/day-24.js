// Day 24: Security Best Practices
window.__lessonCache = window.__lessonCache || {};
window.__lessonCache[24] = {
  "day": 24,
  "week": 3,
  "title": "Security Best Practices",
  "desc": "OWASP Top 10, XSS, CSRF, SQL injection",
  "duration": "55 min",
  "coldOpen": "Security audit found 15 vulnerabilities: SQL injection, XSS, exposed API keys, weak passwords, no rate limiting. Budget for fixes: £30k. How do you prioritize? What's the actual risk?",
  "coldRevisit": "Prioritize by OWASP Top 10 severity + exploitation likelihood + business impact. Critical (fix immediately): SQL injection, broken authentication, XSS. High: rate limiting, password policy. Medium: dependency updates. Calculate: breach cost vs fix cost.",
  "content": "<h2>Why This Matters</h2><p>Security breaches cost UK companies average £3.2M. GDPR fines reach £17M. One SQL injection can expose entire database. Understanding security helps you prioritize fixes and avoid expensive breaches.</p><h2>1. OWASP Top 10 (2021)</h2><table><tr><th>Rank</th><th>Vulnerability</th><th>Example</th></tr><tr><td>1</td><td>Broken Access Control</td><td>Change URL /orders/123 → /orders/456 to see others' orders</td></tr><tr><td>2</td><td>Cryptographic Failures</td><td>Passwords in plain text, no HTTPS</td></tr><tr><td>3</td><td>Injection (SQL, XSS)</td><td>Search: ' OR '1'='1 exposes all data</td></tr><tr><td>4</td><td>Insecure Design</td><td>No rate limiting allows brute-force</td></tr><tr><td>5</td><td>Security Misconfiguration</td><td>Default admin password, debug in production</td></tr></table><h2>2. SQL Injection</h2><pre>// VULNERABLE\nconst query = \"SELECT * FROM users WHERE email = '\" + email + \"'\";\n// Input: ' OR '1'='1\n// Returns ALL users!\n\n// SECURE (parameterized)\nconst query = 'SELECT * FROM users WHERE email = ?';\ndb.query(query, [email]);</pre><p><strong>Impact:</strong> Database fully exposed, GDPR violation, £17M fine potential.</p><h2>3. Cross-Site Scripting (XSS)</h2><pre>// VULNERABLE\nres.send(`<h1>Search: ${query}</h1>`);\n// URL: /search?q=<script>steal_cookies()</script>\n\n// SECURE\nconst escape = require('escape-html');\nres.send(`<h1>Search: ${escape(query)}</h1>`);</pre><p><strong>Impact:</strong> Session hijacking, user impersonation</p><h2>4. Authentication Security</h2><pre>// Password hashing\nconst bcrypt = require('bcrypt');\nconst hash = await bcrypt.hash(password, 10);\n\n// Session security\napp.use(session({\n  cookie: {\n    httpOnly: true,   // XSS protection\n    secure: true,     // HTTPS only\n    sameSite: 'strict' // CSRF protection\n  }\n}));</pre><h2>5. Rate Limiting</h2><pre>const rateLimit = require('express-rate-limit');\nconst loginLimiter = rateLimit({\n  windowMs: 15 * 60 * 1000,\n  max: 5,  // 5 attempts per 15 minutes\n  message: 'Too many attempts'\n});\napp.post('/login', loginLimiter, handler);</pre><p>Without rate limiting: 1000 passwords/second = 86k/day. With: 480/day (brute force impractical).</p><h2>6. Security Checklist</h2><table><tr><th>Priority</th><th>Control</th><th>Cost</th></tr><tr><td>CRITICAL</td><td>Parameterized queries</td><td>1-2 days</td></tr><tr><td>CRITICAL</td><td>HTTPS everywhere</td><td>£50/yr + 2 hours</td></tr><tr><td>CRITICAL</td><td>Hash passwords (bcrypt)</td><td>1 day</td></tr><tr><td>HIGH</td><td>Escape user input</td><td>2-3 days</td></tr><tr><td>HIGH</td><td>CSRF protection</td><td>1 day</td></tr><tr><td>HIGH</td><td>Rate limiting</td><td>4 hours</td></tr><tr><td>MEDIUM</td><td>Dependency updates</td><td>Ongoing</td></tr></table><h2>7. Breach Cost vs Prevention</h2><pre>Breach cost:\n- GDPR fine: £40k-17M\n- Legal fees: £200k-2M\n- Reputation: 20-30% revenue loss\n- Total: £1M-10M\n\nPrevention cost:\n- Fixes: £10k-30k\n- Audit: £5k-15k\n- Tools: £2k-10k/yr\n- Total: £25k-83k\n\nROI: 10-100x</pre>",
  "questions": [
    {
      "q": "SQL injection found. CFO asks 'how bad?' What do you say?",
      "opts": [
        "Just a code bug",
        "CRITICAL. Can expose entire database: customer PII, payments. GDPR breach = £17M fine + lawsuits. Equifax cost: $4B. Fix immediately (1-2 days with parameterized queries).",
        "Fix when convenient",
        "Only bad if exploited"
      ],
      "correct": 1,
      "explain": "SQL injection is CRITICAL. Full database access possible. One vulnerability = catastrophic breach. Equifax: $4B cost from SQL injection. Fix immediately."
    },
    {
      "q": "Login has no rate limiting. Why is this risky?",
      "opts": [
        "Not risky",
        "Enables brute-force: 1000 passwords/second = 86k/day. Common passwords cracked fast. Rate limiting (5/15min) reduces to 480/day, making brute force impractical.",
        "Users login too fast",
        "Database overload"
      ],
      "correct": 1,
      "explain": "Without rate limiting, brute force is practical: 86k attempts/day. Rate limiting (5/15min) = 480/day, impractical for brute force. Critical for auth endpoints."
    },
    {
      "q": "Passwords hashed with MD5. Security says 'inadequate'. Why?",
      "opts": [
        "MD5 is fine",
        "MD5 too fast—billions cracked/second with GPUs. bcrypt intentionally slow (tunable), resists brute-force. Always use bcrypt/scrypt/argon2, never MD5/SHA.",
        "MD5 just old",
        "Don't need hashing"
      ],
      "correct": 1,
      "explain": "MD5/SHA designed for speed. Attackers crack billions/second. bcrypt intentionally slow, adjustable difficulty. Password hashing must be slow. Use bcrypt/scrypt/argon2."
    },
    {
      "q": "ROI of £50k security fixes vs doing nothing?",
      "opts": [
        "£50k wasted",
        "Average breach: £1M-10M. Prevention: £50k. Break-even: prevent one breach every 20-200 years. Given exploitation likelihood, ROI is 10-100x.",
        "Can't calculate ROI",
        "Calculate after breach"
      ],
      "correct": 1,
      "explain": "Breach: £1M-10M. Prevention: £25k-83k. Expected loss calculation shows 10-100x ROI. Plus GDPR compliance, customer trust, reduced insurance premiums."
    },
    {
      "q": "15 vulnerabilities found. How to prioritize?",
      "opts": [
        "Fix all equally",
        "OWASP severity + exploit likelihood + business impact. Critical (SQL, XSS) = immediate. High (CSRF, rate limit) = 2 weeks. Medium (dependencies) = quarter. Group similar fixes.",
        "Cheapest first",
        "Random order"
      ],
      "correct": 1,
      "explain": "Prioritization: 1) Severity (OWASP ranking), 2) Exploitation likelihood, 3) Business impact (customer PII = critical), 4) Cost/effort. Do critical fixes first, quick wins early."
    }
  ],
  "essay": {
    "q": "Security audit found 15 vulnerabilities. How do you prioritize with £30k budget? Framework?",
    "guide": "Framework: 1) Severity (OWASP): Critical (SQL injection, XSS) = immediate. High (CSRF, rate limit) = 2 weeks. Medium (dependencies) = quarter. 2) Exploit likelihood: Public exploits = higher priority. 3) Business impact: Customer PII = critical (GDPR). 4) Cost: Quick wins first (rate limiting = 4 hours). Example: SQL injection (1 day), XSS 3 places (2 days), rate limiting (4 hours), weak passwords (1 day), HTTPS staging (2 hours), error messages (1 day), dependencies (ongoing). Total: 6 days = £10k. Critical fixes done, prevents £1M-10M breach. Present to CFO: £10k vs £1M+ risk = 100x ROI."
  }
};
