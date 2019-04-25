import axios from "axios";
import { NOTIFICATIONS } from '../constants/action-types';


export function notifications(data,tokenfromstorage) {
  console.log("inside  notifications action")
  console.log(data)
  var config = {
    headers: {'Authorization': tokenfromstorage,
              'Content-Type': 'application/json'
    }
  };
  console.log("tokenFromStorage", tokenfromstorage)

  axios.defaults.withCredentials = true;
  const response =  axios.post('http://localhost:3001/quora/notifications',data, config);
  console.log("Response", response);
  return {
    type: NOTIFICATIONS,
    payload: response
  };  
}