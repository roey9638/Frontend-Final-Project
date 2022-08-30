import axios, { AxiosResponse } from "axios";
import { url } from "inspector";
import { resolve } from "path";
import { Activity } from "../Models/activity";

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay)
    })
}

axios.defaults.baseURL = 'http://localhost:5000/api/';

axios.interceptors.response.use(async response => {
    try 
    {
        await sleep(1000);
        return response;
    }
    catch (error)
    {
        console.log(error);
        return await Promise.reject(error);
    }
})

//The [<T>] makes are [responseBody] a [Generic] type.
const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
}

const Activities = {
    //This [requests.get('/activities')] will be the [base URL] on (top^^) plus what ever we put after it which wil be the ('/') for example (/activities)
    list: () => requests.get<Activity[]>('/activities'),
    //The [Back ticks (` `)] is so that we could [pass in] the [Id] of a [specific activity]
    details: (id: string) => requests.get<Activity>(`/activities/${id}`),
    create: (activity: Activity) => requests.post<void>('/activities', activity),
    update: (activity: Activity) => requests.put<void>(`/activities/${activity.id}`,activity),
    delete: (id: string) => requests.del<void>(`/activities/${id}`)
}

const agent = {
    Activities
}

export default agent;