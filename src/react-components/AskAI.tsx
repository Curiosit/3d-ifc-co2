import React, { useEffect, useRef, useState } from 'react';

// Assuming `env` is defined elsewhere in your application
const env = 'p'; // Placeholder value

const apiAIUrl = 'https://cyz7bkwwhl.execute-api.us-west-2.amazonaws.com/production/';

const fullApiPath = apiAIUrl

export const AskAI: React.FC<{ question: string, show: boolean }> = ({ question, show }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [response, setResponse] = useState('');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = '0px'; // Reset height to recalculate correctly below
      const scrollHeight = textAreaRef.current.scrollHeight;
      textAreaRef.current.style.height = `${scrollHeight}px`;
    }
  }, [response]); 


  const eventAskAI = async () => {
    let description = question
    const apiAIUrl = `${fullApiPath}askai`;
    const ask = `${description}`;
    console.log(`Prompt: ${ask}`);
    const jsonQuestion = JSON.stringify({ "question": ask });
    setResponse("SLAD.AI is analyzing Your design. Please wait...");

    try {
      const response = await fetch(apiAIUrl, {
        method: 'POST',
        body: jsonQuestion,
        headers: { 'Content-Type': 'application/json' },
      });
      const body = await response.text();
      console.log(body);
      setResponse(body);
    } catch (error) {
      console.error(error);
      setResponse("Error contacting the AI service.");
    }
  };

  const handleButtonClick = () => {
    if (show) {
      setIsModalOpen(true);
      eventAskAI(); 
    }
  };

  return (
    <div >
      <button className="btn-ai" type="button" onClick={handleButtonClick}>
        <span className="material-symbols-rounded">
          smart_toy
        </span>
        Ask AI
      </button>
      {isModalOpen && show && (
        <textarea
          name="response"
          ref={textAreaRef}
          placeholder="Response will be shown here..."
          value={response}
          readOnly
          style={{ marginTop: '10px', width: '100%', boxSizing: 'border-box'}}
        />
      )}
    </div>
  );
};
