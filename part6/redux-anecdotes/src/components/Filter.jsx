import { useDispatch } from "react-redux"
import { setFilter } from "../reducers/filterReducer"

const Filter = () => {
  const dispatch = useDispatch()

  const handleChange = (event) => {
    console.log(event.target.value)
    // input-field value is in variable event.target.value
    dispatch(setFilter(event.target.value))

  }
  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter <input onChange={handleChange} name="filter"/>
    </div>
  )
}

export default Filter