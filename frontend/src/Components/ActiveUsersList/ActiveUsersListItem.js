
import userAvatar from "../../assets/userAvatar.png";

const ActiveUsersListItem = ({activeUser}) =>{

    const handleActiveUserPressed = () =>{
        //
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
