import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [changelogSummary, setChangelogSummary] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/changelog-summary')
      .then(response => {
        setChangelogSummary(response.data.summary);
      })
      .catch(error => {
        console.error('Error fetching changelog summary:', error);
      });
  }, []);

  return (
    <div>
      <h1>Changelog Summary</h1>
      <p>{changelogSummary}</p>
    </div>
  );
}

export default App;
