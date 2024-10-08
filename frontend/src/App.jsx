import React, { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [changelogs, setChangelogs] = useState([])

  useEffect(() => {
    fetchChangelogs()
  }, [])

  const fetchChangelogs = async () => {
    try {
      const response = await axios.get(process.env.REACT_BACKEND_URL)
      setChangelogs(response.data)
    } catch (error) {
      console.error('Error fetching changelogs:', error)
    }
  }

  return (
    <div>
      <h1>Changelog</h1>
      <ul>
        {changelogs.map((log, index) => (
          <li key={index}>
            <strong>{new Date(log.date).toLocaleString()}:</strong> {log.summary}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App