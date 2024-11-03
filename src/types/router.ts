export enum PageComponents {
    Landing = 'landing-page',
    Budge = 'budge-page'
}

export type PageComponent = `${PageComponents}`;
export type Page = keyof typeof PageComponents;

export enum Paths {
    Landing = '/',
    Budge = '/budge/:id'
}

export type Path = `${Paths}`;
export type StaticPaths = Extract<Path, '/' | '/budge'>;
export type DynamicPath<T extends string> = T extends `${infer Path}/:id` ? `${Path}/${string}` : T;
export type Routes = Record<StaticPaths | DynamicPath<Extract<Path, '/budge/:id'>>, PageComponent>;
