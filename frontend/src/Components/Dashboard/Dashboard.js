import { useSelector, useDispatch } from "react-redux";
import { saveUserName,increaseCounter } from '../../store/slices/dashboardSlice';


const Dashboard = () => {
    const username = useSelector((state) => state.dashboard.userName)
    const counter = useSelector((state) => state.dashboard.counter);
    const dispatch = useDispatch();

    const handleCounterIncrease = () => {
        dispatch(increaseCounter())
    }
    return (
        <>
            <h1>
                Dashboad 
            </h1>

            <h2>
                counter : {counter}
                <br />
                <button onClick={handleCounterIncrease}>Increase</button>
            </h2>

            <div>
                
                <span>
                    new User name is {username}
                </span>
                <br />
                <button onClick={()=> dispatch(saveUserName("Donny"))}>set user name</button>
            </div>
        </>
    )
};

export default Dashboard;