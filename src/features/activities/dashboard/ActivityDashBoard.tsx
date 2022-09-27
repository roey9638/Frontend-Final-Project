import React, { useEffect } from "react";
import { Grid, GridColumn } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import { useStore } from "../../../app/stores/store";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { observer } from 'mobx-react-lite';
import ActivityFilters from "./ActivityFilters";



export default observer(function ActivityDashBoard() {

    //Here I'm [destructuring] the [activityStore] fron the [useStore()].
    const { activityStore } = useStore();
    const { loadActivities, activityRegistry } = activityStore

    useEffect(() => {
       if(activityRegistry.size <= 1)
       {
         loadActivities();
       } 
    }, [activityRegistry.size, loadActivities])


    //What this do - If The [activityStore.loadingInitial] which is a [property] in [ActivityStore.ts]. then will [return/execute] the [<LoadingComponent content='Loading app' />].
    if (activityStore.loadingInitial) 
    {
        return <LoadingComponent content='Loading app' />
    }

    return (
        <Grid>
            <Grid.Column width='10'>
                <ActivityList />
            </Grid.Column>

            <GridColumn width='6'>
                <ActivityFilters />
            </GridColumn>

        </Grid>
    )
})