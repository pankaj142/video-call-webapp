
import { useSelector } from "react-redux";

import './ActiveUsersList.css';
import ActiveUsersListItem from './ActiveUsersListItem';

const ActiveUsersList = () =>{

    // const username = useSelector((state) => state.dashboard.username)
    const activeUsers = useSelector((state) => state.dashboard.activeUsers)

    return(
        <div className='active_user_list_container'>
            { activeUsers.map((activeUser)=>
                <ActiveUsersListItem key={activeUser.socketId} activeUser={activeUser} />
            )}
        </div>
    );
}

export default ActiveUsersList;