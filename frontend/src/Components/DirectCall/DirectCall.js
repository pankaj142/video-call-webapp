import LocalVideoView from "../LocalVideoView/LocalVideoView";
import RemoteVideoView from "../RemoteVideoView/RemoteVideoView";

const DirectCall = ({localStream, remoteStream}) => {
    return(
        <>
            <LocalVideoView localStream={localStream} />
            {remoteStream && <RemoteVideoView remoteStream={remoteStream} />}
        </>
    );
}

export default DirectCall;