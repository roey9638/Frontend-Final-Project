import { makeAutoObservable } from "mobx";
import { ServerError } from "../Models/serverError";

//We [use] this [store] in [order] to [get and Store] the [Error] will get from the [API]
export default class CommonStore {
    error: ServerError | null = null;


    constructor() {
        makeAutoObservable(this);
    }

    setServerError = (error: ServerError) => {
        this.error = error;
    }
}