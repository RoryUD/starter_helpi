import React, { useState } from 'react';
import axios from 'axios';
import { keyData } from './APIFooter';

const OpenAIRequest = () => {
  const [response, setResponse] = useState('');

  const generateResponse = async () => {
    let APIKey = keyData;
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/engines/davinci-codex/completions',
        {
          prompt: 'How do I create a React component?',
          max_tokens: 100,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${APIKey}`,
          },
        }
      );

      setResponse(response.data.choices[0].text);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <button onClick={generateResponse}>Generate Response</button>
      <p>{response}</p>
    </div>
  );
};

export default OpenAIRequest;