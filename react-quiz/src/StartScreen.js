import { useQuiz } from "./QuizContext";

function StartScreen() {
  const { totalQuestions, dispatch } = useQuiz();

  return (
    <div className="start">
      <h2>Welcome to React Quiz!</h2>
      <h3>{totalQuestions} questions to test your React mastery</h3>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "dataActive" })}
      >
        Let's Start
      </button>
    </div>
  );
}

export default StartScreen;
