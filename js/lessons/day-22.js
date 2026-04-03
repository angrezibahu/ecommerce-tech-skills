// Day 22: Platform Architecture
window.__lessonCache = window.__lessonCache || {};
window.__lessonCache[22] = {
  "day": 22,
  "week": 3,
  "title": "Platform Architecture",
  "desc": "Monolith vs microservices",
  "duration": "55 min",
  "coldOpen": "Your CTO proposes migrating to microservices: 8-month project, 4 engineers full-time. Your monolith works but is 'becoming hard to maintain'. How do you evaluate if this £256k investment is justified?",
  "coldRevisit": "Microservices solve specific problems: independent scaling, team autonomy, technology diversity. But add massive complexity: distributed debugging, network failures, deployment coordination. Only justified when monolith problems are severe and team is large (15+ engineers). Most companies should start with a modular monolith.",
  "content": "<h2>Why This Matters to You</h2><p>Microservices are heavily hyped but expensive and complex. A migration can cost £200k-500k and take 6-12 months. Many migrations fail or deliver limited value. Understanding when microservices actually make sense helps you avoid expensive mistakes and ask the right questions when your CTO proposes a migration.</p><h2>1. Monolith vs Microservices</h2><table><tr><th>Aspect</th><th>Monolith</th><th>Microservices</th></tr><tr><td><strong>Definition</strong></td><td>One application, one codebase, deploys together</td><td>Many small services, separate codebases, deploy independently</td></tr><tr><td><strong>Communication</strong></td><td>Function calls (in-process)</td><td>Network calls (HTTP/RPC)</td></tr><tr><td><strong>Database</strong></td><td>Usually one shared database</td><td>Each service has own database</td></tr><tr><td><strong>Deployment</strong></td><td>Deploy entire app at once</td><td>Deploy services independently</td></tr><tr><td><strong>Scaling</strong></td><td>Scale entire app together</td><td>Scale services independently</td></tr><tr><td><strong>Complexity</strong></td><td>Low (one app to understand)</td><td>High (many services, networking, orchestration)</td></tr></table><h2>2. Monolith Architecture</h2><pre>┌─────────────────────────────────────┐\n│         Monolith Application        │\n│                                     │\n│  ┌──────────┐  ┌─────────────┐    │\n│  │   API    │  │  Frontend   │    │\n│  └──────────┘  └─────────────┘    │\n│  ┌──────────┐  ┌─────────────┐    │\n│  │ Business │  │   Data      │    │\n│  │  Logic   │  │   Access    │    │\n│  └──────────┘  └─────────────┘    │\n│                                     │\n└─────────────────────────────────────┘\n           ↓\n    ┌──────────────┐\n    │   Database   │\n    └──────────────┘\n\n// All code in one repository\n// All features deploy together\n// Fast function calls (no network)\n// Transactions work easily (ACID)</pre><h2>3. Microservices Architecture</h2><pre>┌─────────────┐     ┌─────────────┐     ┌─────────────┐\n│   Product   │     │   Order     │     │  Payment    │\n│   Service   │←───→│   Service   │←───→│  Service    │\n└─────────────┘     └─────────────┘     └─────────────┘\n      ↓                   ↓                   ↓\n┌─────────────┐     ┌─────────────┐     ┌─────────────┐\n│  Product DB │     │  Order DB   │     │ Payment DB  │\n└─────────────┘     └─────────────┘     └─────────────┘\n\n// Separate repositories\n// Independent deployment\n// Network calls (slower, can fail)\n// Distributed transactions (complex)</pre><h2>4. When Microservices Make Sense</h2><table><tr><th>Problem</th><th>How Microservices Help</th><th>Minimum Team Size</th></tr><tr><td><strong>Independent scaling</strong></td><td>Scale only the services that need it (e.g., product search gets 10x traffic)</td><td>10+ engineers</td></tr><tr><td><strong>Team autonomy</strong></td><td>Teams own services end-to-end, deploy independently without coordination</td><td>15+ engineers (2-3 teams)</td></tr><tr><td><strong>Technology diversity</strong></td><td>Use different languages/frameworks per service (search in Go, checkout in Node)</td><td>10+ engineers</td></tr><tr><td><strong>Clear domain boundaries</strong></td><td>Services map to business domains (product catalog, order management, payments)</td><td>Any size (but complexity not worth it for small teams)</td></tr></table><div class=\"warning-box\"><div class=\"warning-title\">⚠️ The Team Size Rule</div><p>Microservices add ~30% development overhead (networking, deployment, debugging). Small teams (< 10 engineers) should almost never use microservices—the overhead outweighs benefits. You need 2-3 full teams (15+ engineers) to justify the complexity.</p></div><h2>5. The Hidden Costs of Microservices</h2><pre>Monolith costs:\n- Development: Straightforward\n- Testing: One app to test\n- Deployment: One deploy\n- Monitoring: One app to monitor\n- Debugging: Stack traces work\n- Total overhead: ~10%\n\nMicroservices costs:\n- Development: API contracts, versioning\n- Testing: Integration tests across services\n- Deployment: Coordinate multiple services\n- Monitoring: Distributed tracing needed\n- Debugging: Trace across 5-10 services\n- Networking: Calls fail, retries, timeouts\n- Data consistency: Distributed transactions\n- Total overhead: ~30-40%</pre><h2>6. The Middle Ground: Modular Monolith</h2><p>Best of both worlds—monolith with clear internal boundaries:</p><pre>// Modular monolith structure\nsrc/\n  modules/\n    products/\n      api/\n      services/\n      models/\n    orders/\n      api/\n      services/\n      models/\n    payments/\n      api/\n      services/\n      models/\n\n// Rules:\n// 1. Modules can't directly access other modules' internals\n// 2. Communication via well-defined APIs\n// 3. Each module could become a service later\n\n// Example: Orders can't directly query products database\n// BAD: \nconst product = await db.products.findById(123);  // Direct access\n\n// GOOD:\nconst product = await ProductsAPI.getProduct(123);  // Through API\n\n// Benefits:\n// - Still one deployment (simple)\n// - Clear boundaries (can extract services later if needed)\n// - Fast function calls (no network overhead)\n// - Easy transactions (single database)</pre><h2>7. Migration Path: Monolith → Microservices</h2><pre>Phase 1: Modular Monolith (3 months)\n- Refactor into clear modules\n- Define internal APIs\n- No external changes\n- Cost: £72k (3 months × 3 devs × £8k)\n\nPhase 2: Extract One Service (3 months)\n- Extract highest-value service (e.g., search)\n- Learn microservices challenges\n- Measure: deployment speed, scaling benefits\n- Cost: £72k\n\nPhase 3: Evaluate\n- Did Phase 2 solve real problems?\n- Was complexity worth it?\n- Continue or stop?\n\nPhase 4: Extract More Services (6-12 months)\n- Only if Phase 3 shows clear value\n- Extract 2-3 more services\n- Cost: £144k-288k\n\nTotal: £288k-432k over 12-18 months</pre><h2>8. Microservices Decision Matrix</h2><table><tr><th>Your Situation</th><th>Recommendation</th><th>Why</th></tr><tr><td>< 10 engineers</td><td>Monolith (modular if growing)</td><td>Overhead not justified</td></tr><tr><td>10-15 engineers</td><td>Modular monolith</td><td>Prepare for future, but stay simple</td></tr><tr><td>15-30 engineers</td><td>Consider microservices</td><td>Team autonomy benefits emerge</td></tr><tr><td>30+ engineers</td><td>Microservices likely make sense</td><td>Multiple teams, independent deployment critical</td></tr><tr><td>Startup, pre-product-market fit</td><td>Monolith</td><td>Speed of iteration > architecture</td></tr><tr><td>Established, complex domain</td><td>Modular monolith or microservices</td><td>Depends on team size</td></tr></table><h2>9. Common Microservices Mistakes</h2><table><tr><th>Mistake</th><th>Impact</th><th>Prevention</th></tr><tr><td><strong>Too many services</strong></td><td>30 services for 8 engineers = constant coordination</td><td>Start with 3-5 services max</td></tr><tr><td><strong>Wrong boundaries</strong></td><td>Services that constantly call each other (chatty)</td><td>Follow domain boundaries, not technical layers</td></tr><tr><td><strong>Shared database</strong></td><td>Services aren't truly independent</td><td>Each service owns its data</td></tr><tr><td><strong>Distributed monolith</strong></td><td>Microservices complexity + monolith coupling = worst of both</td><td>Ensure services can deploy independently</td></tr></table><div class=\"info-box\"><div class=\"info-title\">💡 The Amazon/Netflix Argument</div><p>\"Amazon and Netflix use microservices!\" Yes, with:<br>• Amazon: 1.6 million employees<br>• Netflix: 11,000 engineers<br><br>Your 8-person team isn't Amazon. Different scale = different solutions. Don't cargo-cult big tech architecture.</p></div><h2>10. Questions to Ask Your CTO</h2><pre>When CTO proposes microservices:\n\n1. What specific problems are we solving?\n   - Be specific (not 'scalability'—what can't scale?)\n   - Quantify (deployment takes X hours, want Y minutes)\n\n2. Have we tried alternatives?\n   - Modular monolith?\n   - Better caching/databases?\n   - Horizontal scaling of monolith?\n\n3. What's the cost?\n   - Dev time: X months × Y engineers\n   - New infrastructure (service mesh, monitoring)\n   - Ongoing overhead (30-40% slower feature development)\n\n4. What's the migration path?\n   - Big bang (risky) or incremental (safer)?\n   - Can we extract one service as pilot?\n\n5. Do we have the expertise?\n   - Distributed systems are hard\n   - Do we understand: eventual consistency, circuit breakers, distributed tracing?\n\n6. How do we measure success?\n   - Deployment frequency increase?\n   - Scaling cost decrease?\n   - Team velocity improve?\n   - Define metrics before starting</pre>",
  "questions": [
    {
      "q": "Your CTO proposes microservices. Your team has 8 engineers. Your response?",
      "opts": [
        "Approve—microservices are modern best practice",
        "Ask: What problems are we solving? With 8 engineers, microservices overhead (30-40%) outweighs benefits. Consider modular monolith instead—clear boundaries, simpler deployment.",
        "Reject immediately—never use microservices",
        "Hire 10 more engineers first"
      ],
      "correct": 1,
      "explain": "Small teams (< 10 engineers) rarely benefit from microservices. The overhead (distributed debugging, deployment coordination, networking) slows development. Modular monolith provides clear boundaries without the complexity."
    },
    {
      "q": "What's a 'modular monolith' and when does it make sense?",
      "opts": [
        "An outdated pattern",
        "Monolith with clear internal module boundaries. Modules communicate via defined APIs. Benefits: monolith simplicity + clear boundaries. Can extract modules to services later if needed. Best for most teams.",
        "A compromise that satisfies no one",
        "Only for legacy systems"
      ],
      "correct": 1,
      "explain": "Modular monolith = best of both worlds. Clear module boundaries (like microservices) but single deployment (like monolith). Most teams should start here—get boundaries right, extract services only if problems emerge."
    },
    {
      "q": "What's the main hidden cost of microservices?",
      "opts": [
        "Higher cloud bills",
        "30-40% development overhead: distributed debugging (trace across services), deployment coordination, network failures/retries, eventual consistency, API versioning, distributed tracing/monitoring. Slows feature development significantly.",
        "Hiring specialized engineers",
        "Licensing costs"
      ],
      "correct": 1,
      "explain": "Microservices add 30-40% overhead. Simple features now require coordinating changes across services, handling network failures, and distributed debugging. Only justified when benefits (independent scaling/deployment) outweigh this cost."
    },
    {
      "q": "Your CTO says 'Amazon uses microservices, we should too.' Your response?",
      "opts": [
        "Agree—copy successful companies",
        "Amazon has 1.6M employees and different problems at extreme scale. Your 12-person team isn't Amazon. Architecture should match your team size and problems, not imitate big tech.",
        "Microservices don't work at scale",
        "Hire more engineers to match Amazon"
      ],
      "correct": 1,
      "explain": "Cargo-culting big tech is dangerous. Amazon's architecture solves Amazon-scale problems with Amazon-sized teams. Your 10-person team has different constraints. Match architecture to your team and scale, not someone else's."
    },
    {
      "q": "If you do migrate to microservices, what's the safest approach?",
      "opts": [
        "Rewrite everything in 6 months (big bang)",
        "Incremental: 1) Create modular monolith, 2) Extract one high-value service as pilot, 3) Measure benefits vs costs, 4) Continue only if clear value. Never big-bang rewrite.",
        "Hire consultants to do it",
        "Start with 20 microservices"
      ],
      "correct": 1,
      "explain": "Incremental migration is safer: modular monolith first, extract one service, learn from experience, measure actual benefits. Big-bang rewrites typically fail—timelines slip 2-3x, new bugs, business impact."
    }
  ],
  "essay": {
    "q": "Your CTO proposes an 8-month microservices migration for your 12-person engineering team. Current monolith 'works but is hard to maintain'. How do you evaluate this proposal? What questions do you ask? What's the cost/benefit analysis?",
    "guide": "Cost analysis: 8 months × 3 engineers full-time × £8k/mo = £192k direct cost. Indirect cost: 3 engineers not building features = £192k opportunity cost. Total: £384k. Questions: 1) What specific problems? ('Hard to maintain' is vague—is it deployment speed? scaling? team conflicts?). 2) Tried alternatives? (Modular monolith refactor = 2-3 months, £72k, 80% of benefits). 3) Team expertise? (Distributed systems are hard—do we have experience?). 4) What if monolith but with better structure? (Extract modules, improve test coverage, add monitoring). Recommendation: Almost never approve 8-month big-bang migration. Instead: Phase 1 (3 months, £72k): Refactor to modular monolith. Measure: is 'hard to maintain' solved? If yes, stop here. If no: Phase 2 (3 months, £72k): Extract one service as pilot. Measure: deployment speed, scaling, development velocity. If clear benefit: continue. If marginal: stop. Total pilot cost: £144k vs £384k, less risk, faster value. Most companies should stop at modular monolith."
  }
};
