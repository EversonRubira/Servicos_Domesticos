// Arquivo: user.api.test.js
const request = require("supertest")
const api = require("../src/app.js");
const dbConnection = require("../src/config/database.js");
var expect = require("chai").expect

// Arrange
const newUser = { 
  nome:"Joao Freitas", 
  email:"joao@example.com", 
  senha:"1!2@3#4$5%", 
  tipo:"cliente"
 };

 var user_id = 0;

describe("API de usuários", () => {
  it("Deve criar um novo usuário corretamente", async () => {
    // Act
    const response = await request(api)
            .post("/user")
            .set('Content-Type', 'application/json')
            .send(newUser);
    // Assert
    expect(201).to.equal(response.status);
    expect(0).to.not.equal(response.body.userId);  
    user_id = response.body.userId;
  });
});



describe("API de usuários", () => {
  it("Deve recuparar usuário pelo email", async () => {
    var emailBusca = 'joao@example.com'
    
    // Act
    const response = await request(api)
            .get("/user/" + emailBusca)
            //.set('Content-Type', 'application/json')
            .send();
    // Assert
    expect(response.status).to.equal(200);
    expect(response.body.user.nome).to.equal(newUser.nome);
    expect(response.body.user.email).to.equal(emailBusca);    
    expect(response.body.user.tipo).to.equal(newUser.tipo);
  });
});


describe("API de usuários", () => {
  it("Deve recuparar todos usuário", async () => {
    // Act
    const response = await request(api)
            .get("/user")
            //.set('Content-Type', 'application/json')
            .send();
    // Assert
    expect(response.status).to.equal(200);
    expect(response.body.users.length).to.be.above(0);
  });
});
/*
describe("API de usuários", () => {
  it("Deve autenticar usuário com sucesso", async () => {
    // Act
    const response = await request(api)
            .post("/user/auth")
            .set('Content-Type', 'application/json')
            .send(newUser);
    // Assert
    expect(response.status).to.equal(200);
    expect(response.body.auth).to.equal(true);
  });
});

describe("API de usuários", () => {
  it("Deve alterar usuário corretamente", async () => {

    // Arrange
    const alterUser = { 
      name:"Joao Freitas Alteracao", 
      email:"alteracao@example.com", 
      senha:"222222222", 
      tipo:"ADMIN"
    };
    // Act
    const response = await request(api)
            .put("/user/" + user_id)
            .set('Content-Type', 'application/json')
            .send(alterUser);
  
    // Assert
    expect(response.status).to.equal(200);
    expect(response.body.user.name).to.equal(alterUser.name);
    expect(response.body.user.email).to.equal(alterUser.email);
    expect(response.body.user.tipo).to.equal(alterUser.tipo);
  });
});
*/

describe("API de usuários", () => {
  it("Deve remover usuário corretamente", async () => {
    // Act
    const response = await request(api)
            .del("/user/" + user_id)
            .send();
    // Assert
    expect(200).to.equal(response.status);
    expect(user_id).to.equal(parseInt(response.body.userId));
  });
});

