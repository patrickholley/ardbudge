export enum PageComponents {
    Home = 'home-page',
}

export type PageComponent = `${PageComponents}`;
export type Page = keyof typeof PageComponents;

export enum Paths {
    Home = '/',
}

export type Path = `${Paths}`;
export type Routes = Record<Path, PageComponent>;
