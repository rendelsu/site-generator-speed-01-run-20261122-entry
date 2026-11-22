// site-generator-speed-01-run-20261122-entry: the harness runs `node /bot/main.ts` (node22). It reads
// every case from /input/cases.json (a JSON array of {id, input}), answers each one alone with run()
// from solve.js, and writes /output/answers.json: a JSON array of the answers, one per case and in
// the cases' order. Outside a container MAKEFUN_INPUT_DIR and MAKEFUN_OUTPUT_DIR stand in for /input
// and /output. Plain JavaScript (no type annotations) so it runs on any Node 22 without type stripping.

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { setFlagsFromString } from 'node:v8';

// V8's incremental marking off, set before solve.js is imported so all of its work runs under it (the
// rules allow an entry to tune V8's flags this way).
setFlagsFromString('--no-incremental-marking');

const { run } = await import(new URL('./solve.js', import.meta.url).href);

const INPUT_DIR = process.env.MAKEFUN_INPUT_DIR ?? '/input';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const cases = JSON.parse(readFileSync(join(INPUT_DIR, 'cases.json'), 'utf8'));
const answers = new Array(cases.length);
for (let i = 0; i < cases.length; i++) answers[i] = run(cases[i].input);
writeFileSync(join(OUTPUT_DIR, 'answers.json'), JSON.stringify(answers));
