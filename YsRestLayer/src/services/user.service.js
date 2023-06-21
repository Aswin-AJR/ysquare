const express = require('express');
const { PrismaClient } = require('@prisma/client');
const createUser = require('../engine/user/create.user');
const readuser = require('../engine/user/read.user');
const updateUser = require('../engine/user/update.user');

const prisma = new PrismaClient()
const UserService = express.Router();
const ReadUser = new readuser()
const CreateUser = new createUser()
const UpdateUser = new updateUser()

UserService.post("/user", async (request, response) => {
    try {
        const createUser = await CreateUser.createUser(prisma, request.body)
        response.json(createUser)
    } catch (error) {
        response.json(error)
    }
})

UserService.post("/readuser", async (request, response) => {
    try {
        const readUser = await ReadUser.readuser(prisma, request.body)
        response.json(readUser)
    } catch (error) {
        response.json(error)
    }
})

UserService.patch("/updateuser", async (request, response) => {
    try {
        const readUser = await UpdateUser.updateMultipleUsers(prisma, request.body)
        response.json(readUser)
    } catch (error) {
        response.json(error)
    }
})

module.exports = UserService