import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom'
import { gql, useQuery } from '@apollo/client'
import { ALL_AUTHORS, ALL_BOOKS } from "./queries";



const App = () => {
  const [page, setPage] = useState("authors");
  const result = useQuery(ALL_AUTHORS)
  const booksResult = useQuery(ALL_BOOKS)
  // console.log('this is result', result.data)
  // console.log('this is booksResult', booksResult)

  if (result.loading) {
    return <div>Loading...</div>
  }

  if (booksResult.loading) {
    return <div>Loading...</div>
  }
  

  const padding = {padding: 5}

  return (
    <Router>
      <div>
        {/* <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        <button onClick={() => setPage("add")}>add book</button> */}
        <Link style={padding} to="/" onClick={() => setPage("authors")}>authors</Link>
        <Link style={padding} to="/books" onClick={() => setPage("books")}>books</Link>
        <Link style={padding} to="/add" onClick={() => setPage("add")}>add book!</Link>
      </div>
        
      <Routes>
        <Route path="/" element={<Authors data={result.data.allAuthors} show={page === "authors"}/>} />
        <Route path="/books" element={<Books data={booksResult.data.allBooks} show={page === "books"}/>} />
        <Route path="/add" element={<NewBook show={page === "add"}/>} />
      </Routes>
  
      {/* <Authors show={page === "authors"} />

      <Books show={page === "books"} />

      <NewBook show={page === "add"} /> */}
    </Router>
  );
};

export default App;
