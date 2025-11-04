import type { LevelConfig, Operator, Problem } from '../types';

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

function makeDivisionPair(min: number, max: number): [number, number] {
  const d = randomInt(Math.max(1, min), Math.max(2, Math.min(12, max)));
  const q = randomInt(Math.max(1, min), Math.max(2, Math.floor(max / d)));
  return [q * d, d];
}

function compute(operands: number[], operators: Operator[]): number {
  const ops = [...operators];
  const vals = [...operands];
  for (let i = 0; i < ops.length; ) {
    if (ops[i] === '×' || ops[i] === '÷') {
      const a = vals[i], b = vals[i + 1];
      const v = ops[i] === '×' ? a * b : a / b;
      vals.splice(i, 2, v);
      ops.splice(i, 1);
    } else i++;
  }
  return ops.reduce((acc, op, i) => (op === '+' ? acc + vals[i + 1] : acc - vals[i + 1]), vals[0]);
}

function generateArithmeticProblem(cfg: LevelConfig): Problem {
  const arity = cfg.arity;
  const operators: Operator[] = Array.from({ length: arity - 1 }, () => pick(cfg.operators));
  const operands: number[] = [];
  for (let i = 0; i < arity; i++) {
    operands.push(randomInt(cfg.minOperand, cfg.maxOperand));
  }
  for (let i = 0; i < operators.length; i++) {
    if (operators[i] === '÷') {
      const [dividend, divisor] = makeDivisionPair(cfg.minOperand, cfg.maxOperand);
      operands[i] = dividend;
      operands[i + 1] = divisor;
    }
  }
  const answer = compute(operands, operators);
  if (!Number.isInteger(answer)) return generateArithmeticProblem(cfg);
  if (!cfg.allowNegatives && answer < 0) return generateArithmeticProblem(cfg);
  const expression = operands.map((v, i) => (i === 0 ? `${v}` : ` ${operators[i - 1]} ${v}`)).join('');
  return { expression, answerStr: String(answer), operands, operators, kind: 'arithmetic' };
}

function generateRelationalProblem(cfg: LevelConfig): Problem {
  // Relational: a ? b with ? in >, <, =, >=, <=
  const a = randomInt(cfg.minOperand, cfg.maxOperand);
  const b = randomInt(cfg.minOperand, cfg.maxOperand);
  const rel = pick(['>', '<', '=', '>=', '<='] as const);
  const truth = rel === '>' ? a > b : rel === '<' ? a < b : rel === '=' ? a === b : rel === '>=' ? a >= b : a <= b;
  const expression = `${a} ${rel} ${b}`;
  return { expression, answerStr: truth ? 'True' : 'False', operands: [a, b], operators: [] as Operator[], kind: 'relational' };
}

function gcd(a: number, b: number): number { return b === 0 ? Math.abs(a) : gcd(b, a % b); }

function generatePercentageProblem(cfg: LevelConfig): Problem {
  // Format like "60 of 50%" (user example). Compute as 60 * 50% = 30
  const percChoices = [10, 20, 25, 30, 40, 50, 60, 75, 80, 90, 100];
  const pct = pick(percChoices);
  const denom = 100 / gcd(100, pct); // base must be multiple of denom for integer result
  const minBase = Math.max(cfg.minOperand, denom);
  const maxBase = cfg.maxOperand - (cfg.maxOperand % denom);
  const base = Math.max(denom, randomInt(minBase, Math.max(minBase, maxBase)) - ((randomInt(minBase, Math.max(minBase, maxBase)) % denom)));
  const result = Math.round(base * (pct / 100));
  const expression = `${base} of ${pct}%`;
  return { expression, answerStr: String(result), operands: [base, pct], operators: [] as Operator[], kind: 'percentage' };
}

function generateRootProblem(cfg: LevelConfig): Problem {
  // Square root of a perfect square
  const kMin = 2;
  const kMax = Math.max(kMin, Math.floor(Math.sqrt(cfg.maxOperand)) + 10); // allow larger perfect squares
  const k = randomInt(kMin, Math.min(kMax, 20));
  const n = k * k;
  const expression = `√${n}`;
  return { expression, answerStr: String(k), operands: [n], operators: [] as Operator[], kind: 'root' };
}

export function generateProblem(cfg: LevelConfig): Problem {
  // Decide kind based on configured rates
  const rRel = cfg.relationalRate ?? 0;
  const rPct = cfg.percentRate ?? 0;
  const rRoot = cfg.rootRate ?? 0;
  const r = Math.random();
  if (r < rRel) return generateRelationalProblem(cfg);
  if (r < rRel + rPct) return generatePercentageProblem(cfg);
  if (r < rRel + rPct + rRoot) return generateRootProblem(cfg);
  return generateArithmeticProblem(cfg);
}

export function generateOptions(correct: string, n: number, kind: Problem['kind']): string[] {
  if (kind === 'relational') {
    const opts = ['True', 'False'];
    return (opts[0] === correct ? opts : opts.reverse()).slice(0, Math.min(n, 2));
  }
  const correctNum = Number(correct);
  const set = new Set<string>([String(correctNum)]);
  const deltas = [1, 2, 5, 10, -1, -2, -5, -10, 3, -3, 4, -4];
  let k = 0;
  while (set.size < n && k < 200) {
    const delta = pick(deltas) * randomInt(1, 2);
    const cand = correctNum + delta;
    if (cand !== correctNum) set.add(String(cand));
    k++;
  }
  return Array.from(set).sort(() => Math.random() - 0.5);
}


