import BaseService from './base';
import {UserCredentials, User} from "@app-types/services.ts";

class UserService extends BaseService {
    constructor() {
        super(`/users`);
    }

    // users do not have parentIds - _parentId present purely for compatibility with createUniqueEntity
    public createUser = async (_parentId: string, userData: UserCredentials): Promise<UserCredentials> =>
        this.post(`/`, userData);

    public updateUser = async (userId: string, userData: User): Promise<User> =>
        this.put(`/${userId}`, userData);

    public deleteUser = async (userId: string): Promise<void> =>
        this.delete(`/${userId}`);

    public login = async (name: string, password: string): Promise<any> =>
        this.post(`/login`, { name, password });
}

export default UserService;
