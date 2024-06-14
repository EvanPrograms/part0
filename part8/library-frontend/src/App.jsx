import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm"
import Recommendations from "./components/Recommendations"

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom'

import { 
  useQuery,
  useApolloClient,
  useSubscription
} from '@apollo/client'

import { ALL_AUTHORS, ALL_BOOKS, BOOK_ADDED } from "./queries";

export const updateCache = (cache, query, addedBook) => {
  const uniqByTitle = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.title
      return seen.has(k) ? false : seen.add(k)
    })
  }

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByTitle(allBooks.concat(addedBook)),
    }
  })
}


const App = () => {
  const [token, setToken] = useState(localStorage.getItem('library-user-token'))
  const [page, setPage] = useState("authors");
  const result = useQuery(ALL_AUTHORS)
  const booksResult = useQuery(ALL_BOOKS)
  const client = useApolloClient()

  console.log('this is result', result.data)
  console.log('this is booksResult', booksResult.data)

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded
      window.alert(`Book added: ${addedBook.title}`)
      console.log('use subscription', data)

      updateCache(client.cache, { query: ALL_BOOKS }, addedBook)
    },
    onError: (error) => {
      console.error('Subscription error: ', error)
    }
  })

  if (result.loading) {
    return <div>Loading...</div>
  }

  if (booksResult.loading) {
    return <div>Loading...</div>
  }

  
  
  
  const logout = () => {
    setToken(null)
    const user = JSON.parse(localStorage.getItem('user'))
    console.log('logging out', user)
    localStorage.clear()
    client.resetStore()
  }

  const padding = {padding: 5}

  return (
    <Router>
      <div>
        <Link style={padding} to="/" onClick={() => setPage("authors")}>authors</Link>
        <Link style={padding} to="/books" onClick={() => setPage("books")}>books</Link>
        { token ? (
          <>
            <Link style={padding} to="/add" onClick={() => setPage("add")}>add book!</Link>
            <Link style={padding} to="/recommendations" onClick={() => setPage("recommendations")}>recommendations</Link>
            <Link style={padding} to="/" onClick={logout}>logout</Link>
          </>
        ) : (
          <Link style={padding} to="/login" onClick={() => setPage("login")}>login</Link>
        )}
      </div>
        
      <Routes>
        <Route path="/" element={<Authors data={result.data.allAuthors} show={page === "authors"}/>} />
        <Route path="/books" element={<Books data={booksResult.data.allBooks} show={page === "books"} hideGenres={false}/>} />
        <Route path="/add" element={<NewBook show={page === "add"}/>} />
        <Route path="/login" element={<LoginForm setToken={setToken}/>} />
        <Route path="/recommendations" element={<Recommendations show={page === 'recommendations'}/>}/>
      </Routes>
    </Router>
  );
};

export default App;
