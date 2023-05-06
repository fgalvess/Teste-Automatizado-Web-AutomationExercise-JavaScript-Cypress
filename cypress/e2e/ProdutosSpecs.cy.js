describe('Testar funcionalidades relacionadas aos produtos da loja', () => {
    
    beforeEach(() => {
        cy.visit('/')
        cy.get('body').should('be.visible')
    });

    //Atribui em variáveis o  mapeamento de alguns botões
    let produto1 = ':nth-child(3) > .product-image-wrapper > .single-products > .productinfo > .btn'
    let produto2= ':nth-child(4) > .product-image-wrapper > .single-products > .productinfo > .btn'
    let produtoTelaInicial = ':nth-child(4) > .product-image-wrapper > .choose > .nav > li > a'
    let verCarrinho = 'u'
    let verProduto = ':nth-child(3) > .product-image-wrapper > .choose > .nav > li > a'
    let adcionarProdutoRecomendadoNoCarrinho = '.active > :nth-child(3) > .product-image-wrapper > .single-products > .productinfo > .btn'

    it('Verificar todos os produtos e a página de detalhes do produto', () => {
        //Acessa a tela de detalhes de um produto
        acessarProdutos()
        cy.get(verProduto).click()
        //Valida que os detalhes estão visíveis
        cy.get('.product-information').should('be.visible')
    });

    it('Pesquisar produtos', () => {
        cy.fixture('produtos.json').then(produtos =>{
            //Acessa a tela de produtos
            acessarProdutos()
            //Pesquisa por um produto
            cy.get('#search_product').type(produtos.calça)
            cy.get('#submit_search').click()
            //Valida que no resultando contém o produto pesquisado
            cy.get('.features_items').contains(produtos.calça)
        })
    });

    it('Adicionar produto no carrinho', () => {
        acessarProdutos()
        //Adiciona primeiro produto no carrinho e continua na tela de produtos
        cy.get(produto1).click()
        cy.contains('Continue Shopping').click()
        //Adiciona segundo produto no carrinho e acessa a tela do carrinho
        cy.get(produto2).click()
        cy.get(verCarrinho).click()
        //Valida que os produtos foram adicionados
        cy.get('#product-1').should('be.visible')
        cy.get('#product-2').should('be.visible')
    });

    it('Verificar quantidade de produto no carrinho', () => {
        //Visualiza os detalhes do produto da tela inicial
        cy.get(produtoTelaInicial).click()
        //Adiciona 5 unidades do produto no carrinho
        cy.get('#quantity').click().clear().type(5)
        cy.contains('Add to cart').click()
        //Acessa o carrinho
        cy.get(verCarrinho).click()
        //Valida que as 5 unidades do produto foram adicionadas no carrinho
        cy.get('.disabled').should('have.text','5')
    });

    it('Remover produtos do carrinho', () => {
        //Acessa a tela de produtos e adiciona um protudo no carrinho
        acessarProdutos()
        cy.get(produto1).click()
        cy.contains('Continue Shopping').click()
        //Acessa o carrinho e remove o produto
        cy.contains('Cart').click()
        cy.get('.cart_quantity_delete').click()
        //Valida que o produto foi removido do carrinho
        cy.contains('Cart is empty!').should('be.visible')
    });

    it('Exibir produtos da categoria', () => {
        //Verifica se as categorias estão visíveis
        cy.get('.left-sidebar > :nth-child(1)').should('have.text', 'Category')
        //Clica na categoria "Mulheres" e seleciona "Vestidos"
        cy.get(':nth-child(1) > .panel-heading > .panel-title > a > .badge > .fa').click()
        cy.get('#Women > .panel-body > ul > :nth-child(1) > a').click()
        //Verifica se é exibido apenas produtos da categoria "Mulher - Vestidos"
        cy.get('.title').should('have.text', 'Women - Dress Products')
        //Muda para a categoria "Homem - Camisas"
        cy.get(':nth-child(2) > .panel-heading > .panel-title > a > .badge > .fa').click()
        cy.get('#Men > .panel-body > ul > :nth-child(1) > a').click()
        //Verifica se é exibido apenas produtos da categoria "Homem - Camisas"
        cy.get('.title').should('have.text', 'Men - Tshirts Products')
    });

    it('Avaliar produto', () => {
        cy.fixture('produtos.json').then(produtos =>{
            //Acessa a tela de detalhes de um produto
            acessarProdutos()
            cy.get(verProduto).click()
            cy.get('.active > a').should('be.visible')
            //Preenche nome e email do usuario
            cy.fixture('usuarios.json').then(usuarios =>{
                cy.get('#name').type(usuarios.usuarioValido.nome)
                cy.get('#email').type(usuarios.usuarioValido.email)
            })
            //Escreve um comentário sobre o produto e clica em enviar
            cy.get('#review').type(produtos.comentário)
            cy.get('#button-review').click()
            //Verifica se a mensagem confirmando o envio do comentário aparece
            cy.get('.alert-success > span').should('have.text', 'Thank you for your review.')
        })
    });

    it('Adicionando um item recomendado no carrinho', () => {
        //Dar scrool até a parte inferior da página e adicionar um produto recomendado no carrinho
        cy.get('.recommended_items').scrollIntoView()
        cy.get('.recommended_items > .title').should('have.text','recommended items')
        cy.get(adcionarProdutoRecomendadoNoCarrinho).click()
        //Verificar se o produto foi adicionado no carrinho
        cy.get(verCarrinho).click()
        cy.get('.cart_description').should('be.visible')
    });
});
//
function acessarProdutos(){ 
    cy.contains('Products').click()
    cy.get('.title').should('have.text','All Products')
}