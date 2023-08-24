import ConversationButtons from "../ConversationButtons/ConversationButtons"
import "./GroupCallRoom.css";
import GroupCallVideo from "./GroupCallVideo";

const GroupCallRoom = ({ groupCallStreams }) => {
    return(
        <div className="group_call_room_container">
            <span className="group_call_title"> Group Call</span>
            <div  className="group_call_videos_container">
                {
                    groupCallStreams.map(stream => {
                        return <GroupCallVideo  key={stream.id} stream={stream} />
                    })
                }
                
            </div>
            <ConversationButtons groupCall={true} />
        </div>
    )
}

export default GroupCallRoom;