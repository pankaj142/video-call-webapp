import { callStates, setChatMessage } from "../../store/slices/callSlice";
import {  useSelector } from "react-redux/es/hooks/useSelector";

import CallRejectedDialog from "../CallRejectedDialog/CallRejectedDialog";
import CallingDialog from "../CallingDialog/CallingDialog";
import IncomingCallDialog from "../IncomingCallDialog/IncomingCallDialog";
import LocalVideoView from "../LocalVideoView/LocalVideoView";
import RemoteVideoView from "../RemoteVideoView/RemoteVideoView";
import ConversationButtons from "../ConversationButtons/ConversationButtons";
import Messenger from "../Messenger/Messenger";
import { store } from "../../store/store";

const DirectCall = () => {
    const callState = useSelector((state)=> state.call.callState)
    const callerUsername = useSelector((state)=> state.call.callerUsername);
    const callingDialogVisible = useSelector((state) => state.call.callingDialogVisible)
    const callRejected = useSelector((state) => state.call.callRejected);
    const remoteStream = useSelector((state) => state.call.remoteStream);
    const message = useSelector((state) => state.call.message);

    const setDirectCallMessage = (received, content) => {
        store.dispatch(setChatMessage({
            received: received,
            content: content
          }))
    }

    return(
        <>
            <LocalVideoView />
            {remoteStream && callState === callStates.CALL_IN_PROGRESS && <RemoteVideoView remoteStream={remoteStream} />}
            {callingDialogVisible && <CallingDialog/>}
            {callRejected.rejected && <CallRejectedDialog reason={callRejected.reason} />}
            { callState === callStates.CALL_REQUESTED && <IncomingCallDialog callerUsername={callerUsername} />}
            {remoteStream && callState === callStates.CALL_IN_PROGRESS && <ConversationButtons /> }
            {remoteStream && callState === callStates.CALL_IN_PROGRESS && <Messenger message={message} setDirectCallMessage={setDirectCallMessage} /> }
        </>
    );
}

export default DirectCall;