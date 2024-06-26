import React from "react";
import { Form } from "react-bootstrap";
import { playSliderSetUp, playSliderSetDown } from "../Components/AudioPlayer";
import "../Formatting/General.css";
import "../Formatting/DetailedQuestions.css";

interface DetailedQuestionProps {
  label: string;
  question: string;
  value: number;
  onChange: React.Dispatch<React.SetStateAction<number>>;
}
//Slider question component used on the detailed questions page
export function SliderQuestion(props: DetailedQuestionProps) {
  function updateSliderValue(event: React.ChangeEvent<HTMLInputElement>) {
    var newValue = parseInt(event.target.value);
    var oldValue = props.value;
    if (newValue >= oldValue) {
      playSliderSetUp();
    } else {
      playSliderSetDown();
    }
    props.onChange(newValue);
  }
  //Slider formatted using the detailed questions css
  return (
    <div className="DetailedQuestions-slider" role="form">
      <p className="Slider-questions">{props.question}</p>
      <p className="Slider-text">Strongly Agree</p>
      <Form.Range
        className="Slider-slider"
        role="Slider-slider"
        value={props.value}
        onChange={updateSliderValue}
      />
      <p className="Slider-text">Strongly Disagree</p>
      <p className="Slider-value">{props.value}</p>
    </div>
  );
}
