import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Container } from '@mui/material';
import { Link, useNavigate  } from 'react-router-dom';

function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const isValidEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return emailRegex.test(email);
    };

    const isPasswordStrong = (password) => {
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        return passwordRegex.test(password);
    };

    const handleSignUp = async () => {
        if (!isValidEmail(email)) {
            setMessage("Please enter a valid email address.");
            
            return;
        }

        if (!isPasswordStrong(password)) {
            setMessage("Password should be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.");
            return;
        }

        try {
            await axios.post("http://127.0.0.1:5000/signup", { email, password });
            setMessage("Successfully signed up!");
            navigate("/signin");
        } catch (error) {
            console.error("Error signing up:", error);
            setMessage("Error signing up. Please try again.");
        }
    };

    return (
        <Container maxWidth="sm">
            <h1>SignUp</h1>
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
                <Button variant="contained" color="primary" onClick={handleSignUp}>
                    Sign Up
                </Button>

              

                <Link to="/signin">Already have an account? Sign in</Link>
            </div>
            {message && 
                    <Typography variant="body1" color="error">
                        {message}
                    </Typography>
                }
        </Container>
    );
}

export default SignUp;
