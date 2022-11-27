import React, { useEffect, useState } from "react";
import { Grid, Loader } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import { useStore } from "../../../app/stores/store";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { observer } from 'mobx-react-lite';
import ActivityFilters from "./ActivityFilters";
import { PagingParams } from "../../../app/Models/pagination";
import InfiniteScroll from 'react-infinite-scroller';
import ActivityListItemPlaceholder from "./ActivityListItemPlaceholder";


export default observer(function ActivityDashBoard() {

    //Here I'm [destructuring] the [activityStore] fron the [useStore()].
    const { activityStore } = useStore();
    const { loadActivities, activityRegistry, setPagingParams, pagination } = activityStore
    const [loadingNext, setLoadingNext] = useState(false);

    function handleGetNext() {
        setLoadingNext(true);
        setPagingParams(new PagingParams(pagination!.currentPage + 1))
        loadActivities().then(() => setLoadingNext(false));
    }

    useEffect(() => {
        if (activityRegistry.size <= 1) {
            loadActivities();
        }
    }, [activityRegistry.size, loadActivities])


    //What this do - If The [activityStore.loadingInitial] which is a [property] in [ActivityStore.ts]. then will [return/execute] the [<LoadingComponent content='Loading app' />].
    if (activityStore.loadingInitial && !loadingNext) {
        return <LoadingComponent content='Loading activities...' />
    }

    return (
        <Grid>
            <Grid.Column width='10'>
                {activityStore.loadingInitial && !loadingNext ? (
                    <>
                        <ActivityListItemPlaceholder />
                        <ActivityListItemPlaceholder />
                    </>
                ) : (
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={handleGetNext}
                        hasMore={!loadingNext && !!pagination && pagination.currentPage < pagination.totalPages}
                        initialLoad={false}
                    >
                        <ActivityList />
                    </InfiniteScroll>
                )}
            </Grid.Column>
            <Grid.Column width='6'>
                <ActivityFilters />
            </Grid.Column>

            <Grid.Column width={10}>
                <Loader active={loadingNext} />
            </Grid.Column>
        </Grid>
    )
})