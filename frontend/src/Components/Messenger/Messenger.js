import { useEffect, useState } from 'react';
import { sendMessageUsingDataChannel } from '../../utils/webRTC/webRTCHandler';
import MessageDisplay from './MessageDisplayer';

import "./Messenger.css";

const Messenger = ({message, setDirectCallMessage }) => {
    const [inputValue, setInputValue] = useState('');

    const handleOnKeyDownEvent = (e) => {   
        if(e.keyCode === 13){
            sendMessageUsingDataChannel(inputValue)
            setInputValue('');
        }
    }

    useEffect(() => {
        if(message.received){
            setTimeout(() => {
                setDirectCallMessage(false, '')
            }, 5000)
        }
    }, [message])

    return (
        <>
            <input 
            className="messages_input"
            type="text" 
            value={inputValue}
            onChange={(e) => {setInputValue(e.target.value)}}
            onKeyDown={handleOnKeyDownEvent}
            placeholder='Type your message'
            />
            {message.received && <MessageDisplay message={message.content} /> }
        </>
    )
}

export default Messenger;