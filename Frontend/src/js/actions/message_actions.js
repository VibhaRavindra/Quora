import  { GET_EMAIL_LIST, SAVE_MESSAGE, GET_MESSAGE_CONVERSATION_LIST, GET_MESSAGES } from '../constants/action-types';
import axios from "axios";
import {rooturl} from '../../Config/settings';
import swal from 'sweetalert';

export const getEmailList = () => async (dispatch) => {
    //var token = localStorage.getItem("token");
    axios.defaults.withCredentials = true;
    await axios({
        method: 'get',
        url: 'http://'+rooturl+':3001/quora/emailList',
        config: { headers: { 'Content-Type': 'application/json' } },
        //headers: {"Authorization" : `Bearer ${token}`}
    })
        .then((response) => {
            if (response.status >= 500) {
                throw new Error("Bad response from server");
            }
            return response.data;
        })
        .then(async (responseData) => {
            //result.data1 = "data";
            console.log('responseData: ', responseData)
            dispatch({
                type: GET_EMAIL_LIST,
                payload: responseData
            });   
        }).catch(function (err) {
            console.log(err)
        });
}

export const saveMessage = (data) => async (dispatch) => {
    var token = localStorage.getItem("token");
    console.log("saving message");
    axios.defaults.withCredentials = true;
    await axios({
        method: 'post',
        data: data,
        url: 'http://'+rooturl+':3001/quora/new/message',
        config: { headers: { 'Content-Type': 'application/json' } },
        headers: {"Authorization" : `Bearer ${token}`}
    })
        .then((response) => {
            if (response.status >= 500) {
                throw new Error("Bad response from server");
            }
            return response.data;
        })
        .then(async (responseData) => {
            console.log('responseData: ', responseData);
            swal(responseData.responseMessage);
            dispatch({
                type: SAVE_MESSAGE,
                payload: responseData
            });   
        }).catch(function (err) {
            console.log(err)
        });
}

export const getMessageConversationList = (user) => async (dispatch) => {
    //var token = localStorage.getItem("token");
    axios.defaults.withCredentials = true;
    await axios({
        method: 'get',
        url: 'http://'+rooturl+':3001/quora/messages/conversationList',
        params: {"user": user},
        config: { headers: { 'Content-Type': 'application/json' } },
        //headers: {"Authorization" : `Bearer ${token}`}
    })
        .then((response) => {
            if (response.status >= 500) {
                throw new Error("Bad response from server");
            }
            return response.data;
        })
        .then(async (responseData) => {
            //result.data1 = "data";
            console.log('responseData: ', responseData)
            dispatch({
                type: GET_MESSAGE_CONVERSATION_LIST,
                payload: responseData
            });   
        }).catch(function (err) {
            console.log(err)
        });
}

export const getMessages = (fromID, toID) => async (dispatch) => {
    //var token = localStorage.getItem("token");
    axios.defaults.withCredentials = true;
    await axios({
        method: 'get',
        url: 'http://'+rooturl+':3001/quora/messages',
        params: {"fromID": fromID, "toID": toID},
        config: { headers: { 'Content-Type': 'application/json' } },
        //headers: {"Authorization" : `Bearer ${token}`}
    })
        .then((response) => {
            if (response.status >= 500) {
                throw new Error("Bad response from server");
            }
            return response.data;
        })
        .then(async (responseData) => {
            //result.data1 = "data";
            console.log('responseData: ', responseData)
            dispatch({
                type: GET_MESSAGES,
                payload: responseData
            });   
        }).catch(function (err) {
            console.log(err)
        });
}



