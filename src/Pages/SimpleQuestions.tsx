import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { LinkButton } from "../Components/LinkButton";
import { themeState } from "../Components/ThemeParent";
import { ThemeSelect } from "../Components/ThemeSelect";
import { SimpleQuestion } from "../QuestionData/SimpleQuestion";
import { AudioPlayer, playButtonClick } from "../Components/AudioPlayer";
import jsonData from "../QuestionData/SimpleQuestions.json";
import "../Formatting/General.css";
import "../Formatting/Questions.css";
import "../Formatting/SimpleQuestions.css";
// Imports for images
import Image1 from "../Images/Simple-Question-1.jpg";
import Image2 from "../Images/Simple-Question-2.jpg";
import Image3 from "../Images/Simple-Question-3.jpg";
import Image4 from "../Images/Simple-Question-4.jpg";
import Image5 from "../Images/Simple-Question-5.jpg";
import Image6 from "../Images/Simple-Question-6.jpg";
import Image7 from "../Images/Simple-Question-7.jpg";
import Image8 from "../Images/Simple-Question-8.jpg";
import Image9 from "../Images/Simple-Question-9.jpg";
import Image10 from "../Images/Simple-Question-10.jpg";
import Image11 from "../Images/Simple-Question-11.jpg";
import Image12 from "../Images/Simple-Question-12.jpg";
import Image13 from "../Images/Simple-Question-13.jpg";
import Image14 from "../Images/Simple-Question-14.jpg";
import Image15 from "../Images/Simple-Question-15.jpg";
import EndOfQuizImage from "../Images/End-Quiz.jpg";
// Store images in an array to cycle through
const questionImages = [
  Image1,
  Image2,
  Image3,
  Image4,
  Image5,
  Image6,
  Image7,
  Image8,
  Image9,
  Image10,
  Image11,
  Image12,
  Image13,
  Image14,
  Image15,
  EndOfQuizImage,
];

//local storage and API Key: key should be entered in by the user and will be stored in local storage (NOT session storage)
let keyData = "";
const saveKeyData = "MYKEY";
const prevKey = localStorage.getItem(saveKeyData); //so it'll look like: MYKEY: <api_key_value here> in the local storage when you inspect
if (prevKey !== null) {
  keyData = JSON.parse(prevKey);
}

let simpleQuestionQuizCompleted: SimpleQuestion[] = [];
// Function used to export question data so it can be used on the SimpleReport page
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

  // State variables for question data
  const [questions, setQuestions] = useState<SimpleQuestion[]>([]);
  const [numberOfQuestions, setNumberOfQuestions] = useState(15);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
  const [questionBody, setQuestionBody] = useState("Question...");
  const [option1, setOption1] = useState("Option 1...");
  const [option2, setOption2] = useState("Option 2...");
  const [backButtonDisabled, setBackButtonDisabled] = useState(true);

  // useEffect is called when page loads.
  // Initialize everything with appropriate question data to start the quiz.
  useEffect(() => {
    playButtonClick();
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

  // Function that is called to advance to the next question by iterating forward though the
  // question array and updating all properties.
  const nextQuestion = (selectedOption: string) => {
    // currentQuestionNumber displays current question. questionNumber is iteration in array.
    setCurrentQuestionNumber(currentQuestionNumber + 1);
    if (questionNumber < numberOfQuestions - 1) {
      // Not the end of the quiz so iterate.
      questions[questionNumber].answer = selectedOption;
      setBackButtonDisabled(false);
      const nextQuestion = questionNumber + 1;
      setQuestionNumber(nextQuestion);
      setQuestionBody(questions[nextQuestion].question);
      setOption1(questions[nextQuestion].option1);
      setOption2(questions[nextQuestion].option2);
    } else {
      // End of quiz...
      setQuestionBody("You have completed the quiz!");
      simpleQuestionQuizCompleted = questions;
      // Hide option buttons
      let nextButton = document.getElementById("nextButton");
      if (nextButton != null) {
        nextButton.classList.remove("Button-visible-true");
        nextButton.classList.add("Button-visible-false");
      }
      // Show "Report" button
      let reportButton = document.getElementById("reportButton");
      if (reportButton != null) {
        reportButton.classList.remove("Button-visible-false");
        reportButton.classList.add("Button-visible-true");
      }
    }
  };

  // Function that is called to backtrack to the previous question by iterating backwards though the
  // question array and updating all properties.
  const previousQuestion = () => {
    // Check if you are not on the first question.
    if (questionNumber >= 0) {
      // currentQuestionNumber displays current question. questionNumber is iteration in array.
      setCurrentQuestionNumber(currentQuestionNumber - 1);
      if (questionBody === "You have completed the quiz!") {
        // Show the option buttons
        let nextButton = document.getElementById("nextButton");
        if (nextButton != null) {
          nextButton.classList.remove("Button-visible-false");
          nextButton.classList.add("Button-visible-true");
        }
        // Hide the "Report" button
        let reportButton = document.getElementById("reportButton");
        if (reportButton != null) {
          reportButton.classList.remove("Button-visible-true");
          reportButton.classList.add("Button-visible-false");
        }
        // Update properties displayed
        setQuestionBody(questions[questionNumber].question);
        setOption1(questions[questionNumber].option1);
        setOption2(questions[questionNumber].option2);
      } else {
        // Not on last question, so simply iterate.
        const previousQuestion = questionNumber - 1;
        setQuestionNumber(previousQuestion);
        setQuestionBody(questions[previousQuestion].question);
        setOption1(questions[previousQuestion].option1);
        setOption2(questions[previousQuestion].option2);
        if (questionNumber === 1) {
          // On the first question, so you can't go back anymore.
          setBackButtonDisabled(true);
        }
      }
    }
  };

  return (
    <div className={themeState} id="bigBody">
      <div className="Header-general" id="Header-Full">
        <span className="Header-toggle">
          <ThemeSelect></ThemeSelect>
        </span>
        <span className="Header-text">The Career Lab</span>
        <span className="Header-Audio">
          <AudioPlayer></AudioPlayer>
        </span>
        <span className="Header-button">
          <LinkButton to="/" label="Home"></LinkButton>
        </span>
      </div>

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
          <div className="Simple-progress-outer">
            <div
              className="Simple-progress-inner"
              style={{
                width: `${
                  100 * ((currentQuestionNumber - 1) / numberOfQuestions)
                }%`,
              }}
            ></div>
            <div className="Simple-question-number">
              {currentQuestionNumber === 16
                ? "Quiz Complete!"
                : "Question " + currentQuestionNumber}
              {currentQuestionNumber === 16 ? "" : "/" + numberOfQuestions}
            </div>
            <div className="Simple-progress-percentage">
              {Math.round(
                100 * ((currentQuestionNumber - 1) / numberOfQuestions)
              )}
              % completed
            </div>
          </div>
        </div>
        <div className="Simple-textSpace">
          <img
            src={questionImages[currentQuestionNumber - 1]}
            alt="Not Available..."
            width="600"
            height="354"
            style={{ borderRadius: "10px" }}
          />
          <div className="Simple-question-body">{questionBody}</div>
          <div className="Simple-buttons">
            <span className="Button-visible-true" id="nextButton">
              <span className="Simple-option-1">
                <Button
                  className="Button-next"
                  onClick={() => nextQuestion(option1)}
                  style={{
                    position: "absolute",
                    width: "calc(50% - 5px)",
                    left: "0",
                    margin: "0",
                    padding: "10px",
                  }}
                >
                  {option1}
                </Button>
              </span>
              <span className="Simple-option-2">
                <Button
                  className="Button-next-2"
                  onClick={() => nextQuestion(option2)}
                  style={{
                    position: "absolute",
                    width: "calc(50% - 5px)",
                    margin: "0",
                    padding: "10px",
                    left: "calc(50% + 5px)",
                  }}
                >
                  {option2}
                </Button>
              </span>
            </span>
            <span className="Button-visible-false" id="reportButton">
              <span className="Button-report">
                <LinkButton to="/simplereport" label="Report"></LinkButton>
              </span>
            </span>
          </div>
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
