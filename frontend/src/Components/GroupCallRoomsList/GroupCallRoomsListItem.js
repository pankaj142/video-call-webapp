import * as webRTCGroupCallHandler from "../../utils/webRTC/webRTCGroupCallHandler";

const GroupCallRooomsListItem = ({room}) => {

    const handleListItemPressed = () =>{
        // join the group call
        webRTCGroupCallHandler.joinGroupCall(room.socketId, room.roomId);
    }

    return (
        <div onClick={handleListItemPressed} className="group_calls_list_item background_main_color">
            <span>{room.hostName}</span>
        </div>
    )
}

export default GroupCallRooomsListItem;