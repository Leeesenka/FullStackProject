
import React, { useState, useEffect} from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function CreateOrganization({ onOrganizationAdded }) {
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [serverResponse, setServerResponse] = useState("");
    const [userActive, setUserActive] = useState(false);
    const navigate = useNavigate();

    const handleNewOrganization = async () => {
        if (!name || name.trim() === "") {
            setMessage("Organization name cannot be empty!");
            return;
        }
    
        try {
            const response = await axios.post("http://127.0.0.1:5000/create-org", { name });
    
            if (response.data && response.data.message === "Organization created!") {
                setMessage("Organization successfully added!");
                setName(""); 
                if (onOrganizationAdded) onOrganizationAdded();
            } else {
                setMessage("Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("Error adding organization:", error);
            
        
            if (error.response && error.response.data.message === "An organization with this name already exists.") {
                setMessage(error.response.data.message);
            } else {
                setMessage("Error adding organization. Please try again.");
            }
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const headers = {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            };
            
            try {
                const response = await axios.get("http://127.0.0.1:5000/protected-resource", { headers });
                console.log("Response from server:", response.data);
                setServerResponse(response.data.message);  
                setIsUserAuthenticated(true);
                setUserEmail(response.data.email);
            } catch (error) {
                if (error.response && error.response.status !== 401) {
                    console.error("Error checking authentication:", error);
                }
                setIsUserAuthenticated(false);
            }
        };
    
        fetchData();
    }, []);
    
    

    const logout = () => {
        localStorage.removeItem('token');
        setIsUserAuthenticated(false);
        setUserEmail('');
       
        navigate('/login');
    };
        
    

    return (
        <Container maxWidth="sm">
            <div className='serverResponse'>
                {serverResponse && 
                    <Typography variant="body1">
                        {serverResponse}
                    </Typography>
                }
                {isUserAuthenticated && 
                    <Button variant="contained" color="secondary" onClick={logout} id='logout'>
                        Logout
                    </Button>
                }
            </div>
    
            <h1 id='neworg'>New Organization</h1>
            <div className='org'>
                <TextField
                    label="Organization Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleNewOrganization} 
                    disabled={!isUserAuthenticated}
                >
                    New Organization
                </Button>
    
                {!isUserAuthenticated && 
                    <Typography 
                        variant="body2" 
                        color="textSecondary" 
                        style={{marginLeft: '10px'}}
                    >
                        You should be logged in to perform the action
                    </Typography>
                }
            </div>
    
            {message && 
                <Typography variant="body1" color="error">
                    {message}
                </Typography>
            }
        </Container>
    );
    
}

export default CreateOrganization;
