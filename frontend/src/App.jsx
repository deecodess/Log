import { useEffect, useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import './App.css';

function App() {
  const [changelogs, setChangelogs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchChangelogs();
  }, []);

  const fetchChangelogs = async () => {
    try {
      const backendUrl = import.meta.env.VITE_REACT_BACKEND_URL || 'http://localhost:5000/api/changelogs';
      const response = await axios.get(backendUrl);
      setChangelogs(response.data);
    } catch {
      setError('Failed to load changelogs.');

  };
}

  const technicalWords = ["refactor", "optimize", "bug", "fix", "performance", "deployment", "security", "patch"];

  const highlightTechnicalWords = (text) => {
    const regex = new RegExp(`\\b(${technicalWords.join('|')})\\b`, 'gi');
    return text.replace(regex, (match) => `<span class="highlight">${match}</span>`);
  };

  const renderMarkdownWithHighlight = ({ children }) => {
    const text = Array.isArray(children) ? children.join('') : children;
    const highlightedText = highlightTechnicalWords(text);
    return <p dangerouslySetInnerHTML={{ __html: highlightedText }} />;
  };

  return (
    <div className="changelog-container">
      <h1 className="changelog-title">
        Log<span className="title-dot"></span>
      </h1>
      <p className="tagline">Automating your changelogs</p>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {changelogs.length > 0 ? (
          changelogs.map((log, index) => (
            <li key={index} className="changelog-item">
              <div className="changelog-item-header">
                <div className="changelog-item-date">
                  {new Date(log.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
                <div className="changelog-item-tag">Changelog</div>
              </div>
              <ReactMarkdown
                className="changelog-item-summary"
                components={{
                  p: renderMarkdownWithHighlight,
                }}
              >
                {log.summary}
              </ReactMarkdown>
            </li>
          ))
        ) : (
          <p>No changelogs available.</p>
        )}
      </ul>
    </div>
  );
}


export default App;
