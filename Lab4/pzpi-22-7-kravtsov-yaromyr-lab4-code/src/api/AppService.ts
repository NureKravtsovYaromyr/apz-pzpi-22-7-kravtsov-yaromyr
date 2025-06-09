import { AxiosResponse } from "axios";
import $api from ".";


export interface AuthResponse {
    accessToken: string
}
export default class AppService {
    static async login(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
        console.log(email,password)
        return $api.post('/users/login', {
            email,
            password
        })
    }
}

