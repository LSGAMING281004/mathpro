import type { LevelConfig } from '../types';

export const LEVELS: LevelConfig[] = [
  // Easier early levels: only + and -, small numbers, occasional relational questions
  { level: 1, timeLimitSec: 12, numOptions: 4, operators: ['+','-'], minOperand: 1,  maxOperand: 10,  arity: 2, allowNegatives: false, relationalRate: 0.3 },
  { level: 2, timeLimitSec: 11, numOptions: 4, operators: ['+','-'], minOperand: 1,  maxOperand: 15,  arity: 2, allowNegatives: false, relationalRate: 0.35 },
  { level: 3, timeLimitSec: 10, numOptions: 4, operators: ['+','-'], minOperand: 1,  maxOperand: 20,  arity: 2, allowNegatives: false, relationalRate: 0.35, percentRate: 0.2 },
  { level: 4, timeLimitSec: 9,  numOptions: 4, operators: ['+','-','×'], minOperand: 1,  maxOperand: 25,  arity: 2, allowNegatives: false, relationalRate: 0.3, percentRate: 0.25 },
  { level: 5, timeLimitSec: 8,  numOptions: 5, operators: ['+','-','×'], minOperand: 1,  maxOperand: 30,  arity: 2, allowNegatives: false, relationalRate: 0.25, percentRate: 0.3 },
  // Harder later levels: include ÷ (integer), 3-term expressions
  { level: 6, timeLimitSec: 7,  numOptions: 5, operators: ['+','-','×','÷'], minOperand: 1, maxOperand: 50, arity: 3, allowNegatives: false, percentRate: 0.3 },
  { level: 7, timeLimitSec: 6,  numOptions: 6, operators: ['+','-','×','÷'], minOperand: 1, maxOperand: 80, arity: 3, allowNegatives: false, percentRate: 0.3 },
  { level: 8, timeLimitSec: 5,  numOptions: 6, operators: ['+','-','×','÷'], minOperand: 1, maxOperand: 120, arity: 3, allowNegatives: false, percentRate: 0.25, rootRate: 0.25 },
];

export const getLevelConfig = (level: number): LevelConfig => LEVELS[Math.min(level - 1, LEVELS.length - 1)];


