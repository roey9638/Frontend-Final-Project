import { observer } from "mobx-react-lite";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { Button, Form, Segment } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";
import { v4 as uuid } from 'uuid';



export default observer(function ActivityForm() {

    //The [useHistory] will take to the [Route/Component] that i want. I [use it] in the [handleSubmit()] [function].
    const history = useHistory();
    const { activityStore } = useStore();
    const { createActivity, updateActivity, 
            loading, loadActivity, loadingInitial} = activityStore;
    const {id} = useParams<{id: string}>();

    const [activity, setActivity] = useState({
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: ''
    });

    useEffect(() => {
        if(id)
        {
            loadActivity(id).then(activity => setActivity(activity!))
        }
    }, [id, loadActivity])

    function handleSubmit(){
        if(activity.id.length === 0)
        {
            let newActivity = {
                ...activity,
                id: uuid()
            };
            createActivity(newActivity).then(() => history.push(`/activities/${newActivity.id}`))
        }
        else
        {
            updateActivity(activity).then(() => history.push(`/activities/${activity.id}`))
        }
    }

    //This [function] gets and [event] because we call it in [onChange()].
    //And we call this [function] in the [Form.Input placeholder='Title']!!!
    //The (event) will be [either] a [type off] [ChangeEvent<HTMLInputElement>] Or [ChangeEvent<HTMLTextAreaElement>]
    function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>){
        //This [{name, value}] [matches] the (two) [fields] inside the [Form.Input]. Because that's [where we call] [this function]
        const {name, value} = event.target;
        //Here we do [spread] to the [state activity].
        //Then we take out the [property] that [with the] [key] of [name]. will be set to the [value]
        setActivity({...activity, [name]: value})
    }

    if(loadingInitial)
    {
        return <LoadingComponent content='Loading activity...' />
    }

    return(
        <Segment clearing>
            <Form onSubmit={handleSubmit} autoComplete='off'>
                <Form.Input placeholder='Title' value={activity.title} name='title' onChange={handleInputChange} />
                <Form.TextArea placeholder='Description' value={activity.description} name='description' onChange={handleInputChange} />
                <Form.Input placeholder='Category' value={activity.category} name='category' onChange={handleInputChange} />
                <Form.Input type="date" placeholder='Date' value={activity.date} name='date' onChange={handleInputChange} />
                <Form.Input placeholder='City' value={activity.city} name='city' onChange={handleInputChange} />
                <Form.Input placeholder='Venue' value={activity.venue} name='venue' onChange={handleInputChange} />

                <Button loading={loading} floated='right' positive type='submit' content='Submit' />
                <Button as={Link} to='/activities' floated='right'  type='button' content='Cancel' />
            </Form>
        </Segment>
    );
})