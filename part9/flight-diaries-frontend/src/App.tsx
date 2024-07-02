import { useState, useEffect } from 'react';
import axios from 'axios';

interface Diary {
  id: number,
  date: string,
  weather: string,
  visibility: string
}

const App = () => {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [newDiary, setNewDiary] = useState('')
  const [date, setDate] = useState('');
  const [visibility, setVisibility] = useState('');
  const [weather, setWeather] = useState('');
  const [comment, setComment] = useState('');

  useEffect(() => {
    axios.get<Diary[]>('http://localhost:3000/api/diaries').then(response => {
      setDiaries(response.data)
    })
  }, [])

  const diaryCreation = (event: React.SyntheticEvent) => {
    event.preventDefault()
    const newDiary = {
      date,
      visibility,
      weather,
      comment
    }
    axios.post<Diary>('http://localhost:3000/api/diaries', newDiary)
      .then(response => {
        setDiaries(diaries.concat(response.data))
      })

      setDate('');
      setVisibility('');
      setWeather('');
      setComment('');
  };

  return (
    <div>
      <h3>Add new entry</h3>
      <form onSubmit={diaryCreation}>
        <div>
          <label>Date: </label>
          <input value={date} onChange={(event) => setDate(event.target.value)} />
        </div>
        <div>
          <label>Weather: </label>
          <input value={weather} onChange={(event) => setWeather(event.target.value)} />
        </div>
        <div>
          <label>Visibility: </label>
          <input value={visibility} onChange={(event) => setVisibility(event.target.value)} />
        </div>
        <div>
          <label>Comment: </label>
          <input value={comment} onChange={(event) => setComment(event.target.value)} />
        </div>
        <button>add</button>
      </form>
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