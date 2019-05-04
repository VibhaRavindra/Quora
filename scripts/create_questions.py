import requests
#incomplete
def create_questions(start,end):
 for i in range(start,end):
# all questions are created under Test1 user
  question_data = {"question":"What is perf testing "+str(i)+"?","topic_name":"technology","owner_id":"5cc68b084b8bfdcdd12cae8f","owner_name":"Test 1","owner_username":"Test1@gmail.com","owner_profile_pic":None,"owner_tagline":None}
  requests.post("http://localhost:3001/quora/question",json=question_data)

create_questions(372,10001)
