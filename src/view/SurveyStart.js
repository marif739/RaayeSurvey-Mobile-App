import React, { useState, useEffect } from 'react';
import { View, Text, Button, TouchableOpacity, BackHandler, Alert, Image, CheckBox, Linking } from 'react-native'
import { Container, Content, ListItem, Radio, Right, Left, Row, Body, Form, Textarea } from 'native-base';
import { Overlay, Rating, AirbnbRating } from 'react-native-elements'
import Api from '../utils/Api';
import Header from '../components/Header'
import { UIActivityIndicator } from 'react-native-indicators';
import AsyncStorage from '@react-native-community/async-storage';
import { StackActions, NavigationActions } from 'react-navigation';

export default (props) => {

    const [que, setQuestion] = useState({
        question: [],
        an: [],
        current: 0,
        check : true,
        val:null
    });
    const [ qCount, setCount ] = useState(0)
    const [load, setLoad] = useState(true);
    const [ second, setSecond ] = useState(0)
    const [ minute, setMinute ] = useState(0)
    const { question, current, an, check, val } = que;


    useEffect(() => {

        BackHandler.addEventListener('hardwareBackPress', back);

        const survey = props.navigation.getParam('survey');
        Api.get('survey-start/' + survey)
            .then(res => {
                setQuestion({ ...que, question: res.data })
                setLoad(false)
            })
            .catch(err => console.log(err.response))

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', back);
        }

    },[])

    useEffect(() => {

        setTimeout(() => {
            surveyTimer()
        }, 1000);
    })

    const back = () => {

        Alert.alert("Exit", "Are you sure you want to exit?",
         [{ text: "No"},
          { text: "Yes", onPress: () => {

            let resetAction = StackActions.reset({
                key: undefined,
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'Home'})],
            });
            props.navigation.dispatch(resetAction);

          }}], 
          { cancelable: false });  
          return true;
    }


    function surveyTimer(){
        
        if(second > 60){
                setMinute(minute+1)
        }
        else{
            setSecond(second+1)
        }
        second > 59 && setSecond(0)
    }

const total = question.length - 1;

const questionUpdate = () => {
    if (current < total) {
        setQuestion({ ...que, current: current + 1, check:true })
    }
    else {
        setLoad(true)
        setQuestion({ ...que, check:true })
        AsyncStorage.getItem('token')
        .then(res => {
            const s = props.navigation.getParam('survey')
            Api.post('/survey-fill', {an,s,user:res})
            .then(res => {
                if(res.data.msg == 'success'){

                setLoad(false)
                Alert.alert("Thank You", "You will be rewarded mobile balance on your given number within 24 hours working day",
                [{ text: "close", onPress: () => props.navigation.navigate('Home') }], 
                { cancelable: false });  

                }
                else{
                    setLoad(false)
                    setQuestion({ ...que, check:false })
                    alert('Error: Please Try Again.')
                }
            })
            .catch(err => console.log(err.response))
        })
        .catch(err => console.log(err))
    }
}

const previousQuestion = () => {
    if (current > -1) {
        setQuestion({ ...que, current: current - 1, check:false })
    }
}

function storeAnswer(type,ansID, qID, grid = null, questionType, value = null,none){
    const data = { answerID: ansID,
        questionID: qID,
        gridQuestion:grid,
        questionType:questionType,
        ansType:type,
        answerValue:value,
        none:none }
        var c = false
    if(questionType === 'grid'){
        if(type == 'radio' && none == '1'){
            Alert.alert("Exit", "Are you sure you want to exit?",
             [{ text: "No"},
              { text: "Yes", onPress: () => {

                let resetAction = StackActions.reset({
                    key: undefined,
                    index: 0,
                    actions: [NavigationActions.navigate({ routeName: 'Home'})],
                });
                props.navigation.dispatch(resetAction);

              } }], 
              { cancelable: false });  
        }
        else if(type === 'radio'){
            var count = 0
            for(var i=0; i < an.length; i++){
                if(an[i].gridQuestion == grid){
                    an.splice(i,1)
                }
            }
            store(data,true)
            for(var z=0; z < an.length; z++){
                if(question[current].answers.some(e => e.gridQuestionID == an[z].gridQuestion)){
                    count++
                }
            }
            count == question[current].answers.length - 1 && setCount(count +1)
            if(count == question[current].answers.length){
                store(null,false)
                count = 0
            }
            
            }
            else if(type === 'checkbox'){
                var checkboxGrid = false
                if(none == '1'){
                    for(var x=0; x < an.length; x++){
                        if(an[x].gridQuestion === grid){
                            an.splice(x,1)
                            checkboxGrid = false
                        }
                        else{
                            checkboxGrid = true
                        }
                    }
                }
                else{
            for(var x=0; x < an.length; x++){
                if(an[x].answerID === ansID){
                    an.splice(x,1)
                    checkboxGrid = false
                }
                else{
                    checkboxGrid = true
                }
            }
            }
            checkboxGrid == true && store(data,'a')
            var checkBoxCount = 0
            for(var z=0; z < an.length; z++){
                if(question[current].answers.some(e => e.gridQuestionID == an[z].gridQuestion)){
                    checkBoxCount++
                }
            }
            checkBoxCount == question[current].answers.length - 1 && setCount(count +1)
            if(checkBoxCount == question[current].answers.length){
                store(null,false)
                checkBoxCount = 0
            }

        }
    }
    else{
    if(type == 'radio' || type == 'rating' || type == 'text'){
        for(var i=0; i < an.length; i++){
            if(an[i].questionID == qID){
                an.splice(i,1)
            }
        }
        if(type == 'radio' && none == '1'){
            Alert.alert("Exit", "Are you sure you want to exit?",
             [{ text: "No"},
              { text: "Yes", onPress: () => {

                let resetAction = StackActions.reset({
                    key: undefined,
                    index: 0,
                    actions: [NavigationActions.navigate({ routeName: 'Home'})],
                });
                props.navigation.dispatch(resetAction);

              } }], 
              { cancelable: false }); 
        }
        store(data,false)
    }
    else if(type === 'checkbox'){
        var check = false
        if(none == '1'){
            for(var x=0; x < an.length; x++){
                if(an[x].questionID === qID && an[x].none != 1){
                     an.splice(x,10)
                     check = false
                }
                else{
                    check = true
                }
            }
            check = true
        }
        else{

            for(var x=0; x < an.length; x++){
                if(an[x].questionID === qID && an[x].none == 1){
                     an.splice(x,1)
                     check = false
                }
                
            }

        for(var x=0; x < an.length; x++){
            if(an[x].answerID === ansID){
                 an.splice(x,1)
                 check = false
            }
            else{
                check = true
            }
        }
        }
        check == true && store(data,'a')
        if(an.some(e => e.questionID === qID)){
            store(null,false)
        }
        else{
            store(null,true)
        }
        
    }
    }
    //type == 'radio' && store(data)
    type == 'rating' && store(data)
    type == 'text' && store(data)
    c == true && store(data)
    
}

const store = (data,btn) => {
    // console.log(data)
    data !== null && an.push(data)
    if(btn == true){
        setQuestion({ ...que, check:true })
    }
    else if(btn == false){
        setQuestion({ ...que, check:false })
    }
}




return (
    <Container>
        <Header title='Survey' back='back' nav={props.navigation.navigate} />
        {load &&
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
        {!load ? (
            <Content style={{ paddingLeft: 10, paddingRight: 10, backgroundColor: '#ededed' }}>


                <Row style={{
                    paddingLeft: 20, paddingRight: 20, marginTop: 20, backgroundColor: '#96cd2a',
                    height: 30, justifyContent: 'flex-end', alignItems: 'flex-end', borderTopLeftRadius: 10, borderTopRightRadius: 10
                }}>
                    <Text style={{ fontSize:22, fontWeight:'bold', color:'#fff'}}>{minute} : {second}</Text>
                </Row>


                <Row style={{
                    paddingLeft: 20, paddingRight: 20, marginTop: 0, backgroundColor: '#96cd2a',
                    height: 100, justifyContent: 'center', alignItems: 'center', borderTopLeftRadius: 0, borderTopRightRadius: 0
                }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }}>{question[current].question}</Text>
                </Row>

                {question[current].questionType == 'image' &&
                    <View style={{ flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#96cd2a'}}>
                    <Image
                    style={{width: 150, height: 150}}
                    source={{uri: question[current].url+question[current].content}}
                    />
                    </View>
                }

                {question[current].questionType == 'rating' &&
                    <View style={{ flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#96cd2a'}}>
                    <Rating type="custom" readonly imageSize={30} startingValue={question[current].content} style={{ marginBottom:30}}/>
                    </View>
                }


                {question[current].questionType !== 'grid' &&
                <>
                    {question[current].answers.map((ans) => (
                        <>
                
                {ans.answerType == 'radio' ? (

                <ListItem
                selected={an.filter(e => e.answerID === ans.id).length > 0 ? true : false}
                onPress={() => storeAnswer(ans.answerType,ans.id, ans.questionID, null, question[current].questionType,null,ans.exit_ans)}
                >
                <Left>
                    <Text>{ans.content}</Text>
                </Left>

                <Right>
                    <Radio
                    selected={an.filter(e => e.answerID === ans.id).length > 0 ? true : false}
                    onPress={() => storeAnswer(ans.answerType,ans.id, ans.questionID, null, question[current].questionType,null,ans.exit_ans)}
                    />
                </Right>

                </ListItem>
                ) : null    
                }

                {ans.answerType == 'checkbox' ? (
                    
                    <ListItem
                    selected={an.some(e => e.answerID === ans.id)}
                    onPress={() => storeAnswer(ans.answerType,ans.id, ans.questionID, null, question[current].questionType,null,ans.none )}
                    >
                    <Left>
                        <Text>{ans.content}</Text>
                    </Left>
    
                    <Right>
                    <CheckBox 
                       /*checked={checkBoxes(ans.id) == true ? true : false}
                       onPress={() => storeAnswer(ans.answerType,ans.id, ans.questionID, null, question[current].questionType )}
                        */
                        value={an.some(e => e.answerID === ans.id)}
                        onValueChange={() => storeAnswer(ans.answerType,ans.id, ans.questionID, null, question[current].questionType,null, ans.none )}
                        style={{marginRight:10}}
                    />
                    </Right>
    
                    </ListItem>
                    ) : null 
                 }

                {ans.answerType == 'rating' ? (
                    
                    <ListItem>
    
                    <Body>
                    <AirbnbRating
                    count={5}
                    reviews={[]}
                    defaultRating={0}
                    size={30}
                    onFinishRating={a => {
                        storeAnswer(ans.answerType,ans.id, ans.questionID, null, question[current].questionType,a )
                    }}
                    />
                    </Body>
    
                    </ListItem>
                    ) : null

                }

                {ans.answerType == 'link' ? (
                    
                    <ListItem>
    
                    <Body style={{ justifyContent:'center', alignItems:'center' }}>
                        <TouchableOpacity onPress={() => Linking.openURL(ans.content)}>
                            <Text style={{ fontSize:20, fontWeight:'bold',}}>Open Url 
                            <Text style={{ color:'blue', fontSize:16, fontWeight:'400'}}>({ans.content})</Text></Text>
                        </TouchableOpacity>
                    </Body>
    
                    </ListItem>
                    ) : null

                }

                {ans.answerType == 'text' ? (
                    
                    <Form style={{backgroundColor:'#fff'}}>
                        <Textarea rowSpan={5} bordered placeholder="Your answer"
                        onChangeText={val => setQuestion({...que,val:val})}
                        />
                        <Button title="Submit Answer" onPress={() => {
                            if(val !== null){
                                storeAnswer(ans.answerType,ans.id,
                                    ans.questionID, null,
                                    question[current].questionType,val )
                            }
                            else{
                                alert('Please add your answer')
                            }
                        }}></Button>
                    </Form>
                    ) : null

                }

                    </>
                        ))}
                </>
                    }

                {question[current].questionType == 'grid' &&
                <View style={{ backgroundColor: '#fff', paddingLeft: 10, paddingRight: 10}}>
                    {question[current].answers.map((ans,index) => (
                        <>
                        { question[current].questionID == ans.questionID && (
                            <>
                            <Row style={{ justifyContent:'center', alignItems:'center', marginTop:20}}>
                            <Text>{ans.Question}</Text>
                            </Row>

                        <View style={{ flex:1, flexDirection:'row', justifyContent:'space-around', marginTop:20, backgroundColor:'#f4f4f4', paddingTop:10, paddingBottom:10}}>       
                        {ans.answer.map((a,i) => (
                            <>

                            {a.answerType === 'radio' && 
                            <View style={{ justifyContent:'center', alignItems:'center'}}>
                            <TouchableOpacity onPress={() => storeAnswer(a.answerType, a.id, a.questionID, a.grid_question_id, 'grid',null,a.exit_ans)} >
                            <Radio selected={an.filter(e => e.answerID === a.id).length > 0 ? true : false} 
                            onPress={() => storeAnswer(a.answerType, a.id, a.questionID, a.grid_question_id, 'grid',null,a.exit_ans)} 
                            />
                            <Text>{a.content}</Text>
                            </TouchableOpacity>
                            
                            </View>
                            }

                        {a.answerType == 'link' && 
    
                        <Body style={{ justifyContent:'center', alignItems:'center' }}>
                            <TouchableOpacity onPress={() => Linking.openURL(a.content)}>
                                <Text style={{ fontSize:20, fontWeight:'bold',}}>Open Url 
                                <Text style={{ color:'blue', fontSize:16, fontWeight:'400'}}>({a.content})</Text></Text>
                            </TouchableOpacity>
                        </Body>
                        }

                            {a.answerType === 'checkbox' && 
                            <View style={{ justifyContent:'center', alignItems:'center'}}>
                            <TouchableOpacity onPress={() => storeAnswer(a.answerType, a.id, a.questionID, a.grid_question_id, 'grid')} >
                            <CheckBox
                                value={an.some(e => e.answerID === a.id)}
                                onValueChange={() => storeAnswer(a.answerType, a.id, a.questionID, a.grid_question_id, 'grid')}
                                style={{marginRight:10}}
                            />
                            <Text>{a.content}</Text>
                            </TouchableOpacity>
                            </View>
                            }


                            </>
                        ))}

                        </View>
                            
                        </>
                        
                        )}
                        </>

                        ))}
                </View>
                    }

                <Row style={{ paddingTop: 10, paddingBottom: 10, paddingLeft: 10, paddingRight: 10, backgroundColor: '#fff' }}>
                    <Left>
                        <Button title='Previous' onPress={previousQuestion} disabled={current === 0 ? true : false}></Button>
                    </Left>

                    <Right>
                        <Button onPress={questionUpdate} title={current === total ? 'Finish' : 'Next'} disabled={check}></Button>
                    </Right>
                </Row>
            </Content>
            ) : null}
    </Container>
    )

}