import BaseService from './base';

class LoginService extends BaseService {
    constructor() {
        super(`/login`);
    }

    public login = async (name: string, password: string): Promise<any> =>
        this.post(`/`, { name, password });
}

export default LoginService;
