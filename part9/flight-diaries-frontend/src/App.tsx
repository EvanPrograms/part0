import { useState, useEffect } from 'react';
import axios from 'axios';

interface Diary {
  id: number,
  date: string,
  weather: string,
  visibility: string
}

const App = () => {
  const [newNote, setNewNote] = useState('');
  const [diaries, setDiaries] = useState<Diary[]>([]);

  useEffect(() => {
    axios.get<Diary[]>('http://localhost:3000/api/diaries').then(response => {
      setDiaries(response.data)
    })
  }, [])

  return (
    <div>
      <h3>Diary entries</h3>
      <ul>
      {diaries.map(diary =>
          <li key={diary.id}>
            <p><strong> {diary.date}</strong></p>
            <p>Weather: {diary.weather}<br />Visibility: {diary.visibility}</p>
          </li>
        )}
      </ul>
    </div>
  )
}

export default App;