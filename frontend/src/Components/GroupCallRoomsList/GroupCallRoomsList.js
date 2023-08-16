import GroupCallRooomsListItem from "./GroupCallRoomsListItem";
import "./GroupCallRoomsList.css";

const rooms = [
    {
        roomId: 1234,
        hostName:  'john'
    },
    {
        roomId: 1235,
        hostName:  'Daney'
    }
]
const GroupCallRooomsList = () => {
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
