import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Button, Select, MenuItem, Container, Typography } from '@mui/material';
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
    const navigate = useNavigate();
    const [openSelect, setOpenSelect] = useState(false);


    const handleAllUsers = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:5000/show_users");
            setUsers(response.data.users);
       
        } catch (error) {
            console.error("Error fetching users:", error);
            setMessage("Error fetching users. Please try again."); 
        }
    };

    const handleAllOrganization = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:5000/show_organizations");
            setOrganizations(response.data.names);
    
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
    
            if (error.response && error.response.status === 400) {
                setMessage(error.response.data.error);
            } else {
                setMessage("Error adding user to organization. Please try again.");
            }
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
           <h1 id='neworg'>Add Users in Organization</h1>
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
                  open={openSelect}
                  onOpen={() => setOpenSelect(true)}
                  onClose={() => setOpenSelect(false)}
                  value={selectedOrganization}
                  onFocus={handleAllOrganization}
                  onChange={(e) => setSelectedOrganization(e.target.value)}
                  displayEmpty
                  renderValue={(selectedValue) => {
                    if (!selectedValue) {
                        return "Select an organization";
                    }
                    return selectedValue;}}
                >
                    <MenuItem value="" disabled>Select an organization</MenuItem>
                    {organizations.map((organization, index) => 
                        <MenuItem key={index} value={organization.name}>{organization.name}</MenuItem>
                    )}
                </Select>


                <Button variant="contained" color="primary" onClick={handleOrganizationUser} disabled={!isUserAuthenticated}>
                    Add User to Organization
                </Button>
                {!isUserAuthenticated && 
                    <Typography variant="body2" color="textSecondary" style={{marginLeft: '10px'}}>
                        You should be logged in to perform the action
                    </Typography>
                }

            </div>
          
        {selectedUserId && selectedOrganization && 
            <Typography variant="body1" style={{marginTop: '20px'}}>
                Selected User: {users.find(user => user.id === selectedUserId)?.email}
            </Typography>
        }
        {selectedOrganization && 
            <Typography variant="body1" style={{marginTop: '10px'}}>
                Selected Organization: {selectedOrganization}
            </Typography>
        }


            {message && 
                <Typography variant="body1" color="error">
                    {message}
                </Typography>
            }
          

        </Container>
    );
}

export default Organization;
