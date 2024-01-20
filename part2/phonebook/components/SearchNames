import { useState } from 'react'

const SearchNames = (props) => {
    const [search, setSearch] = useState('')
    const handleSearch = (event) => {
      console.log(event.target.value)
      setSearch(event.target.value)
    }
    const searching = (event) => {
      event.preventDefault()
      console.log(props.names)
      const searchObject = search
      if (props.names.some((person) => person.name.toLowerCase() === searchObject.toLowerCase()) === true) {
        console.log("HIS NAME EXISTS")
        console.log(props.names.find((person) => person.name.toLowerCase() === searchObject.toLowerCase()))
        props.setpersons(
          [props.names.find((person) => person.name.toLowerCase() === searchObject.toLowerCase())]
        )
      } else {
        console.log("HE DOESNT EXIST")
      }
    }
    return (
      <div>
        <form onSubmit={searching}>
          {console.log('form resubmitted')}
          <div>
            filter shown with <input value={search} onChange={handleSearch} id="text-box"/>
          </div>
        </form>
      </div>
    )
  }

  export default SearchNames
