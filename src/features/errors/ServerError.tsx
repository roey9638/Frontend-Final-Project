import { observer } from 'mobx-react-lite';
import React from 'react'
import { Container, Header, Segment } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store'

//This is an [observer] [Because] We [getting] [information] from the [commonStore]. Continue Down VV
//And [Because] the [commonStore.error] -> the [error] is [Observable]
export default observer(function ServerError() {
    const { commonStore } = useStore();

    return (
        <Container>
            <Header as='h1' content='Server Error' />
            {/* Im getting the [Error/ commonStore.error?.message] from the [commonStore] and he's getting the [Error/ commonStore] [From] the [agen Component] in the [Switch case] [under] the [case: 500] */}
            {/* I have [message] [because] the [error] in the [commonStore] is a [type of] [ServerError] [which is] an [interface] that as tha [property]   */}
            <Header sub as='h5' color='red' content={commonStore.error?.message} />

            {commonStore.error?.details &&
                <Segment>
                    <Header as='h4' content='Stack trace' color='teal' />
                    {/* I have [details] [because] the [error] in the [commonStore] is a [type of] [ServerError] [which is] an [interface] that as tha [property]   */}
                    <code style={{marginTop: '10PX'}}>{commonStore.error.details}</code>
                </Segment>
            }
        </Container>

    )
})