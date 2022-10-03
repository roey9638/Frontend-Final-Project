import React from 'react';
import { Message } from 'semantic-ui-react';

interface Props {
    //Here I want to [get all] the [Errors] into the [errors] array.
    //We [made it] to be [either] a [string] Or a [null]. [Because] [we may] or [may not] [get] [Errors]
    errors: string[] | null;
}

export default function ValidationErrors({ errors }: Props) {
    return(
        <Message error>
            {/* Here i want to [check] that the [errors] [array] is [not empty] */}
            {errors && (
                <Message.List>
                    {/* Here i [go threw] [all] the [Errors] in [order] to [display them] */}
                    {/* [Each Error] that been [display] [need] to Have a [key]. That's [why] [w]e have] the (i) [param] which is the [index] of [each] [Error].Note -> [Each] [Error] has [diffrent] [index] */}
                    {/* We use this [ValidationErrors Component] in the [TestError Component] [inside] the [function] [handleValidationError] the [setErrors()]*/}
                    {/* [Important] --> [In Order] to [display] the [Errors] We get the [Errors] from the [TestError Component] on the [bottom] */}
                    {errors.map((err:any, i) => (
                        <Message.Item key={i}>{err}</Message.Item>
                    ))}
                </Message.List>
            )}
        </Message>
    )
}
