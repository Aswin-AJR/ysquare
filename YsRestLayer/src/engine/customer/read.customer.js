
/****** Importing all the required modules ******/

const { Prisma } = require('@prisma/client')


module.exports = class readCustomer {
    async readCustomer(databaseConnector, request) {
        let output
        try {
            if (request.limit === 0) {
                throw { output: null, status: 400, message: "The limit must be greater than zero" }
            } else {
                let queryObject = {
                    where: request.filter,
                    take: request.limit,
                    skip: request.page,
                    orderBy: request.sort
                }
                
                let createCustomerResponse = null;
                createCustomerResponse = await databaseConnector.customer.findMany(queryObject).catch((error) => {
                    if (error instanceof Prisma.PrismaClientValidationError) {
                        throw { output: null, status: 422, message: JSON.stringify(error.message) }
                    } else {
                        throw { output: null, status: 500, message: JSON.stringify(error.message) }
                    }
                })
                if (createCustomerResponse.length === 0) {
                    return { output: [], status: 404, message: "Data not found" }
                }
                else if (createCustomerResponse != null && createCustomerResponse != "undefined") {
                    output = { output: createCustomerResponse, status: 200, message: "Data successfully fetched" }
                    return output
                }
            }
        } catch (error) {
            throw error
        }

    }
}

