function ProgressBar({ totalQuestions, index, score, maxScore, answer }) {
  return (
    <header className="progress">
      <progress max={totalQuestions} value={index + Number(answer !== null)} />
      <p>
        Question <strong>{index + 1}</strong> / {totalQuestions}
      </p>
      <p>
        <strong>
          {score} / {maxScore}
        </strong>
      </p>
    </header>
  );
}

export default ProgressBar;
