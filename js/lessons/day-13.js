// Day 13: Frontend Build Tools
window.__lessonCache = window.__lessonCache || {};
window.__lessonCache[13] = {
  "day": 13,
  "week": 1,
  "title": "Frontend Build Tools",
  "desc": "Bundlers, transpilers, workflows",
  "duration": "50 min",
  "coldOpen": "Developer says 'npm install' takes 15 minutes and builds are slow. Your CI pipeline times out. Is this normal? How much should you invest in build optimization?",
  "coldRevisit": "15-minute installs are not normal. Likely: corrupted package-lock.json, conflicting dependencies, or inefficient build config. Normal install: 1-3 minutes. Investigate before throwing hardware at the problem.",
  "content": "<h2>Why This Matters to You</h2><p>Modern websites aren't just HTML files—they require build processes to bundle JavaScript, optimize images, compile CSS. Slow builds waste developer time and delay deploys. Understanding build tools helps you evaluate when 'the build is broken' is an excuse vs. a real problem worth fixing.</p><h2>1. What Are Build Tools?</h2><p>Build tools transform source code into optimized production code:</p><table><tr><th>Tool Type</th><th>Purpose</th><th>Examples</th></tr><tr><td><strong>Package Manager</strong></td><td>Install dependencies</td><td>npm, yarn, pnpm</td></tr><tr><td><strong>Bundler</strong></td><td>Combine many files into few optimized files</td><td>Webpack, Vite, esbuild, Parcel</td></tr><tr><td><strong>Transpiler</strong></td><td>Convert modern JS to older JS for browser compatibility</td><td>Babel</td></tr><tr><td><strong>Task Runner</strong></td><td>Automate repetitive tasks</td><td>npm scripts, Gulp</td></tr><tr><td><strong>Linter</strong></td><td>Check code for errors and style</td><td>ESLint, Prettier</td></tr></table><h2>2. Package Managers: npm, yarn, pnpm</h2><p>Package managers install third-party libraries (dependencies).</p><pre># Install dependencies from package.json\nnpm install\n\n# Add a new dependency\nnpm install react\n\n# Install dev-only dependency (testing, linting)\nnpm install --save-dev eslint</pre><h3>The package.json File</h3><pre>{\n  \"name\": \"my-ecommerce-site\",\n  \"version\": \"1.0.0\",\n  \"scripts\": {\n    \"dev\": \"vite\",              // npm run dev\n    \"build\": \"vite build\",      // npm run build\n    \"test\": \"jest\"              // npm run test\n  },\n  \"dependencies\": {\n    \"react\": \"^18.2.0\",          // Production dependencies\n    \"stripe\": \"^12.0.0\"\n  },\n  \"devDependencies\": {\n    \"eslint\": \"^8.0.0\",          // Development-only\n    \"vite\": \"^4.0.0\"\n  }\n}</pre><div class=\"warning-box\"><div class=\"warning-title\">⚠️ The 15-Minute Install Problem</div><p>If npm install takes more than 5 minutes, something is wrong:</p><ul><li><strong>Corrupted lock file:</strong> Delete package-lock.json and node_modules, reinstall</li><li><strong>Network issues:</strong> Use a registry mirror</li><li><strong>Too many dependencies:</strong> Audit with npm ls --depth=0</li><li><strong>Consider pnpm:</strong> Faster, uses less disk space</li></ul></div><h2>3. Bundlers: From Many Files to One</h2><p>Modern development uses modules—small files, each with one purpose. But browsers load files slowly. Bundlers combine modules into optimized bundles.</p><h3>Without Bundler (Problem)</h3><pre>&lt;!-- Loading many small files = slow --&gt;\n&lt;script src=\"utils.js\"&gt;&lt;/script&gt;\n&lt;script src=\"api.js\"&gt;&lt;/script&gt;\n&lt;script src=\"cart.js\"&gt;&lt;/script&gt;\n&lt;script src=\"checkout.js\"&gt;&lt;/script&gt;\n&lt;!-- 100+ script tags = 100+ HTTP requests --&gt;</pre><h3>With Bundler (Solution)</h3><pre>&lt;!-- One optimized file = fast --&gt;\n&lt;script src=\"bundle.min.js\"&gt;&lt;/script&gt;\n&lt;!-- Contains all code, minified, tree-shaken --&gt;</pre><h3>Modern Bundlers Comparison</h3><table><tr><th>Bundler</th><th>Speed</th><th>Best For</th><th>Learning Curve</th></tr><tr><td><strong>Vite</strong></td><td>⚡ Very Fast</td><td>New projects, dev speed priority</td><td>Easy</td></tr><tr><td><strong>Webpack</strong></td><td>🐢 Slower</td><td>Complex configs, mature projects</td><td>Steep</td></tr><tr><td><strong>esbuild</strong></td><td>⚡⚡ Fastest</td><td>Build speed priority</td><td>Medium</td></tr><tr><td><strong>Parcel</strong></td><td>⚡ Fast</td><td>Zero-config projects</td><td>Easy</td></tr></table><h2>4. Build Process Example</h2><pre># Development mode (fast, unoptimized, includes debugging)\nnpm run dev\n\n# What happens:\n# 1. Start dev server (localhost:3000)\n# 2. Watch files for changes\n# 3. Hot reload on save\n# 4. No optimization (speed priority)\n\n# Production build (slow, optimized)\nnpm run build\n\n# What happens:\n# 1. Bundle all JavaScript into app.js\n# 2. Minify code (remove whitespace, shorten variables)\n# 3. Tree-shake (remove unused code)\n# 4. Optimize images\n# 5. Generate source maps for debugging\n# 6. Output to dist/ folder\n</pre><div class=\"info-box\"><div class=\"info-title\">💡 Dev vs. Prod Builds</div><p><strong>Development:</strong> Fast rebuilds, readable code, detailed errors<br><strong>Production:</strong> Optimized size, fast loading, minified code<br><br>Never deploy dev builds—they're 10x larger and expose debug info.</p></div><h2>5. Common Build Problems</h2><table><tr><th>Problem</th><th>Symptom</th><th>Solution</th></tr><tr><td><strong>Slow builds</strong></td><td>npm run build takes 10+ minutes</td><td>Use faster bundler (Vite/esbuild), reduce dependencies, check for circular imports</td></tr><tr><td><strong>Out of memory</strong></td><td>JavaScript heap out of memory</td><td>Increase Node memory: NODE_OPTIONS=--max-old-space-size=4096</td></tr><tr><td><strong>Dependency conflicts</strong></td><td>npm install fails with ERESOLVE</td><td>Check for incompatible versions, use npm install --legacy-peer-deps as workaround</td></tr><tr><td><strong>CI timeouts</strong></td><td>Build times out in GitHub Actions</td><td>Cache node_modules, use pnpm, optimize build config</td></tr></table><h2>6. Code Splitting: Load Only What's Needed</h2><p>Don't send all code to all users. Split by route:</p><pre>// Bad: one huge bundle with everything\nimport Home from './pages/Home';\nimport Checkout from './pages/Checkout';\nimport Admin from './pages/Admin';\n\n// Good: code splitting with dynamic imports\nconst Home = lazy(() => import('./pages/Home'));\nconst Checkout = lazy(() => import('./pages/Checkout'));\nconst Admin = lazy(() => import('./pages/Admin'));\n\n// Result:\n// - Home page users download only Home code\n// - Checkout users download only Checkout code\n// - Admin code never sent to regular users</pre><h3>Bundle Size Budget</h3><pre>Good bundle sizes:\n┌──────────────────────┬───────────┐\n│ File                 │ Target    │\n├──────────────────────┼───────────┤\n│ Main JS bundle       │ < 200 KB  │\n│ CSS bundle           │ < 50 KB   │\n│ Vendor/libraries     │ < 150 KB  │\n│ Total initial load   │ < 400 KB  │\n└──────────────────────┴───────────┘</pre><h2>7. Transpilation: Modern Code for Old Browsers</h2><p>You write modern JavaScript, but some users have old browsers. Transpilers convert modern code to compatible code:</p><pre>// Modern JavaScript (you write)\nconst products = items.filter(item => item.price > 100);\n\n// Transpiled for old browsers (Babel outputs)\nvar products = items.filter(function(item) {\n  return item.price > 100;\n});</pre><h3>When to Transpile</h3><ul><li><strong>Target modern browsers only (2022+)?</strong> No transpilation needed</li><li><strong>Support older browsers?</strong> Use Babel with appropriate presets</li><li><strong>Check your analytics:</strong> If <2% use old browsers, consider dropping support</li></ul><h2>8. CI/CD Build Optimization</h2><pre># Slow CI build (problem)\nname: Build\nsteps:\n  - npm install          # 5 minutes\n  - npm run build        # 10 minutes\n  - npm test             # 8 minutes\n# Total: 23 minutes per deploy\n\n# Optimized CI build (solution)\nname: Build\nsteps:\n  - uses: actions/cache@v3\n    with:\n      path: ~/.pnpm-store\n      key: ${{ runner.os }}-pnpm-${{ hashFiles('pnpm-lock.yaml') }}\n  - pnpm install         # 30 seconds (cached)\n  - pnpm build           # 2 minutes (using Vite)\n  - pnpm test            # 3 minutes\n# Total: 5.5 minutes per deploy</pre><div class=\"exercise\"><h4>🔧 Build Audit Exercise</h4><ol><li>Run npm run build and time it. Target: <3 minutes</li><li>Check bundle size: ls -lh dist/*.js. Target: <200KB main bundle</li><li>Run npm ls --depth=0 to see all dependencies. Are they all necessary?</li></ol></div>",
  "questions": [
    {
      "q": "Developer says npm install takes 15 minutes. What should you investigate first?",
      "opts": [
        "Buy faster servers",
        "Check if package-lock.json is corrupted, look for dependency conflicts, consider switching to pnpm. 15 minutes is not normal—typical install should be 1-3 minutes.",
        "It's normal for large projects",
        "Upgrade npm"
      ],
      "correct": 1,
      "explain": "15-minute installs indicate a problem: corrupted lock file, network issues, or inefficient package manager. Normal installs are 1-3 minutes. Investigate before adding resources."
    },
    {
      "q": "Your main JavaScript bundle is 2.5MB. PageSpeed Insights says this is 'blocking'. What's the issue?",
      "opts": [
        "PageSpeed is wrong",
        "Bundle is too large—users download 2.5MB before page becomes interactive. Need code splitting, tree shaking, and lazy loading. Target: <200KB main bundle.",
        "Need faster CDN",
        "Compress the bundle"
      ],
      "correct": 1,
      "explain": "2.5MB is huge—users on 3G wait 20+ seconds. Modern best practice: <200KB initial bundle. Use code splitting to load only needed code, lazy load routes, tree-shake unused dependencies."
    },
    {
      "q": "What's the difference between dependencies and devDependencies in package.json?",
      "opts": [
        "No real difference",
        "dependencies = needed in production (React, Stripe). devDependencies = only for development (testing, linting). This affects production bundle size.",
        "devDependencies are optional",
        "dependencies install first"
      ],
      "correct": 1,
      "explain": "dependencies ship to production. devDependencies are build-time only (tests, linters). Misclassifying adds unnecessary weight to production bundles. Always use --save-dev for build tools."
    },
    {
      "q": "Build works locally but fails in CI with 'JavaScript heap out of memory'. What's happening?",
      "opts": [
        "CI is broken",
        "Build requires more memory than CI provides. Fix: increase Node memory limit (NODE_OPTIONS=--max-old-space-size=4096) or optimize build.",
        "Need to upgrade CI plan",
        "Restart CI"
      ],
      "correct": 1,
      "explain": "Local machines often have more RAM than CI. Node defaults to ~1.5GB heap. Large builds need more. Fix: increase limit or optimize (reduce dependencies, improve build config)."
    },
    {
      "q": "Developer proposes migrating from Webpack to Vite, estimating 2 weeks. How do you evaluate?",
      "opts": [
        "Approve—Vite is modern",
        "Ask: what's the current pain? (slow builds?) What's the benefit? (faster dev server, quicker builds?) Is 2 weeks justified? Can we test on one feature first?",
        "Reject—Webpack is fine",
        "Require 6-month plan"
      ],
      "correct": 1,
      "explain": "Evaluate migrations by specific problems and measurable benefits. If builds take 15 min and Vite reduces to 2 min, calculate dev time saved. Test on small feature before full migration."
    }
  ],
  "essay": {
    "q": "Your CI builds time out after 30 minutes. Local builds take 12 minutes. How do you diagnose and fix this? What's the cost/benefit of build optimization?",
    "guide": "Diagnose: Profile build (webpack-bundle-analyzer), check dependency count (npm ls), compare CI vs local (caching? slower hardware?). Common causes: no caching (every build reinstalls), slow bundler (Webpack), huge dependencies. Fixes: Enable CI caching (pnpm + cache action), switch to faster bundler (Vite: 10x faster), audit dependencies (remove unused), code splitting. Cost/benefit: If 20 devs deploy 5x/day, 12-minute builds = 1000 minutes/day wasted. Reducing to 3 minutes saves £300+/day in dev time. 1-week optimization investment pays for itself in 1 month."
  }
};
