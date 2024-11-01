import styled from "@emotion/styled";
import image from '../assets/student.png'
import {
    Avatar, Modal, Button, createTheme, Paper, Table, TableBody, TableCell,
    tableCellClasses, TableContainer, TableHead, TableRow, ThemeProvider, Box, Typography, TextField
} from "@mui/material"
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import request from "../services/request";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const StudentsPage = () => {
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));
    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));
    const theme = createTheme();
    const [loading, setLoading] = useState(false);
    const [students, setStudents] = useState([]);
    const { id: teacherId } = useParams();
    const [open, setOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSelectedStudent((prevStudent) => ({
            ...prevStudent,
            [name]: value,
        }));
    };

    const handleOpen = (student) => {
        setSelectedStudent(student);
        setOpen(true);
    };

    const handleClose = () => {
        setSelectedStudent(null);
        setOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await request.put(`/teachers/${teacherId}/students/${selectedStudent.id}`, selectedStudent);
            setStudents((prevStudents) =>
                prevStudents.map((student) =>
                    student.id === selectedStudent.id ? selectedStudent : student
                )
            );
            setOpen(false);
            alert("Ma'lumotlar muvaffaqiyatli yangilandi!");
            handleClose();
        } catch (error) {
            console.error("Failed to update student:", error);
            alert("Ma'lumotlarni yangilashda xatolik yuz berdi!");
        }
    }

    const handleDelete = async (studentId) => {
        try {
            await request.delete(`/teachers/${teacherId}/students/${studentId}`);
            setStudents(students.filter(student => student.id !== studentId))
            alert("Ma'lumotlar muvaffaqiyatli o'chirildi!");
        }
        catch (error) {
            console.error("Talabani o'chirishda xato:", error);
        }
    }

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login');
        } else {
            const getStudents = async () => {
                setLoading(true);
                try {
                    const res = await request.get(`/teachers/${teacherId}/students`);
                    setStudents(res.data);
                } catch (error) {
                    console.error("Error fetching students:", error);
                } finally {
                    setLoading(false);
                }
            };
            getStudents();
        }
    }, [navigate, teacherId]);

    if (loading) {
        return <h3 className="text-center">Loading...</h3>;
    }

    return (
        <ThemeProvider theme={theme}>
            <div className="mx-3">
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>ID</StyledTableCell>
                                <StyledTableCell>Full name</StyledTableCell>
                                <StyledTableCell>Phone number</StyledTableCell>
                                <StyledTableCell>Email</StyledTableCell>
                                <StyledTableCell>BirthDate</StyledTableCell>
                                <StyledTableCell>Image</StyledTableCell>
                                <StyledTableCell align="center">Actions</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {students.map(student => (
                                <StyledTableRow key={student.id}>
                                    <StyledTableCell component="th" scope="row">{student.id}</StyledTableCell>
                                    <StyledTableCell>{student.firstName + " " + student.lastName}</StyledTableCell>
                                    <StyledTableCell>{student.phoneNumber}</StyledTableCell>
                                    <StyledTableCell>{student.email}</StyledTableCell>
                                    <StyledTableCell>{student.birthday}</StyledTableCell>
                                    <StyledTableCell><Avatar alt="Remy Sharp" src={image} /></StyledTableCell>
                                    <StyledTableCell align="center">
                                        <Button onClick={() => handleOpen(student)} sx={{ margin: '0px 8px 0px 0px' }} variant="contained" color="warning">Edit</Button>
                                        <Button onClick={() => handleDelete(student.id)} sx={{ margin: '0px 8px 0px 0px' }} variant="contained" color="error">Delete</Button>
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Modal open={open} onClose={handleClose}>
                    <Box sx={style}>
                        <Typography variant="h6" component="h2">
                            Edit Student
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <TextField
                                label="First name"
                                name="firstName"
                                fullWidth
                                variant="standard"
                                margin="normal"
                                value={selectedStudent?.firstName || ''}
                                onChange={handleChange}
                            />
                            <TextField
                                label="Last name"
                                name="lastName"
                                fullWidth
                                variant="standard"
                                margin="normal"
                                value={selectedStudent?.lastName || ''}
                                onChange={handleChange}
                            />
                            <TextField
                                label="Birthday"
                                name="birthday"
                                fullWidth
                                variant="standard"
                                margin="normal"
                                value={selectedStudent?.birthday || ''}
                                onChange={handleChange}
                            />
                            <TextField
                                label="Phone number"
                                name="phoneNumber"
                                fullWidth
                                variant="standard"
                                margin="normal"
                                value={selectedStudent?.phoneNumber || ''}
                                onChange={handleChange}
                            />
                            <TextField
                                label="Email"
                                name="email"
                                fullWidth
                                variant="standard"
                                margin="normal"
                                value={selectedStudent?.email || ''}
                                onChange={handleChange}
                            />
                            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                                Save Changes
                            </Button>
                        </form>
                    </Box>
                </Modal>
            </div>
        </ThemeProvider>
    );
}

export default StudentsPage;
