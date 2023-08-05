import {useState} from "react";
import  './LoginPage.css';
import UserNameInput from "./UserNameInput";
import SubmitButton from "./SubmitButton";
import logo from "../../assets/logo.png";

import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import {saveUserName } from '../../store/slices/dashboardSlice';

const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [userName, setUserName] = useState("");

    const handleSubmit = () =>{
        dispatch(saveUserName(userName))
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
                <UserNameInput userName={userName} setUserName={setUserName} />
                <SubmitButton handleSubmit={handleSubmit} />
            </div>
        </div>
    );
};

export default LoginPage;