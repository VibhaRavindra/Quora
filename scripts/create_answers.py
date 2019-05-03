import requests
#incomplete
def create_questions(start,end):
 for i in range(start,end):
# all answers are created under 5cc6c681efc6c2d728fac803 question
  answer_data = {"answer":"{\"ops\":[{\"insert\":\"This is answer "+str(i)+"\\n\"}]}","user_username":"Test1@gmail.com","user_name":"Test 1","user_profile_pic":None,"user_tagline":None}
  requests.post("http://localhost:3001/answer/5cc6c681efc6c2d728fac803",json=answer_data)

create_questions(10,10001)
