import ConversationButtons from "../ConversationButtons/ConversationButtons"
import "./GroupCallRoom.css";

const GroupCallRoom = () => {
    return(
        <div className="group_call_room_container">
            <span className="group_call_title"> Group Call</span>
            <div  className="group_call_videos_container">
                display the streams from other users
            </div>
            <ConversationButtons />
        </div>
    )
}

export default GroupCallRoom;