// Day 9: CSS Architecture & Layout
window.__lessonCache = window.__lessonCache || {};
window.__lessonCache[9] = {
  "day": 9,
  "week": 1,
  "title": "CSS Architecture & Layout",
  "desc": "Modern CSS, Flexbox, Grid, and scalable stylesheets",
  "duration": "55 min",
  "coldOpen": "Your lead developer says your CSS is unmaintainable and proposes a 3-month rewrite. Marketing wants a homepage redesign next week. How do you evaluate if a rewrite is necessary?",
  "coldRevisit": "CSS rewrites are expensive and rarely necessary. Most 'messy CSS' problems stem from lack of system, not the CSS itself. Modern CSS (Flexbox, Grid, custom properties) can often fix issues incrementally without a full rewrite.",
  "content": "<h2>Why This Matters to You</h2><p>CSS seems simple—it's just styling, right? But CSS is where many ecommerce sites struggle. Poor CSS architecture leads to slow development, inconsistent branding, and expensive maintenance. A 3-month CSS rewrite costs £200k+ in developer time, but proper CSS architecture prevents these problems in the first place.</p><h2>1. Understanding CSS Architecture Problems</h2><p>When developers say 'CSS is a mess', they usually mean one of these:</p><table><tr><th>Problem</th><th>Symptoms</th><th>Root Cause</th></tr><tr><td><strong>Specificity Wars</strong></td><td>Styles overriding each other, need !important everywhere</td><td>No clear selector strategy, IDs mixed with classes</td></tr><tr><td><strong>Dead Code</strong></td><td>Afraid to delete CSS—might break something</td><td>No component boundaries or naming system</td></tr><tr><td><strong>Duplication</strong></td><td>Same color defined 47 times in different values</td><td>No design tokens or CSS variables</td></tr><tr><td><strong>Layout Hacks</strong></td><td>Magic numbers, negative margins, absolute positioning everywhere</td><td>Not using modern layout tools (Flexbox, Grid)</td></tr></table><div class=\"info-box\"><div class=\"info-title\">💡 The Real Question</div><p>Before approving a rewrite, ask: 'What specific problems are we solving, and can we solve them incrementally?' A rewrite should be the last resort, not the first instinct.</p></div><h2>2. Modern CSS Layout: Flexbox</h2><p>Flexbox is designed for one-dimensional layouts—rows or columns. It's perfect for navigation, card layouts, and flexible components.</p><h3>Core Flexbox Concepts</h3><pre>/* Parent container */\n.nav {\n  display: flex;\n  justify-content: space-between;  /* Horizontal alignment */\n  align-items: center;             /* Vertical alignment */\n  gap: 20px;                       /* Space between items */\n}\n\n/* Child items */\n.nav-item {\n  flex: 1;        /* Grow to fill space */\n  /* flex: 0 0 200px;  Fixed width item */\n}</pre><h3>Common Flexbox Patterns</h3><pre>/* Horizontal navigation with logo left, links right */\n.header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n\n/* Evenly spaced product cards */\n.product-grid {\n  display: flex;\n  flex-wrap: wrap;  /* Wrap to next line */\n  gap: 20px;\n}\n.product-card {\n  flex: 1 1 300px;  /* Grow, shrink, min-width */\n}\n\n/* Centered content (vertically and horizontally) */\n.modal {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 100vh;\n}</pre><div class=\"warning-box\"><div class=\"warning-title\">⚠️ Common Flexbox Mistake</div><p>Using Flexbox for two-dimensional layouts (rows AND columns). That's what Grid is for. Flexbox is for one dimension at a time.</p></div><h2>3. Modern CSS Layout: Grid</h2><p>CSS Grid is designed for two-dimensional layouts—rows and columns simultaneously. It's perfect for page layouts, dashboards, and complex arrangements.</p><h3>Basic Grid Example</h3><pre>/* 3-column product grid */\n.product-grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);  /* 3 equal columns */\n  gap: 20px;\n}\n\n/* Responsive: 1 column on mobile, 2 on tablet, 3 on desktop */\n.product-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n  gap: 20px;\n}</pre><h3>Complex Grid Layout</h3><pre>/* Dashboard layout with header, sidebar, main, footer */\n.dashboard {\n  display: grid;\n  grid-template-areas:\n    \"header header header\"\n    \"sidebar main main\"\n    \"footer footer footer\";\n  grid-template-columns: 250px 1fr 1fr;\n  grid-template-rows: auto 1fr auto;\n  min-height: 100vh;\n  gap: 20px;\n}\n\n.header  { grid-area: header; }\n.sidebar { grid-area: sidebar; }\n.main    { grid-area: main; }\n.footer  { grid-area: footer; }</pre><h2>4. CSS Custom Properties (Variables)</h2><p>Custom properties solve the duplication problem and enable theming. Define once, use everywhere.</p><pre>/* Define in :root for global access */\n:root {\n  /* Colors - from design system */\n  --color-brand: #0066cc;\n  --color-success: #00cc66;\n  --color-error: #cc0000;\n  --color-text: #333333;\n  --color-text-light: #666666;\n  \n  /* Spacing - consistent rhythm */\n  --space-xs: 4px;\n  --space-sm: 8px;\n  --space-md: 16px;\n  --space-lg: 24px;\n  --space-xl: 32px;\n  \n  /* Typography */\n  --font-body: 'Inter', sans-serif;\n  --font-heading: 'Poppins', sans-serif;\n  --text-sm: 14px;\n  --text-base: 16px;\n  --text-lg: 20px;\n}\n\n/* Use everywhere */\n.button {\n  background: var(--color-brand);\n  color: white;\n  padding: var(--space-md) var(--space-lg);\n  font-family: var(--font-body);\n}\n\n/* Easy theming */\n[data-theme=\"dark\"] {\n  --color-text: #ffffff;\n  --color-background: #1a1a1a;\n}</pre><div class=\"exercise\"><h4>🔧 Practical Exercise</h4><p>Audit your CSS for magic numbers and repeated values:</p><ol><li>Search for <code>color:</code> in your stylesheets. How many unique color values? Should be ~10-15 max.</li><li>Search for <code>font-size:</code>. How many unique sizes? Should be 5-8 max.</li><li>Convert repeated values to CSS custom properties.</li></ol></div><h2>5. CSS Naming Methodologies: BEM</h2><p>BEM (Block Element Modifier) is a naming convention that makes CSS predictable and maintainable.</p><h3>BEM Structure</h3><pre>/* Block: standalone component */\n.product-card { }\n\n/* Element: part of the block (uses __) */\n.product-card__image { }\n.product-card__title { }\n.product-card__price { }\n.product-card__button { }\n\n/* Modifier: variant of block or element (uses --) */\n.product-card--featured { }\n.product-card--out-of-stock { }\n.product-card__button--primary { }\n.product-card__button--secondary { }</pre><h3>Why BEM Works</h3><ul><li><strong>No specificity issues:</strong> All classes have same specificity</li><li><strong>Clear relationships:</strong> Name shows what component it belongs to</li><li><strong>Safe to delete:</strong> Search for <code>.product-card</code> shows all related CSS</li><li><strong>No conflicts:</strong> Long names prevent accidental collisions</li></ul><h2>6. CSS Organization Strategies</h2><p>Organize CSS files by purpose, not by page.</p><pre>styles/\n├── 1-settings/\n│   ├── _variables.css      /* Custom properties */\n│   └── _tokens.css         /* Design tokens */\n├── 2-tools/\n│   └── _mixins.css         /* Reusable patterns */\n├── 3-generic/\n│   ├── _reset.css          /* Normalize browser styles */\n│   └── _box-sizing.css     /* Global defaults */\n├── 4-elements/\n│   ├── _typography.css     /* h1, p, a styles */\n│   └── _forms.css          /* input, button styles */\n├── 5-components/\n│   ├── _button.css         /* .button */\n│   ├── _card.css           /* .card */\n│   ├── _modal.css          /* .modal */\n│   └── _navigation.css     /* .nav */\n├── 6-utilities/\n│   └── _helpers.css        /* .hidden, .text-center */\n└── main.css                /* Imports all others */\n</pre><h2>7. Responsive Design Principles</h2><p>Mobile-first approach: start with mobile styles, add complexity for larger screens.</p><pre>/* Mobile first: base styles for small screens */\n.product-grid {\n  display: grid;\n  grid-template-columns: 1fr;  /* 1 column on mobile */\n  gap: 16px;\n}\n\n/* Tablet: 2 columns at 600px+ */\n@media (min-width: 600px) {\n  .product-grid {\n    grid-template-columns: repeat(2, 1fr);\n    gap: 20px;\n  }\n}\n\n/* Desktop: 3 columns at 900px+ */\n@media (min-width: 900px) {\n  .product-grid {\n    grid-template-columns: repeat(3, 1fr);\n    gap: 24px;\n  }\n}\n\n/* Large desktop: 4 columns at 1200px+ */\n@media (min-width: 1200px) {\n  .product-grid {\n    grid-template-columns: repeat(4, 1fr);\n  }\n}</pre><div class=\"info-box\"><div class=\"info-title\">💡 Breakpoint Strategy</div><p>Don't use device-specific breakpoints like 'iPhone' or 'iPad'. Use content-based breakpoints: where does your design break? That's your breakpoint.</p></div><h2>8. When to Rewrite vs. Refactor</h2><table><tr><th>Situation</th><th>Recommendation</th><th>Why</th></tr><tr><td>Using tables for layout</td><td>Rewrite incrementally</td><td>Modern layout (Flexbox/Grid) is essential</td></tr><tr><td>No naming system</td><td>Adopt BEM, refactor gradually</td><td>Can be done per-component without breaking site</td></tr><tr><td>Colors/sizes repeated</td><td>Add CSS variables incrementally</td><td>Find-and-replace is safe and quick</td></tr><tr><td>Too much !important</td><td>Flatten specificity gradually</td><td>Fix highest-traffic pages first</td></tr><tr><td>Large unused CSS</td><td>Audit with coverage tools, remove safely</td><td>Low risk, high reward</td></tr></table><div class=\"warning-box\"><div class=\"warning-title\">⚠️ The Rewrite Trap</div><p>A full CSS rewrite takes 2-3x longer than estimated, introduces new bugs, and doesn't guarantee better architecture. Always prefer incremental refactoring unless the technical debt is truly insurmountable.</p></div>",
  "questions": [
    {
      "q": "Your product grid uses float-based layout from 2010. Developer proposes 3-month rewrite. What should you do first?",
      "opts": [
        "Approve the 3-month rewrite immediately",
        "Ask: Can we replace float with CSS Grid incrementally, page by page, starting with highest-traffic pages?",
        "Keep using floats—if it works, don't fix it",
        "Hire a CSS specialist"
      ],
      "correct": 1,
      "explain": "Incremental refactoring is safer and faster. Convert one page at a time, test, and deploy. Full rewrites are rarely necessary and often introduce new bugs."
    },
    {
      "q": "Your CSS has the same blue color defined 47 times with slightly different hex values. What's the systematic fix?",
      "opts": [
        "Find-and-replace all to one value",
        "Define CSS custom property --color-brand once, replace all instances with var(--color-brand)",
        "Leave it—consistency doesn't matter",
        "Rewrite all CSS"
      ],
      "correct": 1,
      "explain": "CSS custom properties (variables) solve duplication. Define once in :root, use everywhere. Easy to change and maintain."
    },
    {
      "q": "Designer wants a 4-column product grid on desktop, 2 on tablet, 1 on mobile. What's the modern CSS approach?",
      "opts": [
        "Create three separate layouts with JavaScript",
        "Use CSS Grid with media queries: 1 column base, 2 at 600px, 4 at 1200px",
        "Use Flexbox for everything",
        "Use CSS Grid without media queries"
      ],
      "correct": 1,
      "explain": "CSS Grid with mobile-first media queries is the standard modern approach. Start with 1 column, add breakpoints as screen size increases."
    },
    {
      "q": "Developer says you need !important everywhere because specificity is broken. What's the real problem?",
      "opts": [
        "CSS is fundamentally flawed",
        "Too many IDs or overly specific selectors creating specificity wars. Need flatter hierarchy with single classes (like BEM).",
        "!important is the correct solution",
        "Need to use inline styles"
      ],
      "correct": 1,
      "explain": "Needing !important everywhere indicates specificity problems. BEM methodology uses only single classes, giving flat specificity that's easy to manage."
    },
    {
      "q": "How do you evaluate if a CSS 'mess' requires a full rewrite?",
      "opts": [
        "If developers say it's messy, trust them and approve rewrite",
        "Identify specific problems (specificity? duplication? layout?), assess if they can be fixed incrementally, rewrite only if incremental fixes are impossible",
        "Always rewrite every 2 years",
        "Never rewrite, always add more CSS"
      ],
      "correct": 1,
      "explain": "Most CSS problems can be fixed incrementally. Identify root causes, fix component by component. Full rewrites should be last resort when incremental fixes are truly impossible."
    }
  ],
  "essay": {
    "q": "Your developer proposes a 3-month CSS rewrite. What questions do you ask to evaluate if it's necessary? How would you assess the business risk and propose alternatives?",
    "guide": "Ask: What specific problems are we solving? Can these be fixed incrementally? What's the risk of breaking existing functionality? Investigate: Run CSS coverage audit, identify unused code, check for modern layout usage. Propose: Incremental refactoring starting with highest-traffic pages, CSS variables for design tokens, BEM naming for new components. Calculate cost: 3 months dev time vs. incremental approach. Assess risk: Rewrite breaks everything at once vs. incremental changes contain risk."
  }
};
