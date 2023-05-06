describe('Testar upload de arquivos', () => {

    before(() => {
        cy.visit('/')
        cy.get('body').should('be.visible')
        cy.get('.shop-menu > .nav > :nth-child(4) > a').click()
    });

    it('Enviar formulário', () => {
        cy.fixture('usuarios.json').then(usuarios =>{
            //Preenche dados do usuário
            cy.contains('Contact us').click()
            cy.get('div.contact-form').should('be.visible')
            cy.get('[data-qa="name"]').type(usuarios.usuarioValido.nome)
            cy.get('[data-qa="email"]').type(usuarios.usuarioValido.email)
            cy.get('[data-qa="subject"]').type(usuarios.usuarioValido.assunto)
            //Clica em "Enviar arquivo" e seleciona o arquivo a ser enviado
            cy.fixture('uploadTeste.txt').then(fileContent => {
                cy.get(':nth-child(6) > .form-control').attachFile({
                    fileContent: fileContent.toString(),
                    fileName: 'uploadTeste.txt',
                    mimeType: 'text/plain'
                })
            })
            //clica em enviar e valida que foi enviado
            cy.get('[data-qa="submit-button"]').click()
            cy.get('.status').should('have.text','Success! Your details have been submitted successfully.')
            cy.get('#form-section > .btn').click()
            cy.get('a > img').should('be.visible')   
        })       
    });
});