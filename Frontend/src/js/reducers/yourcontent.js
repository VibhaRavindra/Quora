import { GET_QUESTIONS_ASKED,GET_QUESTIONS_FOLLOWED,GET_USER_ANSWERS } from "../constants/action-types";

const initialState ={
  
}

export default function(state=initialState,action){
    switch(action.type){
        case GET_QUESTIONS_ASKED:
        console.log(action.payload);
         return{
             
             ...state,
             payload:action.payload,

               }
         case GET_QUESTIONS_FOLLOWED:
         console.log(action.payload);
         return{
             ...state,
            questionsfollowed:action.payload,
         } 
         case GET_USER_ANSWERS:
         console.log(action.payload);
         return{
             ...state,
            useranswers:action.payload,
         } 
         default:
         return state;     
    }
}