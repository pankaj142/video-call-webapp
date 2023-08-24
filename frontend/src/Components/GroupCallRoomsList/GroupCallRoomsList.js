import { useSelector } from "react-redux";
import GroupCallRooomsListItem from "./GroupCallRoomsListItem";

import "./GroupCallRoomsList.css";

const GroupCallRooomsList = () => {
    const rooms = useSelector((state) => state.dashboard.groupCallRooms);
    return (
        <>
            { rooms.map((room)=>{
                return <GroupCallRooomsListItem key={room.roomId} room={room}/>
              })
            }
        </>
        
    )
}

export default GroupCallRooomsList;
