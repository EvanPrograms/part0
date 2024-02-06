import noteService from '../services/phonebook'

const DeleteButton = (props) => {
  const askForConfirmation = () => {
    const result = window.confirm(`Do you want to delete ${props.name}`)
    if (result) {
      console.log("CONFIRM DELETE")
      noteService
        .deleteRecord(props.id)
        .then(() => {
          props.setRequestData(new Date())
        })
    } else {
      console.log("REJECT THE DELETION")
    }
  }
  return (
    <button onClick={askForConfirmation}>{props.label}</button>
    )
  }

const Entries = (props) => {
  console.log('these are the entries from props: ', props)
    return (
      <div>
        {props.entries.map((entry) =>
        <div key={entry.name}>
          {entry.name} {entry.number} {' '}
          <DeleteButton label="delete" name={entry.name} id={entry.id} setRequestData={props.setRequestData}/>
        </div>
        )}
      </div>
    )
  }

  export default Entries
