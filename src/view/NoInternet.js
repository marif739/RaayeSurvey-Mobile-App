import React from 'react';
import { Container, Content, Grid, Col, Row, Item, Icon, Input, Button, Text, Toast, Spinner } from 'native-base';
import { View, Image, StatusBar, StyleSheet, Keyboard, BackHandler } from 'react-native';
import { FadeInAnim } from '../components/Animate'

export default () => {

    return(
        <Container style={{flex:1, backgroundColor:'#333333'}}>
            <Content>

            <FadeInAnim>
            <Grid>
                <Row>
                    <Col style={{alignItems: 'center', marginTop:100}}>
                    <Icon style={{fontSize:120, color:'#ffffff'}} name='wifi'/>
                    </Col>
                </Row>
                <Row>
                    <Col style={{alignItems: 'center'}}>
                    <Text style={{fontSize:50, color:'#ffffff'}}>No Internet</Text>
                    </Col>
                </Row>
                <Row>
                    <Col style={{alignItems: 'center'}}>
                    <Text style={{fontSize:60, fontWeight:'bold', color:'#ffffff'}}>Connection</Text>
                    </Col>
                </Row>
                <Row style={{marginTop:20}}>
                    <Col style={{alignItems: 'center'}}>
                    <Text style={{fontSize:18, fontWeight:'300', color:'#ffffff'}}>Please check your internet connection</Text>
                    </Col>
                </Row>
                <Row>
                    <Col style={{alignItems: 'center'}}>
                    <Text style={{fontSize:18, fontWeight:'300', color:'#ffffff'}}> and try again</Text>
                    </Col>
                </Row>
                <Row style={{marginTop:30}}>
                    <Col style={{alignItems: 'center'}}>
                    <Button rounded bordered style={{width:'50%', justifyContent:'center', borderColor:'#ffffff'}} onPress={() => BackHandler.exitApp() }>
                    <Text style={{ color:'#ffffff'}}>Close</Text>
                    </Button>
                    </Col>
                </Row>
            </Grid>
            </FadeInAnim>

            </Content>
        </Container>
    )
}