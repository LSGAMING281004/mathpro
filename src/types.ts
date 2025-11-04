export type Operator = '+' | '-' | '×' | '÷';
export type Arity = 2 | 3;

export type Problem = {
  expression: string;
  answerStr: string; // normalized answer to compare; numeric answers stringified
  operands: number[];
  operators: Operator[];
  kind: 'arithmetic' | 'relational' | 'percentage' | 'root';
};

export type LevelConfig = {
  level: number;
  timeLimitSec: number;
  numOptions: number;
  operators: Operator[];
  minOperand: number;
  maxOperand: number;
  arity: Arity;
  allowNegatives: boolean;
  relationalRate?: number; // 0..1 chance for relational question at this level
  percentRate?: number; // 0..1 chance for percentage question
  rootRate?: number; // 0..1 chance for root question
};


