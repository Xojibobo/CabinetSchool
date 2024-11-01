import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const LoginPage = () => {
    //Email: eve.holt@reqres.in
    //Password: cityslicka
    const [login, setLogin] = useState('');;
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://reqres.in/api/login', {
                email: login,
                password: password
            });
            toast.success(<div className="alert alert-success">Login muvaffaqiyatli!</div>);
            localStorage.setItem('token', response.data.token);
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        } catch (error) {

            toast.error(
                <div className="alert alert-danger">
                    Noto‘g‘ri email yoki parol! Qaytadan urinib ko‘ring.
                </div>
            );
            console.log(error)
        }
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            bgcolor="background.default"
        >
            <Paper elevation={3} sx={{ padding: 4, maxWidth: 400, width: '100%' }}>
                <Typography variant="h4" component="h1" textAlign="center" gutterBottom>
                    Login
                </Typography>
                <form onSubmit={handleLogin}>
                    <TextField
                        label="Login"
                        type="text"
                        variant="outlined"
                        fullWidth
                        required
                        margin="normal"
                        onChange={e => setLogin(e.target.value)}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        required
                        margin="normal"
                        onChange={e => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Log In
                    </Button>
                </form>

            </Paper>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </Box>
    );
};

export default LoginPage;
