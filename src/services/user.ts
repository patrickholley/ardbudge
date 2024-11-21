import BaseService from './base';
import {User} from "@app-types/services.ts";

class UserService extends BaseService {
    constructor() {
        super(`/users`);
    }

    public getUser = async (userId: string): Promise<User> =>
        this.get(`/${userId}`);

    public createUser = async (userData: User): Promise<User> =>
        this.post(`/`, userData);

    public updateUser = async (userId: string, userData: User): Promise<User> =>
        this.put(`/${userId}`, userData);

    public deleteUser = async (userId: string): Promise<void> =>
        this.delete(`/${userId}`);
}

export default UserService;
