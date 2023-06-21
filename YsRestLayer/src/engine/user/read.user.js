
/****** Importing all the required modules ******/

const { Prisma } = require('@prisma/client')


module.exports = class readuser {
    async readuser(databaseConnector, request) {
        let output
        try {
            if (request.limit === 0) {
                throw { output: null, status: 400, message: "The limit must be greater than zero" }
            } else {
                console.log('%c⧭', 'color: #d90000', request);
                let queryObject = {
                    where: request.filter,
                    take: request.limit,
                    skip: request.page,
                    orderBy: request.sort
                }
                let createUserResponse = null;
                createUserResponse = await databaseConnector.user.findMany(queryObject).catch((error) => {
                    if (error instanceof Prisma.PrismaClientValidationError) {
                        throw { output: null, status: 422, message: JSON.stringify(error.message) }
                    } else {
                        throw { output: null, status: 500, message: JSON.stringify(error.message) }
                    }
                })
                console.log('%c⧭', 'color: #733d00',createUserResponse);
                if (createUserResponse.length === 0) {
                    return { output: [], status: 404, message: "Data not found" }
                }
                else if (createUserResponse != null && createUserResponse != "undefined") {
                    output = { output: createUserResponse, status: 200, message: "Data successfully fetched" }
                    return output
                }
            }
        } catch (error) {
            throw error
        }

    }
}

