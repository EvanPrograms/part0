import { GET_ME, GET_BOOKS_BY_GENRE } from '../queries';
import { useQuery, useApolloClient } from '@apollo/client'
import Books from './Books';
import { useState, useEffect } from 'react'

const Recommendations = (props) => {
  const client = useApolloClient()
  const [favoriteGenre, setFavoriteGenre] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { loading: booksLoading, error: booksError, data: booksData, refetch } = useQuery(GET_BOOKS_BY_GENRE, {
    variables: { genre: favoriteGenre }, // Pass selectedGenre as a variable
    skip: !favoriteGenre
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await client.query({ query: GET_ME })
        setFavoriteGenre(data.me.favoriteGenre)
        setLoading(false)
      } catch (error) {
        console.log('Error fetching user data', error)
        setError(error)
        setLoading(false)
      }
    }

    fetchUserData()
  },  [client])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (booksLoading) return <div>Loading books...</div>;
  if (booksError) return <div>Error fetching books: {booksError.message}</div>;

  console.log('booksdata', booksData)

  return(
    <div>
      <h2>recommendations</h2>
      <div>books in your favorite genre <b>{favoriteGenre}</b></div>
      <Books show={true} data={booksData?.allBooks || []} hideGenres={true}/>
    </div>
  )
}

export default Recommendations
