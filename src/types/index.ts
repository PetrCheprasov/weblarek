export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

//Connection api interfaces 
export interface ISuccessOrder {
    id: string;
    total: number;
}
export interface IErrors { err: string }

export interface IpostProducts extends IBuyer {
    total: number;
    items: string[];
}

export interface IgetProducts {
    total: number;
    items: IProduct[];
}

//Data models interfaces 
export interface IProduct {
    id: string,
    title: string,
    image: string,
    category: string,
    price: number | null,
    description: string
}

export interface IBuyer {
    payment: 'cash' | 'card' | '',
    address: string,
    email: string,
    phone: string,
}

export interface IProductCart extends IProduct {
    inCart: boolean
}

export interface IElementsList {
    elementsList: HTMLElement[];
}