import React, { useState } from "react";
import OpenAIAPi from "openai";
import { Button, Form, Spinner } from "react-bootstrap";
import { LinkButton } from "../Components/LinkButton";
import { themeState } from "../Components/ThemeParent";
import { ThemeSelect } from "../Components/ThemeSelect";
import { DetailedQuestion } from "../QuestionData/DetailedQuestion";
import { slidenums } from "./DetailedQuestions";
import jsonData from "../QuestionData/DetailedQuestions.json";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Formatting/General.css";
import "../Formatting/Report.css";

//local storage and API Key: key should be entered in by the user and will be stored in local storage (NOT session storage)
let keyData = "";
const saveKeyData = "MYKEY";
const prevKey = localStorage.getItem(saveKeyData); //so it'll look like: MYKEY: <api_key_value here> in the local storage when you inspect
if (prevKey !== null) {
  keyData = JSON.parse(prevKey);
}

function DetailedReport() {
  const [key, setKey] = useState<string>(keyData); //for api key input
  const [loading, setLoading] = useState(false);

  //sets the local storage item to the api key the user inputed
  function handleSubmit() {
    localStorage.setItem(saveKeyData, JSON.stringify(key));
    window.location.reload(); //when making a mistake and changing the key again, I found that I have to reload the whole site before openai refreshes what it has stores for the local storage variable
  }

  function changeKey(event: React.ChangeEvent<HTMLInputElement>) {
    setKey(event.target.value);
  }

  //gets all 30 questions into an array from DetailedQuestions.json
  const getQuestions = () => {
    const parsedData = JSON.parse(JSON.stringify(jsonData));
    const detailedQuestions: DetailedQuestion[] = parsedData.DETAILED_QUESTIONS;
    return detailedQuestions.map((x) => x.question);
  };

  const joinQuestionsToAnswers = () => {
    return getQuestions().map((x, i) => {
      return x + ": " + slidenums[i] + " ";
    });
  };

  const userData =
    "I have rated these questions from 0 to 100 (100 being I strongly agree and 0 being strongly disagree)" +
    joinQuestionsToAnswers();

  const exampleFormat =
    "~Sample Career: 2-3 sentences of why this is a good fit~Another Sample Career: 2-3 sentences of why this is a good fit~Final Sample Career: 2-3 sentences of why this is a good fit";

  let UserRolePrompt = "What should my career be? " + userData;
  let GPTRole =
    "You are a helpful career advisor. You will be provided a students result to a career quiz. Provide a list of 3 careers, with '~' as the bulletpoint. Here is the example format" +
    exampleFormat +
    "Include the tilda (~) in the report string, it is important.";

  function setPrompt(newUserPrompt: string, newGPTPrompt: string) {
    UserRolePrompt = newUserPrompt;
    GPTRole = newGPTPrompt;
  }


  function optionOne(career: string) {
    setPrompt(
      "Expand on this career option you gave me: " + career,
      "The user would like to explore the first career option you gave. Please provide more details (2 paragraphs) on a single career the user provides"
    );
    ChatGPT();
  }
//Creates ChatGPT
    const openai = new OpenAIAPi({
      apiKey: keyData,
      dangerouslyAllowBrowser: true,
    });
  const [responseData, setResponseData] = useState<string>(""); //Stores ChatGPTs response
  const [careerList, setCareerList] = useState<Array<string>>(responseData.split("~")); //splits the careers for easy formatting
  
  const changeResponseData = (data: string) => {
    setResponseData(data);
  }

  //Queries ChatGPT to generate report
  async function ChatGPT() {
    setLoading(true);
    
    //Queries ChatGPT
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: GPTRole,
        },
        { role: "user", content: UserRolePrompt },
      ],
      model: "gpt-3.5-turbo",
    });
    //Stores response data
    if (completion.choices[0].message.content !== null) {
      changeResponseData(completion.choices[0].message.content);
      
      setCareerList(completion.choices[0].message.content.split("~"));
      
    } else {
      setResponseData("Error! Maybe you forgot to input the API key?");
    }
    setLoading(false);
    //console.log("responseData: "+ responseData);
    //console.log("careerList: "+ careerList);
  }

  
  //const [careerList, setCareerList] = useState<Array<string>>(responseData.split("~"));

  const generateReport = async() => {
    await ChatGPT();
    //setCareerList(responseData.split("~"));
  }
  

  return (
    <div className={themeState} id="bigBody">
      <div className="General-header">
        <span className="Header-toggle">
          <ThemeSelect></ThemeSelect>
        </span>
        <span className="Header-text">The Career Lab</span>
        <span className="Header-button">
          <LinkButton to="/" label="Home"></LinkButton>
        </span>
      </div>

      <div className="Page-body">
        <div className="Report-space">
          <div className="Report-header">View your Detailed Quiz Results!</div>
          <Form className="Report-body">
            <Button className="Button-chatGPT" onClick={generateReport}>
              Generate Report
            </Button>
          </Form>
          {loading && (
            <div>
              <Spinner animation="border" role="status">
                <span className="sr-only"></span>
              </Spinner>
              <p>Generating Your Results...</p>
            </div>
          )}
          {!loading && careerList.length >= 3 && (
            <div className="Report-results">
              Based on your results:
              <div>
                <br />
                <span className="Report-results-header">Career 1:</span>
                <li>{careerList[1]}</li>
                <br />
                <span className="Report-results-header">Career 2:</span>
                <li>{careerList[2]}</li>
                <br />
                <span className="Report-results-header">Career 3:</span>
                <li>{careerList[3]}</li>
              </div>
            </div>
          )}
          {!loading && careerList.length < 3 && <div>{responseData}</div>}
          <Button className="Report-button-explore" onClick={() => optionOne(careerList[1])}>
            Explore Career 1
          </Button>
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

export default DetailedReport;
