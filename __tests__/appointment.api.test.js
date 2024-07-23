const request = require("supertest");
const api = require("../src/app.js");  // Certifique-se de que o caminho está correto
const expect = require("chai").expect;

describe("API de agendamentos", () => {
    let appointmentId;
    let clienteId, servicoId, prestadorId;

    before(async () => {
        try {
            // Criar cliente temporário como um usuário do tipo 'cliente'
            const clienteResponse = await request(api).post('/users/user').send({
                nome: "Cliente Teste", 
                email: "cliente@teste.com", 
                senha: "senha123", 
                tipo: "cliente"
            });
            if (clienteResponse.status !== 201) throw new Error(`Erro ao criar cliente: ${clienteResponse.status}`);
            clienteId = clienteResponse.body.userId;
    
            // Suponha que você já tem um serviço e prestador criados, e seus IDs são conhecidos
            servicoId = 1; // ID do serviço existente
            prestadorId = 1; // ID do prestador existente

            const appointmentData = {
                cliente_id: clienteId, 
                servico_id: servicoId, 
                prestador_id: prestadorId,
                data_hora: new Date().toISOString(), 
                status: "agendado"
            };
    
            const appointmentResponse = await request(api).post("/appointments").send(appointmentData);
            if (appointmentResponse.status !== 201) throw new Error(`Erro ao criar agendamento: ${appointmentResponse.status}`);
            appointmentId = appointmentResponse.body.appointmentId;
        } catch (error) {
            console.error('Erro durante a configuração do teste:', error.message);
        }
    });

    after(async () => {
        // Limpar dados criados para o teste
        await Promise.all([
            request(api).delete(`/users/user/${clienteId}`),  
            request(api).delete(`/appointments/${appointmentId}`)
        ]);
    });

    it("Deve agendar um serviço corretamente", async () => {
        expect(appointmentId).to.not.equal(null);
    });

    it("Deve atualizar o status de um agendamento", async () => {
        const response = await request(api)
            .put(`/appointments/${appointmentId}`)
            .send({ status: "concluído" });
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal("Compromisso atualizado com sucesso");
    });

    it("Deve listar todos os agendamentos", async () => {
        const response = await request(api)
            .get("/appointments/");
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array');
    });

    it("Deve deletar um agendamento", async () => {
        const deleteResponse = await request(api)
            .delete(`/appointments/${appointmentId}`);
        expect(deleteResponse.status).to.equal(200);
        expect(deleteResponse.body.message).to.equal("Compromisso deletado com sucesso");
    });
});
