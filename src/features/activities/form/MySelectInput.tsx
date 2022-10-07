import { useField } from 'formik';
import React from 'react';
import { Form, Label, Select } from 'semantic-ui-react';

interface Props {
    placeholder: string;
    name: string;
    options: any;
    label?: string;
}

export default function MySelectInput(props: Props) {
    //[Important] --> The [useField(props.name) will match the [Fields] in the [ActivityForm] Where [<MyTextInput />] Is]
    //The [meta] is [to see] if [something] [has] [Changed] in the [Field]
    //The [field] is coming from the [useField()]
    //The [helpers] [allows] us to [manually] set a [value] and [manually] set the [touched status] of the [input component]
    const [field, meta, helpers] = useField(props.name);

    return(
        //If [there is] an [error] the [entire field] will be [pink Redish]
        //The [meta] is [to see] if [something] [has] [Changed] in the [Field]
        //The [!!] Just [makes] [meta.error] [into] a [Boolean]. It's [either] will be [exist] or will be [Undefined]
        <Form.Field error={meta.touched && !!meta.error}>

            <label>{props.label}</label>

            <Select
                clearable
                options={props.options}
                value={field.value || null}
                onChange={(e, data) => helpers.setValue(data.value)}
                onBlur={() => helpers.setTouched(true)}
                placeholder={props.placeholder}
            />

            {/* Here The [meta.touched] Check if something [Changed] in the [{..field}] in the [<input />] Above^^. Continue Down VV */}
            {/* And the [meta.error] [Checks] if [there's] [any] [error] in the [{..field}] in the [<input />] Above^^.  */}
            {meta.touched && meta.error ? (
                //The [ {meta.error} ]
                <Label basic color='red'>{meta.error}</Label>
            ) : null}
        </Form.Field>
    )
}
