import { useEffect, useReducer } from "react";
import Header from "./Header.js";
import Main from "./Main.js";
import Loader from "./Loader.js";
import Error from "./Error.js";
import StartScreen from "./StartScreen.js";
import Question from "./Question.js";
import ScoreCard from "./ScoreCard.js";
import Footer from "./Footer.js";

const initialState = {
  questions: [],
  status: "loading",
  selectedId: 0,
  score: 0,
  time: 6,
  selectedOpt: null,
  highScore: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataFetched":
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    case "dataActive":
      return { ...state, status: "active" };
    case "setId":
      return { ...state, selectedId: state.selectedId + 1, selectedOpt: null };
    case "setScore":
      return { ...state, score: state.score + action.payload };
    case "setTime":
      return { ...state, time: state.time - 1 };
    case "setOpt":
      //perform some action here also
      const question = state.questions.at(state.selectedId);
      const points =
        question.correctOption === action.payload ? question.points : 0;
      return {
        ...state,
        selectedOpt: action.payload,
        score: state.score + points,
      };
    case "endQuiz":
      return {
        ...state,
        status: "finished",
        highScore: Math.max(action.payload, state.highScore),
      };
    case "resetQuiz":
      return {
        ...initialState,
        questions: state.questions,
        status: "ready",
        highScore: state.highScore,
      };
    default:
      return new Error("unknown input");
  }
}

export default function App() {
  const [
    { questions, status, selectedId, score, time, highScore, selectedOpt },
    dispatch,
  ] = useReducer(reducer, initialState);

  const totalQuestions = questions.length;

  //fetching the data
  useEffect(function () {
    fetch("http://localhost:9000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataFetched", payload: data }))
      .catch((error) => dispatch({ type: "dataFailed" }));
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
        {status === "active" &&
          (selectedId >= questions.length ? (
            dispatch({ type: "endQuiz", payload: score })
          ) : (
            <>
              <Question
                question={questions.at(selectedId)}
                num={selectedId}
                dispatch={dispatch}
                score={score}
                selectedOpt={selectedOpt}
              />
              <Footer
                time={time}
                selectedOpt={selectedOpt}
                score={score}
                dispatch={dispatch}
                selectedId={selectedId}
              />
            </>
          ))}
        {status === "finished" && (
          <ScoreCard score={score} dispatch={dispatch} highScore={highScore} />
        )}
      </Main>
    </div>
  );
}
