import {useState} from "react";
import  './LoginPage.css';
import UserNameInput from "../../Components/UserNameInput";
import SubmitButton from "../../Components/SubmitButton";
import logo from "../../assets/logo.png";

import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import {saveUserName } from '../../store/slices/dashboardSlice';
import {registerNewUser} from '../../utils/wssConnection/wssConnection';

const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [username, setUsername] = useState("");

    const handleSubmit = () =>{
        registerNewUser(username);
        dispatch(saveUserName(username))
        navigate("/dashboard")
    }

    return (
        <div className='login-page_container background_main_color' >
            <div className="login-page_login_box background_secondary_color">
                <div className="login-page_logo_container">
                    <img className="login-page_logo_image" src={logo} alt="VideoChat Logo" />
                </div>
                <div className="login-page_title_container">
                    <h2>Get on Board</h2>
                </div>
                <UserNameInput username={username} setUsername={setUsername} />
                <SubmitButton handleSubmit={handleSubmit} />
            </div>
        </div>
    );
};

export default LoginPage;