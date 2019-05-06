import  { GET_PROFILE_PIC } from '../constants/action-types';
import axios from "axios";
import {rooturl} from '../../Config/settings';


export const getProfilePic = (userid) => async (dispatch) => {
    //var token = localStorage.getItem("token");
    axios.defaults.withCredentials = true;
    await axios({
        method: 'get',
        params: {"userid": userid},
        url: 'http://'+rooturl+':3001/quora/profilepic',
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
                type: GET_PROFILE_PIC,
                payload: responseData
            });   
        }).catch(function (err) {
            console.log(err)
        });
}