import axios from 'axios';


export class UserApi {
    async readUser(reqData: any) {
        try {
            const response = await axios.post('http://localhost:3100/api/rest/js/1.0.0/user/v1/users', reqData);
            return response.data
        } catch (error) {
            console.error(error);
        }
    }
}