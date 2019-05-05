var chai = require('chai');
var chaiHttp = require('chai-http');
var should = require('chai').should();
chai.use(chaiHttp);
var assert = require('assert');
var expect = chai.expect;
let rooturl = 'http://localhost:3001';

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

        //sample data
        const questionData = { 
            "question":"why is technology so important?",
            "topic_name": "technology",
            "owner_id": "5cc69cca0b036cd050eaa901",
            "owner_name": "Mocha Test",
            "owner_username":"mocha@gmail.com"
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
            "sent_from_name": "swetha suresh"
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

})