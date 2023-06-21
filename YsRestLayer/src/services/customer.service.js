const express = require('express');
const { PrismaClient } = require('@prisma/client');
const createCustomer = require('../engine/customer/create.customer');
const readCustomer = require('../engine/customer/read.customer');
const updateCustomer = require("../engine/customer/update.customer")

const prisma = new PrismaClient()
const customerService = express.Router();
const CreateCustomer = new createCustomer()
const ReadCustomer = new readCustomer()
const UpdateCustomer = new updateCustomer()

customerService.post("/customer", async (request, response) => {
    try {
        const createUser = await CreateCustomer.createCustomer(prisma, request.body)
        response.json(createUser)
    } catch (error) {
        response.json(error)
    }
})

customerService.post("/readcustomer", async (request, response) => {
    try {
        const readUser = await ReadCustomer.readCustomer(prisma, request.body)
        response.json(readUser)
    } catch (error) {
        response.json(error)
    }
})

customerService.patch("/updatecustomer", async (request, response) => {
    try{

        console.log('%c⧭', 'color: #1d5673',request.body );
        const updateInvoiceRespose = await UpdateCustomer.updateMultipleCustomers(prisma, request.body)
        response.json(updateInvoiceRespose)
    }catch(error){
        response.json(error.message)
    }
})

module.exports = customerService