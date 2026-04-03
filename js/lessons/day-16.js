// Day 16: Authentication & Authorization
window.__lessonCache = window.__lessonCache || {};
window.__lessonCache[16] = {
  "day": 16,
  "week": 2,
  "title": "Authentication & Authorization",
  "desc": "Sessions, JWT, OAuth explained",
  "duration": "55 min",
  "coldOpen": "Security audit found users can access other users' orders by changing URL. Your dev says 'we have login'. What's the difference between authentication and authorization?",
  "coldRevisit": "Authentication = proving who you are (login). Authorization = what you're allowed to do (permissions). You need both. Broken authorization is a top security issue.",
  "content": "<h2>Why This Matters to You</h2><p>Authentication and authorization are different but both critical. Authentication proves identity ('you are user@email.com'). Authorization controls access ('you can only see your own orders'). Mixing them up leads to security breaches—users accessing others' data, unauthorized admin access.</p><h2>1. Authentication vs Authorization</h2><table><tr><th>Authentication</th><th>Authorization</th></tr><tr><td>Who are you?</td><td>What can you do?</td></tr><tr><td>Login with email/password</td><td>Check if user can access resource</td></tr><tr><td>Verify identity</td><td>Enforce permissions</td></tr><tr><td>Happens once (login)</td><td>Happens on every request</td></tr><tr><td>Example: Entering username/password</td><td>Example: Checking if order belongs to user</td></tr></table><h2>2. Session-Based Authentication</h2><pre>// Traditional session approach\n// 1. User logs in\nPOST /login\n{ email: 'user@example.com', password: 'secret123' }\n\n// 2. Server validates, creates session\nconst session = {\n  userId: 123,\n  email: 'user@example.com',\n  createdAt: Date.now()\n};\nsessionStore.set(sessionId, session);\n\n// 3. Server sends session cookie\nSet-Cookie: sessionId=abc123; HttpOnly; Secure\n\n// 4. Browser sends cookie on every request\nGET /api/orders\nCookie: sessionId=abc123\n\n// 5. Server validates session\nconst session = sessionStore.get(request.cookies.sessionId);\nif (!session) return 401; // Unauthorized</pre><h3>Session Pros/Cons</h3><ul><li><strong>Pros:</strong> Simple, can revoke immediately (delete from store), server controls everything</li><li><strong>Cons:</strong> Requires session storage (Redis/database), harder to scale across servers</li></ul><h2>3. Token-Based Authentication (JWT)</h2><pre>// JWT (JSON Web Token) approach\n// 1. User logs in\nPOST /login\n{ email: 'user@example.com', password: 'secret123' }\n\n// 2. Server creates signed token\nconst token = jwt.sign(\n  { userId: 123, email: 'user@example.com' },\n  SECRET_KEY,\n  { expiresIn: '7d' }\n);\n// Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\n\n// 3. Client stores token (localStorage or cookie)\nlocalStorage.setItem('token', token);\n\n// 4. Client sends token on every request\nGET /api/orders\nAuthorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\n\n// 5. Server verifies token signature\nconst decoded = jwt.verify(token, SECRET_KEY);\nif (!decoded) return 401;\n// Token is valid, decoded.userId = 123</pre><h3>JWT Pros/Cons</h3><ul><li><strong>Pros:</strong> Stateless (no server storage), scales easily, works across domains</li><li><strong>Cons:</strong> Can't revoke (until expiry), larger payload, secret key must be secure</li></ul><h2>4. Authorization: Checking Permissions</h2><pre>// Bad: No authorization check\napp.get('/api/orders/:orderId', (req, res) => {\n  const order = await getOrder(req.params.orderId);\n  return res.json(order);  // Anyone can see any order!\n});\n\n// Good: Verify order belongs to user\napp.get('/api/orders/:orderId', requireAuth, async (req, res) => {\n  const order = await getOrder(req.params.orderId);\n  \n  // Authorization check\n  if (order.userId !== req.user.id) {\n    return res.status(403).json({ error: 'Access denied' });\n  }\n  \n  return res.json(order);\n});</pre><h2>5. OAuth: Third-Party Login</h2><p>OAuth lets users log in with Google, Facebook, etc.:</p><pre>// OAuth flow (simplified)\n1. User clicks 'Login with Google'\n2. Redirect to Google with your app credentials\n3. User approves access\n4. Google redirects back with authorization code\n5. Exchange code for access token\n6. Use token to get user info from Google\n7. Create session/JWT in your system</pre><h3>When to Use OAuth</h3><ul><li><strong>Use:</strong> Reduce friction (users don't need another password), trust established providers</li><li><strong>Don't use:</strong> If you need fine-grained control, complex permission requirements</li></ul><h2>6. Password Security</h2><pre>// WRONG: Never store passwords in plain text!\nusers.insert({\n  email: 'user@example.com',\n  password: 'secret123'  // Database breach = all passwords leaked!\n});\n\n// CORRECT: Hash with bcrypt (slow by design)\nconst bcrypt = require('bcrypt');\nconst hashedPassword = await bcrypt.hash(password, 10);\nusers.insert({\n  email: 'user@example.com',\n  password: hashedPassword  // Leak shows hash, not original password\n});\n\n// Verify login\nconst isValid = await bcrypt.compare(inputPassword, user.password);</pre><div class=\"warning-box\"><div class=\"warning-title\">⚠️ Critical Security Rules</div><ul><li>Never store passwords in plain text</li><li>Always hash with bcrypt (not MD5 or SHA1)</li><li>Use HTTPS for all authentication endpoints</li><li>HttpOnly cookies prevent XSS theft</li><li>Implement rate limiting on login attempts</li></ul></div><h2>7. Common Vulnerabilities</h2><table><tr><th>Vulnerability</th><th>Attack</th><th>Prevention</th></tr><tr><td><strong>Broken Authorization</strong></td><td>Access other users' data by changing URL/ID</td><td>Always verify resource belongs to user</td></tr><tr><td><strong>Session Fixation</strong></td><td>Attacker sets victim's session ID</td><td>Regenerate session ID after login</td></tr><tr><td><strong>XSS Token Theft</strong></td><td>JavaScript steals token from localStorage</td><td>Use HttpOnly cookies instead</td></tr><tr><td><strong>CSRF</strong></td><td>Malicious site makes request as logged-in user</td><td>CSRF tokens, SameSite cookies</td></tr></table>",
  "questions": [
    {
      "q": "Security audit shows users can view others' orders by changing the order ID in the URL. What's the issue?",
      "opts": [
        "Need better authentication",
        "Broken authorization: system authenticates (knows who you are) but doesn't authorize (check if you own that order). Must verify resource ownership on every request.",
        "Need HTTPS",
        "Password security issue"
      ],
      "correct": 1,
      "explain": "This is authorization failure, not authentication. User is logged in (authenticated) but system doesn't check if they own the requested resource. Always verify: does this resource belong to this user?"
    },
    {
      "q": "What's the key difference between sessions and JWTs?",
      "opts": [
        "Sessions are more secure",
        "Sessions store state on server (can revoke anytime, requires storage). JWTs are stateless (self-contained, can't revoke until expiry, no server storage needed).",
        "JWTs are newer",
        "No real difference"
      ],
      "correct": 1,
      "explain": "Sessions: server stores session data, can revoke immediately. JWTs: stateless tokens, can't revoke (until expiry), no server storage. Trade-off: control vs scalability."
    },
    {
      "q": "Developer stored passwords using MD5 hash. Is this secure?",
      "opts": [
        "Yes—passwords are hashed",
        "No—MD5 is fast and crackable. Must use bcrypt, which is intentionally slow to resist brute-force attacks. MD5 hashes can be cracked in minutes.",
        "Yes if passwords are strong",
        "Only a problem if database is leaked"
      ],
      "correct": 1,
      "explain": "MD5 is too fast—attackers can try billions of passwords per second. Bcrypt is intentionally slow (tunable), making brute-force attacks impractical. Always use bcrypt for passwords."
    },
    {
      "q": "Your app stores JWT tokens in localStorage. Security consultant says this is vulnerable. Why?",
      "opts": [
        "localStorage is outdated",
        "XSS attacks can steal tokens from localStorage via JavaScript. HttpOnly cookies can't be accessed by JavaScript, preventing XSS theft. Use HttpOnly cookies for sensitive tokens.",
        "localStorage is slow",
        "Tokens should be in sessionStorage"
      ],
      "correct": 1,
      "explain": "XSS vulnerability: malicious JavaScript can read localStorage and steal tokens. HttpOnly cookies are inaccessible to JavaScript, protecting against XSS. For sensitive auth, use HttpOnly + Secure cookies."
    },
    {
      "q": "What does HttpOnly flag on cookies prevent?",
      "opts": [
        "HTTP connections",
        "JavaScript access to cookie, preventing XSS attacks from stealing authentication tokens. Cookie is only sent in HTTP requests, not readable via document.cookie.",
        "HTTPS requirement",
        "Cookie expiration"
      ],
      "correct": 1,
      "explain": "HttpOnly prevents JavaScript from reading cookies. Without it, XSS attacks can steal auth tokens via document.cookie. With HttpOnly, cookies are HTTP-only—sent in requests but not accessible to scripts."
    }
  ],
  "essay": {
    "q": "Your security audit found: 1) Users can access others' orders by changing URLs, 2) Passwords stored with MD5, 3) No rate limiting on login. How do you prioritize fixes? What's the business risk of each?",
    "guide": "Prioritize: 1) Authorization (CRITICAL): Users can access others' data—privacy breach, legal liability (GDPR), immediate exploitation risk. Fix: Add ownership checks to all API endpoints. 2) Password hashing (HIGH): Database breach exposes passwords. MD5 cracks in minutes. Users reuse passwords across sites. Fix: Migrate to bcrypt. 3) Rate limiting (MEDIUM): Enables brute-force attacks. Fix: Limit login attempts. Timeline: Authorization fixes can be deployed in days (add checks per endpoint). Password migration requires user communication (force password reset). Rate limiting is quick (middleware). Business risk: Authorization breach could be PR disaster + legal liability + customer trust loss. Estimate cost of breach vs fix cost."
  }
};
