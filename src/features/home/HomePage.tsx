import { observer } from 'mobx-react-lite';
import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Header, Image, Segment } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import LoginForm from '../users/LoginForm';
import RegisterForm from '../users/RegisterForm';

export default observer(function HomePage() {

    const { userStore, modalStore } = useStore();
    
    return (
        <Segment inverted textAlign='center' vertical className='masthead'>
            <Container text>
                <Header as='h1' inverted>
                    <Image size='massive' src='/assets/logo.png' alt='logo' style={{ marginBottom: 12 }} />
                    {/* He used [Reactivities] and not [Welcome Aboard] */}
                    Welcome Aboard
                </Header>
                {userStore.isLoggedIn ? (
                    <>
                        {/* He used [Welcome to Reactivities] and not [Explore Now] */}
                        <Header as='h2' inverted content='Explore Now' />

                        <Button as={Link} to='/activities' size='huge' inverted>
                            Go to Activities!
                        </Button>
                    </>

                ) : (
                    <>
                        {/* Wee [Passed] [<LoginForm />] Because he [Returns] a [JSX.Element]. And the [openModal] [Requires] [JSX.Element] [Paramater] */}
                        <Button onClick={() => modalStore.openModal(<LoginForm />)} size='huge' inverted> Login! </Button>

                        <Button onClick={() => modalStore.openModal(<RegisterForm />)} size='huge' inverted> Register! </Button>
                    </>

                )}

            </Container>
        </Segment>
    )
})