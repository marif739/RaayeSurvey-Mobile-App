import React,{ useEffect, useState } from 'react'
import { View, StatusBar, StyleSheet, Picker, BackHandler } from 'react-native'
import { Container, Content, Grid, Row, Col, Text, Icon, Button, Item, Card, CardItem } from 'native-base'
import { Avatar, Overlay, Divider } from 'react-native-elements';
import Head from '../components/Header'
import Api from '../utils/Api'
import { getUserData } from '../function/Function'
import { FadeInAnim } from '../components/Animate'
import { UIActivityIndicator } from 'react-native-indicators';
import { toast } from '../function/Function'
import AsyncStorage from '@react-native-community/async-storage';
import { StackActions, NavigationActions } from 'react-navigation';

export default (props) => {

    const [ user, setUser ] = useState()
    const [ load, setLoad ] = useState(true)
    const [ type, setType ] = useState({
        loading: false,
        cat: null,
        title: 'Edit'
    })
    const [ edit, setEdit ] = useState({
        editVal : null,
        editVal2 : null,
        editVal3 : null,
        editLoad : false
    })

    const [ visible, setVisible ] = useState({
        visibility : false,
        option : null,
        param : null,
        param1 : null,
        param2: null
    })

    const back = () => {
        // let resetAction = StackActions.reset({
        //     key: undefined,
        //     index: 0,
        //     actions: [NavigationActions.navigate({ routeName: 'Home'})],
        // });
        // props.navigation.dispatch(resetAction);
    }

    const { visibility, option, param, param1, param2 } = visible
    const {  loading, cat, title } = type
    const { editVal, editVal2, editVal3, editLoad } = edit

    useEffect(() => {
        
        // BackHandler.addEventListener('hardwareBackPress', back);

        getData()
        
        return () => {
            // BackHandler.removeEventListener('hardwareBackPress', back);
        }

    }, [])
    return(
        <Container>
            <StatusBar backgroundColor="#333333" barStyle="default" />
            <Head title='Profile' toggle={props.navigation.toggleDrawer}/>
            { load && 
            <Overlay
                    isVisible={true}
                    windowBackgroundColor="rgba(.5, .5, .5, .5)"
                    overlayBackgroundColor="#fff"
                    width={80}
                    height={60}
                    >
                    <UIActivityIndicator color='black' />
                    </Overlay>
             }

            <Content style={{ backgroundColor:'#e3edf4'}}>
                <FadeInAnim>


                <Content style={{ paddingLeft:5, paddingRight:5}}>
          <Card>

            <CardItem header button onPress={() => {
            visibility && option == 'Eduation' ? setVisible({ visibility:false, option:null}) : setVisible({ visibility:true, option:'Eduation'})
            }}>
            <Col style={{alignItems:'flex-start', justifyContent:'center', width:80}}>
                    <Text style={{fontSize:18, color:'blue'}}>Education</Text>
                    </Col>

                    <Col style={{alignItems:'flex-end', justifyContent:'center'}}>
                    {option !== 'Eduation' &&
                    <>
                    {!load ?
                    <View style={{ flex:1, flexDirection:'row-reverse'}}>
                    <Text style={{paddingRight:15, fontSize:16, textAlign:'right'}}>{user.education.edu_title}</Text>
                    </View>
                    : null }
                    </>
                    }

                    {visibility && option == 'Eduation' && 
                    <Item style={{borderStyle:'solid', borderColor:'#000'}}>
                    <Picker
                            mode="dropdown"
                            iosIcon={<Icon name="arrow-down" style={{color:'#000'}}/>}
                            placeholder="Gender"
                            placeholderStyle={{ color: "#bfc6ea" }}
                            placeholderIconColor="#007aff"
                            style={{ flex: 1, color: '#000' }}
                            itemStyle={{backgroundColor:'#000'}}
                            selectedValue={param}
                            onValueChange={(v, ind) => {
                            if(v !== "0"){
                                sendData('education',v,null,null)
                            }
                            }}
                        >
                        <Picker.Item label="Select Education" value="0"/>
                            {user.edu_tbl.map((u,i) => (
                            <Picker.Item label={u.title} value={u.id} key={i}/>
                            ))
                            }
                        </Picker>
                    </Item>
                    }
                    </Col>
            </CardItem>

            <Divider style={{ backgroundColor: '#333333', marginRight:12, marginLeft:12 }} />

            <CardItem header button 
            onPress={() => {
                visibility && option == 'occupation' ? setVisible({ visibility:false, option:null}) : setVisible({ visibility:true, option:'occupation'})
                }}
            >
            <Col style={{alignItems:'flex-start', justifyContent:'center', width:80}}>
                    <Text style={{fontSize:18, color:'blue'}}>Occupation</Text>
                    </Col>

                    <Col style={{alignItems:'flex-end', justifyContent:'center'}}>
                    {option !== 'occupation' &&
                    <>
                    {!load ?
                    <View style={{ flex:1, flexDirection:'row-reverse'}}>
                    <Text style={{paddingRight:15, fontSize:16, textAlign:'right'}}>{user.occupation.occ_title}</Text>
                    </View>
                    : null }
                    </>
                    }

                {visibility && option == 'occupation' &&
                <Item style={{borderStyle:'solid', borderColor:'#000'}}>
                <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="arrow-down" style={{color:'#000'}}/>}
                        placeholder="Gender"
                        placeholderStyle={{ color: "#bfc6ea" }}
                        placeholderIconColor="#007aff"
                        style={{ flex: 1, color: '#000' }}
                        itemStyle={{backgroundColor:'#000'}}
                        selectedValue={editVal}
                        onValueChange={(val, ind) => {
                        if(val !== "0"){
                            sendData('occupation',val,null,null)
                        }
                        }}
                    >
                    <Picker.Item label="Select Occupation" value="0"/>
                    {user.occ_tbl.map((u,i) => (
                        <Picker.Item label={u.title} value={u.id} key={i}/>
                        ))
                    }
                    </Picker>
                </Item>
                }
                    </Col>
            </CardItem>

            <Divider style={{ backgroundColor: '#333333', marginRight:12, marginLeft:12 }} />

            <CardItem header button onPress={() => {
                visibility && option == 'marital' ? setVisible({ visibility:false, option:null}) : setVisible({ visibility:true, option:'marital'})
                }}>
            <Col style={{alignItems:'flex-start', justifyContent:'center', width:100}}>
                    <Text style={{fontSize:18, color:'blue'}}>Marital Status</Text>
                    </Col>

                    <Col style={{alignItems:'flex-end', justifyContent:'center'}}>
                    {option !== 'marital' &&
                    <>
                    {!load ?
                    <View style={{ flex:1, flexDirection:'row-reverse'}}>
                    <Text style={{paddingRight:15, fontSize:16, textAlign:'right'}}>{user.marital_status}</Text>
                    </View>
                    : null }
                    </>
                    }
                {visibility && option == 'marital' &&
                <Item style={{borderStyle:'solid', borderColor:'#000'}}>
                <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="arrow-down" style={{color:'#000'}}/>}
                        placeholder="Gender"
                        placeholderStyle={{ color: "#bfc6ea" }}
                        placeholderIconColor="#007aff"
                        style={{ flex: 1, color: '#000' }}
                        itemStyle={{backgroundColor:'#000'}}
                        selectedValue={editVal}
                        onValueChange={(val, ind) => {
                        if(val !== "0"){
                            sendData('marital',val,null,null)
                        }
                        }}
                    >
                    <Picker.Item label="Select Marital Status" value="0"/>
                        <Picker.Item label="Single" value="Single" />
                        <Picker.Item label="Married" value="Married" />
                        <Picker.Item label="Divorced" value="Divorced" />
                    </Picker>
                </Item>
                }

                    </Col>
            </CardItem>

            <Divider style={{ backgroundColor: '#333333', marginRight:12, marginLeft:12 }} />

            {!load && user.marital_status !== 'Single' ?
            <>
            <CardItem header button onPress={() => {
                visibility && option == 'child' ? setVisible({ visibility:false, option:null}) : setVisible({ visibility:true, option:'child'})
                }}>
            <Col style={{alignItems:'flex-start', justifyContent:'center', width:80}}>
                    <Text style={{fontSize:18, color:'blue'}}>Children</Text>
                    </Col>

                    <Col style={{alignItems:'flex-end', justifyContent:'center'}}>
                    {option !== 'child' &&
                    <>
                    {!load ?
                    <View style={{ flex:1, flexDirection:'row-reverse',textAlign:'right'}}>
                    <Text style={{paddingRight:15, fontSize:16,}}>{user.children}</Text>
                    </View>
                    : null }
                    </>
                    }

            {visibility && option == 'child' &&
            <Item style={{borderStyle:'solid', borderColor:'#000'}}>
            <Picker
                    mode="dropdown"
                    iosIcon={<Icon name="arrow-down" style={{color:'#000'}}/>}
                    placeholder="Gender"
                    placeholderStyle={{ color: "#bfc6ea" }}
                    placeholderIconColor="#007aff"
                    style={{ flex: 1, color: '#000' }}
                    itemStyle={{backgroundColor:'#000'}}
                    selectedValue={editVal2}
                    onValueChange={(val, ind) => {
                    if(val !== "0"){
                        sendData('child',val,null,null)
                    }
                    }}
                >
                <Picker.Item label="Do you have children" value="0"/>
                    <Picker.Item label="Yes" value="Yes" />
                    <Picker.Item label="No" value="No" />
                </Picker>
            </Item>
                }
                    </Col>
            </CardItem>

            <Divider style={{ backgroundColor: '#333333', marginRight:12, marginLeft:12 }} />
            </>
            : null
                }

            {!load && user.children == 'false' ?
            <>
            <CardItem header button onPress={() => {
                visibility && option == 'children' ? setVisible({ visibility:false, option:null}) : setVisible({ visibility:true, option:'children'})
                }}>
            <Col style={{alignItems:'flex-start', justifyContent:'center'}}>
                    <Text style={{fontSize:19, color:'blue'}}>Children Group</Text>
                    </Col>

                    <Col style={{alignItems:'flex-end', justifyContent:'center'}}>
                    {option !== 'children' &&
                    <>
                    {!load ?
                    <View style={{ flex:1, flexDirection:'row-reverse'}}>
                    <Text style={{paddingRight:15, fontSize:19,}}>{user.child.child_title}</Text>
                    </View>
                    : null }
                    </>
                    }
            {visibility && option == 'children' &&
            <Item style={{borderStyle:'solid', borderColor:'#000'}}>
            <Picker
                    mode="dropdown"
                    iosIcon={<Icon name="arrow-down" style={{color:'#000'}}/>}
                    placeholder="Gender"
                    placeholderStyle={{ color: "#bfc6ea" }}
                    placeholderIconColor="#007aff"
                    style={{ flex: 1, color: '#000' }}
                    itemStyle={{backgroundColor:'#000'}}
                    selectedValue={editVal3}
                    onValueChange={(val, ind) => {
                    if(val !== "0"){
                        sendData('children',val,null,null)
                    }
                    }}
                >
                <Picker.Item label="Select Children Group" value="0"/>
                {user.child_tbl.map((u,i) => (
                    <Picker.Item label={u.title} value={u.id} key={i}/>
                ))
                }
                </Picker>
            </Item>
                }
                    </Col>
            </CardItem>

            <Divider style={{ backgroundColor: '#333333', marginRight:12, marginLeft:12 }} />
            </>
            : null
                }

            {!load && user.children == 'false' ?
            <>
            <CardItem header button onPress={() => {
            visibility && option == 'childrenhousehold' ? setVisible({ visibility:false, option:null}) : setVisible({ visibility:true, option:'childrenhousehold'})
        }}>
            <Col style={{alignItems:'flex-start', justifyContent:'center'}}>
                    <Text style={{fontSize:19, color:'blue'}}>Children Household</Text>
                    </Col>

                    <Col style={{alignItems:'flex-end', justifyContent:'center'}}>
                    {option !== 'childrenhousehold' &&
                    <>
                    {!load ?
                    <View style={{ flex:1, flexDirection:'row-reverse'}}>
                    <Text style={{paddingRight:15, fontSize:19,}}>{user.child_household.child_household_title}</Text>
                    </View>
                    : null }
                    </>
                    }
                    {visibility && option == 'childrenhousehold' &&
                    <Item style={{borderStyle:'solid', borderColor:'#000'}}>
                <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="arrow-down" style={{color:'#000'}}/>}
                        placeholder="Gender"
                        placeholderStyle={{ color: "#bfc6ea" }}
                        placeholderIconColor="#007aff"
                        style={{ flex: 1, color: '#000' }}
                        itemStyle={{backgroundColor:'#000'}}
                        selectedValue={editVal}
                        onValueChange={(val, ind) => {
                        if(val !== "0"){
                            sendData('childrenhousehold',val,null,null)
                        }
                        }}
                    >
                    <Picker.Item label="Select Children Household" value="0"/>
                    {user.child_household_tbl.map((u,i) => (
                        <Picker.Item label={u.title} value={u.id} key={i}/>
                        ))
                    }
                    </Picker>
                </Item>
                    }
                    </Col>
            </CardItem>

            <Divider style={{ backgroundColor: '#333333', marginRight:12, marginLeft:12 }} />
            </>
            : null
                }

        <CardItem header button onPress={() => {
            visibility && option == 'Purchasing' ? setVisible({ visibility:false, option:null}) : setVisible({ visibility:true, option:'Purchasing'})
        }}>
            <Col style={{alignItems:'flex-start', justifyContent:'center', width:115}}>
                    <Text style={{fontSize:18, color:'blue'}}>Purchasing Role</Text>
                    </Col>

                    <Col style={{alignItems:'flex-end', justifyContent:'center'}}>
                    {option !== 'Purchasing' &&
                    <>
                    {!load ?
                    <View style={{ flex:1, flexDirection:'row-reverse',textAlign:'right'}}>
                    <Text style={{paddingRight:15, fontSize:16,}}>{user.role_purchase.role_title}</Text>
                    </View>
                    : null }
                    </>
                    }
                    {visibility && option == 'Purchasing' &&
                    <>
                    <Item style={{borderStyle:'solid', borderColor:'#000'}}>
                    <Picker
                            mode="dropdown"
                            iosIcon={<Icon name="arrow-down" style={{color:'#000'}}/>}
                            placeholder="Gender"
                            placeholderStyle={{ color: "#bfc6ea" }}
                            placeholderIconColor="#007aff"
                            style={{ flex: 1, color: '#000' }}
                            itemStyle={{backgroundColor:'#000'}}
                            selectedValue={editVal}
                            onValueChange={(v, ind) => {
                            if(v !== "0"){
                                sendData('role',v,null,null)
                            }
                            }}
                        >
                        <Picker.Item label="Select Role Purchasing" value="0"/>
                        {user.role_tbl.map((u,i) => (
                            <Picker.Item label={u.title} value={u.id} key={i}/>
                            ))
                        }
                        </Picker>
                    </Item>
                    </>
                    }
                    </Col>
            </CardItem>

            <Divider style={{ backgroundColor: '#333333', marginRight:12, marginLeft:12, marginBottom:5 }} />

            </Card>

            </Content>
                
                </FadeInAnim>


                <Overlay
                isVisible={loading}
                windowBackgroundColor="rgba(.5, .5, .5, .5)"
                overlayBackgroundColor="#fff"
                width={300}
                height={220}
                overlayStyle={{
                    justifyContent:'center',
                    alignItems:'center'
                }}
                >
                <Content>

                <Row style={{ marginTop:10}}>
                
                <Col style={{ alignItems:'flex-start'}}>
                <Text style={{ fontSize:18, fontWeight:'400', color:'#000000'}}>{title}</Text>
                </Col>

                <Col style={{ alignItems:'flex-end' }}>
                <Button bordered style={{ justifyContent:'center', alignItems:'center', width:45, height:30, borderColor:'#f21010' }}
                onPress={() => {
                    setType({...type, 
                        loading:false, 
                        cat:null, 
                        title:null})
                        setEdit({editVal:null,editVal2:null,editVal3:null,editLoad:false})
                    }
                    
                    }
                > 
                <Icon style={{ color:'#f21010', fontSize:14 }} name='md-close-circle'/>
                </Button>
                </Col>

                </Row>

                <Grid>

                { cat == 'education' && 
                <Row style={{ paddingLeft:10, paddingRight:10, marginTop:20, justifyContent:'center', alignItems:'center'}}>
                    <Item style={{borderStyle:'solid', borderColor:'#000'}}>
                    <Picker
                            mode="dropdown"
                            iosIcon={<Icon name="arrow-down" style={{color:'#000'}}/>}
                            placeholder="Gender"
                            placeholderStyle={{ color: "#bfc6ea" }}
                            placeholderIconColor="#007aff"
                            style={{ flex: 1, color: '#000' }}
                            itemStyle={{backgroundColor:'#000'}}
                            selectedValue={editVal}
                            onValueChange={(val, ind) => {
                            if(val !== "0"){
                                setEdit({...edit, editVal:val})
                            }
                            }}
                        >
                        <Picker.Item label="Select Education" value="0"/>
                            {user.edu_tbl.map((u,i) => (
                            <Picker.Item label={u.title} value={u.id} key={i}/>
                            ))
                            }
                        </Picker>
                    </Item>
                </Row>
                }

                { cat == 'occupation' && 
                <Row style={{ paddingLeft:10, paddingRight:10, marginTop:20, justifyContent:'center', alignItems:'center'}}>
                <Item style={{borderStyle:'solid', borderColor:'#000'}}>
                <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="arrow-down" style={{color:'#000'}}/>}
                        placeholder="Gender"
                        placeholderStyle={{ color: "#bfc6ea" }}
                        placeholderIconColor="#007aff"
                        style={{ flex: 1, color: '#000' }}
                        itemStyle={{backgroundColor:'#000'}}
                        selectedValue={editVal}
                        onValueChange={(val, ind) => {
                        if(val !== "0"){
                            setEdit({...edit, editVal:val})
                        }
                        }}
                    >
                    <Picker.Item label="Select Occupation" value="0"/>
                    {user.occ_tbl.map((u,i) => (
                        <Picker.Item label={u.title} value={u.id} key={i}/>
                        ))
                    }
                    </Picker>
                </Item>
                </Row>
                }

                { cat == 'marital' && 
                <Grid>
                <Row style={{ paddingLeft:10, paddingRight:10, marginTop:20, justifyContent:'center', alignItems:'center'}}>
                <Item style={{borderStyle:'solid', borderColor:'#000'}}>
                <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="arrow-down" style={{color:'#000'}}/>}
                        placeholder="Gender"
                        placeholderStyle={{ color: "#bfc6ea" }}
                        placeholderIconColor="#007aff"
                        style={{ flex: 1, color: '#000' }}
                        itemStyle={{backgroundColor:'#000'}}
                        selectedValue={editVal}
                        onValueChange={(val, ind) => {
                        if(val !== "0"){
                            setEdit({...edit, editVal:val})
                        }
                        }}
                    >
                    <Picker.Item label="Select Marital Status" value="0"/>
                        <Picker.Item label="Single" value="Single" />
                        <Picker.Item label="Married" value="Married" />
                        <Picker.Item label="Divorced" value="Divorced" />
                    </Picker>
                </Item>
            </Row>
            
            {editVal == 'Married' || editVal == 'Divorced' ? 
            <Row style={{ paddingLeft:10, paddingRight:10, marginTop:20, justifyContent:'center', alignItems:'center'}}>
            <Item style={{borderStyle:'solid', borderColor:'#000'}}>
            <Picker
                    mode="dropdown"
                    iosIcon={<Icon name="arrow-down" style={{color:'#000'}}/>}
                    placeholder="Gender"
                    placeholderStyle={{ color: "#bfc6ea" }}
                    placeholderIconColor="#007aff"
                    style={{ flex: 1, color: '#000' }}
                    itemStyle={{backgroundColor:'#000'}}
                    selectedValue={editVal2}
                    onValueChange={(val, ind) => {
                    if(val !== "0"){
                        setEdit({...edit, editVal2:val})
                    }
                    }}
                >
                <Picker.Item label="Do you have children" value="0"/>
                    <Picker.Item label="Yes" value="Yes" />
                    <Picker.Item label="No" value="No" />
                </Picker>
            </Item>
            </Row>
            : null
            }

        {editVal2 == 'Yes' && 
            <Row style={{ paddingLeft:10, paddingRight:10, marginTop:20, justifyContent:'center', alignItems:'center'}}>
            <Item style={{borderStyle:'solid', borderColor:'#000'}}>
            <Picker
                    mode="dropdown"
                    iosIcon={<Icon name="arrow-down" style={{color:'#000'}}/>}
                    placeholder="Gender"
                    placeholderStyle={{ color: "#bfc6ea" }}
                    placeholderIconColor="#007aff"
                    style={{ flex: 1, color: '#000' }}
                    itemStyle={{backgroundColor:'#000'}}
                    selectedValue={editVal3}
                    onValueChange={(val, ind) => {
                    if(val !== "0"){
                        setEdit({...edit, editVal3:val})
                    }
                    }}
                >
                <Picker.Item label="Select Children Group" value="0"/>
                {user.child_tbl.map((u,i) => (
                    <Picker.Item label={u.title} value={u.id} key={i}/>
                ))
                }
                </Picker>
            </Item>
            </Row>
            }

            </Grid>
                }

                { cat == 'child' && 
                <Grid>
                <Row style={{ paddingLeft:10, paddingRight:10, marginTop:20, justifyContent:'center', alignItems:'center'}}>
                <Item style={{borderStyle:'solid', borderColor:'#000'}}>
                <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="arrow-down" style={{color:'#000'}}/>}
                        placeholder="Gender"
                        placeholderStyle={{ color: "#bfc6ea" }}
                        placeholderIconColor="#007aff"
                        style={{ flex: 1, color: '#000' }}
                        itemStyle={{backgroundColor:'#000'}}
                        selectedValue={editVal}
                        onValueChange={(val, ind) => {
                        if(val !== "0"){
                            setEdit({...edit, editVal:val})
                        }
                        }}
                    >
                    <Picker.Item label="Do you have children" value="0"/>
                        <Picker.Item label="Yes" value="Yes" />
                        <Picker.Item label="No" value="No" />
                    </Picker>
                </Item>
            </Row>

            {editVal == 'Yes' && 
            <Row style={{ paddingLeft:10, paddingRight:10, marginTop:20, justifyContent:'center', alignItems:'center'}}>
            <Item style={{borderStyle:'solid', borderColor:'#000'}}>
            <Picker
                    mode="dropdown"
                    iosIcon={<Icon name="arrow-down" style={{color:'#000'}}/>}
                    placeholder="Gender"
                    placeholderStyle={{ color: "#bfc6ea" }}
                    placeholderIconColor="#007aff"
                    style={{ flex: 1, color: '#000' }}
                    itemStyle={{backgroundColor:'#000'}}
                    selectedValue={editVal2}
                    onValueChange={(val, ind) => {
                    if(val !== "0"){
                        setEdit({...edit, editVal2:val})
                    }
                    }}
                >
                <Picker.Item label="Select Children" value="0"/>
                {user.child_tbl.map((u,i) => (
                    <Picker.Item label={u.title} value={u.id} key={i}/>
                ))
                }
                </Picker>
            </Item>
        </Row>
            }

            </Grid>

                }

                { cat == 'children' && 
                <Row style={{ paddingLeft:10, paddingRight:10, marginTop:20, justifyContent:'center', alignItems:'center'}}>
                <Item style={{borderStyle:'solid', borderColor:'#000'}}>
                <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="arrow-down" style={{color:'#000'}}/>}
                        placeholder="Gender"
                        placeholderStyle={{ color: "#bfc6ea" }}
                        placeholderIconColor="#007aff"
                        style={{ flex: 1, color: '#000' }}
                        itemStyle={{backgroundColor:'#000'}}
                        selectedValue={editVal}
                        onValueChange={(val, ind) => {
                        if(val !== "0"){
                            setEdit({...edit, editVal:val})
                        }
                        }}
                    >
                    <Picker.Item label="Select Children" value="0"/>
                    {user.child_tbl.map((u,i) => (
                        <Picker.Item label={u.title} value={u.id} key={i}/>
                    ))
                    }
                    </Picker>
                </Item>
            </Row>
                }

                { cat == 'childrenhousehold' && 
                <Row style={{ paddingLeft:10, paddingRight:10, marginTop:20, justifyContent:'center', alignItems:'center'}}>
                <Item style={{borderStyle:'solid', borderColor:'#000'}}>
                <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="arrow-down" style={{color:'#000'}}/>}
                        placeholder="Gender"
                        placeholderStyle={{ color: "#bfc6ea" }}
                        placeholderIconColor="#007aff"
                        style={{ flex: 1, color: '#000' }}
                        itemStyle={{backgroundColor:'#000'}}
                        selectedValue={editVal}
                        onValueChange={(val, ind) => {
                        if(val !== "0"){
                            setEdit({...edit, editVal:val})
                        }
                        }}
                    >
                    <Picker.Item label="Select Children Household" value="0"/>
                    {user.child_household_tbl.map((u,i) => (
                        <Picker.Item label={u.title} value={u.id} key={i}/>
                        ))
                    }
                    </Picker>
                </Item>
            </Row>
                }

                { cat == 'role' && 
                <Row style={{ paddingLeft:10, paddingRight:10, marginTop:20, justifyContent:'center', alignItems:'center'}}>
                <Item style={{borderStyle:'solid', borderColor:'#000'}}>
                <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="arrow-down" style={{color:'#000'}}/>}
                        placeholder="Gender"
                        placeholderStyle={{ color: "#bfc6ea" }}
                        placeholderIconColor="#007aff"
                        style={{ flex: 1, color: '#000' }}
                        itemStyle={{backgroundColor:'#000'}}
                        selectedValue={editVal}
                        onValueChange={(val, ind) => {
                        if(val !== "0"){
                            setEdit({...edit, editVal:val})
                        }
                        }}
                    >
                    <Picker.Item label="Select Role Purchasing" value="0"/>
                    {user.role_tbl.map((u,i) => (
                        <Picker.Item label={u.title} value={u.id} key={i}/>
                        ))
                    }
                    </Picker>
                </Item>
            </Row>
                }

                <Row style={{justifyContent:'center', marginTop:20}}>
                    {editLoad === false ? 
                    <Button bordered dark onPress={() => updateData(cat,editVal,editVal2,editVal3)}>
                        <Text>Update</Text>
                    </Button>
                    :
                    <UIActivityIndicator color='black'/>
                    }
                </Row>

                </Grid>

                </Content>
                </Overlay>



            </Content>
        </Container>
    )

function getData(){
    AsyncStorage.getItem('token')
        .then(async res => {
            await Api.get('/profile/'+res+'/about')
            .then(res => {
                setUser(res.data)
                setLoad(false)
            })
            .catch(err => alert(err))
        })
        .catch(err => alert(err))
}

function updateData(type,val,val2,val3){
    setEdit({...edit, editLoad:true })
    if(type === 'education'){
        if(val == null){
            toast('Please select your education', 'red')
            setEdit({...edit, editLoad:false })
        }
        else{
            sendData(type,editVal,null,null)
        }
    }
    else if(type === 'occupation'){
        if(val == null){
            toast('Please select your occupation', 'red')
            setEdit({...edit, editLoad:false })
        }
        else{
            sendData(type,editVal,editVal2,editVal3)
        }
    }
    else if(type === 'marital'){
        if(val !== null){
            if(val === 'Married' || val === 'Divorced'){
                if(val2 !== null){
                    if(val2 === 'Yes'){
                        if(val3 === null){
                            toast('Children group is required', 'red')
                            setEdit({...edit, editLoad:false })
                        }
                        else{
                            sendData(type,editVal,editVal2,editVal3)
                        }
                    }
                    else{
                        sendData(type,editVal,editVal2,null)
                    }
                }
                else{
                    toast('Children field is required.', 'red')
                    setEdit({...edit, editLoad:false })  
                }
            }
            else{
                sendData(type,editVal,editVal2,null)
            }
        }
        else{
            toast('Marital status is required.', 'red')
            setEdit({...edit, editLoad:false }) 
        }
    }
    else if(type === 'child'){
        if(val !== null){
            if(val === 'Yes'){
                if(val2 === null){
                    toast('Children group field is required', 'red')
                    setEdit({...edit, editLoad:false })
                }
                else{
                    sendData(type,editVal,editVal2,null)
                }
            }
            else{
                sendData(type,editVal,null,null)
            }
        }
        else{
            toast('Children field is required.', 'red')
            setEdit({...edit, editLoad:false }) 
        }
    }
    else if(type === 'children'){
        if(val === null){
            toast('Children group field is required', 'red')
            setEdit({...edit, editLoad:false })
        }
        else{
            sendData(type,editVal,null,null)
        }
    }
    else if(type === 'childrenhousehold'){
        if(val === null){
            toast('Children household field is required', 'red')
            setEdit({...edit, editLoad:false })
        }
        else{
            sendData(type,editVal,null,null)
        }
    }
    else if(type === 'role'){
        if(val === null){
            toast('Purchasing Role field is required', 'red')
            setEdit({...edit, editLoad:false })
        }
        else{
            sendData(type,editVal,editVal2,editVal3)
        }
    }

}

function sendData(type,val,val2,val3){
    AsyncStorage.getItem('token')
        .then(async res => {
            const id = res
            await Api.post('/updateUserProfile', {type,val,val2,val3,id})
            .then(res => {
                if(res.data.msg == 'success'){
                    getData() 
                    setType({loading:false, cat:null, title:null})
                    setEdit({editLoad:false,editVal:null,editVal2:null,editVal3:null})
                    setVisible({ visibility:false, option:null})
                }
                else{
                    toast(res.data.msg, 'red')  
                }
            })
            .catch(err => console.log(err.response))
        })
        .catch(err => console.log(err))

}
    

}



const styles = StyleSheet.create({
    box:{
        borderWidth: 1,
        borderRadius: 2,
        borderColor: '#ddd',
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: {width: 10, height: 10},
        shadowOpacity: 1,
        shadowRadius: 1,
        elevation: 1
    }
})