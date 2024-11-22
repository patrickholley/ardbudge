export enum PageComponents {
    Landing = 'landing-page',
    Login = 'login-page',
    Budget = 'budget-page'
}

export type PageComponent = `${PageComponents}`;
export type Page = keyof typeof PageComponents;

export enum Paths {
    Landing = '/',
    Login = '/login',
    Budget = '/budget/:id'
}

export type Path = `${Paths}`;
export type StaticPaths = Extract<Path, `${Paths}`>;
export type DynamicPath<T extends string> = T extends `${infer Path}/:id` ? `${Path}/${string}` : T;
export type Routes = Record<StaticPaths | DynamicPath<Extract<Path, '/budget/:id'>>, PageComponent>;
