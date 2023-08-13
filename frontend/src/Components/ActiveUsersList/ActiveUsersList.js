
import { useSelector } from "react-redux";

import './ActiveUsersList.css';
import ActiveUsersListItem from './ActiveUsersListItem';

const ActiveUsersList = () =>{

    // const username = useSelector((state) => state.dashboard.username)
    const activeUsers = useSelector((state) => state.dashboard.activeUsers);
    const callState = useSelector((state) => state.call.callState);

    return(
        <div className='active_user_list_container'>
            { activeUsers.map((activeUser)=>
                <ActiveUsersListItem key={activeUser.socketId} activeUser={activeUser} callState={callState} />
            )}
        </div>
    );
}

export default ActiveUsersList;