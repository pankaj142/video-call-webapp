import { useSelector } from "react-redux";
import { callStates } from "../../store/slices/callSlice";
import GroupCallButton from "../GroupCallButton/GroupCallButton";

const GroupCall = () => {
    const localStream = useSelector((state) => state.call.localStream);
    const callState = useSelector((state) => state.call.callState);

    const createRoom = () => {
        // create new room
    } 

    return (
        <>
            {
                localStream && callState !== callStates.CALL_IN_PROGRESS &&
                <GroupCallButton  onClickHandler={createRoom} label='Creat room' />
            }
        </>
    )
}

export default GroupCall;