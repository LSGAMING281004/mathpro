type Props = { show: boolean; score: number; onRestart: () => void; onHome: () => void };

export function GameOverModal({ show, score, onRestart, onHome }: Props) {
  if (!show) return null;
  return (
    <div className="modal d-block" role="dialog" aria-modal="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Game Over</h5>
          </div>
          <div className="modal-body">
            <p className="mb-0">Your score: <strong>{score}</strong></p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-outline-secondary" onClick={onHome}>Home</button>
            <button className="btn btn-primary" onClick={onRestart}>Restart</button>
          </div>
        </div>
      </div>
    </div>
  );
}


