import { useEffect } from "react";

function Footer({ dispatch, totalQuestions, index, answer, timer }) {
  const isLastQuestion = index === totalQuestions - 1;
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  useEffect(
    function () {
      const id = setInterval(() => dispatch({ type: "tick" }), 1000);
      return () => clearInterval(id);
    },
    [dispatch]
  );

  return (
    <footer>
      <div className="timer">
        {minutes < 10 && "0"}
        {minutes}:{seconds < 10 && "0"}
        {seconds}
      </div>
      {answer !== null &&
        (isLastQuestion ? (
          <button
            className="btn btn-ui"
            onClick={() => dispatch({ type: "finish" })}
          >
            Finish
          </button>
        ) : (
          <button
            className="btn btn-ui"
            onClick={() => dispatch({ type: "nextQuestion" })}
          >
            Next
          </button>
        ))}
    </footer>
  );
}

export default Footer;
