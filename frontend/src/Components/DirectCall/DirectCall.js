import CallRejectedDialog from "../CallRejectedDialog/CallRejectedDialog";
import CallingDialog from "../CallingDialog/CallingDialog";
import IncomingCallDialog from "../IncomingCallDialog/IncomingCallDialog";
import LocalVideoView from "../LocalVideoView/LocalVideoView";
import RemoteVideoView from "../RemoteVideoView/RemoteVideoView";

const DirectCall = ({localStream, remoteStream}) => {
    return(
        <>
            <LocalVideoView localStream={localStream} />
            {remoteStream && <RemoteVideoView remoteStream={remoteStream} />}
            {/* <CallRejectedDialog/>
            <IncomingCallDialog/>
            <CallingDialog/> */}
        </>
    );
}

export default DirectCall;