import { playSound } from '../audio/sounds';

type Props = { options: string[]; onSelect: (index: number) => void };

export function Options({ options, onSelect }: Props) {
  return (
    <div className="options-grid mt-4">
      {options.map((opt, i) => (
        <button
          key={i}
          className="btn btn-lg btn-outline-primary"
          onClick={() => {
            playSound('click', 0.3);
            onSelect(i);
          }}
          aria-label={`Option ${i + 1}: ${opt}`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}


