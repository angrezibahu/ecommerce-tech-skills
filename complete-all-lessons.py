#!/usr/bin/env python3
"""
Complete all remaining lesson content for Days 2-7 and 22-30
"""

# Read current file
with open('/home/user/ecommerce-tech-skills/js/lessons-data.js', 'r') as f:
    content = f.read()

# Days 2-7 content to insert after Day 1 (before Day 8)
days_2_7 = """
    // DAY 2 - CLIENT-SERVER ARCHITECTURE & APIS
    {
        day: 2,
        week: 0,
        title: "Client-Server Architecture & APIs",
        desc: "How frontend and backend communicate",
        duration: "50 min",
        coldOpen: "Your mobile app team says they need a separate API. Web team says they can share the existing one. CTO proposes GraphQL instead of REST. What's the right approach?",
        coldRevisit: "Different clients (web, mobile, third-party) often need different data shapes. REST works for simple cases. GraphQL helps when clients need flexible queries. Start simple (REST), add complexity only when needed.",
        content: "<h2>Why This Matters</h2><p>Your ecommerce site likely has a frontend (what users see) and backend (server, database). Understanding how they communicate helps you evaluate API design proposals and integration projects.</p><h2>1. Client-Server Model</h2><pre>┌──────────────┐         ┌──────────────┐\\n│   CLIENT     │ ←────→  │   SERVER     │\\n│ (Browser/App)│         │  (API/DB)    │\\n└──────────────┘         └──────────────┘\\n\\nClient responsibilities:\\n- Display UI\\n- Handle user input\\n- Make API requests\\n- Render responses\\n\\nServer responsibilities:\\n- Business logic\\n- Database access\\n- Authentication\\n- Data processing</pre><h2>2. REST APIs: The Standard</h2><pre>// Get product\\nGET /api/products/123\\nResponse: { id: 123, name: 'Headphones', price: 149.99 }\\n\\n// List products\\nGET /api/products?category=audio&sort=price\\nResponse: [{ id: 123, ... }, { id: 124, ... }]\\n\\n// Create order\\nPOST /api/orders\\nBody: { productId: 123, quantity: 2 }\\nResponse: { orderId: 'ORD-789', total: 299.98 }\\n\\n// Update product\\nPUT /api/products/123\\nBody: { price: 129.99 }\\n\\n// Delete product\\nDELETE /api/products/123</pre><h3>REST Principles</h3><ul><li><strong>Resources:</strong> Products, orders, users (nouns)</li><li><strong>HTTP Verbs:</strong> GET (read), POST (create), PUT (update), DELETE (delete)</li><li><strong>Stateless:</strong> Each request independent, no session on server</li><li><strong>Standard formats:</strong> JSON responses</li></ul><h2>3. Common API Patterns</h2><table><tr><th>Pattern</th><th>When to Use</th><th>Example</th></tr><tr><td><strong>REST</strong></td><td>Standard CRUD operations</td><td>Product catalog, user management</td></tr><tr><td><strong>GraphQL</strong></td><td>Flexible querying, multiple clients</td><td>Mobile app needs different data than web</td></tr><tr><td><strong>Webhooks</strong></td><td>Event notifications (covered Day 18)</td><td>Payment succeeded, order shipped</td></tr><tr><td><strong>WebSockets</strong></td><td>Real-time bidirectional</td><td>Live chat, real-time inventory</td></tr></table><h2>4. API Versioning</h2><pre>// Version in URL (common)\\nGET /api/v1/products\\nGET /api/v2/products\\n\\n// Version in header (flexible)\\nGET /api/products\\nHeader: Accept: application/vnd.api+json;version=2\\n\\nWhy version?\\n- Breaking changes don't break existing clients\\n- Mobile apps can't force-update immediately\\n- Third-party integrations need stability</pre><h2>5. API Documentation</h2><p>Good APIs need documentation:</p><ul><li><strong>Endpoints:</strong> What URLs exist?</li><li><strong>Parameters:</strong> What inputs required?</li><li><strong>Responses:</strong> What data returned?</li><li><strong>Examples:</strong> Working code samples</li><li><strong>Errors:</strong> What can go wrong?</li></ul><p>Tools: Swagger/OpenAPI, Postman</p>",
        questions: [
            { q: "Mobile team says they need 'just product name and price', but web needs 'everything'. Should you create separate APIs?", opts: ["Yes—separate APIs for each client", "No—one API can return different data based on query parameters or use GraphQL to let clients specify exactly what they need. Don't duplicate logic.", "Create separate servers", "Mobile should use web API"], correct: 1, explain: "One API, flexible responses. REST: Use query params like ?fields=name,price. GraphQL: Let clients query exactly what they need. Separate APIs = duplicate logic, more maintenance." },
            { q: "What's the difference between PUT and POST?", opts: ["No difference", "POST creates new resource, PUT updates existing resource (or creates if you specify ID). POST to /products creates product. PUT to /products/123 updates product 123.", "PUT is faster", "POST is more secure"], correct: 1, explain: "REST conventions: POST creates (generates new ID), PUT updates (you specify ID). POST /products creates new. PUT /products/123 updates existing. This convention helps API users understand what each endpoint does." },
            { q: "Why do APIs need versioning?", opts: ["To track changes", "Breaking changes don't break existing clients. Mobile apps can't force-update. Third-party integrations need stability. v1 works while v2 adds features.", "Makes APIs faster", "Required by standards"], correct: 1, explain: "Version APIs to avoid breaking existing clients. If you change response format, old mobile apps break. Versioning lets old clients use v1 while new clients use v2. Critical for stability." },
            { q: "Your API returns 50 fields but frontend uses only 5. Problem?", opts: ["No problem—more data is better", "Wastes bandwidth and slows responses. Large payloads slow mobile users. Solution: Let clients specify needed fields (?fields=name,price) or use GraphQL.", "Need faster server", "Should use POST instead"], correct: 1, explain: "Over-fetching wastes bandwidth. 50-field response when you need 5 = slow, especially on mobile. Solution: Query parameters to select fields, or GraphQL to request exactly what's needed." },
            { q: "When should you choose GraphQL over REST?", opts: ["Always—GraphQL is newer", "When you have multiple clients (web, mobile, third-party) with different data needs, or complex nested queries. Don't use GraphQL if REST works—adds complexity.", "Never—REST is standard", "Only for startups"], correct: 1, explain: "GraphQL solves specific problems: flexible querying, avoiding over/under-fetching, multiple client types. But adds complexity (learning curve, caching harder). Use REST unless you have these specific problems." }
        ],
        essay: { q: "Your mobile team wants a separate API because 'the web API returns too much data'. Your architect proposes GraphQL. Your CTO wants to keep REST simple. How do you evaluate these options? What are the trade-offs?", guide: "Current problem: Mobile uses 5 fields, web API returns 50. Options: 1) Separate mobile API: Duplicate logic, double maintenance, different bugs. Cost: High. Benefit: Mobile-optimized. 2) Add query params to REST: ?fields=name,price. Cost: Low (1-2 days). Benefit: Flexible, backward compatible. 3) GraphQL: Clients query exact needs. Cost: 2-4 weeks migration + learning curve. Benefit: Very flexible, solves problem long-term. Recommendation: Start with option 2 (query params). Measure if it solves problem. If mobile needs grow complex (nested data, many variations), consider GraphQL. Don't rewrite unless complexity justifies cost. Calculate: GraphQL migration = 4 weeks × 3 devs = £96k. Query params = 2 days × 1 dev = £1.6k. Start cheap, add complexity only if needed." }
    },

    // Days 3-7 will be added in next iteration to keep response manageable
"""

# Find insertion point (after Day 1, before Day 8)
day_8_marker = "    // DAY 8 - HTML5 SEMANTICS & ACCESSIBILITY"
insertion_point = content.find(day_8_marker)

if insertion_point == -1:
    print("Error: Couldn't find Day 8 marker")
    exit(1)

# Insert Days 2-7 content
new_content = content[:insertion_point] + days_2_7 + "\n" + content[insertion_point:]

# Write back
with open('/home/user/ecommerce-tech-skills/js/lessons-data.js', 'w') as f:
    f.write(new_content)

print("✅ Added Day 2 content. Days 3-7 and 22-30 still pending.")
print("Run this script again for next batch.")
