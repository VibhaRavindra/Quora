var chai = require('chai');
var chaiHttp = require('chai-http');
var should = require('chai').should();
chai.use(chaiHttp);
var assert = require('assert');
var expect = chai.expect;
let rooturl = 'http://backend-kafka-zookeeper-320127944.us-west-1.elb.amazonaws.com:3001';

describe('Quora Mocha Test Harness:', () => {

    // Get all questions
    it("Test Case 1 - Get all questions for home page Quora", (done) => {
        chai.request(rooturl)
        .get(`/quora/questions`)
        .set('Accept', 'application/json')
        .end((err, res) => {
            expect(err).to.be.null;
            res.body.should.be.a('Object');
            res.status.should.be.equal(200);  
        done();
        });
    })

    //Add new question
    it("Test Case 2 - User should be able to add a new question", (done) => { 

        let timestamp = new Date();
        //sample data
        const questionData = { 
            "question":"Will the iphone work at -2deg? "+timestamp,
            "topic_name": "technology",
            "owner_id": "5cd14cab5e70255146f4031b",
            "owner_name": "swetha",
            "owner_username":"swetha.suresh@sjsu.edu"
        }
        chai.request(rooturl)
        .post('/quora/question')
        .send(questionData)
        .end((err, res) => {
            expect(err).to.be.null;
            res.should.have.status(200);
            res.body.should.have.property('responseMessage').equal('Successfully Added!');
        done();
        });
    })

    //Send a message

    it("Test Case 3 - Send message to a Quora user", (done) => { 

        //sample data
        const messageData = { 
            "to": "vibhashree.ravindra@sjsu.edu", 
            "from": "swetha.suresh@sjsu.edu", 
            "message": "This message is send from mocha",
            "sent_from_name": "swetha"
        }
        chai.request(rooturl)
        .post('/quora/new/message')
        .send(messageData)
        .end((err, res) => {
            expect(err).to.be.null;
            res.should.have.status(200);
            res.body.should.have.property('responseMessage').equal('Successfully Sent!');
        done();
        });
    })

       // add description
       it("Test Case 4 - adddescription", (done) => {

        const data = { 
            "user_name":"swetha.suresh@sjsu.edu",
            "aboutme":"i am in wonderland"
        }
        chai.request(rooturl)
        .post(`/quora/adddescription`)
        .send(data)
        .end((err, res) => {
            expect(err).to.be.null;
            res.should.have.status(200);
            res.body.should.have.property('responseMessage').equal('Successfully Added!');
        done();
        });
    })
    //addtagline
    it("Test Case 5 - User should be able to add a tagline", (done) => { 

        //sample data
        var data={
            "user_name":"swetha.suresh@sjsu.edu",
            "tagline":"appleapple"
          }
        chai.request(rooturl)
        .post('/quora/addtagline')
        .send(data)
        .end((err, res) => {
            expect(err).to.be.null;
            res.should.have.status(200);
            res.body.should.have.property('responseMessage').equal('Successfully Added!');
        done();
        });
    })
    it("Test Case 6 - Get notifications", (done) => {

        const data = { 
           "user_name":"swetha.suresh@sjsu.edu"
        }
        chai.request(rooturl)
        .get(`/quora/notifications`)
        .send(data)
        .set('Accept', 'application/json')
        .end((err, res) => {
            expect(err).to.be.null;
            res.status.should.be.equal(200);  
        done();
        });
    })

    it("Test Case 7 - Get All answers", (done) => {

        chai.request(rooturl)
        .get(`/answer/5cd1c996781c14520863e869`)
        .set('Accept', 'application/json')
        .end((err, res) => {
            expect(err).to.be.null;
            res.status.should.be.equal(200);  
        done();
        });
    })

    it("Test Case 8 - Get user bookmarks", (done) => {

        const data = { 
            user_id: "5cd1c96638a6d0560e944fca"
         }
        chai.request(rooturl)
        .post('/bookmarks')
        .send(data)
        .end((err, res) => {
            expect(err).to.be.null;
            res.should.have.status(200);
        done();
        });
    })

    it("Test Case 9 - Get questions asked", (done) => {

        const data = { 
            user_id: "5cd1c96638a6d0560e944fca"
         }
        chai.request(rooturl)
        .get(`/content/questions_asked`)
        .set('Accept', 'application/json')
        .end((err, res) => {
            expect(err).to.be.null;
            res.status.should.be.equal(200);  
        done();
        });
    })

    it("Test Case 10 - Search topics", (done) => {

         chai.request(rooturl)
        .get(`/search/topics/technology`)
        .set('Accept', 'application/json')
        .end((err, res) => {
            expect(err).to.be.null;
            res.status.should.be.equal(200);  
        done();
        });
    })



})
