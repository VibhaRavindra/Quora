import  { INCREASE_PROFILE_VIEW_COUNT, GET_PROFILE_VIEW_COUNT, INCREASE_BOOKMARK_COUNT, GET_BOOKMARK_COUNT } from '../constants/action-types';
import axios from "axios";
import {rooturl} from '../../Config/settings';

export const increaseProfileView = (data) => async (dispatch) => {
    // var token = localStorage.getItem("token");
    console.log("in actions");
     axios.defaults.withCredentials = true;
     await axios({
         method: 'post',
         data: data,
         url: 'http://'+rooturl+':3001/quora/graphprofileview',
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
                 type: INCREASE_PROFILE_VIEW_COUNT,
                 payload: responseData
             });   
         }).catch(function (err) {
             console.log(err)
         });
 }

 export const getProfileViews = (data) => async (dispatch) => {
    // var token = localStorage.getItem("token");
    console.log("in actions");
     axios.defaults.withCredentials = true;
     await axios({
         method: 'get',
         params: data,
         url: 'http://'+rooturl+':3001/quora/graphprofileview',
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
                 type: GET_PROFILE_VIEW_COUNT,
                 payload: responseData
             });   
         }).catch(function (err) {
             console.log(err)
         });
 }

 export const increaseBookmarkCount = (data) => async (dispatch) => {
    // var token = localStorage.getItem("token");
    console.log("in actions");
     axios.defaults.withCredentials = true;
     await axios({
         method: 'post',
         data: data,
         url: 'http://'+rooturl+':3001/quora/graphbookmarkcount',
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
                 type: INCREASE_BOOKMARK_COUNT,
                 payload: responseData
             });   
         }).catch(function (err) {
             console.log(err)
         });
 }

 export const getBookmarkCount = (data) => async (dispatch) => {
    // var token = localStorage.getItem("token");
    console.log("in actions");
     axios.defaults.withCredentials = true;
     await axios({
         method: 'get',
         params: data,
         url: 'http://'+rooturl+':3001/quora/graphbookmarkcount',
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
                 type: GET_BOOKMARK_COUNT,
                 payload: responseData
             });   
         }).catch(function (err) {
             console.log(err)
         });
 }
