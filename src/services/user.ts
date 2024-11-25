import BaseService from './base';
import {NewUser, User} from "@app-types/services.ts";

class UserService extends BaseService {
    constructor() {
        super(`/users`);
    }

    public getUser = async (username: string): Promise<User> =>
        this.get(`/${username}`);

    // users do not have parentIds - _parentId present purely for compatibility with createUniqueEntity
    public createUser = async (_parentId: string, userData: NewUser): Promise<NewUser> =>
        this.post(`/`, userData);

    public updateUser = async (userId: string, userData: User): Promise<User> =>
        this.put(`/${userId}`, userData);

    public deleteUser = async (userId: string): Promise<void> =>
        this.delete(`/${userId}`);
}

export default UserService;
