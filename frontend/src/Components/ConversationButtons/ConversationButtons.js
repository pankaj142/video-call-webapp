import { MdCallEnd, MdMic, MdMicOff, MdVideocam, MdVideocamOff, MdVideoLabel, MdVideoCall, MdCamera} from 'react-icons/md';
import ConversationButton from './ConversationButton';

const styles = {
    buttonContainer : {
        display: 'flex',
        position: 'absolute',
        bottom: '22%',
        left:'35%'
    },
    icon: {
        width: '25px',
        height: '25px',
        fill: '#e6e5e8'
    }
}

const ConversationButtons = () =>{
    return (
        <div style={styles.buttonContainer}>
            <ConversationButton>
                <MdMic style={styles.icon} />
            </ConversationButton>
            <ConversationButton>
                <MdCallEnd style={styles.icon} />
            </ConversationButton>
            <ConversationButton>
                <MdVideocam style={styles.icon} />
            </ConversationButton>
            <ConversationButton>
                <MdVideoLabel style={styles.icon} />
            </ConversationButton>

        </div>
    )
}

export default ConversationButtons;