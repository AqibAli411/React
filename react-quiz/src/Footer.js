import { useEffect } from "react";

function Footer({ time, selectedOpt, dispatch, score, selectedId }) {
  useEffect(
    function () {
      if (time <= 0) {
        dispatch({ type: "endQuiz", payload: score });
        return;
      }

      const startTimer = setInterval(() => {
        dispatch({ type: "setTime" });
      }, 1000);

      return () => clearInterval(startTimer);
    },
    [time, dispatch, score]
  );

  return (
    <footer>
      <div className="timer">
        0{Math.floor(time / 60)}:{time % 60 <= 9 ? 0 : ""}
        {time % 60}
      </div>
      {selectedOpt !== null && (
        <button
          className="btn btn-ui"
          onClick={() => dispatch({ type: "setId" })}
        >
          {selectedId === 14 ? "Finish " : "Next"}
        </button>
      )}
    </footer>
  );
}

export default Footer;
