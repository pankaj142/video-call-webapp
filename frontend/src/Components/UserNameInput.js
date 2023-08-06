
const UserNameInput = ({userName, setUserName}) =>{
    return (
        <div className="login-page_input_container" >
            <input 
                placeholder="Enter your name"
                type="text" 
                value={userName}
                onChange={(event)=>{ setUserName(event.target.value)}}
                className="login-page_input background_main_color text_main_color"
            />
        </div>
    );
}

export default UserNameInput;