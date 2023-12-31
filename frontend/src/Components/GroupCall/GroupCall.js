import { useSelector } from "react-redux";
import { callStates } from "../../store/slices/callSlice";
import GroupCallButton from "../GroupCallButton/GroupCallButton";
import * as webRTCGroupCallHandler from "../../utils/webRTC/webRTCGroupCallHandler";
import GroupCallRoom from "../GroupCallRoom/GroupCallRoom";

const GroupCall = () => {
    const localStream = useSelector((state) => state.call.localStream);
    const callState = useSelector((state) => state.call.callState);
    const groupCallActive = useSelector((state)=> state.call.groupCallActive);
    const groupCallStreams = useSelector((state)=> state.call.groupCallStreams);

    const createRoom = () => {
        // create new room
        webRTCGroupCallHandler.createNewGroupCall();
    } 

    const leaveRoom = () => {
        webRTCGroupCallHandler.leaveGroupCall();
    }

    return (
        <>
            {
                !groupCallActive && localStream && callState !== callStates.CALL_IN_PROGRESS &&
                <GroupCallButton  onClickHandler={createRoom} label='Creat room' />
            }
            {
                groupCallActive && <GroupCallRoom groupCallStreams={groupCallStreams} />
            }
            {
                groupCallActive && <GroupCallButton onClickHandler={leaveRoom} label='Leave room' />
            }
        </>
    )
}

export default GroupCall;