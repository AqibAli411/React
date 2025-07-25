import { useQuiz } from "./QuizContext";

function ScoreCard() {
  const { score, dispatch, highScore } = useQuiz();

  function handleReset() {
    dispatch({ type: "resetQuiz" });
  }

  return (
    <main className="main">
      <p className="result">
        <span>🤦‍♂️</span> You scored <strong>{score}</strong> out of 280 (
        {Math.round((score / 280) * 100)}%)
      </p>
      <p className="highscore">(Highscore: {highScore} points)</p>
      <button className="btn btn-ui" onClick={handleReset}>
        Restart quiz
      </button>
    </main>
  );
}

export default ScoreCard;
