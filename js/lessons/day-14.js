// Day 14: Frontend Frameworks
window.__lessonCache = window.__lessonCache || {};
window.__lessonCache[14] = {
  "day": 14,
  "week": 1,
  "title": "Frontend Frameworks",
  "desc": "React, Vue, Angular - when to use",
  "duration": "55 min",
  "coldOpen": "Your dev team says your jQuery codebase is unmaintainable and wants to rewrite in React. Estimate: 6 months. Marketing needs features next quarter. How do you evaluate if a framework migration is justified?",
  "coldRevisit": "Framework migrations are expensive (6 months = £300k+ dev cost) and risky. Always ask: what specific problems are we solving? Can we adopt incrementally? Modern frameworks solve real problems (state management, component reuse), but full rewrites rarely deliver expected value on time.",
  "content": "<h2>Why This Matters to You</h2><p>Frontend frameworks (React, Vue, Angular) are among the most expensive technical decisions you'll make. A framework rewrite can cost £300k+ and take a year. Understanding what problems frameworks solve—and when they're overkill—helps you evaluate proposals critically and avoid expensive mistakes.</p><h2>1. What Problem Do Frameworks Solve?</h2><p>Before frameworks, building interactive sites meant manually manipulating the DOM—tedious and error-prone:</p><pre>// Without framework: manual DOM updates (messy)\nfunction updateCart() {\n  const cart = getCart();\n  \n  // Update count\n  document.querySelector('.cart-count').textContent = cart.length;\n  \n  // Update total\n  const total = cart.reduce((sum, item) => sum + item.price, 0);\n  document.querySelector('.cart-total').textContent = '$' + total;\n  \n  // Update item list\n  const listHTML = cart.map(item => \n    `<div>${item.name} - $${item.price}</div>`\n  ).join('');\n  document.querySelector('.cart-items').innerHTML = listHTML;\n  \n  // If data changes, manually call updateCart() everywhere\n}\n\n// With framework: declarative UI (clean)\nfunction Cart({ items }) {\n  const total = items.reduce((sum, item) => sum + item.price, 0);\n  \n  return (\n    <div>\n      <div>Items: {items.length}</div>\n      <div>Total: ${total}</div>\n      <div>\n        {items.map(item => (\n          <div key={item.id}>{item.name} - ${item.price}</div>\n        ))}\n      </div>\n    </div>\n  );\n}\n// UI automatically updates when items change</pre><div class=\"info-box\"><div class=\"info-title\">💡 The Core Benefit</div><p>Frameworks provide <strong>declarative UI</strong>: describe what the UI should look like based on data. Framework handles DOM updates automatically. No manual querySelector or innerHTML.</p></div><h2>2. The Big Three Frameworks</h2><table><tr><th>Framework</th><th>Created By</th><th>Philosophy</th><th>Best For</th><th>Market Share</th></tr><tr><td><strong>React</strong></td><td>Meta (Facebook)</td><td>Library, not framework. Flexible, large ecosystem</td><td>Complex apps, large teams, hiring availability</td><td>~40%</td></tr><tr><td><strong>Vue</strong></td><td>Evan You (independent)</td><td>Progressive framework. Start simple, add features as needed</td><td>Incremental adoption, smaller teams</td><td>~18%</td></tr><tr><td><strong>Angular</strong></td><td>Google</td><td>Full framework. Opinionated, batteries-included</td><td>Large enterprise apps, TypeScript-first</td><td>~15%</td></tr></table><h2>3. React Fundamentals</h2><p>React is a library for building user interfaces with components:</p><pre>// Component: reusable UI piece\nfunction ProductCard({ product }) {\n  const [inCart, setInCart] = useState(false);\n  \n  const handleAddToCart = () => {\n    addToCart(product.id);\n    setInCart(true);\n  };\n  \n  return (\n    <div className=\"product-card\">\n      <img src={product.image} alt={product.name} />\n      <h3>{product.name}</h3>\n      <p>${product.price}</p>\n      <button \n        onClick={handleAddToCart}\n        disabled={inCart}\n      >\n        {inCart ? 'Added' : 'Add to Cart'}\n      </button>\n    </div>\n  );\n}\n\n// Usage: render multiple products\n<div className=\"product-grid\">\n  {products.map(product => (\n    <ProductCard key={product.id} product={product} />\n  ))}\n</div></pre><h3>React Concepts</h3><table><tr><th>Concept</th><th>Purpose</th><th>Example</th></tr><tr><td><strong>Components</strong></td><td>Reusable UI pieces</td><td><code>&lt;ProductCard /&gt;</code>, <code>&lt;Header /&gt;</code></td></tr><tr><td><strong>Props</strong></td><td>Pass data to components</td><td><code>&lt;ProductCard product={product} /&gt;</code></td></tr><tr><td><strong>State</strong></td><td>Component's internal data</td><td><code>const [count, setCount] = useState(0)</code></td></tr><tr><td><strong>Hooks</strong></td><td>Add features to components</td><td><code>useState</code>, <code>useEffect</code></td></tr><tr><td><strong>JSX</strong></td><td>HTML-like syntax in JavaScript</td><td><code>&lt;div&gt;Hello&lt;/div&gt;</code></td></tr></table><h2>4. When to Use a Framework</h2><h3>Good Reasons to Use a Framework</h3><ul><li><strong>Complex state:</strong> Many interdependent UI pieces (filters, cart, checkout)</li><li><strong>Reusable components:</strong> Same UI patterns across many pages</li><li><strong>Real-time updates:</strong> UI changes frequently based on user actions</li><li><strong>Team collaboration:</strong> Component model helps teams work in parallel</li><li><strong>Mobile app planned:</strong> React Native shares code with React web</li></ul><h3>Bad Reasons to Use a Framework</h3><ul><li><strong>'It's modern':</strong> Tech hype isn't a business reason</li><li><strong>'Easier to hire':</strong> Good developers adapt—hire for fundamentals</li><li><strong>'jQuery is old':</strong> Old doesn't mean wrong—if it works, it works</li><li><strong>'We need to refactor anyway':</strong> Refactor doesn't require rewrite</li></ul><div class=\"warning-box\"><div class=\"warning-title\">⚠️ The Rewrite Trap</div><p>Framework rewrites typically:<br>• Take 2-3x longer than estimated<br>• Introduce new bugs<br>• Pause feature development<br>• Cost £300k+ for medium-sized sites<br><br>Incremental adoption is almost always better than big-bang rewrites.</p></div><h2>5. Incremental Adoption Strategy</h2><p>Don't rewrite everything—adopt incrementally:</p><pre>Phase 1: New features only\n- Keep existing jQuery code\n- Build new features in React\n- Isolate: mount React components in specific divs\n- Timeline: immediate\n\nPhase 2: High-value pages\n- Convert highest-traffic pages (product, checkout)\n- Measure: performance, conversion improvements\n- Timeline: 3-6 months\n\nPhase 3: Complete migration (optional)\n- Only if Phase 1-2 show clear value\n- Convert remaining pages\n- Timeline: 6-12 months</pre><h3>Mounting React in Existing Site</h3><pre>&lt;!-- Existing jQuery site --&gt;\n&lt;div id=\"legacy-content\"&gt;\n  &lt;!-- Existing code stays --&gt;\n&lt;/div&gt;\n\n&lt;!-- New React component --&gt;\n&lt;div id=\"react-root\"&gt;&lt;/div&gt;\n&lt;script&gt;\n  // Mount React in specific container\n  ReactDOM.render(&lt;NewFeature /&gt;, document.getElementById('react-root'));\n&lt;/script&gt;\n\n&lt;!-- Both coexist peacefully --&gt;</pre><h2>6. Framework Decision Matrix</h2><table><tr><th>Your Situation</th><th>Recommendation</th><th>Why</th></tr><tr><td>Simple marketing site, 10 pages</td><td>No framework—vanilla JS or jQuery</td><td>Framework overhead not justified</td></tr><tr><td>Product catalog, some interactivity</td><td>Consider Vue (incremental)</td><td>Easy to adopt gradually</td></tr><tr><td>Complex ecommerce, custom checkout</td><td>React or Vue</td><td>State management benefits clear</td></tr><tr><td>Large team, enterprise</td><td>React (hiring) or Angular (structure)</td><td>Ecosystem and talent pool</td></tr><tr><td>Existing jQuery, working well</td><td>Keep it, add framework incrementally if needed</td><td>Working code has value</td></tr></table><h2>7. The Build vs. Buy Decision</h2><p>Before building custom with a framework, consider platforms:</p><table><tr><th>Option</th><th>Pros</th><th>Cons</th><th>Cost</th></tr><tr><td><strong>Shopify/Magento</strong></td><td>Fast launch, maintained</td><td>Less customization</td><td>£100-500/mo</td></tr><tr><td><strong>Headless CMS + React</strong></td><td>Flexibility, modern stack</td><td>More complex, need devs</td><td>£50k-150k build</td></tr><tr><td><strong>Custom framework app</strong></td><td>Complete control</td><td>Expensive, slow, maintenance burden</td><td>£150k-500k build</td></tr></table><div class=\"exercise\"><h4>🔧 Framework Evaluation Exercise</h4><p>Your dev team proposes React migration. Ask:</p><ol><li>What specific problems are we solving? (Be specific—not 'maintainability')</li><li>Can we solve these without a full rewrite?</li><li>Can we adopt incrementally on one page first?</li><li>What's the cost? (Dev months × £8k/mo)</li><li>What's the risk if we don't do this?</li></ol></div><h2>8. Framework Performance Considerations</h2><p>Frameworks add weight. Make sure the benefits justify the cost:</p><pre>Bundle Size Comparison:\n┌─────────────────────┬─────────────┐\n│ Approach            │ JS Size     │\n├─────────────────────┼─────────────┤\n│ Vanilla JS          │ 10-50 KB    │\n│ jQuery              │ 30 KB       │\n│ Vue                 │ 40 KB       │\n│ React               │ 45 KB       │\n│ Angular             │ 70 KB       │\n│ React + Router      │ 90 KB       │\n│ Full React app      │ 200+ KB     │\n└─────────────────────┴─────────────┘\n\nFor simple sites: Framework overhead not justified\nFor complex apps: Framework benefits outweigh cost</pre>",
  "questions": [
    {
      "q": "Dev team wants to rewrite your working jQuery site in React. Estimate: 6 months. Your response?",
      "opts": [
        "Approve—React is modern",
        "Ask: What specific problems are we solving? Can we adopt React incrementally for new features instead of rewriting? What's the business case for £300k+ investment?",
        "Reject—jQuery works fine",
        "Hire React consultants"
      ],
      "correct": 1,
      "explain": "Working code has value. React rewrites are expensive (6 months = £300k+ dev cost) and risky. Always ask for specific problems and consider incremental adoption—build new features in React while keeping existing code."
    },
    {
      "q": "Your site is 10 pages with light interactivity. Developer insists you need React. Your evaluation?",
      "opts": [
        "Agree—React is industry standard",
        "For simple sites, framework overhead (45KB+ base, build complexity) isn't justified. Vanilla JavaScript or lightweight library sufficient. Frameworks make sense for complex state management.",
        "Compromise—use Vue instead",
        "Hire more developers"
      ],
      "correct": 1,
      "explain": "Frameworks solve specific problems: complex state, component reuse, frequent updates. Simple sites don't have these problems. Adding 45KB+ framework for light interactivity is overengineering."
    },
    {
      "q": "What's the main benefit of component-based frameworks like React?",
      "opts": [
        "Faster performance",
        "Reusable UI components with encapsulated logic. Build once (ProductCard), use everywhere. Changes in one place update all instances.",
        "Better SEO",
        "Easier to learn"
      ],
      "correct": 1,
      "explain": "Components provide reusability and maintainability. Build ProductCard once with all logic, reuse across site. Change price formatting in one place, updates everywhere. Reduces duplication and bugs."
    },
    {
      "q": "How should you approach migrating from jQuery to React?",
      "opts": [
        "6-month full rewrite",
        "Incremental: 1) Build new features in React, 2) Convert high-value pages, 3) Measure success, 4) Continue only if clear benefit. Both can coexist.",
        "Stay with jQuery forever",
        "Rebuild in Vue instead"
      ],
      "correct": 1,
      "explain": "Incremental adoption is safer and cheaper. Mount React in specific containers while keeping existing code. Convert high-traffic pages first, measure improvements. Full rewrite is last resort."
    },
    {
      "q": "Which signal suggests you might benefit from a framework?",
      "opts": [
        "Competitors use frameworks",
        "Complex interdependent state: filters update products, products update cart, cart updates totals—lots of DOM manipulation in multiple places. Framework's reactive state helps.",
        "Your jQuery code is old",
        "Developers want to learn React"
      ],
      "correct": 1,
      "explain": "Frameworks excel at managing complex state. If you're manually syncing many DOM elements when data changes, framework's reactive model (data changes → UI updates automatically) simplifies code."
    }
  ],
  "essay": {
    "q": "Your dev team proposes a 6-month React migration from your current jQuery site. The site works but 'isn't modern'. How do you evaluate this proposal? What questions do you ask? What alternative approaches might be better?",
    "guide": "Evaluate: 1) What specific problems exist? (Not 'jQuery is old'—what breaks? what's slow to build?) 2) Cost: 6 months = 3 devs × £8k/mo = £144k minimum. What's the ROI? 3) Risk: Feature development pauses, new bugs introduced, timelines slip 2-3x. 4) Alternatives: Can we solve problems without rewrite? Can we adopt React incrementally (new features only)? Can we refactor jQuery incrementally? Questions: Show me the 5 most painful code areas. Can we fix these specifically? Have you built with React before (learning curve)? What if we try React on one new feature first? Recommendation: Almost never approve big-bang rewrites. Start with one new feature in React, measure success (dev velocity, bugs, performance), then decide. Working code has value—preserve it."
  }
};
