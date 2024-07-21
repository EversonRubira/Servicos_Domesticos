const request = require("supertest");
const api = require("../src/app.js");
const expect = require("chai").expect;

describe("API de usuários", () => {
  let user_id;  // Variável para armazenar o ID do usuário criado.

  // Criar usuário antes de todos os testes.
  before(async () => {
    const newUser = {
      nome: "Everson Rubira",
      email: "everson@example.com",
      senha: "1!2@3#4$5%",
      tipo: "cliente"
    };
    const response = await request(api)
      .post("/user")
      .set('Content-Type', 'application/json')
      .send(newUser);

    expect(response.status).to.equal(201);
    user_id = response.body.userId;  // Salva o ID do usuário criado para uso nos testes subsequentes.
  });

  // Teste para verificar se o usuário foi criado corretamente.
  it("Deve criar um novo usuário corretamente", async () => {
    expect(user_id).to.not.equal(0);  // Verifica se um ID de usuário foi recebido.
  });

  // Teste para recuperar usuário pelo email.
  it("Deve recuperar usuário pelo email", async () => {
    const emailBusca = 'everson@example.com';
    const response = await request(api)
      .get("/user/" + emailBusca)
      .send();
    expect(response.status).to.equal(200);
    expect(response.body.user.nome).to.equal("Everson Rubira");
    expect(response.body.user.email).to.equal(emailBusca);
    expect(response.body.user.tipo).to.equal("cliente");
  });

  // Teste para recuperar todos os usuários.
  it("Deve recuperar todos usuário", async () => {
    const response = await request(api)
      .get("/user")
      .send();
    expect(response.status).to.equal(200);
    expect(response.body.users.length).to.be.above(0);
  });

  // Teste para remover usuário corretamente.
  it("Deve remover usuário corretamente", async () => {
    const response = await request(api)
      .del("/user/" + user_id)
      .send();
    expect(response.status).to.equal(200);
    expect(parseInt(response.body.userId)).to.equal(user_id);
  });
});
