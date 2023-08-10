import { callStates } from "../../store/slices/callSlice";
import CallRejectedDialog from "../CallRejectedDialog/CallRejectedDialog";
import CallingDialog from "../CallingDialog/CallingDialog";
import IncomingCallDialog from "../IncomingCallDialog/IncomingCallDialog";
import LocalVideoView from "../LocalVideoView/LocalVideoView";
import RemoteVideoView from "../RemoteVideoView/RemoteVideoView";
import {  useSelector } from "react-redux/es/hooks/useSelector";

const DirectCall = ({localStream, remoteStream}) => {
    const callState = useSelector((state)=> state.call.callState)
    const callerUsername = useSelector((state)=> state.call.callerUsername);
    const callingDialogVisible = useSelector((state) => state.call.callingDialogVisible)
    const callRejected = useSelector((state) => state.call.callRejected);

    return(
        <>
            <LocalVideoView localStream={localStream} />
            {remoteStream && <RemoteVideoView remoteStream={remoteStream} />}
            {callRejected.rejected && <CallRejectedDialog reason={callRejected.reason} />}
            { callState === callStates.CALL_REQUESTED && <IncomingCallDialog callerUsername={callerUsername} />}
            {callingDialogVisible && <CallingDialog/>}
        </>
    );
}

export default DirectCall;