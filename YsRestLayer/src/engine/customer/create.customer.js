
/****** Importing all the required modules ******/

const { Prisma,PrismaClient } = require('@prisma/client')


module.exports = class createCustomer {

    async createCustomer(databaseConnector, request) {
        let output
        try {
            const {
                id,
                firstName,
                lastName,
                address,
                email,
                password,
                phoneNumber,
                status,
                createdAt,
                createdBy
            } = request
            let createCustomerResponse = await databaseConnector.customer.create({
                data: {
                    id,
                    firstName,
                    lastName,
                    address,
                    email,
                    password,
                    phoneNumber,
                    status,
                    createdAt,
                    createdBy
                },
            }).catch((error) => {
                console.log('%c⧭', 'color: #ffa640', error);
                if (error instanceof Prisma.PrismaClientValidationError) {
                    output = { output: null, status: 422, message: JSON.stringify('Unprocessable Entity') }
                } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
                    output = { output: null, status: 422, message: JSON.stringify('Unprocessable Entity') }
                } else {
                    output = { output: null, status: 500, message: JSON.stringify('Internal Server Error') }
                }
            })
            if (createCustomerResponse) {
                output = { output: createCustomerResponse, status: 200, message: 'user Successfully Created' }
            }
        }

        catch (error) {
            output = { output: null, status: 500, message: JSON.stringify(error.message) }
        }
        return output
    }
}

