import axios, {AxiosRequestConfig} from 'axios';
import { User } from './UserContext';
import { setCookie, getCookie } from './utils';
import { ITodo } from './todo.type';

const HOST = 'http://localhost:9000';

function GetAxiosConfig(): AxiosRequestConfig {
    return {
        responseType: 'json',
        headers: {
            'x-auth': getCookie('token')
        }
    }
}

export function ApiLogin(username: string, password: string): Promise<User | null> {
    return new Promise((resolve, reject) => {
        axios.post(`${HOST}/users/login`, {username, password}, GetAxiosConfig()).then(res => {
            setCookie('token', res.headers['x-auth'], 1000);
            return resolve(res.data as User);
        }).catch(e => reject(e));
    })
}

export function ApiSignup(username: string, password: string): Promise<User | null> {
    return new Promise((resolve, reject) => {
        axios.post(`${HOST}/users`, {username, password}, GetAxiosConfig()).then(res => {
            setCookie('token', res.headers['x-auth'], 1000);
            return resolve(res.data as User);
        }).catch(e => reject(e));
    })
}

export function ApiLogout(): Promise<void> {
    return new Promise((resolve, reject) => {
        axios.get(`${HOST}/users/logout`, GetAxiosConfig()).then(() => resolve()).catch((e) => reject(e));
    })
}

export function GetMe(): Promise<User | null> {
    return new Promise((resolve, reject) => {
        axios.get(`${HOST}/users/me`, GetAxiosConfig()).then(res => {
            return resolve(res.data as User);
        }).catch(e => reject(e));
    });
}

export function PostTodo(todo: ITodo): Promise<ITodo> {
    return new Promise((resolve, reject) => {
        axios.post(`${HOST}/todos`, todo, GetAxiosConfig()).then(res => {
            return resolve(res.data);
        }).catch(e => reject(e));
    })
}

export function GetMyTodos(): Promise<ITodo[]> {
    return new Promise((resolve, reject) => {
        axios.get(`${HOST}/todos/my-todos`, GetAxiosConfig()).then(res => {
            return resolve(res.data);
        }).catch(e => reject(e));
    })
}

export function UpdateTodoText(id: string, text: string): Promise<ITodo> {
    return new Promise((resolve, reject) => {
        axios.post(`${HOST}/todos/${id}`, {text}, GetAxiosConfig()).then(res => {
            return resolve(res.data);
        }).catch(e => reject(e));
    })
}

export function UpdateTodoStatus(id: string, completed: boolean, text: string): Promise<ITodo> {
    return new Promise((resolve, reject) => {
        axios.post(`${HOST}/todos/${id}`, {completed, text}, GetAxiosConfig()).then(res => {
            return resolve(res.data);
        }).catch(e => reject(e));
    })
}

export function DeleteTodo(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        axios.delete(`${HOST}/todos/${id}`, GetAxiosConfig()).then(() => {
            return resolve(true);
        }).catch(() => reject(false));
    })
}