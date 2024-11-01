import { useEffect, useState } from "react";
import {
    Avatar,
    Box,
    Button,
    Modal,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import request from "../services/request";
import image from '../assets/teacher.png';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${TableCell.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${TableCell.body}`]: {
        fontSize: 14,
    },
}));

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

const DashboardPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [teachers, setTeachers] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [is_save, setIsSave] = useState(false);

    const handleOpen = (teacher) => {
        setSelectedTeacher(teacher);
        setOpen(true);
    };

    const handleClose = () => {
        setSelectedTeacher(null);
        setOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSelectedTeacher((r) => ({
            ...r,
            [name]: value,
        }));
    };

    const handleDelete = async (teacherId) => {
        try {
            await request.delete(`/teachers/${teacherId}`);
            setTeachers(teachers.filter(teacher => teacher.id !== teacherId))
            alert("Ma'lumotlar muvaffaqiyatli o'chirildi!");
        }
        catch (error) {
            console.error("O'qituvchini o'chirishda xato:", error);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await request.put(`/teachers/${selectedTeacher.id}`, selectedTeacher);
            // setTeachers((prevTeachers) =>
            //     prevTeachers.map((teacher) =>
            //         teacher.id === selectedTeacher.id ? selectedTeacher : teacher
            //     )
            // );
            setOpen(false)
            setIsSave(!is_save)
            alert("Ma'lumotlar muvaffaqiyatli yangilandi!");
            handleClose();
        } catch (error) {
            console.error("Failed to update teacher:", error);
            alert("Ma'lumotlarni yangilashda xatolik yuz berdi!");
        }
    };

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login');
        } else {
            const getTeachers = async () => {
                try {
                    setLoading(true);
                    const res = await request.get('/teachers');
                    setTeachers(res.data);
                } catch (error) {
                    console.log("Failed to load teachers:", error);
                } finally {
                    setLoading(false);
                }
            };
            getTeachers();
        }
    }, [navigate]);

    useEffect(() => {
        const getTeachers = async () => {
            try {

                const res = await request.get('/teachers');
                setTeachers(res.data);
            } catch (error) {
                console.log("Failed to load teachers:", error);
            } finally {
                setLoading(false);
            }
        };
        getTeachers();
    }, [is_save]);




    if (loading) {
        return <h3 className="text-center">Loading...</h3>;
    }

    return (
        <div className="mx-3">
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>ID</StyledTableCell>
                            <StyledTableCell>Full name</StyledTableCell>
                            <StyledTableCell>Phone number</StyledTableCell>
                            <StyledTableCell>Email</StyledTableCell>
                            <StyledTableCell>Subject</StyledTableCell>
                            <StyledTableCell>Image</StyledTableCell>
                            <StyledTableCell align="center">Actions</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {teachers.map((teacher) => (
                            <TableRow key={teacher.id}>
                                <StyledTableCell>{teacher.id}</StyledTableCell>
                                <StyledTableCell>{teacher.firstName} {teacher.lastName}</StyledTableCell>
                                <StyledTableCell>{teacher.phoneNumber}</StyledTableCell>
                                <StyledTableCell>{teacher.email}</StyledTableCell>
                                <StyledTableCell>{teacher.subject}</StyledTableCell>
                                <StyledTableCell>
                                    <Avatar alt="Teacher" src={image} />
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    <Button onClick={() => handleOpen(teacher)} variant="contained" color="warning" sx={{ mr: 1 }}>Edit</Button>
                                    <Button onClick={() => handleDelete(teacher.id)} variant="contained" color="error" sx={{ mr: 1 }}>Delete</Button>
                                    <Link className="btn btn-primary" to={`/students/${teacher.id}`}>Students</Link>
                                </StyledTableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Modal open={open} onClose={handleClose}>
                <Box sx={style}>
                    <Typography variant="h6" component="h2">
                        Edit Teacher
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="First name"
                            name="firstName"
                            fullWidth
                            variant="standard"
                            margin="normal"
                            value={selectedTeacher?.firstName}
                            onChange={handleChange}
                        />
                        <TextField
                            label="Last name"
                            name="lastName"
                            fullWidth
                            variant="standard"
                            margin="normal"
                            value={selectedTeacher?.lastName}
                            onChange={handleChange}
                        />
                        <TextField
                            label="Birthday"
                            name="birthday"
                            fullWidth
                            variant="standard"
                            margin="normal"
                            value={selectedTeacher?.birthday}
                            onChange={handleChange}
                        />
                        <TextField
                            label="Phone number"
                            name="phoneNumber"
                            fullWidth
                            variant="standard"
                            margin="normal"
                            value={selectedTeacher?.phoneNumber}
                            onChange={handleChange}
                        />
                        <TextField
                            label="Email"
                            name="email"
                            fullWidth
                            variant="standard"
                            margin="normal"
                            value={selectedTeacher?.email}
                            onChange={handleChange}
                        />
                        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                            Save Changes
                        </Button>
                    </form>
                </Box>
            </Modal>
        </div>
    );
};

export default DashboardPage;
