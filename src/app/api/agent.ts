import axios, { AxiosError, AxiosResponse } from "axios";
//import { url } from "inspector";
//import { resolve } from "path";
import { Activity } from "../Models/activity";
import { toast } from "react-toastify";
import { history } from "../..";
import { store } from "../stores/store";
import { User, UserFormValues } from "../Models/user";
import { config } from "process";

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay)
    })
}

axios.defaults.baseURL = 'http://localhost:5000/api/';

axios.interceptors.request.use(config => {
    const token = store.commonStore.token;

    //This will [Make Sure] that we will [Send] a [token] with [Every] [Request]. Continue Down VV
    //When We [Have] a [token] in our [commonStore]
    if (token) config.headers!.Authorization = `Bearer ${token}`
    return config;
})

axios.interceptors.response.use(async response => {
    await sleep(1000);
    return response;
    //The [AxiosError]. I [Changed] in the the from the [T = unknown] to [T = any]
}, (error: AxiosError) => { //Everything that is not (200) [Response] will be [error: AxiosError / Rejected]
    
    const { data, status, config } = error.response!;

    switch (status) {
        case 400:

            //We do this [In order] to [show] in the [toast/Red erros] on the [bottom rigth]. Continue Down VV.
            //[In order] to [show] the [data/ the string] We [getting from] the [API] In the [BuggyController]
            //We getting the [Error Number / status / StatusCode] When we call the [Function] [handleBadRequest()] in the [TestError Component]
            //This [axios.interceptors.response] [knows] [by itself] what [Error] we [Got] [from] the [API]. In this [case] the [Error] we [get] [from] the [API] is [in] the [BuggyController]
            if (typeof data === 'string') {
                toast.error(data);
            }

            //The [config.method === 'get'] is to if the [400 Error] that's [coming from] the [API] is a [Get methood] example -> [HttpGet("bad-request")]
            //The [data.errors.hasOwnProperty('id')] is to [check] if the [400 Error] that's [coming from] the [API] is a [Get methood] that has a [Property] example -> [HttpGet("bad-request")/("{id}")] Or [HttpGet("{id}")]
            if(config.method === 'get' && data.errors.hasOwnProperty('id'))
            {
                history.push('/not-found');
            }

            if (data.errors) 
            {
                //Here I'm [storing] the [Diffrent] [Errors]
                const modalStateErrors = [];
                //Here i want to go threw all the [Errors] and [push] [them] [into] the [modalStateErrors] [array].
                for (const key in data.errors){
                    //The [key] is to [look for] the [specific] [key] [inside] the [data errors]
                    if(data.errors[key]) {
                        modalStateErrors.push(data.errors[key]);
                    }
                }
                //Here i want to [flattent] the [array] [in order] to just [see] the [Validation Errors]. Continue Downn VV.
                //[Rather then] [seeing them] in the [Surrounding Object]
                //We use to [throw] this [back] the [Component].
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
            //We [use] this [function] that's [coming from] the [commonStore Component] in [order] to [get/store] the [Error] [from] the [API]. Continue Downn vv.
            //So Now the [data] is [stored] [in that] are [observable]
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

const Account = {
    current: () => requests.get<User>('/account'),
    login: (user: UserFormValues) => requests.post<User>('/account/login', user),
    register: (user: UserFormValues) => requests.post<User>('/account/register', user)
}

const agent = {
    Activities,
    Account
}

export default agent;