const Notification = ({ message }) => {
    console.log(message)
    if (message.message === null) {
        return null
    }
    const redAlert = {
        color: 'red'
    }
    console.log( alert)
    return (
        <div className="error" style={message.alert ? {color: 'green'} : {color: 'red'}}>
            {message.message}
        </div>
    )
}

export default Notification