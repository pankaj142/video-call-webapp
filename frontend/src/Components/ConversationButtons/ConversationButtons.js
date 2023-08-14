import { useSelector, useDispatch } from 'react-redux';
import { MdCallEnd, MdMic, MdMicOff, MdVideocam, MdVideocamOff, MdVideoLabel, MdVideoCall, MdCamera} from 'react-icons/md';

import { setLocalMicrophoneEnabled, setLocalCameraEnabled } from '../../store/slices/callSlice';
import ConversationButton from './ConversationButton';
import { switchForScreenSharingStream, hangUp } from "../../utils/webRTC/webRTCHandler";

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

const ConversationButtons = () => {
    const dispatch = useDispatch();

    const localStream = useSelector((state) => state.call.localStream);
    const localCameraEnabled = useSelector((state) => state.call.localCameraEnabled);
    const localMicrophoneEnabled = useSelector((state)=> state.call.localMicrophoneEnabled); 
    const screenSharingActive = useSelector((state)=> state.call.screenSharingActive);


    const handleMicButtonPressed = () => {
        const micEnabled = localMicrophoneEnabled;
        
        // update localstream audio track
        localStream.getAudioTracks()[0].enabled = !micEnabled;

        // update the microphone change in store
        dispatch(setLocalMicrophoneEnabled(!micEnabled));
    }

    const handleCameraButtonPressed = () => {
        const cameraEnabled = localCameraEnabled;

        // update localstream video track
        localStream.getVideoTracks()[0].enabled = !cameraEnabled;
        
        // update the camera change in store
        dispatch(setLocalCameraEnabled(!cameraEnabled));
    }

    const handleScreenSharingButtonPressed = () =>{
        switchForScreenSharingStream();
    }

    const handleHangUpButtonPressed = () => {
        hangUp();
    }

    return (
        <div style={styles.buttonContainer}>
            <ConversationButton onClickHandler = { handleMicButtonPressed } >
                {localMicrophoneEnabled ? <MdMic style={styles.icon} /> :  <MdMicOff style={styles.icon} />}
            </ConversationButton>
            <ConversationButton onClickHandler={handleHangUpButtonPressed}>
                <MdCallEnd style={styles.icon} />
            </ConversationButton>
            <ConversationButton onClickHandler={ handleCameraButtonPressed} >
                {localCameraEnabled ? <MdVideocam style={styles.icon} /> : <MdVideocamOff style={styles.icon} />}
            </ConversationButton>
            <ConversationButton onClickHandler={handleScreenSharingButtonPressed} >
                { screenSharingActive ? <MdCamera style={styles.icon} /> : <MdVideoLabel style={styles.icon} /> }
            </ConversationButton>

        </div>
    )
}

export default ConversationButtons;