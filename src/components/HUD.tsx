type Props = {
  level: number;
  score: number;
  remainingSec: number;
  timeLimit: number;
};

export function HUD({ level, score, remainingSec, timeLimit }: Props) {
  const percent = Math.max(0, Math.min(100, Math.round((remainingSec / timeLimit) * 100)));
  const ratio = Math.max(0, Math.min(1, (level - 1) / 10));
  const hue = 120 * (1 - ratio);
  const barColor = `hsl(${hue} 85% 45%)`;
  return (
    <div className="d-flex align-items-center justify-content-between gap-3">
      <div className="badge fs-6" style={{ backgroundColor: barColor, color: 'white' }}>Level {level}</div>
      <div className="flex-grow-1">
        <div className="progress timer-bar" role="progressbar" aria-label="Time remaining" aria-valuemin={0} aria-valuemax={timeLimit} aria-valuenow={remainingSec}>
          <div className="progress-bar" style={{ width: `${percent}%`, backgroundColor: barColor }} aria-live="polite">
            {remainingSec}s
          </div>
        </div>
      </div>
      <div className="badge text-bg-success fs-6">Score {score}</div>
    </div>
  );
}


