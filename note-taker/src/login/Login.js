import { useState } from 'react';
import './login.css'
import { useNavigate } from 'react-router';

function Login() {
    const [username, setUname] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function verify() {
        const res = await fetch(
            "http://localhost:5000/notes/login", {
                method: "POST",
                body: JSON.stringify({
                    "username": username,
                    "password": password
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        const data = await res.json();
        console.log(data);
        if (data.length) {
            localStorage.setItem("texjwt", data[0]["jwt"]);
            navigate("/list", {
                state: {
                    "username": username
                }
            })
        }
        else {
            alert("Enter valid username and password");
        }
    }

    return (
        <div className='Login'>
            <label htmlFor="username">Username</label>
            <input type="text" name="username" id="username" 
            onInput={e => setUname(e.target.value)}
            />
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" 
            onInput={e => setPassword(e.target.value)}
            />
            <button onClick={verify} id='login-button'>Log in</button>
        </div>
    );
}

export default Login;