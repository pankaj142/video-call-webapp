
import userAvatar from "../../assets/userAvatar.png";
import { callStates } from "../../store/slices/callSlice";
import { callToOtherUser } from "../../utils/webRTC/webRTCHandler";

const ActiveUsersListItem = ({activeUser, callState}) =>{

    const handleActiveUserPressed = () =>{
        if(callState === callStates.CALL_AVAILABLE){
            callToOtherUser(activeUser)
        }
    }

    return (
        <div className="active_user_list_item" onClick={handleActiveUserPressed}>
            <div className="active_user_list_image_container">
                <img className="active_user_list_image" src={userAvatar} alt="" />
            </div>
            <span className="active_user_list_text">
                {activeUser.username}
            </span>
        </div>
    ) 
}

export default ActiveUsersListItem;
