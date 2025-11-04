type Props = { show: boolean; level: number; onContinue: () => void };

export function LevelUpModal({ show, level, onContinue }: Props) {
  if (!show) return null;
  return (
    <div className="modal d-block" role="dialog" aria-modal="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Level Up!</h5>
          </div>
          <div className="modal-body">
            <p className="mb-0">Welcome to level {level}. Time decreases and questions get harder.</p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-primary" onClick={onContinue}>Continue</button>
          </div>
        </div>
      </div>
    </div>
  );
}



