import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import mockAxios from 'jest-mock-axios';
import Organization from './сomponents/Organization';
import { BrowserRouter as Router } from 'react-router-dom';
import SignUp from './сomponents/SignUp';

test('renders SignUp component', () => {
    render(<SignUp />);
    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
});
test('рендерится кнопка Войти', () => {
    render(<App />);
    const buttonElement = screen.getByText(/Sign In/i);
    expect(buttonElement).toBeInTheDocument();
  });
  

test('displays error message for invalid email', () => {
    render(<SignUp />);
    
  
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const signUpButton = screen.getByText(/Sign Up/i);


    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123' } });
    
  
    fireEvent.click(signUpButton);

 
    expect(screen.getByText(/Please enter a valid email address./i)).toBeInTheDocument();
});

afterEach(() => {
  mockAxios.reset();
});

test('renders Organization component and adds a new organization', async () => {
    const { getByLabelText, getByText } = render(
    <Router>
    <Organization />
    </Router> );
    const orgNameInput = getByLabelText('Organization Name');
    fireEvent.change(orgNameInput, { target: { value: 'New Org' } });

    const newOrgButton = getByText('New Organization');
    console.log('Before click');
fireEvent.click(newOrgButton);
console.log('After click');


    await waitFor(() => {
      expect(mockAxios.post).toHaveBeenCalledWith("http://127.0.0.1:5000/create-org", { name: 'New Org' });

    });

   
    expect(screen.getByText("Successfully added organization!")).toBeInTheDocument();
});

test('renders Sign In button', () => {
  render(<App />);
  const buttonElement = screen.getByText(/Sign In/i);
  expect(buttonElement).toBeInTheDocument();
});

