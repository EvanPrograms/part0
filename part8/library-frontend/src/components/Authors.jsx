import { gql, useMutation } from '@apollo/client'
import { ALL_AUTHORS, ALL_BOOKS, EDIT_BIRTH } from '../queries'
import { useState } from 'react'
import Select from 'react-select'

const BirthForm = (props) => {
  // const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  console.log('birthyear propsdata', props.data)
  const options = props.data.map(author => ({ value: author.name, label: author.name}))
  console.log('this is options', options)

  const [selectedOption, setSelectedOption] = useState(null)

  const [ editAuthor ] = useMutation(EDIT_BIRTH, {
    refetchQueries: [ { query: ALL_AUTHORS }, { query: ALL_BOOKS }]
  })

  const submit = () => {
    event.preventDefault()
    console.log('sumbmiss')
    editAuthor({ variables: { name: selectedOption.value, born } })
    // setName('')
    setBorn('')
  }

  return(
    <div>
    <h3>Set Birthyear</h3>
    <form onSubmit={submit}>
      {/* <div>
        name
        <input
          value={name}
          onChange={({ target }) => setName(target.value)}
        />
      </div> */}
      <div>
      <Select
        defaultValue={selectedOption}
        // value={selectedOption}
        onChange={setSelectedOption}
        options={options}
      />
    </div>
      <div>
        born
        <input
          value={born}
          onChange={({ target }) => setBorn(parseInt(target.value))}
        />
      </div>
      <button type="submit">update author</button>
    </form>
    </div>
  )
}

const Authors = (props) => {
  if (!props.show) {
    return null
  }
  const authors = props.data
  // console.log('this is authors', authors)

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born || 'Unknown'}</td>
              <td>{a.bookCount || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <BirthForm data={authors}/>
    </div>
  )
}

export default Authors
