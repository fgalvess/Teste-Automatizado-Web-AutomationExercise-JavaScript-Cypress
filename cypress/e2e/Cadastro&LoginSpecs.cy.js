describe('Testar funcionalidade de cadastro e login', () => {

    beforeEach(() => {
      cy.visit('/')
      cy.get('body').should('be.visible')
      cy.get('.shop-menu > .nav > :nth-child(4) > a').click()
    });

    it('Registrar usuário', () => {
      cy.fixture('cadastro.json').then(cadastro => {
        //Preenche os dados do novo usuário
        prencherNovoUsuario(cadastro.nome, cadastro.email)
        preencherCadastro()
        //Verifica se o nome do usuário aparece no menu
        cy.get(':nth-child(10) > a').should('have.text', ' Logged in as ' + cadastro.nome)
        //Deleta a conta e verifica se a conta foi deletada  
        cy.get('.shop-menu > .nav > :nth-child(5) > a').click()
        cy.get('b').should('have.text', 'Account Deleted!')
      })
    });

    it('Registrar usuário com email existente', () => {
      cy.fixture('usuarios.json').then(usuarios =>{
        //Preenche os dados do novo usuário com um usuário já registrado
        prencherNovoUsuario(usuarios.usuarioValido.nome, usuarios.usuarioValido.email)
        //Verifica se a mensagem informando que o email já existe aparece
        cy.get('.signup-form > form > p').should('be.visible')
        cy.get('.signup-form > form > p').contains('Email Address already exist!')
      })
    });

    it('Login com usuário válido', () => {
      cy.fixture('usuarios.json').then(usuarios => {
        //Realiza login com um  usário válido
        fazerLogin(usuarios.usuarioValido.email, usuarios.usuarioValido.senha)
        //Verifica se o nome do usuário aparece no menu
        cy.get(':nth-child(10) > a').should('have.text', ' Logged in as ' + usuarios.usuarioValido.nome)
      })
    })
    
    it('Login com usuário inválido', () => {
      cy.fixture('usuarios.json').then(usuarios => {
        //Realiza login com um usuário inválido
        fazerLogin(usuarios.usuarioInvalido.email, usuarios.usuarioInvalido.senha)
        //Verifica se a mensagem de erro aparece
        cy.get('.login-form > form > p').should('have.text', 'Your email or password is incorrect!')
      })
    })
    
    it('Deslogar usuário', () => {
      cy.fixture('usuarios.json').then(usuarios =>{
        //Verifica se o formulário de login aparece. realiza login com usuário válido
        cy.get('.login-form > h2').contains('Login to your account')
        fazerLogin(usuarios.usuarioValido.email, usuarios.usuarioValido.senha)
        //Verifica se o nome do usuário aparece no menu
        cy.get(':nth-child(10) > a').should('have.text', ' Logged in as ' + usuarios.usuarioValido.nome)
        //Realiga logout e verifica se a página de login aparece após o logout
        cy.contains('Logout').click()
        cy.get('.login-form').should('be.visible')
      })
    });
});

function preencherCadastro(){
    cy.fixture('cadastro.json').then(cadastro => {
      //Verifica se o formulário de cadastro aparece e clica
      cy.get('.login-form').should('be.visible')
      //Clica em criar conta
      cy.get(':nth-child(3) > .top > [data-qa="title"]').click()
      //Define uma senha para a conta
      cy.get('[data-qa="password"]').type(cadastro.senha)
      //Verifica se o usuário optou por receceber NewsLetter e Aceitar Termos e clica no checkbox correspondente
      if (cadastro.receberNewsletter) {
        cy.get('#newsletter').click()
      }
      if (cadastro.aceitaTermos) {
        cy.get('#optin').click()
      }
      //Preenche dados do cadastro
      cy.get('[data-qa="first_name"]').type(cadastro.primeiroNome)
      cy.get('[data-qa="last_name"]').type(cadastro.ultimoNome)
      cy.get('[data-qa="company"]').type(cadastro.empresa)
      cy.get('[data-qa="address"]').type(cadastro.endereco)
      cy.get('[data-qa="state"]').type(cadastro.estado)
      cy.get('[data-qa="city"]').type(cadastro.cidade)
      cy.get('[data-qa="zipcode"]').type(cadastro.cep)
      cy.get('[data-qa="mobile_number"]').type(cadastro.telefone)
      cy.get('[data-qa="create-account"]').click()
      cy.get('b').should('have.text', 'Account Created!')
      cy.get('[data-qa="continue-button"]').click()
    })
  }
  
  function fazerLogin(email, senha) {
    cy.fixture('usuarios.json').then(usuarios => {
      //Preenche email, senha e clica no botão de login
      cy.get('[data-qa="login-email"]').type(email)
      cy.get('[data-qa="login-password"]').type(senha)
      cy.get('[data-qa="login-button"]').click()
    })
  }

  function prencherNovoUsuario(nome, email){
    cy.fixture('cadastro.json').then(cadastro =>{
      //Verifica se o formuláio de cadastro aparece
      cy.get('.signup-form').should('be.visible')
      //Preenche email, senha e clica no botão de inscrever-se
      cy.get('[data-qa="signup-name"]').type(nome)
      cy.get('[data-qa="signup-email"]').type(email)
      cy.get('[data-qa="signup-button"]').click()
    })
  }