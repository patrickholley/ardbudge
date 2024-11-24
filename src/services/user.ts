import BaseService from './base';
import {NewUser} from "@app-types/services.ts";

class UserService extends BaseService {
    constructor() {
        super(`/users`);
    }

    public getUser = async (username: string): Promise<NewUser> =>
        this.get(`/${username}`);

    public createUser = async (_parentId: '', userData: NewUser): Promise<NewUser> =>
        this.post(`/`, userData);

    public updateUser = async (userId: string, userData: NewUser): Promise<NewUser> =>
        this.put(`/${userId}`, userData);

    public deleteUser = async (userId: string): Promise<void> =>
        this.delete(`/${userId}`);
}

export default UserService;
