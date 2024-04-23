import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { LinkButton } from "../Components/LinkButton";
import { DarkModeToggle, bodyClassName } from "../Components/DarkModeToggle";
import { SimpleQuestion } from "../QuestionData/SimpleQuestion";
import jsonData from "../QuestionData/SimpleQuestions.json";
import "../Formatting/General.css";
import "../Formatting/Questions.css";
import "../Formatting/SimpleQuestions.css";

//local storage and API Key: key should be entered in by the user and will be stored in local storage (NOT session storage)
let keyData = "";
const saveKeyData = "MYKEY";
const prevKey = localStorage.getItem(saveKeyData); //so it'll look like: MYKEY: <api_key_value here> in the local storage when you inspect
if (prevKey !== null) {
  keyData = JSON.parse(prevKey);
}

let simpleQuestionQuizCompleted: SimpleQuestion[] = [];

export function getQuestions(): SimpleQuestion[] {
  return simpleQuestionQuizCompleted;
}

function SimpleQuestions() {
  const [key, setKey] = useState<string>(keyData); //for api key input
  //sets the local storage item to the api key the user inputed
  function handleSubmit() {
    localStorage.setItem(saveKeyData, JSON.stringify(key));
    window.location.reload(); //when making a mistake and changing the key again, I found that I have to reload the whole site before openai refreshes what it has stores for the local storage variable
  }

  //whenever there's a change it'll store the api key in a local state called key but it won't be set in the local storage until the user clicks the submit button
  function changeKey(event: React.ChangeEvent<HTMLInputElement>) {
    setKey(event.target.value);
  }

  const [questions, setQuestions] = useState<SimpleQuestion[]>([]);
  const [numberOfQuestions, setNumberOfQuestions] = useState<number>(15);
  const [questionNumber, setQuestionNumber] = useState<number>(0);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState<number>(1);
  const [questionBody, setQuestionBody] = useState<string>("Question...");
  const [option1, setOption1] = useState<string>("Option 1...");
  const [option2, setOption2] = useState<string>("Option 2...");
  const [color, setColor] = useState<string>("");
  const [backButtonDisabled, setBackButtonDisabled] = useState<boolean>(true);

  useEffect(() => {
    const colors = ["red", "orange", "green", "blue", "purple", "pink", "brown"];
    setColor(colors[Math.floor(Math.random() * colors.length)]);
  }, []);

  useEffect(() => {
    const loadQuestions = () => {
      const parsedData = JSON.parse(JSON.stringify(jsonData));
      const simpleQuestions: SimpleQuestion[] = parsedData.SIMPLE_QUESTIONS;
      setQuestions(simpleQuestions);
      setNumberOfQuestions(simpleQuestions.length);
      setQuestionNumber(questionNumber);
      setQuestionBody(simpleQuestions[questionNumber].question);
      setOption1(simpleQuestions[questionNumber].option1);
      setOption2(simpleQuestions[questionNumber].option2);
    };

    loadQuestions();
  }, [questionNumber]);

  const nextQuestion = (selectedOption: string) => {
    setCurrentQuestionNumber(currentQuestionNumber + 1);
    if (questionNumber < numberOfQuestions - 1) {
      questions[questionNumber].answer = selectedOption;
      setBackButtonDisabled(false);
      const nextQuestion = questionNumber + 1;
      setQuestionNumber(nextQuestion);
      //setColor(colors[Math.floor(Math.random() * colors.length)])
      setQuestionBody(questions[nextQuestion].question);
      setOption1(questions[nextQuestion].option1);
      setOption2(questions[nextQuestion].option2);
    } else {
      // End of quiz...
      window.alert("You've completed the Simple Quiz!");
      setQuestionBody("You have completed the quiz!");
      simpleQuestionQuizCompleted = questions;
      let nextButton = document.getElementById("nextButton");
      if (nextButton != null) {
        nextButton.classList.remove("Button-visible-true");
        nextButton.classList.add("Button-visible-false");
      }
      let reportButton = document.getElementById("reportButton");
      if (reportButton != null) {
        reportButton.classList.remove("Button-visible-false");
        reportButton.classList.add("Button-visible-true");
      }
    }
  };

  const previousQuestion = () => {
    if (questionNumber >= 0) {
      setCurrentQuestionNumber(currentQuestionNumber - 1);
      if (questionBody === "You have completed the quiz!") {
        let nextButton = document.getElementById("nextButton");
        if (nextButton != null) {
          nextButton.classList.remove("Button-visible-false");
          nextButton.classList.add("Button-visible-true");
        }
        let reportButton = document.getElementById("reportButton");
        if (reportButton != null) {
          reportButton.classList.remove("Button-visible-true");
          reportButton.classList.add("Button-visible-false");
        }
        setQuestionBody(questions[questionNumber].question);
        setOption1(questions[questionNumber].option1);
        setOption2(questions[questionNumber].option2);
      } else {
        const previousQuestion = questionNumber - 1;
        setQuestionNumber(previousQuestion);
        //setColor(colors[Math.floor(Math.random() * colors.length)])
        setQuestionBody(questions[previousQuestion].question);
        setOption1(questions[previousQuestion].option1);
        setOption2(questions[previousQuestion].option2);
        if (questionNumber === 1) {
          setBackButtonDisabled(true);
        }
      }
    }
  };

  return (
    <div className={bodyClassName} id="bigBody">
      <header className="General-header">
        <span className="Header-toggle">
          <DarkModeToggle></DarkModeToggle>
        </span>
        <span>The Career Lab</span>
        <span className="Header-button">
          <LinkButton to="/" label="Home"></LinkButton>
        </span>{" "}
      </header>

      <div className="Simple-body">
        <span className="Simple-back-top">
          <Button
            className="Button-back"
            onClick={previousQuestion}
            disabled={backButtonDisabled}
          >
            Back
          </Button>
        </span>
        <div className="Simple-progress">
          <div
            className="Simple-progress-outer"
            style={{ backgroundColor: color }}
          >
            <div
              className="Simple-progress-inner"
              style={{
                width: `${
                  100 * ((currentQuestionNumber - 1) / numberOfQuestions)
                }%`,
                backgroundColor: "rgba(0, 0, 0, 0.3)",
              }}
            ></div>
            Question {questionNumber + 1}/{numberOfQuestions}
            <div className="Simple-progress-percentage">
              {Math.round(
                100 * ((currentQuestionNumber - 1) / numberOfQuestions)
              )}
              % completed
            </div>
          </div>
        </div>
        <div className="Simple-question">
          <div style={{ padding: "10px", backgroundColor: color }}>
            {questionBody}
          </div>
        </div>
        <div className="Simple-buttons">
          <span className="Button-visible-true" id="nextButton">
            <span className="Simple-option-1">
              <Button
                className="Button-next"
                onClick={() => nextQuestion(option1)}
              >
                {option1}
              </Button>
            </span>
            <span className="Simple-option-2">
              <Button
                className="Button-next-2"
                onClick={() => nextQuestion(option2)}
              >
                {option2}
              </Button>
            </span>
          </span>
          <span className="Button-visible-false" id="reportButton">
            <span>
              <p className="Button-report" style={{ paddingTop: "40px" }}>
                <LinkButton to="/simplereport" label="Report"></LinkButton>
              </p>
            </span>
          </span>
        </div>
      </div>

      <div className="API-Footer">
        <Form>
          <Form.Label>API Key:</Form.Label>
          <Form.Control
            type="password"
            placeholder="Insert API Key Here"
            onChange={changeKey}
          ></Form.Control>
          <br></br>
          <Button className="Submit-Button" onClick={handleSubmit}>
            Submit
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default SimpleQuestions;
