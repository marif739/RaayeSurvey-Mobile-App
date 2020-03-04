import React,{ useEffect, useState } from 'react'
import { View, StatusBar, StyleSheet, Keyboard, Picker, BackHandler } from 'react-native'
import { Container, Content, Grid, Row, Col, Text, Button, Icon, Item, Label, Input,
     Card, CardItem } from 'native-base'
import { Avatar, Overlay, Divider } from 'react-native-elements';
import Header from '../components/Header'
import Api from '../utils/Api'
import { getUserData } from '../function/Function'
import { FadeInAnim } from '../components/Animate'
import { UIActivityIndicator } from 'react-native-indicators';
import { toast } from '../function/Function'
import DatePicker from 'react-native-datepicker'
import { LoginButton, AccessToken } from 'react-native-fbsdk';
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
        editLoad : false
    })
    const [ visible, setVisible ] = useState({
        visibility : false,
        option : null,
        param : null,
        param1 : null,
        param2: null
    })
    const [ date, setDate ] = useState('')
    useEffect(() => {

        // BackHandler.addEventListener('hardwareBackPress', back);

        getData()

        const val = props.navigation.getParam('update');
        if(val == 'update'){
            getData() 
        }

        return () => {
            // BackHandler.removeEventListener('hardwareBackPress', back);
        }
        
    }, [props.navigation.getParam('update')])

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
    const { editVal, editVal2, editLoad } = edit
    return(
        <Container>
            <StatusBar backgroundColor="#333333" barStyle="default" />
            <Header title='Profile' toggle={props.navigation.toggleDrawer}/>
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
                <Grid style={{backgroundColor:'#333333', height:220}}>
                    <Row style={{height:150}}>
                        <Col style={{ flex:1, justifyContent:'center', alignItems:'center'}}>
                        {!load && <Avatar rounded title={user.avatar} size={120}/> }
                        </Col>
                    </Row>
                    <Row style={{ height:20}}>
                    {!load ?
                    <Col style={{justifyContent:'center', alignItems:'center'}}>
                    <Button transparent onPress={() => setType({ ...type, loading:true, cat:'name', title:'Edit Name' })}>
                        <Text style={{ fontSize:26, color:'#fff', textTransform:'capitalize'}}>{user.fname+' '+user.lname+' '}
                        <Icon name='md-create' style={{fontSize:26, color:'#fff'}}/>
                        </Text>
                    </Button>
                    </Col>
                    : null }
                    </Row>
                    <Row style={{ height:20, marginTop:20 }}>
                        <Col style={{justifyContent:'center', alignItems:'center'}}>
                        <LoginButton
    onLoginFinished={
      (error, result) => {
        if (error) {
          alert("login has error: " + result.error);
        } else if (result.isCancelled) {
          alert("login is cancelled.");
        } else {

          AccessToken.getCurrentAccessToken().then(
            (data) => {
              let accessToken = data.accessToken
              alert(accessToken.toString())

              const responseInfoCallback = (error, result) => {
                if (error) {
                  console.log(error)
                  alert('Error fetching data: ' + error.toString());
                } else {
                  console.log(result)
                  alert('Success fetching data: ' + result.toString());
                }
              }

              const infoRequest = new GraphRequest(
                '/me',
                {
                  accessToken: accessToken,
                  parameters: {
                    fields: {
                      string: 'email,name,first_name,middle_name,last_name'
                    }
                  }
                },
                responseInfoCallback
              );

              // Start the graph request.
              new GraphRequestManager().addRequest(infoRequest).start()

            }
          )

        }
      }
    }
    onLogoutFinished={() => alert("logout.")}/>
                        </Col>
                    </Row>
                </Grid>

                <Content style={{ paddingLeft:5, paddingRight:5}}>
          <Card>
            <CardItem header>
                    <Col style={{alignItems:'flex-start', justifyContent:'center', width:100}}>
                    <Text style={{fontSize:16}}>Email</Text>
                    </Col>

                    <Col style={{alignItems:'flex-end', justifyContent:'center'}}>
                    {!load ?
                    <Text style={{paddingRight:10, fontSize:16}}>{user.email}</Text>
                    : null }
                    </Col>
            </CardItem>

            <Divider style={{ backgroundColor: '#333333', marginRight:12, marginLeft:12 }} />

            <CardItem header button onPress={() => setType({ ...type, loading:true, cat:'phone', title:'Edit Phone' })}>
            <Col style={{alignItems:'flex-start', justifyContent:'center', width:100}}>
                    <Text style={{fontSize:16}}>Phone</Text>
                    </Col>

                    <Col style={{alignItems:'flex-end', justifyContent:'center'}}>
                    {!load ?
                    <View style={{ flex:1, flexDirection:'row-reverse'}}>

                    {!load && user.phoneveri == 1 ? null : 
                        <Button small primary onPress={() => props.navigation.navigate('Phone')}>
                            <Text>Verify Phone</Text>
                        </Button>
                    }

                    <Text style={{paddingRight:15, fontSize:16, color:'blue'}}>{user.phone}</Text>
                    </View>
                    : null }
                    </Col>
            </CardItem>

            <Divider style={{ backgroundColor: '#333333', marginRight:12, marginLeft:12 }} />

            <CardItem header>
                    <Col style={{alignItems:'flex-start', justifyContent:'center', width:100}}>
                    <Text style={{fontSize:16}}>Mobile Network</Text>
                    </Col>

                    <Col style={{alignItems:'flex-end', justifyContent:'center'}}>
                    {!load ?
                    <Text style={{paddingRight:10, fontSize:16}}>{user.network}</Text>
                    : null }
                    </Col>
            </CardItem>

            <Divider style={{ backgroundColor: '#333333', marginRight:12, marginLeft:12 }} />

            <CardItem header button onPress={() => {
            visibility && option == 'dob' ? setVisible({ visibility:false, option:null}) : setVisible({ visibility:true, option:'dob'})
        }}>
            <Col style={{alignItems:'flex-start', justifyContent:'center', width:100}}>
                    <Text style={{fontSize:16}}>Date Of Birth</Text>
                    </Col>

                    <Col style={{alignItems:'flex-end'}}>
                    {option !== 'dob' &&
                    <>
                    {!load ?
                    <View style={{ flex:1, flexDirection:'row-reverse'}}>
                    <Text style={{paddingRight:15, fontSize:16, color:'blue'}}>{user.dob}</Text>
                    </View>
                    : null }
                    </>
                    }
                    {visibility && option == 'dob' &&
                    <Item style={{borderStyle:'solid', width:'100%', borderColor:'#000'}}>
                        <DatePicker
                        style={{width: '100%'}}
                        date={date}
                        mode="date"
                        placeholder="Select date of Birth"
                        maxDate={new Date()}
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        customStyles={{
                        dateIcon: {
                            position: 'absolute',
                            left: 0,
                            top: 4,
                            marginLeft: 0
                        },
                        dateInput: {
                            marginLeft: 36,
                            borderColor:'#fff',
                        },
                        placeholderText:{
                            color:'#000'
                        },
                        dateText:{
                            color:'#000'
                        }
                        }}
                        onDateChange={(date) => { 
                            sendData('dob',date,null)
                            setDate(date)
                        }}
                        />
                        </Item>
                        }
                    </Col>
            </CardItem>

            <Divider style={{ backgroundColor: '#333333', marginRight:12, marginLeft:12 }} />

            <CardItem header>
                    <Col style={{alignItems:'flex-start', justifyContent:'center', width:100}}>
                    <Text style={{fontSize:16}}>Gender</Text>
                    </Col>

                    <Col style={{alignItems:'flex-end', justifyContent:'center'}}>
                    {!load ?
                    <Text style={{paddingRight:10, fontSize:16}}>{user.gender}</Text>
                    : null }
                    </Col>
            </CardItem>

            <Divider style={{ backgroundColor: '#333333', marginRight:12, marginLeft:12, marginBottom:5 }} />

          </Card>
        </Content>


                <Grid style={{ paddingLeft:5, paddingRight:5}}>

                <Overlay
                isVisible={loading}
                windowBackgroundColor="rgba(.5, .5, .5, .5)"
                overlayBackgroundColor="#fff"
                width={300}
                height={270}
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

                { cat === 'phone' &&
                <Grid>

                    <Row style={{ paddingLeft:10, paddingRight:10, marginTop:20, justifyContent:'center', alignItems:'center'}}>
                    <Item floatingLabel  style={{borderStyle:'solid', borderColor:'#000'}}>
                    <Label style={{color:'#000'}}>Mobile Number</Label>
                    <Input style={{color:'#000'}} keyboardType={'numeric'}
                    value={editVal} onChangeText={val => setEdit({...edit, editVal:val})}
                    />
                    </Item>
                    </Row>

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
                            <Picker.Item label="Mobile Network" value="0"/>
                                <Picker.Item label="Ufone" value="ufone" />
                                <Picker.Item label="Zong" value="zong" />
                                <Picker.Item label="Jazz" value="jazz" />
                                <Picker.Item label="Warid" value="warid" />
                                <Picker.Item label="Telenor" value="telenor" />
                            </Picker>
                        </Item>
                    </Row>

                    <Row style={{justifyContent:'center', marginTop:20}}>
                    {editLoad === false ? 
                    <Button bordered dark onPress={() => updateData(cat,editVal,editVal2)}>
                        <Text>Update</Text>
                    </Button>
                    :
                    <UIActivityIndicator color='black'/>
                    }
                    </Row>

                </Grid>
                }


                { cat === 'name' &&
                <Grid>

                    <Row style={{ paddingLeft:10, paddingRight:10, marginTop:20, justifyContent:'center', alignItems:'center'}}>
                    <Item floatingLabel  style={{borderStyle:'solid', borderColor:'#000'}}>
                    <Label style={{color:'#000'}}>First Name</Label>
                    <Input style={{color:'#000'}} value={editVal} onChangeText={val => setEdit({...edit, editVal:val})}/>
                    </Item>
                </Row>

                <Row style={{ paddingLeft:10, paddingRight:10,  marginTop:20, justifyContent:'center', alignItems:'center'}}>
                    <Item floatingLabel  style={{borderStyle:'solid', borderColor:'#000'}}>
                    <Label style={{color:'#000'}}>Last Name</Label>
                    <Input style={{color:'#000'}} value={editVal2} onChangeText={val => setEdit({...edit, editVal2:val})}/>
                    </Item>
                </Row>

                    <Row style={{justifyContent:'center', marginTop:20}}>
                    {editLoad === false ? 
                    <Button bordered dark onPress={() => updateData(cat,editVal,editVal2)}>
                        <Text>Update</Text>
                    </Button>
                    :
                    <UIActivityIndicator color='black'/>
                    }
                    </Row>

                </Grid>
                } 

                </Content>
                </Overlay>
                
                </Grid>
                </FadeInAnim>
            </Content>
        </Container>
    )

function getData(){

    getUserData()
    .then(async res => {
        await Api.get('/profile/'+res[6][1]+'/profile')
        .then(res => {
            setUser(res.data)
            setLoad(false)
        })
        .catch(err => alert(err))
    })
    .catch(err => alert(err))
}

function updateData(type,val,val2){
    setEdit({...edit, editLoad:true })
    if(type == 'name'){
        if(val == null){
            setEdit({...edit, editLoad:false })
            toast('First name is required.', 'red')
        }
        else if(val2 == null){
            setEdit({...edit, editLoad:false })
            toast('Last name is required.', 'red')
        }
        else{
            sendData(type,val,val2)
        }
    }
    else if(type == 'dob'){
        if(val == null){
            setEdit({...edit, editLoad:false })
            toast('Date of birth is required.', 'red')
        }
        else{
            sendData(type,val,null)
        }
    }
    else if(type == 'phone'){
        if(val !== null){
            const phoneReg = /^[0][1-9]\d{9}$|^[1-9]\d{10}$/
            if(phoneReg.test(editVal)){
                if(val2 == null){
                    setEdit({...edit, editLoad:false })
                    toast('Select Network', 'red')
                  }
                  else{ 
                    sendData(type,val,val2)
                     }
            }
            else{
              setEdit({ ...edit, editVal:'', editLoad:false})
              toast('Invalid Mobile Number, eg( 03412584631 )', 'red')
            }
          }
          else{
            setEdit({ ...edit, editVal:'', editLoad:false })
            toast('Mobile Number Required', 'red')
          }
    }
        
    
}

function sendData(type,val,val2){
    getUserData()
        .then(async res => {
            const id = res[6][1]
            await Api.post('/updateUserData', {type,val,val2,id})
            .then(res => {
                if(res.data.msg == 'success'){
                    getData() 
                    setType({loading:false, cat:null, title:null})
                    setEdit({editLoad:false,editVal:null,editVal2:null})
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