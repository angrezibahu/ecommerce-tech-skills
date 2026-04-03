// Splits js/lessons-data.js into per-day files under js/lessons/
// Also writes js/lessons-manifest.js with metadata only (for dashboard rendering)
// Run once: node split-lessons.js

'use strict';
const fs   = require('fs');
const path = require('path');

// ---- load the source data ----
const src = fs.readFileSync('./js/lessons-data.js', 'utf8');
// lessons-data.js sets `var lessonsData = [...]`
const ctx = { lessonsData: null };
const vm  = require('vm');
vm.runInNewContext(src, ctx);
const lessons = ctx.lessonsData;

if (!Array.isArray(lessons) || lessons.length === 0) {
    console.error('Could not parse lessonsData'); process.exit(1);
}

// ---- create output directory ----
const outDir = path.join(__dirname, 'js', 'lessons');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// ---- write manifest (metadata only) ----
const manifest = lessons.map(({ day, week, title, desc, duration }) =>
    ({ day, week, title, desc, duration }));

fs.writeFileSync(
    path.join(__dirname, 'js', 'lessons-manifest.js'),
    '// Lesson metadata for dashboard rendering — full content loaded lazily\n' +
    'var lessonsManifest = ' + JSON.stringify(manifest, null, 2) + ';\n'
);
console.log('Wrote js/lessons-manifest.js');

// ---- write one file per lesson ----
lessons.forEach(lesson => {
    const file = path.join(outDir, `day-${lesson.day}.js`);
    const json  = JSON.stringify(lesson, null, 2);
    fs.writeFileSync(file,
        `// Day ${lesson.day}: ${lesson.title}\n` +
        `window.__lessonCache = window.__lessonCache || {};\n` +
        `window.__lessonCache[${lesson.day}] = ${json};\n`
    );
});
console.log(`Wrote ${lessons.length} lesson files to js/lessons/`);
