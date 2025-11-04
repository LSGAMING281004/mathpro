import { useEffect, useMemo, useState } from 'react';
import { useGameEngine } from './hooks/useGameEngine';
import { HUD } from './components/HUD';
import { Question } from './components/Question';
import { Options } from './components/Options';
import { GameOverModal } from './components/GameOverModal';
import { Home } from './components/Home';

export default function App() {
  const [screen, setScreen] = useState<'home' | 'game'>('home');
  const engine = useGameEngine();

  const theme = useMemo(() => {
    const ratio = Math.max(0, Math.min(1, (engine.level - 1) / 10));
    const hue = 120 * (1 - ratio); // 120 => green, 0 => red
    const opacity = 0.08 + 0.12 * ratio; // subtle background tint
    const solid = `hsl(${hue} 85% 45%)`;
    const tint = `hsla(${hue}, 85%, 45%, ${opacity})`;
    return { solid, tint };
  }, [engine.level]);

  useEffect(() => {
    // when leaving game over, return to home if requested elsewhere
  }, [engine.gameState]);

  // Apply level tint to the whole page background
  useEffect(() => {
    const prev = document.body.style.backgroundColor;
    document.body.style.backgroundColor = theme.tint;
    return () => {
      document.body.style.backgroundColor = prev;
    };
  }, [theme.tint]);

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">MathPro</h1>
      {screen === 'home' && (
        <Home
          onPlay={() => { engine.restart(); setScreen('game'); }}
        />
      )}

      {screen === 'game' && (
        <>
          <HUD level={engine.level} score={engine.score} remainingSec={engine.remainingSec} timeLimit={engine.timeLimitSec} />

          {engine.gameState === 'playing' && (
            <div className="mt-4">
              <Question expression={engine.problem.expression} />
              <Options options={engine.options} onSelect={(idx) => engine.selectOption(idx)} />
            </div>
          )}

          <GameOverModal
            show={engine.gameState === 'gameover'}
            score={engine.score}
            onHome={() => { setScreen('home'); }}
            onRestart={() => { engine.restart(); }}
          />
        </>
      )}
    </div>
  );
}


