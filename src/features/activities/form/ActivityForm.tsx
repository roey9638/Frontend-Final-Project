import React, { ChangeEvent, useState } from "react";
import { Button, Form, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/Models/activity";

interface Props {
    activity: Activity | undefined;
    closeForm: () => void;
    createOrEdit: (activity: Activity) => void;
    submitting: boolean;
}

export default function ActivityForm({activity: selectedActivity, closeForm, createOrEdit, submitting}: Props) {

    //This [initialState] will either be the [Selected Activity] that [pass into here] [from] the [AcitvityDashBoard] or the [properties] that we [would have] [inside] an [activity object]
    const initialState = selectedActivity ?? {
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: ''
    }

    const [activity, setActivity] = useState(initialState);

    function handleSubmit(){
        createOrEdit(activity);
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

    return(
        <Segment clearing>
            <Form onSubmit={handleSubmit} autoComplete='off'>
                <Form.Input placeholder='Title' value={activity.title} name='title' onChange={handleInputChange} />
                <Form.TextArea placeholder='Description' value={activity.description} name='description' onChange={handleInputChange} />
                <Form.Input placeholder='Category' value={activity.category} name='category' onChange={handleInputChange} />
                <Form.Input type="date" placeholder='Date' value={activity.date} name='date' onChange={handleInputChange} />
                <Form.Input placeholder='City' value={activity.city} name='city' onChange={handleInputChange} />
                <Form.Input placeholder='Venue' value={activity.venue} name='venue' onChange={handleInputChange} />

                <Button loading={submitting} floated='right' positive type='submit' content='Submit' />
                <Button onClick={closeForm} floated='right'  type='button' content='Cancel' />
            </Form>
        </Segment>
    );
}