import { useQuiz } from "./QuizContext";

function Question() {
  const { question, selectedId, dispatch, score, selectedOpt } = useQuiz();

  return (
    <>
      <header className="progress">
        <progress
          max="15"
          value={selectedId + Number(selectedOpt !== null)}
        ></progress>
        <p>
          Question
          <strong> {selectedId + 1}</strong>
        </p>
        <p>
          <strong>{score}</strong>/ 280
        </p>
      </header>
      <div>
        <h4>{question.question}</h4>
        <div className="options">
          {Array.from({ length: 4 }, (_, i) => (
            <Button
              handelOptions={() => dispatch({ type: "setOpt", payload: i })}
              key={i}
              isAnswer={selectedOpt === i}
              isCorrect={i === question.correctOption}
              isMarked={selectedOpt !== null}
            >
              {question.options[i]}
            </Button>
          ))}
        </div>
      </div>
    </>
  );
}

function Button({ children, handelOptions, isAnswer, isCorrect, isMarked }) {
  const optionStyle = isMarked
    ? (isAnswer ? "answer" : "") + " " + (isCorrect ? "correct" : "wrong")
    : "";

  return (
    <button
      className={`btn btn-option ${optionStyle}`}
      disabled={isMarked}
      onClick={handelOptions}
    >
      {children}
    </button>
  );
}

export default Question;
