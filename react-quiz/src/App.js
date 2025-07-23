
import { QuizProvider } from "./QuizContext";
import AppLayout from "./AppLayout.js";

function App() {

  return (
    <QuizProvider>
      <AppLayout/>
    </QuizProvider>
  );
}

export default App;
