const Authors = (props) => {
  if (!props.show) {
    return null
  }
  const authors = props.data
  console.log('this is authors', authors)

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
    </div>
  )
}

export default Authors
