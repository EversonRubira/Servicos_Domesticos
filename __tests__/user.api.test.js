const request = require("supertest");
const api = require("../src/app.js"); // Certifique-se de que o caminho está correto
const expect = require("chai").expect;

describe("API de usuários", () => {
  let user_id;

  before(async () => {
    const newUser = {
      nome: "Everson Rubira",
      email: "everson@example.com",
      senha: "1!2@3#4$5%",
      tipo: "cliente"
    };
    const response = await request(api)
      .post("/users/user") // Mudança aqui para refletir o prefixo usado
      .set('Content-Type', 'application/json')
      .send(newUser);

    expect(response.status).to.equal(201);
    user_id = response.body.userId;
  });

  it("Deve criar um novo usuário corretamente", async () => {
    expect(user_id).to.not.equal(0);
  });

  it("Deve recuperar usuário pelo email", async () => {
    const emailBusca = 'everson@example.com';
    const response = await request(api)
      .get("/users/user/" + emailBusca) // Mudança aqui para refletir o prefixo usado
      .send();
    expect(response.status).to.equal(200);
    expect(response.body.user.nome).to.equal("Everson Rubira");
    expect(response.body.user.email).to.equal(emailBusca);
    expect(response.body.user.tipo).to.equal("cliente");
  });

  it("Deve recuperar todos usuário", async () => {
    const response = await request(api)
      .get("/users/user") // Mudança aqui para refletir o prefixo usado
      .send();
    expect(response.status).to.equal(200);
    expect(response.body.users.length).to.be.above(0);
  });

  it("Deve remover usuário corretamente", async () => {
    const response = await request(api)
      .del("/users/user/" + user_id) // Mudança aqui para refletir o prefixo usado
      .send();
    expect(response.status).to.equal(200);
    expect(parseInt(response.body.userId)).to.equal(user_id);
  });
});
