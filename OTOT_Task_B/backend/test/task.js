const Task = require("../models/Task");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");
const should = chai.should();
const ROUTE = "/api/tasks";

chai.use(chaiHttp);

var initialDbSize;
var newTask = {
  description: "Hello world!",
  completed: true,
};
var editedTask = {
  description: "Goodbye world!",
  completed: false,
};
var id = "/";

describe("Tasks", () => {
  it("GET initial tasks", (done) => {
    chai
      .request(server)
      .get(ROUTE)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("array");
        initialDbSize = res.body.length;
        done();
      });
  });
  it("POST task", (done) => {
    chai
      .request(server)
      .post(ROUTE)
      .send(newTask)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("description").eql("Hello world!");
        res.body.should.have.property("date");
        res.body.should.have.property("completed").eql(true);
        id += res.body._id;
        done();
      });
  });
  it("PUT task", (done) => {
    chai
      .request(server)
      .put(ROUTE + id)
      .send(editedTask)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("description").eql("Goodbye world!");
        res.body.should.have.property("date");
        res.body.should.have.property("completed").eql(false);
        done();
      });
  });
  it("DELETE task", (done) => {
    chai
      .request(server)
      .delete(ROUTE + id)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("description").eql("Goodbye world!");
        res.body.should.have.property("date");
        res.body.should.have.property("completed").eql(false);
        done();
      });
  });
  it("GET final tasks", (done) => {
    chai
      .request(server)
      .get(ROUTE)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("array").to.have.lengthOf(initialDbSize);
        done();
      });
  });
});
