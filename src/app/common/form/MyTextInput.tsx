import { useField } from 'formik';
import React from 'react';
import { Form, Label } from 'semantic-ui-react';

interface Props {
    placeholder: string;
    name: string;
    label?: string;
}

export default function MyTextInput(props: Props) {
    //[Important] --> The [useField(props.name) will match the [Fields] in the [ActivityForm] Where [<MyTextInput />] Is]
    //The [meta] is [to see] if [something] [has] [Changed] in the [Field]
    //The [field] is coming from the [useField()]
    const [field, meta] = useField(props.name);

    return(
        //If [there is] an [error] the [entire field] will be [pink Redish]
        //The [meta] is [to see] if [something] [has] [Changed] in the [Field]
        //The [!!] Just [makes] [meta.error] [into] a [Boolean]. It's [either] will be [exist] or will be [Undefined]
        <Form.Field error={meta.touched && !!meta.error}>

            <label>{props.label}</label>

            {/* When we [Spread] the [  {...field} ] It's gives us [name, value] And we Get them from the [useField()] Above^^  When we [Spread] the (props) */}
            {/* The [ {...field} ] is to [Get] [what's] [needs] to be [writing here] And Show the [Error] */}
            {/* The [ {...props} ] is to Show the Kinda the [placeholder] */}
            <input {...field} {...props}/>

            {/* Here The [meta.touched] Check if something [Changed] in the [{..field}] in the [<input />] Above^^. Continue Down VV */}
            {/* And the [meta.error] [Checks] if [there's] [any] [error] in the [{..field}] in the [<input />] Above^^.  */}
            {meta.touched && meta.error ? (
                //The [ {meta.error} ]
                <Label basic color='red'>{meta.error}</Label>
            ) : null}
        </Form.Field>
    )
}
