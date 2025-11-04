type Props = { expression: string };

export function Question({ expression }: Props) {
  return (
    <div className="question mt-3" aria-live="polite">
      {expression}
    </div>
  );
}



