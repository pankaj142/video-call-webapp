import { useSelector } from "react-redux";
import { callStates } from "../../store/slices/callSlice";
import GroupCallButton from "../GroupCallButton/GroupCallButton";
import * as webRTCGroupCallHandler from "../../utils/webRTC/webRTCGroupCallHandler";
import GroupCallRoom from "../GroupCallRoom/GroupCallRoom";

const GroupCall = () => {
    const localStream = useSelector((state) => state.call.localStream);
    const callState = useSelector((state) => state.call.callState);
    const groupCallActive = useSelector((state)=> state.call.groupCallActive);

    const createRoom = () => {
        // create new room
        webRTCGroupCallHandler.createNewGroupCall();
    } 

    return (
        <>
            {
                !groupCallActive && localStream && callState !== callStates.CALL_IN_PROGRESS &&
                <GroupCallButton  onClickHandler={createRoom} label='Creat room' />
            }
            {
                groupCallActive && <GroupCallRoom/>
            }
        </>
    )
}

export default GroupCall;