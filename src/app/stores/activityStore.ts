import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity, ActivityFormValues } from "../Models/activity";
import { format } from 'date-fns';
import { store } from "./store";
import { Profile } from "../Models/profile";


export default class ActivityStore {

    activityRegistry = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;

    constructor() {
        makeAutoObservable(this)
    }

    get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort((a, b) =>
            a.date!.getTime() - b.date!.getTime());
    }

    get groupedActivities() {
        return Object.entries(
            //Here we geting the [activitiesByDate] [function] that [return] an [array] of [dates]. Continue Down VV.
            //Then we do [reduce] to this [array]. and [reduce] is making a [Object] ou of this [array]. Continue Down VV.
            //And it needs to Params (activities, activity). the [activities] [List] and individual [activity]
            this.activitiesByDate.reduce((activities, activity) => {
                //Here I'm [geting] the [date] of each individual [activity]. And we split the [date]. Continue Down VV.
                //It will [repesent] our [key] [for each] [objects]
                const date = format(activity.date!, 'dd MMM yyyy')

                //Here ( activities[date] = activities[date] ) we access with the [property] [date] inside [activities] the that match that [date]. Continue Down VV.
                //If its [TRUE] we do ( [...activities[date], activity] ) -> which what is does is [...activities/spread/copy] then [specify] which [object] in the [array] we want with [[date]/...activities( [date])]. Continue Down VV.
                //Then we add the [, activity] that we [executing] this [callback] [function]
                //And if its not [TRUE] we do what after the (:), we will create new [array] with that [activity]
                activities[date] = activities[date] ? [...activities[date], activity] : [activity];
                return activities;
                //We need to give  a [starting object] to [reduce] [function] and he will have [initialValue].
                //We [specify] that [starting object] as ([key: string]) as the type of our key for the object. And the [Value] of ([key: string]) is [gonna] be [Activity[]]
                //[Important] --> Now we have an [array] of [Objects].And The [key: string] is gonna be the [activity.date] and [For Each] [date] we will Have an [Array] of [Activitites] inside that [date]
            }, {} as { [key: string]: Activity[] })
        )
    }

    loadActivities = async () => {
        this.loadingInitial = true;
        try {
            const activities = await agent.Activities.list();
            activities.forEach(activity => {
                this.setActivity(activity);
            })
            this.setLoadingInitial(false);
        }
        catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }
    }


    loadActivity = async (id: string) => {
        let activity = this.getActivity(id);
        if (activity) {
            this.selectedActivity = activity;
            return activity;
        }
        else {
            this.loadingInitial = true;
            try {
                activity = await agent.Activities.details(id);
                this.setActivity(activity);
                runInAction(() => {
                    this.selectedActivity = activity;
                })
                this.setLoadingInitial(false);
                return activity;
            }
            catch (error) {
                console.log(error);
                this.setLoadingInitial(false);
            }
        }
    }

    private setActivity = (activity: Activity) => {
        const user = store.userStore.user;
        if (user) {
            //If the [user.username] is in the [activity.attendees] as an [attendee]. Then [activity.isGoing] will be [True]
            activity.isGoing = activity.attendees!.some(
                a => a.username === user.username
            )
            activity.isHost = activity.hostUsername === user.username;
            activity.host = activity.attendees?.find(x => x.username === activity.hostUsername);
        }
        //This [activity.date.split('T')[0];] will [split] the [first part] of the [array] becuase of this ([0]), so that we only see the [dd/mm/yyy]
        activity.date = new Date(activity.date!);
        this.activityRegistry.set(activity.id, activity);
    }

    private getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    createActivity = async (activity: ActivityFormValues) => {
        const user = store.userStore.user;
        const attendee = new Profile(user!);
        try {
            await agent.Activities.create(activity);
            const newActivity = new Activity(activity);
            newActivity.hostUsername = user!.username;
            newActivity.attendees = [attendee];
            this.setActivity(newActivity);
            runInAction(() => {
                this.selectedActivity = newActivity;
            })
        }
        catch (error) {
            console.log(error);

        }
    }

    updateActivity = async (activity: ActivityFormValues) => {
        try {
            await agent.Activities.update(activity);
            runInAction(() => {
                if (activity.id) {
                    let updatedActivity = { ...this.getActivity(activity.id), ...activity }
                    this.activityRegistry.set(activity.id, updatedActivity as Activity);
                    this.selectedActivity = updatedActivity as Activity;
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    deleteActivity = async (id: string) => {
        this.loading = true;
        try {
            await agent.Activities.delete(id);
            runInAction(() => {
                this.activityRegistry.delete(id);
                this.loading = false;
            })
        }
        catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }


    updateAttendance = async () => {
        const user = store.userStore.user;
        this.loading = true;
        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(() => {
                //This is for if the [attendee] want's to [Leave/Cancelle] the [Activity]
                if (this.selectedActivity?.isGoing) {
                    this.selectedActivity.attendees =
                        this.selectedActivity.attendees?.filter(a => a.username !== user?.username);
                    this.selectedActivity.isGoing = false;
                } else {
                    //This is for if the [attendee] want's to [Join] the [Activity]
                    const attendee = new Profile(user!);
                    this.selectedActivity?.attendees?.push(attendee);
                    this.selectedActivity!.isGoing = true;
                }
                this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!)
            })
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.loading = false);
        }
    }

    cancelActivityToggle = async () => {
        this.loading = true;
        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(() => {
                this.selectedActivity!.isCancelled = !this.selectedActivity?.isCancelled;
                this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
            })
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.loading = false);
        }
    }

    clearSelectedActivity = () => {
        this.selectedActivity = undefined;
    }

}