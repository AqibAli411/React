import { createContext, useContext, useEffect, useReducer } from "react";

const QuizContext = createContext();

const initialState = {
  questions: [],
  status: "loading",
  selectedId: 0,
  score: 0,
  time: 7.5 * 60,
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

function QuizProvider({ children }) {
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
    <QuizContext.Provider
      value={{
        questions,
        question:questions.at(selectedId),
        status,
        selectedId,
        score,
        time,
        highScore,
        selectedOpt,
        dispatch,
        totalQuestions
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined)
    throw new Error("useContext can only be used inside ContextProvider");
  return context;
}

export { useQuiz, QuizProvider };
