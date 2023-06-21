
/****** Importing all the required modules ******/

const { Prisma, PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()


module.exports = class createUser {

    async createUser(databaseConnector, request) {
        let output
        try {
            const {
                id,
                firstName,
                lastName,
                email,
                password,
                role,
                status,
                createdAt
            } = request
            let createUserResponse = await prisma.user.create({
                data: {
                    id,
                    firstName,
                    lastName,
                    email,
                    password,
                    role,
                    status,
                    createdAt
                },
            }).catch((error) => {
                if (error instanceof Prisma.PrismaClientValidationError) {
                    output = { output: null, status: 422, message: JSON.stringify('Unprocessable Entity') }
                } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
                    output = { output: null, status: 422, message: JSON.stringify('Unprocessable Entity') }
                } else {
                    output = { output: null, status: 500, message: JSON.stringify('Internal Server Error') }
                }
            })
            if (createUserResponse) {
                output = { output: createUserResponse, status: 200, message: 'user Successfully Created' }
            }
        }

        catch (error) {
            output = { output: null, status: 500, message: JSON.stringify(error.message) }
        }
        return output
    }
}

