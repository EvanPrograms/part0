import { useState } from 'react'
import personService from  '../services/phonebook'

const AddNew = (props) => {
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
  
    const handleNameChange = (event) => {
      console.log(event.target.value)
      setNewName(event.target.value)
    }
  
    const handleNumberChange = (event) => {
      console.log(event.target.value)
      setNewNumber(event.target.value)
    }
    const submitName = (event) => {
      event.preventDefault()
      const person = props.names.find(person => person.name === newName)
      console.log('THIS IS THE PERSON', person)
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
            console.log('THIS IS THE ERROR', error.response.data.error)
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



    //   if (props.names.some(person => person.name === nameObject.name) === false) {
    //     props.setpersons(props.names.concat(nameObject))
    //     console.log("WE FRIGGIN ADDED THIS GUY")
    //     props.setAddMessage({
    //       message: `Added ${nameObject.name}`,
    //       alert: true
    //     })
    //     setTimeout(() => {
    //       props.setAddMessage({
    //         message: null,
    //         alert: false
    //       })
    //     }, 5000)
    //     personService
    //       .create(nameObject)
    //       .then(response => {response.data; props.setRequestData(new Date())})
    //       .catch(error => {
    //         console.log('THIS IS THE ERROR', error.response.data.error)
    //         props.setAddMessage({
    //           message: error.response.data.error,
    //           alert: false
    //         })
    //         setTimeout(() => {
    //           props.setAddMessage({
    //             message: null,
    //             alert: false
    //           })
    //         }, 5000)
    //       })
    //     console.log("NAME NOT IN DATABASE")
    //   } else {
    //     const identity = props.names.find(person => person.name === nameObject.name)
    //     const confirmation = window.confirm(
    //       `${newName} is already in the phonebook, would you like to replace the old number with a new one?`
    //       )
    //     if (confirmation) {
    //       personService
    //       .update(identity.id, nameObject)
    //       .catch(error => {
    //         props.setAddMessage({
    //           message: `Information of ${nameObject.name} has already been removed from the server`,
    //           alert: false
    //         })
    //         setTimeout(() => {
    //           props.setAddMessage({
    //             message: null,
    //             alert: false
    //           })
    //         }, 5000)
    //       })  
    //       .then(response => {response.data; 
    //         props.setRequestData(new Date());
    //         props.setAddMessage({
    //           message: `Updated ${nameObject.name}'s number`,
    //           alert: true
    //         })
    //         setTimeout(() => {
    //           props.setAddMessage({
    //             message: null,
    //             alert: false
    //           })
    //         }, 5000)
            

    //       })
    //     }
    //   }
    //   setNewName('')
    //   setNewNumber('')
    //   console.log(props.names, newName)
    // }
    
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
