import { useEffect, useState } from 'react';

type Props = { onPlay: () => void };

const BEST_SCORE_KEY = 'mathpro_best_score';
const BEST_LEVEL_KEY = 'mathpro_best_level';

export function Home({ onPlay }: Props) {
  const [bestScore, setBestScore] = useState<number>(0);
  const [bestLevel, setBestLevel] = useState<number>(1);

  useEffect(() => {
    const s = Number(localStorage.getItem(BEST_SCORE_KEY) || 0);
    const l = Number(localStorage.getItem(BEST_LEVEL_KEY) || 1);
    setBestScore(s);
    setBestLevel(l);
  }, []);

  return (
    <div className="text-center">
      <div className="math-anim mt-3" aria-hidden>
        <span>+</span>
        <span>−</span>
        <span>×</span>
        <span>÷</span>
        <span>&gt;</span>
        <span>&lt;</span>
      </div>
      <div className="d-flex justify-content-center gap-3 my-4">
        <div className="card shadow-sm" style={{ minWidth: 180 }}>
          <div className="card-body">
            <div className="text-muted">Best Score</div>
            <div className="fs-3 fw-bold">{bestScore}</div>
          </div>
        </div>
        <div className="card shadow-sm" style={{ minWidth: 180 }}>
          <div className="card-body">
            <div className="text-muted">Best Level</div>
            <div className="fs-3 fw-bold">{bestLevel}</div>
          </div>
        </div>
      </div>
      <button className="btn btn-primary btn-lg" onClick={onPlay}>Play</button>
    </div>
  );
}

export function updateBests(score: number, level: number) {
  const bestScore = Number(localStorage.getItem(BEST_SCORE_KEY) || 0);
  const bestLevel = Number(localStorage.getItem(BEST_LEVEL_KEY) || 1);
  if (score > bestScore) localStorage.setItem(BEST_SCORE_KEY, String(score));
  if (level > bestLevel) localStorage.setItem(BEST_LEVEL_KEY, String(level));
}



