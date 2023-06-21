/**
 * @CreatedBy        : Aswin Joseph Raj
 * @CreatedTime      : June 20 2022
 * @Description      : User page for handling the user module
 **/

import React, { useEffect, useState, useContext } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
import { UserContext } from './_app';
import { message } from 'antd';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export default function User(props: any) {
    const userInfo: any = useContext(UserContext);

    // State for controlling the dialog open/close
    const [open, setOpen] = useState(false);

    // Configuration for user roles (dropdown options)
    const [userConfig, setUserConfig] = useState<any>([]);

    // User data to display in the table
    const [userData, setUserData] = useState([]);

    // Form data for creating a new user
    const [formData, setFormData] = useState<any>({
        firstName: '',
        lastName: '',
        email: '',
        role: '',
        password: '',
        status: true,
    });

    // Open the dialog
    const handleClickOpen = () => {
        let object = {
            firstName: '',
            lastName: '',
            email: '',
            role: '',
            password: '',
            status: true,
        }
        setFormData(object)
        setOpen(true);
    };

    // Close the dialog
    const handleClose = () => {
        setOpen(false);
    };

    // Handle input changes in the form fields
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormData((prevFormData: any) => ({ ...prevFormData, [name]: value }));
    };

    // Handle role selection in the dropdown
    const handleSelectChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setFormData((prevFormData: any) => ({ ...prevFormData, role: event.target.value as string }));
    };

    // Handle form submission
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        let response: any = {}
        let id = formData.id
        if (formData.id) {
            delete formData.id
            let queryObject = {
                filter: { id: id },
                fields: { ...formData }
            }
            response = await axios.patch('http://localhost:3100/api/ysquare/updateuser', queryObject)

        } else {
            response = await axios.post('http://localhost:3100/api/ysquare/user', formData)
        }
        if (response?.data?.status === 200) {
            message.success({
                content: 'User created successfully',
                duration: 3,
            });
            const response = await axios.post('http://localhost:3100/api/ysquare/readuser', {});
            setUserData(response?.data?.output);
        } else {
            message.error({
                content: 'Something went wrong',
                duration: 3,
            });
        }
        handleClose();
    };
    const handelSoftDelete = async (user: any) => {
        let queryObject = {
            "filter": { "id": user.id },
            "fields": { "status": false }
        }
        const response = await axios.patch('http://localhost:3100/api/ysquare/updateuser', queryObject)
        if (response?.data?.status === 200) {
            message.success({
                content: "user deleted successfully",
                duration: 3,
            })
            let queryObject = {
                "filter": {
                    "status": true
                },
                "limit": 1000,
                "page": 0,
                "sort": {}
            }
            const response = await axios.post('http://localhost:3100/api/ysquare/readuser', queryObject)
            if (userInfo?.role?.toUpperCase() === "ADMIN") {
                setUserData(response?.data?.output)
            } else if (userInfo?.role?.toUpperCase() === "ASSISTANT") {
                setUserData(response?.data?.output.filter((data: any) => data?.createdBy?.toUpperCase() === "ASSISTANTS" || data?.createdBy?.toUpperCase() === "CUSTOMER"))
            } else if (userInfo?.role?.toUpperCase() === "MANAGER") {
                setUserData(response?.data?.output.filter((data: any) => data?.createdBy?.toUpperCase() !== "ADMIN"))
            } else if (userInfo?.createdBy) {
                setUserData(response?.data?.output.filter((data: any) => data?.createdBy?.toUpperCase() === "CUSTOMER"))
            }
        } else {
            message.error({
                content: "something went wrong",
                duration: 3,
            })
        }

    }

    const handleEdit = (data: any) => {
        setFormData(data)
        setOpen(true)
    }

    // Fetch user data and configure user roles based on user's role
    useEffect(() => {
        if (userInfo?.role?.toUpperCase() === 'ADMIN') {
            setUserConfig(['Manager', 'Assistant']);
            setUserData(props?.data);
        } else if (userInfo?.role?.toUpperCase() === 'ASSISTANT') {
            setUserConfig([]);
            setUserData(props?.data.filter((data: any) => data?.role?.toUpperCase() === 'ASSISTANTS'));
        } else if (userInfo?.role?.toUpperCase() === 'MANAGER') {
            setUserConfig(['Assistant']);
            setUserData(props?.data.filter((data: any) => data?.role?.toUpperCase() !== 'ADMIN'));
        }
    }, [props?.data]);

    return (
        <>
            <div className="adduser">
                <Button type="submit" variant="contained" color="primary" size='small' onClick={handleClickOpen}> Add Users</Button>
            </div>

            {/* Table to display user data */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>First Name</TableCell>
                            <TableCell>Last Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {userData.length > 0 &&
                            userData?.map((user: any) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.id}</TableCell>
                                    <TableCell>{user.firstName}</TableCell>
                                    <TableCell>{user.lastName}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell>{user.status ? 'Active' : 'InActive'}</TableCell>
                                    <TableCell><DeleteIcon onClick={() => handelSoftDelete(user)} />  <EditIcon onClick={() => handleEdit(user)} /></TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog for creating a new user */}
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Create User</DialogTitle>
                <DialogContent>
                    <DialogContentText>Please fill out the form below:</DialogContentText>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            size='small'
                            label="First Name"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            size='small'
                            label="Last Name"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            size='small'
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            size='small'
                            label="Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            fullWidth
                            margin="normal"
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="role-label">Role</InputLabel>
                            <Select
                                size='small'
                                labelId="role-label"
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleSelectChange}
                                required
                            >
                                {/* Render dropdown options based on userConfig */}
                                {userConfig.map((data: any, index: any) => (
                                    <MenuItem key={index} value={data}>
                                        {data}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                Cancel
                            </Button>
                            <Button type="submit" variant="contained" color="primary">
                                {formData?.id ? "Update" : "Create"}
                            </Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

// Server-side data fetching
export const getServerSideProps = async () => {
    let queryObject = {
        "filter": {
            "status": true
        },
        "limit": 1000,
        "page": 0,
        "sort": {}
    }
    const response = await axios.post('http://localhost:3100/api/ysquare/readuser', queryObject)
    return {
        props: { data: response?.data?.output },
    };
};
