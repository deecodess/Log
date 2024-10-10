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
      console.log('Fetching from:', backendUrl);
      const response = await axios.get(backendUrl);
      console.log('Changelogs response:', response.data);

      setChangelogs(response.data);
    } catch (error) {
      console.error('Error fetching changelogs:', error);
      setError('Failed to load changelogs.');
    }
  };


  return (
    <div className="changelog-container">
      <h1 className="changelog-title">
        Log<span className="title-dot"></span>
      </h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {changelogs.length > 0 ? (
          changelogs.map((log, index) => (
            <li key={index} className="changelog-item">
              <div className="changelog-item-date">
                {new Date(log.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </div>
              {/* <div className="changelog-item-heading">
                Changelog
              </div> */}
              <ReactMarkdown className="changelog-item-summary">
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
