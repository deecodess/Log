import React, { useState } from 'react';

function App() {
  const [inputText, setInputText] = useState("");
  const [generatedText, setGeneratedText] = useState("");

  const handleGenerate = async () => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080/generate';
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: inputText }),
    });
    const data = await response.json();
    setGeneratedText(data.generated_text || data.text); 
  };

  return (
    <div>
      <h1>Text Generation with GPT-Neo</h1>
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <button onClick={handleGenerate}>Generate Text</button>
      <div>
        <h2>Generated Text:</h2>
        <p>{generatedText}</p>
      </div>
    </div>
  );
}

export default App;
