import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Container } from '@mui/material';
import { Link} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState(""); 
    const [userActive, setUserActive] = useState(false);


    const isValidEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return emailRegex.test(email);
    };

    const handleSignIn = async () => {
        if (!isValidEmail(email)) {
            setMessage("Please enter a valid email address.");
            return;
        }

        try {
            const response = await axios.post("http://127.0.0.1:5000/signin", { email, password });
            const token = response.data.access_token;
            localStorage.setItem('token', token);
            setUserActive(true);
            setUserEmail(email); 
            setMessage("Successfully signed in!"); 
            setEmail("");
            setPassword("");
            navigate("/organization"); 
        } catch (error) {
            console.error("Error signing in:", error);
            setMessage("Error signing in. Please try again.");
        }
    };
    
    return (
        <Container maxWidth="sm">
               <h1>SignIn</h1>
            <div className='aut'>
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    label="Password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={handleSignIn}>
                    Sign In
                </Button>

                {message && 
                    <Typography variant="body1" color="error">
                        {message}
                    </Typography>
                }

                <Link to="/signup">Don't have an account? Sign up</Link>
            </div>
        </Container>
    );
}

export default SignIn;
