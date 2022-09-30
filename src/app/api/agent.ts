import axios, { AxiosError, AxiosResponse } from "axios";
//import { url } from "inspector";
//import { resolve } from "path";
import { Activity } from "../Models/activity";
import { toast } from "react-toastify";
import { history } from "../..";
import { store } from "../stores/store";

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay)
    })
}

axios.defaults.baseURL = 'http://localhost:5000/api/';

axios.interceptors.response.use(async response => {
    await sleep(1000);
    return response;
    //The [AxiosError]. I [Changed] in the the from the [T = unknown] to [T = any]
}, (error: AxiosError) => { //Everything that is not (200) [Response] will be [error: AxiosError / Rejected]
    
    const { data, status, config } = error.response!;

    switch (status) {
        case 400:

            if (typeof data === 'string') {
                toast.error(data);
            }

            if(config.method === 'get' && data.errors.hasOwnProperty('id'))
            {
                history.push('/not-found');
            }

            if (data.errors) 
            {
                const modalStateErrors = [];
                for (const key in data.errors){
                    if(data.errors[key]) {
                        modalStateErrors.push(data.errors[key]);
                    }
                }
                throw modalStateErrors.flat();
            }
            break;

        case 401:
            toast.error('Unauthorised');
            break;

        case 404:
            history.push('/not-found');
            break;

        case 500:
            store.commonStore.setServerError(data);
            history.push('/server-error');
            break;
    }

    return Promise.reject(error);

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
    update: (activity: Activity) => requests.put<void>(`/activities/${activity.id}`, activity),
    delete: (id: string) => requests.del<void>(`/activities/${id}`)
}

const agent = {
    Activities
}

export default agent;