import axios from 'axios'
import {rooturl} from '../../config/settings';

import {GET_QUESTIONS_ASKED, GET_QUESTIONS_FOLLOWED,GET_USER_ANSWERS} from '../constants/action-types';

export const getquestionsasked = (userid)=>dispatch => {

     axios({
        method: 'get',
        url: 'http://'+rooturl+':3001/quora/getquestionsasked',
        params: {"userid": userid},
        config: { headers: { 'Content-Type': 'application/json' } },
        //headers: {"Authorization" : `Bearer ${token}`}
    })
    .then(res => {
        console.log(res.data);
        dispatch({
        type:GET_QUESTIONS_ASKED,
         payload:res.data, 
          });
        })
              
};


export const getquestionsfollowed = (userid) => dispatch =>{

    axios
    ({
        method: 'get',
        url: 'http://'+rooturl+':3001/quora/getquestionsfollowed',
        params: {"userid": userid},
        config: { headers: { 'Content-Type': 'application/json' } },
        //headers: {"Authorization" : `Bearer ${token}`}
    })
    .then(res =>{
        console.log(res.data);
        dispatch({
       
        type:GET_QUESTIONS_FOLLOWED,
         payload:res.data  
          })
        });
};

export const getuseranswers = (owner_name)=>
dispatch =>{
 axios
    ({
        method: 'get',
        url: 'http://'+rooturl+':3001/quora/getuseranswers',
        params: {"owner_name": owner_name},
        config: { headers: { 'Content-Type': 'application/json' } },
        //headers: {"Authorization" : `Bearer ${token}`}
    })
      .then(res => {
          console.log(res.data);
        dispatch({
          type:GET_USER_ANSWERS,
          payload:res.data,
      })
     } ) ;;  
     
    }

