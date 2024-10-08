import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
      console.error('Error1: ', error);
      setError('Error2');
    }
  };

  return (
    <div>
      <h1>Changelog</h1>
      {error && <p>{error}</p>}  
      <ul>
        {changelogs.length > 0 ? (
          changelogs.map((log, index) => (
            <li key={index}>
              <strong>{new Date(log.date).toLocaleString()}:</strong> <br />
              <div dangerouslySetInnerHTML={{ __html: log.summary }} />
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
