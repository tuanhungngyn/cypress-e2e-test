describe('E2E demoblaze test', () => {
  it('should create user-acc, log in, put 3 items into cart, check total amount, delete one item, check total amount again, complete order', () => {
    const baseUrl = 'https://www.demoblaze.com'
    cy.visit(baseUrl)

    // 1. Create user account
    const username = 'testuser1234567!'
    const password = 'Password1234!'
    cy.get('#signin2').click()
    cy.get('#sign-username').type(username, {delay:0})
    // cy.get('#sign-username').should('contain', username) // in case of debugging
    cy.wait(2000)
    cy.get('#sign-password').type(password, {delay:300})
    cy.contains('button', 'Sign up').click()



    // 2. Log into created account
    cy.get('#login2').click()
    cy.get('#loginusername').type(username, {delay:0})
    cy.get('#loginpassword').type(password, {delay:0})
    cy.contains('#logInModal .btn-primary', 'Log in').click()


    // 3. Put 3 items into cart
    const products = ['Samsung galaxy s6','Nokia lumia 1520','Nexus 6'] // should work for any item

    products.forEach((product) => {
      cy.contains(product).click()
      cy.contains('Add to cart').click()
      cy.get('.navbar-brand').click()
    })

    // 4. Check for total amount
    cy.get('#cartur', { timeout: 10000 }).should('be.visible').click()
    cy.wait(200)
    cy.get('tr.success').should('have.length', 3) // just makes sure that all 3 items are present
    function checkCartTotal() {
      cy.get('tr.success td:nth-child(3)').then(($cells) => {
        const prices = []

        $cells.each((i, cell) => {
          prices.push(Number(cell.innerText))
    })

        let sum = 0
          prices.forEach((price) => {
            sum += price
    })
    cy.get('#totalp').invoke('text').then((t) => {
      const total = Number(t)
      expect(total).to.eq(sum)
    })
  })
}
    checkCartTotal()


    // 5 + 6. Delete a product and check value again
    cy.get('tr.success a').first().click()
    cy.get('tr.success').should('have.length', 2)
    checkCartTotal()
    
    // 7. Complete order
    cy.contains('button', 'Place Order').click()
    const name = 'Max Mustermann'
    const country = 'Germany'
    const city = 'Hamburg'
    const credit_card = '12345'
    const month = 'September'
    const year = '2025'
    cy.get('#name').type(name)
    cy.get('#country').type(country)
    cy.get('#city').type(city)
    cy.get('#card').type(credit_card)
    cy.get('#month').type(month)
    cy.get('#year').type(year)
    cy.contains('button', 'Purchase').click()
  })
})