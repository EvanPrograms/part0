import { useState } from 'react'
import personService from  '../services/phonebook'

const AddNew = (props) => {
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
  
    const handleNameChange = (event) => {
      setNewName(event.target.value)
    }
  
    const handleNumberChange = (event) => {
      setNewNumber(event.target.value)
    }
    const submitName = (event) => {
      event.preventDefault()
      const person = props.names.find(person => person.name === newName)
      const nameObject = {
        name: newName,
        number: newNumber
      }

      if (person) {
        const confirmation = window.confirm(
          `${newName} is already in the phonebook, would you like to replace the old number with a new one?`
          )
        if (confirmation) {
          personService
            .update(person.id, nameObject)
            .then(response => { 
              props.setRequestData(new Date());
              props.setAddMessage({
                message: `Updated ${response.name}'s number`,
                alert: true
              })
              setTimeout(() => {
                props.setAddMessage({
                  message: null,
                  alert: false
                })
              }, 5000)
            })
            .catch(error => {
              console.log("WE GOT A FRIGGIN ERROR HERE ALREADY DELETED")
              props.setAddMessage({
                message: `Information of ${nameObject.name} has already been removed from the server`,
                alert: false
              })
            setTimeout(() => {
              props.setAddMessage({
                message: null,
                alert: false
                })
              }, 5000)
            })  
        }
      } else {
        personService
          .create(nameObject)
          .then(response => {
            props.setpersons(props.names.concat(response))
            props.setRequestData(new Date());
            props.setAddMessage({
              message: `Added ${response.name}`,
              alert: true
            })
            setTimeout(() => {
              props.setAddMessage({
                message: null,
                alert: false
              })
            }, 5000)
            
          })
          .catch(error => {
            props.setAddMessage({
              message: error.response.data.error,
              alert: false
            })
            setTimeout(() => {
              props.setAddMessage({
                message: null,
                alert: false
              })
            }, 5000)
          })
        }
        setNewName('')
        setNewNumber('')
      } 

    return (
      <div>
        <form onSubmit={submitName}>
          <div>
            name: <input value={newName} onChange={handleNameChange}/>
          </div>
          <div>
            number: <input value={newNumber} onChange={handleNumberChange}/>
          </div>
          <div>
            <button type="submit">add</button>
          </div>
        </form>
      </div>
    )
  }


export default AddNew
