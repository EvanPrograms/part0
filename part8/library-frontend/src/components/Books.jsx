import { GET_BOOKS_BY_GENRE } from "../queries"
import { useState } from "react"
import { gql, useQuery, useApolloClient } from '@apollo/client'

const Books = (props) => {
  const [selectedGenre, setSelectedGenre] = useState(null)
  const [books, setBooks] = useState(props.data)

  const { loading, error, data, refetch } = useQuery(GET_BOOKS_BY_GENRE, {
    variables: { genre: selectedGenre }, // Pass selectedGenre as a variable
    skip: !selectedGenre
  });
  

  if (!props.show) {
    return null
  }

  // let books = props.data
  // console.log('books!', data)
  const uniqueGenres = []

  // if (data && data.booksByGenre) {
  //   books = data.booksByGenre
  // }
  // if (!loading && !error && data) {
  //   books = data.booksByGenre;
  // }

  // if (props.data) {
  //   uniqueGenres.push(...new Set(props.data.flatMap(book => book.genres)))
  // }
  if (Array.isArray(props.data)) {
    uniqueGenres.push(...new Set(props.data.flatMap(book => book.genres)))
    console.log('uniquegenres', uniqueGenres)
  }

  // if (!loading && !error && data) {
  //   books = data.booksByGenre
  // }

  // const uniqueGenres = [...new Set(books.flatMap(book => book.genres))];

  const genreSelection = async (genre) => {
    console.log('Selected genre:', genre)
    setSelectedGenre(genre)
    // refetch({ genre: genre })
  }

  const fetchDataByGenre = async (genre) => {
    console.log('Fetching data for genre:', selectedGenre);
    try {
      const { data } = await refetch({ genre })
      console.log('Data fetched:', data);
      setBooks(data.allBooks)
    } catch (error) {
      console.error('Error refetching data:', error);
    }
  };

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books && books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div>
        {!props.hideGenres && (
          <div>
            {uniqueGenres.map((genre, index) => ( // Added index as part of the key
              <button key={`${genre}-${index}`} onClick={async () => {
                await fetchDataByGenre(genre);
              }}>
                {genre}
              </button>
            ))}
          </div>
        )}
        
      </div>
    </div>
  )
}

export default Books
