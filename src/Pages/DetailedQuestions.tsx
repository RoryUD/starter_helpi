import React, { useState, useEffect } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Header } from "../Components/Header";
import { LinkButton } from "../Components/LinkButton";
import { themeState } from "../Components/StateParent";
import { DetailedQuestion } from "../QuestionData/DetailedQuestion";
import { SliderQuestion } from "../Components/SliderQuestion";
import { playButtonClick } from "../Components/AudioPlayer";
import jsonData from "../QuestionData/DetailedQuestions.json";
import "../Formatting/General.css";
import "../Formatting/Questions.css";
import "../Formatting/DetailedQuestions.css";

// Image imports
// Images 1-10
import Image1 from "../Images/Detailed-Question-1.jpg";
import Image2 from "../Images/Detailed-Question-2.jpg";
import Image3 from "../Images/Detailed-Question-3.jpg";
import Image4 from "../Images/Detailed-Question-4.jpg";
import Image5 from "../Images/Detailed-Question-5.jpg";
import Image6 from "../Images/Detailed-Question-6.jpg";
import Image7 from "../Images/Detailed-Question-7.jpg";
import Image8 from "../Images/Detailed-Question-8.jpg";
import Image9 from "../Images/Detailed-Question-9.jpg";
import Image10 from "../Images/Detailed-Question-10.jpg";
// Images 11-20
import Image11 from "../Images/Detailed-Question-11.jpg";
import Image12 from "../Images/Detailed-Question-12.jpg";
import Image13 from "../Images/Detailed-Question-13.jpg";
import Image14 from "../Images/Detailed-Question-14.jpg";
import Image15 from "../Images/Detailed-Question-15.jpg";
import Image16 from "../Images/Detailed-Question-16.jpg";
import Image17 from "../Images/Detailed-Question-17.jpg";
import Image18 from "../Images/Detailed-Question-18.jpg";
import Image19 from "../Images/Detailed-Question-19.jpg";
import Image20 from "../Images/Detailed-Question-20.jpg";
// Images 21-30
import Image21 from "../Images/Detailed-Question-21.jpg";
import Image22 from "../Images/Detailed-Question-22.jpg";
import Image23 from "../Images/Detailed-Question-23.jpg";
import Image24 from "../Images/Detailed-Question-24.jpg";
import Image25 from "../Images/Detailed-Question-25.jpg";
import Image26 from "../Images/Detailed-Question-26.jpg";
import Image27 from "../Images/Detailed-Question-27.jpg";
import Image28 from "../Images/Detailed-Question-28.jpg";
import Image29 from "../Images/Detailed-Question-29.jpg";
import Image30 from "../Images/Detailed-Question-30.jpg";
// End of Quiz
import EndOfQuizImage from "../Images/End-Quiz.jpg";

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
  Image16,
  Image17,
  Image18,
  Image19,
  Image20,
  Image21,
  Image22,
  Image23,
  Image24,
  Image25,
  Image26,
  Image27,
  Image28,
  Image29,
  Image30,
  EndOfQuizImage,
];

//local storage and API Key: key should be entered in by the user and will be stored in local storage (NOT session storage)
let keyData = "";
const saveKeyData = "MYKEY";
const prevKey = localStorage.getItem(saveKeyData); //so it'll look like: MYKEY: <api_key_value here> in the local storage when you inspect
if (prevKey !== null) {
  keyData = JSON.parse(prevKey);
}

//Exports question data
export let slidenums = new Array<number>(30).fill(50);

function DetailedQuestions() {
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

  //State variables for question data
  const [sliderValues, setSliderValues] = useState<number[]>(slidenums);
  const [currSliderValue, setCurrSliderValue] = useState<number>(50);
  const [questions, setQuestions] = useState<DetailedQuestion[]>([]);
  const [numberOfQuestions] = useState(30);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [questionBody, setQuestionBody] = useState("Question...");
  const [backButtonDisabled, setBackButtonDisabled] = useState(true);

  // useEffect is called when page loads.
  // Initialize everything with appropriate question data to start the quiz.
  useEffect(() => {
    playButtonClick();
    const loadQuestions = () => {
      const parsedData = JSON.parse(JSON.stringify(jsonData));
      const detailedQuestions: DetailedQuestion[] =
        parsedData.DETAILED_QUESTIONS;
      setQuestions(detailedQuestions);
      if (detailedQuestions[questionNumber] !== undefined) {
        setQuestionBody(detailedQuestions[questionNumber].question);
      }
    };
    loadQuestions();
  }, [questionNumber]);

  // Function that is called to advance to the next question by iterating forward though the
  // question array and updating all properties.
  const nextQuestion = () => {
    // currentQuestionNumber displays current question. questionNumber is iteration in array.
    let tempSliderValues = [...sliderValues];
    tempSliderValues[questionNumber] = currSliderValue;
    questions[questionNumber].answer = currSliderValue.toString();
    setSliderValues(() => [...tempSliderValues]);
    if (questionNumber < numberOfQuestions - 1) {
      // Not the end of the quiz so iterate.
      setCurrSliderValue(sliderValues[questionNumber + 1]);
      setQuestionBody(questions[questionNumber + 1].question);
      setQuestionNumber(questionNumber + 1);
      setBackButtonDisabled(false);
    } else {
      // End of quiz...
      setQuestionBody("You have completed the quiz!");
      setQuestionNumber(30);
      slidenums = [...sliderValues];
      let nextButton = document.getElementById("nextButton");
      // Hide option buttons
      if (nextButton != null) {
        nextButton.classList.remove("Button-visible-true");
        nextButton.classList.add("Button-visible-false");
      }
      let slider = document.getElementById("sliderQuestion");
      if (slider != null) {
        slider.classList.remove("Slider-visible-true");
        slider.classList.add("Slider-visible-false");
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
    let tempSliderValues = [...sliderValues];
    tempSliderValues[questionNumber] = currSliderValue;
    setSliderValues(() => [...tempSliderValues]);
    // Check if you are not on the first question.
    if (questionNumber > 0) {
      // currentQuestionNumber displays current question. questionNumber is iteration in array.
      setCurrSliderValue(sliderValues[questionNumber - 1]);
      const previousQuestionIndex = questionNumber - 1;
      setQuestionBody(questions[previousQuestionIndex].question);
      setQuestionNumber(previousQuestionIndex);
      if (previousQuestionIndex === 0) {
        setBackButtonDisabled(true);
      }
      if (questionNumber === numberOfQuestions) {
        // Sets the visibility of the buttons
        let nextButton = document.getElementById("nextButton");
        if (nextButton != null) {
          nextButton.classList.remove("Button-visible-false");
          nextButton.classList.add("Button-visible-true");
        }
        let slider = document.getElementById("sliderQuestion");
        if (slider != null) {
          slider.classList.remove("Slider-visible-false");
          slider.classList.add("Slider-visible-true");
        }
        let reportButton = document.getElementById("reportButton");
        if (reportButton != null) {
          reportButton.classList.remove("Button-visible-true");
          reportButton.classList.add("Button-visible-false");
        }
      }
    }
  };

  return (
    <div className={themeState} id="bigBody">
      <Header></Header>

      <div className="Page-body">
        <Container>
          <Row>
            <Col className="DetailedQuestions-questions">
              <img
                className="DetailedQuestions-images"
                src={questionImages[questionNumber]}
                alt="Not Available..."
                width="600"
                height="354"
              />
              <div className="Slider-whole" id="sliderQuestion">
                <SliderQuestion
                  value={currSliderValue}
                  onChange={setCurrSliderValue}
                  label="Question: "
                  question={questionBody}
                ></SliderQuestion>
              </div>
              <span className="DetailedQuestions-buttons">
                <span className="BackButtonSpan">
                  <Button
                    className="Button-back"
                    onClick={previousQuestion}
                    disabled={backButtonDisabled}
                    style={{
                      position: "absolute",
                      width: "calc(50% - 5px)",
                      left: "0",
                      margin: "0",
                      padding: "10px",
                    }}
                  >
                    Back
                  </Button>
                </span>
                <span className="Button-visible-true" id="nextButton">
                  <Button
                    className="Button-next"
                    onClick={() => nextQuestion()}
                    style={{
                      position: "absolute",
                      width: "calc(50% - 5px)",
                      margin: "0",
                      padding: "10px",
                      left: "calc(50% + 5px)",
                    }}
                  >
                    Next
                  </Button>
                </span>
                <span className="Button-visible-false" id="reportButton">
                  <span className="Button-report">
                    <LinkButton
                      to="/detailedreport"
                      label="Report"
                      classNameGive="DetailedQuestions-report"
                    ></LinkButton>
                  </span>
                </span>
              </span>
            </Col>
            <Col className="Detailed-Questions-Progress-Bar">
              <div className="DetailedQuestions-progress-bar">
                <div
                  className="DetailedQuestions-progress-bar-foreground"
                  style={{
                    height: `${100 * (questionNumber / numberOfQuestions)}%`,
                  }}
                ></div>
                <span className="DetailedQuestions-question-number">
                  {questionNumber === 30
                    ? "Quiz Complete!"
                    : "Question " + (questionNumber + 1)}
                  {questionNumber === 30 ? "" : "/" + numberOfQuestions}
                </span>
                <span className="DetailedQuestions-progress-bar-percentage">
                  {Math.trunc(100 * (questionNumber / numberOfQuestions))}%
                  completed
                </span>
              </div>
            </Col>
          </Row>
        </Container>
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
export default DetailedQuestions;
