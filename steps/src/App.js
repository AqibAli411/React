import { useState } from "react";

const messages = [
  "Learn React ⚛️",
  "Apply for jobs 💼",
  "Invest your new income 🤑",
];

export default function App() {
  const [step, setStep] = useState(1);
  const [isOpen, setIsOpen] = useState(true);

  function handlePrevious() {
    if (step > 1) setStep((s) => s - 1);
  }

  function handleNext() {
    if (step < 3) setStep((s) => s + 1);
  }

  function handleOnClick() {
    setIsOpen((isOpen) => !isOpen);
  }

  return (
    <>
      <button className="close" onClick={handleOnClick}>
        &times;
      </button>

      {isOpen && (
        <div className="steps">
          <div className="numbers">
            <div className={step >= 1 ? "active" : ""}>1</div>
            <div className={step >= 2 ? "active" : ""}>2</div>
            <div className={step >= 3 ? "active" : ""}>3</div>
          </div>

          <Message step={step}>
          {/* wrapped in the children */}
            {messages[step - 1]} 
          </Message>

          <div className="buttons">
            <Button
              handleEvent={handlePrevious}
              bgColor="#7950f2"
              textColor="#fff"
            >
              Previous
            </Button>

            <Button handleEvent={handleNext} bgColor="#7950f2" textColor="#fff">
              Next
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

function Button({ handleEvent, bgColor, textColor, children }) {
  return (
    <button
      style={{ background: bgColor, color: textColor }}
      onClick={handleEvent}
    >
      {children}
    </button>
  );
}

function Message({ step,children }) {
  return (
    <p className="message">
      Step {step}:{children}
    </p>
  );
}
