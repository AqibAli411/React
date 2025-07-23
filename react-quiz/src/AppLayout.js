import Header from "./Header.js";
import Main from "./Main.js";
import Loader from "./Loader.js";
import Error from "./Error.js";
import StartScreen from "./StartScreen.js";
import Question from "./Question.js";
import ScoreCard from "./ScoreCard.js";
import Footer from "./Footer.js";
import { useQuiz } from "./QuizContext.js";

function AppLayout() {
  const { selectedId, status, dispatch, questions, score } = useQuiz();

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && <StartScreen />}
        {status === "active" &&
          (selectedId >= questions.length ? (
            dispatch({ type: "endQuiz", payload: score })
          ) : (
            <>
              <Question />
              <Footer />
            </>
          ))}
        {status === "finished" && <ScoreCard />}
      </Main>
    </div>
  );
}

export default AppLayout;
