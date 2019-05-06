import  { ADD_QUESTION, GET_ALL_QUESTIONS } from '../constants/action-types';
import axios from "axios";
import swal from 'sweetalert';
import {rooturl} from '../../Config/settings';


export const addQuestion = (data) => async (dispatch) => {
   // var token = localStorage.getItem("token");
   console.log("in actions");
    axios.defaults.withCredentials = true;
    await axios({
        method: 'post',
        data: data,
        url: 'http://'+rooturl+':3001/quora/question',
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
            console.log('responseData: ', responseData);
            swal(responseData.responseMessage);
            dispatch({
                type: ADD_QUESTION,
                payload: responseData
            });   
        }).catch(function (err) {
            console.log(err)
        });
}

export const getAllQuestions = () => async (dispatch) => {
    // var token = localStorage.getItem("token");
    axios.defaults.withCredentials = true;
    await axios({
        method: 'get',
        url: 'http://'+rooturl+':3001/quora/questions',
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
            console.log('responseData: ', responseData);
            dispatch({
                type: GET_ALL_QUESTIONS,
                payload: responseData
            });   
        }).catch(function (err) {
            console.log(err)
        });
}


export const getTopicQuestions = (topic) => async (dispatch) => {
    // var token = localStorage.getItem("token");
    console.log(topic);
    axios.defaults.withCredentials = true;
    await axios({
        method: 'get',
        url: 'http://'+rooturl+':3001/quora/questions/topic',
        params: {"topic": topic},
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
            console.log('responseData: ', responseData);
            dispatch({
                type: GET_ALL_QUESTIONS,
                payload: responseData
            });   
        }).catch(function (err) {
            console.log(err)
        });
}

