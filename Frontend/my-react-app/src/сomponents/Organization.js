import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Select, MenuItem, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';




function Organization() {
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [users, setUsers] = useState([]);
    const [organizations, setOrganizations] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState("");
    const [selectedOrganization, setSelectedOrganization] = useState("");
    const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [serverResponse, setServerResponse] = useState("");
    const [userActive, setUserActive] = useState(false);
    const navigate = useNavigate();



    const handleNewOrganization = async () => {
        try {
            await axios.post("http://127.0.0.1:5000/create-org", { name });
            setMessage("Successfully added organization!"); 
        } catch (error) {
            console.error("Error adding organization:", error);
            setMessage("Error adding organization. Please try again."); 
        }
    };

    const handleAllUsers = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:5000/show_users");
            setUsers(response.data.users);
            setMessage("Successfully fetched users!"); 
        } catch (error) {
            console.error("Error fetching users:", error);
            setMessage("Error fetching users. Please try again."); 
        }
    };

    const handleAllOrganization = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:5000/show_organizations");
            setOrganizations(response.data.names);
            setMessage("Successfully fetched organizations!"); 
        } catch (error) {
            console.error("Error fetching organizations:", error);
            setMessage("Error fetching organizations. Please try again."); 
        }
    };

    const handleOrganizationUser = async () => {
        if (!selectedUserId || !selectedOrganization) {
            setMessage("Please select both a user and an organization.");
            return;
        }

        try {
            await axios.post("http://127.0.0.1:5000/add-user-to-org", { 
                name: selectedOrganization, 
                user_id: selectedUserId 
            });
            setMessage("Successfully added user to organization!"); 
        } catch (error) {
            console.error("Error adding user to organization:", error);
            setMessage("Error adding user to organization. Please try again."); 
        }
    };
    useEffect(() => {
        
        const headers = {
            Authorization: `Bearer ${localStorage.getItem('token')}` 
        };

        axios.get("http://127.0.0.1:5000/protected-resource", { headers })
        .then(response => {
            console.log("Response from server:", response.data);
            setServerResponse(response.data.message);  
            setIsUserAuthenticated(true);
            setUserEmail(response.data.email); 
        })
            .catch(error => {
                console.error("Error checking authentication:", error);
                setIsUserAuthenticated(false);
            });
    }, []); 

    const logout = () => {
        localStorage.removeItem('token');
        setIsUserAuthenticated(false);
        setUserEmail('');
       
        navigate('/login');
    };
    
    return (
        <Container maxWidth="sm">
               <h1 id='neworg'>New Organization</h1>
            {isUserAuthenticated && 
                <Button variant="contained" color="secondary" onClick={logout} id='logout'>
                    Logout
                </Button>
            }
            <div className='org'>
                <TextField
                    label="Organization Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={handleNewOrganization}>
                    New Organization
                </Button>
            </div>
            
            <div className='add'>
                <Select
                    value={selectedUserId}
                    onFocus={handleAllUsers}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    displayEmpty
                >
                    <MenuItem value="" disabled>Select a user</MenuItem>
                    {users.map((user) => 
                        <MenuItem key={user.id} value={user.id}>{user.email}</MenuItem>
                    )}
                </Select>

                <Select
                    value={selectedOrganization}
                    onFocus={handleAllOrganization}
                    onChange={(e) => setSelectedOrganization(e.target.value)}
                    displayEmpty
                >
                    <MenuItem value="" disabled>Select an organization</MenuItem>
                    {organizations.map((organization, index) => 
                        <MenuItem key={index} value={organization.name}>{organization.name}</MenuItem>
                    )}
                </Select>

                <Button variant="contained" color="primary" onClick={handleOrganizationUser}>
                    Add User to Organization
                </Button>
            </div>

            {message && 
                <Typography variant="body1" color="error">
                    {message}
                </Typography>
            }
          
        

          {serverResponse && 
        <Typography variant="body1">
            {serverResponse}
        </Typography>
    }

        </Container>
    );
}

export default Organization;
