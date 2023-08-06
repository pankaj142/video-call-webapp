
import './ActiveUsersList.css';
import ActiveUsersListItem from './ActiveUsersListItem';

const activeUsers = [
    {
        socketId : 200,
        username: 'Bob'
    },
    {
        socketId : 201,
        username: 'Mike'
    },
    {
        socketId : 202,
        username: 'John'
    },
    {
        socketId : 203,
        username: 'Rob'
    }
];

const ActiveUsersList = () =>{
    return(
        <div className='active_user_list_container'>
            { activeUsers.map((activeUser)=>
                <ActiveUsersListItem key={activeUser.socketId} activeUser={activeUser} />
            )}
        </div>
    );
}

export default ActiveUsersList;