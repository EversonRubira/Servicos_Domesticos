const request = require("supertest");
const api = require("../src/app.js");  // Certifique-se de que o caminho está correto
const expect = require("chai").expect;

describe("API de serviços", () => {
    let serviceId;  // Variável para armazenar o ID do serviço criado para testes que precisam de um serviço persistente

    before(async () => {
        const response = await request(api)
            .post("/services/service")  // Certifique-se que essa rota está correta no servidor
            .send({
                nome: "Limpeza de Casa",
                descricao: "Serviço completo de limpeza",
                preco: "120.00"
            });
        expect(response.status).to.equal(201);
        serviceId = response.body.serviceId;  // Atribua o ID corretamente para uso nos outros testes
    });

    after(async () => {
        await request(api).delete(`/services/service/${serviceId}`);  // Corrigido para usar a sintaxe correta
    });

    it("Deve criar um serviço corretamente", async () => {
        const response = await request(api)
            .post("/services/service")
            .send({
                nome: "Jardinagem",
                descricao: "Manutenção de jardins e áreas verdes",
                preco: "99.99"
            });
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property("serviceId");
        // Limpeza após teste
        await request(api).delete(`/services/service/${response.body.serviceId}`);
    });

    it("Deve atualizar um serviço existente", async () => {
        const response = await request(api)
            .put(`/services/service/${serviceId}`)  // Corrigido para usar a sintaxe correta
            .send({
                nome: "Limpeza de Escritório",
                descricao: "Limpeza profissional de escritórios",
                preco: "199.99"
            });
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal("Serviço atualizado com sucesso");
    });

    it("Deve listar todos os serviços", async () => {
        const response = await request(api)
            .get("/services/services");
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array');
    });

    it("Deve recuperar um serviço pelo ID", async () => {
        const response = await request(api)
            .get(`/services/service/${serviceId}`); 
        expect(response.status).to.equal(200);
        expect(response.body.nome).to.equal("Limpeza de Escritório");
        expect(response.body.preco).to.equal(199.99);
    });

    it("Deve deletar um serviço", async () => {
        // Crie um serviço para deletar
        const createResponse = await request(api)
            .post("/services/service")
            .send({
                nome: "Serviço Temporário",
                descricao: "Este serviço será deletado",
                preco: "50.00"
            });
        expect(createResponse.status).to.equal(201);
        const tempServiceId = createResponse.body.serviceId;

        // Deleção
        const deleteResponse = await request(api)
            .delete(`/services/service/${tempServiceId}`);  // Corrigido para usar a sintaxe correta
        expect(deleteResponse.status).to.equal(200);
        expect(deleteResponse.body.message).to.equal("Serviço deletado com sucesso");
    });
});
