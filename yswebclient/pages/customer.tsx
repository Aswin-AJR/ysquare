/**
 * @CreatedBy        : Aswin Joseph Raj
 * @CreatedTime      : June 20, 2022
 * @Description      : Customer page for handling the customer module
 **/

import React, { useEffect, useState, useContext } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField } from '@mui/material';
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

export default function Customer(props: any) {
    const userInfo: any = useContext(UserContext);

    // State variables
    const [open, setOpen] = useState(false);
    const [customerData, setCustomerData] = useState([]);
    const [formData, setFormData] = useState<any>({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        phoneNumber: '',
        password: '',
        status: true,
        createdBy: ''
    });

    // Open the dialog for adding a new customer
    const handleClickOpen = () => {
        let object = {
            firstName: '',
            lastName: '',
            email: '',
            address: '',
            phoneNumber: '',
            password: '',
            status: true,
            createdBy: ''
        };
        setFormData(object);
        setOpen(true);
    };

    // Close the dialog
    const handleClose = () => {
        setOpen(false);
    };

    // Handle form input changes
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormData((prevFormData: any) => ({ ...prevFormData, [name]: value }));
    };

    // Handle form submission
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        formData.createdBy = userInfo?.role ? userInfo?.role : 'Customer';

        let response: any = {};
        let id = formData.id;

        if (formData.id) {
            delete formData.id;

            let queryObject = {
                filter: { id: id },
                fields: { ...formData }
            };

            response = await axios.patch('http://localhost:3100/api/ysquare/updatecustomer', queryObject);
        } else {
            response = await axios.post('http://localhost:3100/api/ysquare/customer', formData);
        }

        if (response?.data?.status === 200) {
            message.success({
                content: 'Customer created successfully',
                duration: 3
            });

            let queryObject = {
                filter: { status: true },
                limit: 1000,
                page: 0,
                sort: {}
            };

            const response = await axios.post('http://localhost:3100/api/ysquare/readcustomer', queryObject);

            if (userInfo?.role?.toUpperCase() === 'ADMIN') {
                setCustomerData(response?.data?.output);
            } else if (userInfo?.role?.toUpperCase() === 'ASSISTANT') {
                setCustomerData(
                    response?.data?.output.filter((data: any) => data?.createdBy?.toUpperCase() === 'ASSISTANTS' || data?.createdBy?.toUpperCase() === 'CUSTOMER')
                );
            } else if (userInfo?.role?.toUpperCase() === 'MANAGER') {
                setCustomerData(response?.data?.output.filter((data: any) => data?.createdBy?.toUpperCase() !== 'ADMIN'));
            } else if (userInfo?.createdBy) {
                setCustomerData(response?.data?.output.filter((data: any) => data?.createdBy?.toUpperCase() === 'CUSTOMER'));
            }
        } else {
            message.error({
                content: 'Something went wrong',
                duration: 3
            });
        }
        handleClose();
    };

    // Soft delete a customer
    const handleSoftDelete = async (customer: any) => {
        let queryObject = {
            filter: { id: customer.id },
            fields: { status: false }
        };

        const response = await axios.patch('http://localhost:3100/api/ysquare/updatecustomer', queryObject);

        if (response?.data?.status === 200) {
            message.success({
                content: 'Customer deleted successfully',
                duration: 3
            });

            let queryObject = {
                filter: { status: true },
                limit: 1000,
                page: 0,
                sort: {}
            };

            const response = await axios.post('http://localhost:3100/api/ysquare/readcustomer', queryObject);

            if (userInfo?.role?.toUpperCase() === 'ADMIN') {
                setCustomerData(response?.data?.output);
            } else if (userInfo?.role?.toUpperCase() === 'ASSISTANT') {
                setCustomerData(
                    response?.data?.output.filter((data: any) => data?.createdBy?.toUpperCase() === 'ASSISTANTS' || data?.createdBy?.toUpperCase() === 'CUSTOMER')
                );
            } else if (userInfo?.role?.toUpperCase() === 'MANAGER') {
                setCustomerData(response?.data?.output.filter((data: any) => data?.createdBy?.toUpperCase() !== 'ADMIN'));
            } else if (userInfo?.createdBy) {
                setCustomerData(response?.data?.output.filter((data: any) => data?.createdBy?.toUpperCase() === 'CUSTOMER'));
            }
        } else {
            message.error({
                content: 'Something went wrong',
                duration: 3
            });
        }
    };

    // Edit a customer
    const handleEdit = (data: any) => {
        setFormData(data);
        setOpen(true);
    };

    useEffect(() => {
        if (userInfo?.role?.toUpperCase() === 'ADMIN') {
            setCustomerData(props?.data);
        } else if (userInfo?.role?.toUpperCase() === 'ASSISTANT') {
            setCustomerData(
                props?.data.filter((data: any) => data?.createdBy?.toUpperCase() === 'ASSISTANTS' || data?.createdBy?.toUpperCase() === 'CUSTOMER')
            );
        } else if (userInfo?.role?.toUpperCase() === 'MANAGER') {
            setCustomerData(props?.data.filter((data: any) => data?.createdBy?.toUpperCase() !== 'ADMIN'));
        } else if (userInfo?.createdBy) {
            setCustomerData(props?.data.filter((data: any) => data?.createdBy?.toUpperCase() === 'CUSTOMER'));
        }
    }, [props?.data]);

    return (
        <>
            <div className='adduser'>
                <Button variant='contained' color='primary' size='small' onClick={handleClickOpen}>
                    Add Customer
                </Button>
            </div>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>First Name</TableCell>
                            <TableCell>Last Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Phone Number</TableCell>
                            <TableCell>Created By</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {customerData.length > 0 &&
                            customerData?.map((customer: any) => (
                                <TableRow key={customer.id}>
                                    <TableCell>{customer.id}</TableCell>
                                    <TableCell>{customer.firstName}</TableCell>
                                    <TableCell>{customer.lastName}</TableCell>
                                    <TableCell>{customer.email}</TableCell>
                                    <TableCell>{customer.address}</TableCell>
                                    <TableCell>{customer.phoneNumber}</TableCell>
                                    <TableCell>{customer.createdBy}</TableCell>
                                    <TableCell>{customer.status ? 'Active' : 'Inactive'}</TableCell>
                                    <TableCell>
                                        <DeleteIcon onClick={() => handleSoftDelete(customer)} /> <EditIcon onClick={() => handleEdit(customer)} />
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
                <DialogTitle id='form-dialog-title'>Create Customer</DialogTitle>
                <DialogContent>
                    <DialogContentText>Please fill out the form below:</DialogContentText>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            size='small'
                            label='First Name'
                            name='firstName'
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                            fullWidth
                            margin='normal'
                        />
                        <TextField
                            size='small'
                            label='Last Name'
                            name='lastName'
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                            fullWidth
                            margin='normal'
                        />
                        <TextField
                            size='small'
                            label='Email'
                            name='email'
                            type='email'
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            fullWidth
                            margin='normal'
                        />
                        <TextField
                            size='small'
                            label='Password'
                            name='password'
                            type='password'
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            fullWidth
                            margin='normal'
                        />
                        <TextField
                            size='small'
                            label='Address'
                            name='address'
                            value={formData.address}
                            onChange={handleInputChange}
                            required
                            fullWidth
                            margin='normal'
                        />
                        <TextField
                            size='small'
                            label='Phone number'
                            name='phoneNumber'
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            required
                            fullWidth
                            margin='normal'
                        />
                        <DialogActions>
                            <Button onClick={handleClose} color='primary'>
                                Cancel
                            </Button>
                            <Button type='submit' variant='contained' color='primary'>
                                {formData?.id ? 'Update' : 'Create'}
                            </Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

export const getServerSideProps = async () => {
    let queryObject = {
        filter: {
            status: true
        },
        limit: 1000,
        page: 0,
        sort: {}
    };

    const response = await axios.post('http://localhost:3100/api/ysquare/readcustomer', queryObject);

    return {
        props: { data: response?.data?.output }
    };
};
