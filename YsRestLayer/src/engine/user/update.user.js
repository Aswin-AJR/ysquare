

/****** Importing all the required modules ******/ 
const {Prisma, PrismaClient} = require('@prisma/client')

const prisma = new PrismaClient()


module.exports =  class updateUser{


    async updateMultipleUsers(databaseConnector, request){
        try{
            let updateMultipleUsersResponse = await prisma.user.updateMany({
                where: request.filter,
                data: request.fields  
            }).catch((error) =>{
                if(error instanceof Prisma.PrismaClientValidationError){
                    throw { output:null, status:422, message:JSON.stringify(error.message)}
                }
                else{
                    throw { output:null, status:500, message:JSON.stringify(error.message)}
                }
            })
            if(updateMultipleUsersResponse.count === 0){
                throw {output: null, status:404, message:"Data not found"}
            }else if(updateMultipleUsersResponse.count > 0){
                return {output:updateMultipleUsersResponse, status:200, message:"Successfully updated the data"}
            }
        }catch(error){
            throw error
        }
    }
}