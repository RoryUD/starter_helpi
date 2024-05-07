import React, { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { LinkButton } from "../Components/LinkButton";
import { themeState } from "../Components/ThemeParent";
import { ThemeSelect } from "../Components/ThemeSelect";
//import 123 from "../Audio/123.mp3";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Formatting/General.css";
import "../Formatting/Home.css";

//local storage and API Key: key should be entered in by the user and will be stored in local storage (NOT session storage)
let keyData = "";
const saveKeyData = "MYKEY";
const prevKey = localStorage.getItem(saveKeyData); //so it'll look like: MYKEY: <api_key_value here> in the local storage when you inspect
if (prevKey !== null) {
  keyData = JSON.parse(prevKey);
}

function Home() {
  const [key, setKey] = useState<string>(keyData); //for api key input

  //sets the local storage item to the api key the user inputed
  function handleSubmit() {
    localStorage.setItem(saveKeyData, JSON.stringify(key));
    window.location.reload(); //when making a mistake and changing the key again, I found that I have to reload the whole site before openai refreshes what it has stores for the local storage variable
  }

  function changeKey(event: React.ChangeEvent<HTMLInputElement>) {
    setKey(event.target.value);
  }

  return (
    <div className={themeState} id="bigBody">
      <div className="Header-general" id="Header-Full">
        <span className="Header-toggle">
          <ThemeSelect></ThemeSelect>
        </span>
        <span className="Header-text">The Career Lab</span>
        <span className="Header-button">
          <LinkButton to="/" label="Home"></LinkButton>
        </span>
      </div>

      <div className="Page-body">
        <Container>
          <Row>
            <div className="Home-body">
              <img
                src="https://img.freepik.com/free-vector/flat-laboratory-room-with-microscope_23-2148885022.jpg?w=1480&t=st=1714680547~exp=1714681147~hmac=d379d0ea435a9f15edcacf0bca29ae324baaec7273b9e4545a3906992e2115be"
                alt="Science Laboratory"
                width="628px"
                height="417px"
                style={{ padding: "10px", borderRadius: "20px" }}
              />
              <p>
                Welcome to the Career Lab! We have two quizzes you can take to
                help find your ideal career. Your answers will be reviewed by
                ChatGPT to generate a custom report of what caeer paths suit you
                the best. This project created by: Alex Hoy, Connor Jackson,
                Ryan Jones, and Rory Jordan.
              </p>
            </div>
          </Row>
          <Row>
            <Col className="Home-text-basic">
              <div>
                <img
                  src="/Images/Home-Page-Basic-Quiz-Picture.jpg"
                  alt="Simple Science Experiment"
                  width="400px"
                  height="287px"
                  style={{ padding: "10px", borderRadius: "20px" }}
                />
                <p className="Home-button">
                  <LinkButton
                    to="simplequestions"
                    label="Basic Quiz"
                  ></LinkButton>
                </p>
                This is a basic quiz with 15 questions. <br></br> It will take
                around 5 to 10 minutes to complete. <br></br> The questions are
                simple and multiple choice.
              </div>
            </Col>
            <Col className="Home-text-detailed">
              <div>
                <img
                  src="/Images/Home-Page-Detailed-Quiz-Picture.jpg"
                  alt="Complex Science Experiment"
                  width="400px"
                  height="287px"
                  style={{ padding: "10px", borderRadius: "20px" }}
                />
                <p className="Home-button">
                  <LinkButton
                    to="detailedquestions"
                    label="Detailed Quiz"
                  ></LinkButton>
                </p>
                This is a detailed quiz with 30 questions. <br></br> It will
                take around 10 to 15 minutes to complete. <br></br> The
                questions are answered on a scale.
              </div>
            </Col>
          </Row>
        </Container>
        <audio controls>
          <source src="../Audio/123.mp3" type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
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

export default Home;
