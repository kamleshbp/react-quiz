import { useEffect, useReducer } from "react";
import Header from "./components/Header";
import Loader from "./components/Loader";
import Main from "./components/Main";
import StartScreen from "./components/StartScreen";
import Error from "./components/Error";
import ProgressBar from "./components/ProgressBar";
import Question from "./components/Question";
import Footer from "./components/Footer";
import FinishScreen from "./components/FinishScreen";

const SEC_PER_QUESTION = 30;

const initialState = {
  questions: [],
  status: "loading", // loading, ready, error, active, finished
  index: 0,
  score: 0,
  answer: null,
  highscore: 0,
  timer: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return {
        ...state,
        status: "active",
        timer: Math.min(state.questions.length * SEC_PER_QUESTION, 60 * 60),
      };
    case "newAnswer":
      const { correctOption, points } = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        score: state.score + (correctOption === action.payload ? points : 0),
      };
    case "nextQuestion":
      return { ...state, answer: null, index: state.index + 1 };
    case "finish":
      return {
        ...state,
        status: "finished",
        highscore: Math.max(state.highscore, state.score),
      };
    case "tick":
      if (state.timer === 0) return { ...state, status: "finished" };
      return { ...state, timer: state.timer - 1 };
    case "restart":
      return {
        ...initialState,
        questions: state.questions,
        status: "ready",
        highscore: state.highscore,
      };
    default:
      return new Error("Unknown Action");
  }
}

export default function App() {
  const [
    { questions, status, index, score, answer, highscore, timer },
    dispatch,
  ] = useReducer(reducer, initialState);
  const totalQuestions = questions.length;
  const maxScore = questions.reduce(
    (acc, question) => acc + question.points,
    0
  );

  useEffect(function () {
    async function fetchQuestions() {
      try {
        const res = await fetch("http://localhost:3004/questions");
        const data = await res.json();
        dispatch({ type: "dataReceived", payload: data });
      } catch (error) {
        dispatch({ type: "dataFailed" });
      }
    }
    fetchQuestions();
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen totalQuestions={totalQuestions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <ProgressBar
              totalQuestions={totalQuestions}
              index={index}
              score={score}
              maxScore={maxScore}
              answer={answer}
            />
            <Question
              question={questions.at(index)}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer
              dispatch={dispatch}
              totalQuestions={totalQuestions}
              index={index}
              answer={answer}
              timer={timer}
            />
          </>
        )}
        {status === "finished" && (
          <FinishScreen
            dispatch={dispatch}
            score={score}
            maxScore={maxScore}
            highscore={highscore}
          />
        )}
      </Main>
    </div>
  );
}
