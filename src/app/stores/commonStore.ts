import { makeAutoObservable, reaction } from "mobx";
import { ServerError } from "../Models/serverError";

//We [use] this [store] in [order] to [get and Store] the [Error] will get from the [API]
export default class CommonStore {
    error: ServerError | null = null;
    token: string | null = window.localStorage.getItem('jwt');
    appLoaded = false;


    constructor() {
        makeAutoObservable(this);

        //This is to [React] if the [token] has [Changed]
        //The [token => {}] We [Passing] the [token] as a [Paramater]
        //This [reaction] will [Run] [Only] if the [token] [Changed]
        reaction(
            () => this.token,
            token => {
                if (token) {
                    window.localStorage.setItem('jwt', token)
                } else {
                    window.localStorage.removeItem('jwt')
                }
            }
        )
    }

    setServerError = (error: ServerError) => {
        this.error = error;
    }

    setToken = (token: string | null) => {
        this.token = token;
    }

    setAppLoaded = () => {
        this.appLoaded = true;
    }
}