import React, { useState } from 'react';
import './App.css';
import './General.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';

//local storage and API Key: key should be entered in by the user and will be stored in local storage (NOT session storage)
let keyData = "";
const saveKeyData = "MYKEY";
const prevKey = localStorage.getItem(saveKeyData); //so it'll look like: MYKEY: <api_key_value here> in the local storage when you inspect
if (prevKey !== null) {
  keyData = JSON.parse(prevKey);
}

function App() {
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
  
  //Changes page to the basic questions page
  function moveToBasic(): void {
      //Change to basic page here
  }

  //Changes page to the detailed questions page
  function moveToDetailed(): void {
    //Change to detailed page here
}

  return (
    <div className='Home Page'>
      <header className="App-header"> The Career Lab </header>   
      <div className="page-body">
        <Container className="white-background">
          <Row>
          <Col>
              <Button className='basic-button' style={{height: '7vh', width : '50vh', fontSize : "3vh"}} onClick={moveToBasic}>Basic Quiz</Button>
              <p>
                This is a basic quiz with X questions.
              </p>
              <p>
                It will take around Y to Z minutes to complete.
              </p>
              <p>
                The questions are simple and multiple choice.
              </p>
            </Col>
            <Col>
              <Button className='detailed-button' style={{height: '7vh', width : '50vh', fontSize : "3vh"}} onClick={moveToDetailed}>Detailed Quiz</Button>
              <p>
              This is a detailed quiz with X questions.
              </p>
              <p>
              It will take around Y to Z minutes to complete.
              </p>
              <p>
              The questions are answered on a scale.
              </p>
            </Col>
          </Row>
        </Container>
      </div>
      
      <div className="footer">
      <Form>
        <Form.Label>API Key:</Form.Label>
        <Form.Control type="password" placeholder="Insert API Key Here" onChange={changeKey}></Form.Control>
        <br></br>
        <Button className="Submit-Button" onClick={handleSubmit}>Submit</Button>
      </Form>
      </div>
    </div>
  );
}

export default App;