import requests
def start_from(start, end):
 for i in range(start, end):
  data_dict = dict(firstname="Test", lastname=str(i), user_name="Test"+str(i)+"@gmail.com", password="Test"+str(i))
  requests.put("http://localhost:3001/account/signup", data=data_dict)

start_from(5223,10001)
