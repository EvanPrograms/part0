import { useState, forwardRef, useImperativeHandle, Fragment } from 'react'
import PropTypes from 'prop-types'

const Togglable = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <span>
      <span style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </span>
      <span style={showWhenVisible} className='togglableContent'>
        {props.buttonTop === 'true' ? (
          <span>
            <button onClick={toggleVisibility}>{props.hideButton}</button>
            {props.children}
          </span>
        ) : (
          <span>
            {props.children}
            <button onClick={toggleVisibility}>{props.hideButton}</button>
          </span>
        )}
      </span>
    </span>
  )
})

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
}

Togglable.displayName = 'Togglable'

export default Togglable