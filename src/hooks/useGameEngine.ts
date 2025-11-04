import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { generateOptions, generateProblem } from '../logic/generator';
import { getLevelConfig } from '../logic/leveling';
import type { Problem } from '../types';
import { playSound } from '../audio/sounds';
import { updateBests } from '../components/Home';

type GameState = 'playing' | 'gameover';

const CORRECTS_PER_LEVEL = 5;

export function useGameEngine() {
  const [level, setLevel] = useState(1);
  const levelConfig = useMemo(() => getLevelConfig(level), [level]);

  const [problem, setProblem] = useState<Problem>(() => generateProblem(levelConfig));
  const [options, setOptions] = useState<string[]>(() => generateOptions(problem.answerStr, levelConfig.numOptions, problem.kind));
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [correctInThisLevel, setCorrectInThisLevel] = useState(0);
  const [remainingSec, setRemainingSec] = useState(levelConfig.timeLimitSec);
  const [gameState, setGameState] = useState<GameState>('playing');

  const timerRef = useRef<number | null>(null);

  const timeLimitSec = levelConfig.timeLimitSec;

  const startQuestion = useCallback(() => {
    const p = generateProblem(levelConfig);
    setProblem(p);
    setOptions(generateOptions(p.answerStr, levelConfig.numOptions, p.kind));
    setRemainingSec(levelConfig.timeLimitSec);
  }, [levelConfig]);

  useEffect(() => {
    // restart timer each question
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setRemainingSec((s) => {
        if (s <= 1) {
          // time up
          if (timerRef.current) window.clearInterval(timerRef.current);
          playSound('wrong', 0.35);
          setGameState('gameover');
          return 0;
        }
        if (s <= 4 && s > 1) {
          // Low-time tick at 3,2,1 before reaching 0
          playSound('tick', 0.2);
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [problem.expression]);

  useEffect(() => {
    // when level changes, start a fresh problem with new config
    startQuestion();
  }, [level, startQuestion]);

  const nextProblem = useCallback(() => {
    startQuestion();
  }, [startQuestion]);

  const selectOption = useCallback(
    (idx: number) => {
      if (gameState !== 'playing') return;
      const val = options[idx];
      const isCorrect = val === problem.answerStr;
      if (!isCorrect) {
        playSound('wrong', 0.35);
        setGameState('gameover');
        updateBests(score, level);
        return;
      }
      playSound('correct', 0.35);
      const base = 10;
      const timeBonus = remainingSec;
      const levelMultiplier = 1 + (level - 1) * 0.2;
      const delta = Math.round((base + timeBonus) * levelMultiplier);
      setScore((s) => s + delta);
      setStreak((st) => st + 1);
      setCorrectInThisLevel((c) => {
        const nc = c + 1;
        if (nc >= CORRECTS_PER_LEVEL) {
          setLevel((lv) => lv + 1);
          playSound('levelup', 0.35);
          nextProblem();
          return 0;
        }
        // continue playing next question
        nextProblem();
        return nc;
      });
    },
    [gameState, level, options, problem.answerStr, remainingSec, nextProblem]
  );

  const nextAfterModal = useCallback(() => {
    // no-op for auto-advance
    setGameState('playing');
  }, []);

  const restart = useCallback(() => {
    setLevel(1);
    setScore(0);
    setStreak(0);
    setCorrectInThisLevel(0);
    setGameState('playing');
    startQuestion();
  }, [startQuestion]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;
      if (e.key >= '1' && e.key <= '9') {
        const idx = parseInt(e.key, 10) - 1;
        if (idx >= 0 && idx < options.length) selectOption(idx);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [gameState, options.length, selectOption]);

  return {
    level,
    score,
    streak,
    correctInThisLevel,
    problem,
    options,
    remainingSec,
    timeLimitSec,
    gameState,
    selectOption,
    nextAfterModal,
    restart,
  } as const;
}


