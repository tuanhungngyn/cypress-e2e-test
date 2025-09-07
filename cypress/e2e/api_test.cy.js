describe('Simple Books API', () =>{
    const url = 'https://simple-books-api.click'
    it('should return a list of books', () =>{
        cy.request('GET', `${url}/books`).then((response) => {
            expect(response.body).to.be.an('array')
            expect(response.status).to.eq(200) // 200 = everything was ok
            expect(response.body[0]).to.have.property('id')
            expect(response.body[0]).to.have.property('name')
        })
    })
    it('should return a specific book', () => {
        cy.request('GET', `${url}/books/1`).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.include({
                id:1,
                name:'The Russian',
                // could add way more attributes
            })
            // cy.log('Status: ' + response.status)
            // cy.log('Body: ' + JSON.stringify(response.body))
            // Response of book id: 1
            // "id":1,"entityType":"BOOK","available":true,"timestamp":1752239490804,"created":"2025-07-11T13:11:30.804Z","isbn":"1780899475","GSI1SK":"BOOK#1","name":"The Russian","current-stock":12,"GSI1PK":"TYPE#fiction","SK":"METADATA","price":12.98,"PK":"BOOK#1","author":"James Patterson and James O. Born","type":"fiction"}
        })
    })
    // register client 
    let token
    before(() => {
        cy.request({
            method: 'POST',
            url: `${url}/api-clients`,
            body: {
            clientName: 'api_test',
            clientEmail: `test${Date.now()}@example.com`
    }
  }).then((response) => {
        expect(response.status).to.eq(201)
        token = response.body.accessToken
        // cy.log('Token: ' + token)
  })
})
    it('should submit a new order', () => {
    cy.request({
        method: 'POST',
        url: `${url}/orders`,
        headers: { Authorization: `Bearer ${token}` },
        body: { bookId: 1, customerName: 'Max Mustermann' }
    }).then((response) => {
        expect(response.status).to.eq(201)
        expect(response.body).to.have.property('orderId')
    })
    })
    it('should return false code for using no authorization', () => {
        cy.request({
            method: 'POST',
            url: `${url}/orders`,
            headers: { Authorization: `Bearer blablabla` },
            failOnStatusCode : false,
            body: { bookId: 1, customerName: 'Max Mustermann' }
    }).then((response) => {
        expect(response.status).to.eq(401)
        expect(response.body).to.have.property('error')
    })
    })
    it('should return false code for creating order without bookId', () => {
        cy.request({
            method: 'POST',
            url: `${url}/orders`,
            headers: { Authorization: `Bearer ${token}` },
            failOnStatusCode : false,
            body: { customerName: 'Max Mustermann' }
    }).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body).to.have.property('error')
    })
    })
    it('should return false code for invalid bookId', () => {
        cy.request({
            method: 'POST',
            url: `${url}/orders`,
            headers: { Authorization: `Bearer ${token}` },
            failOnStatusCode : false,
            body: { bookId: 'hallo' , customerName: 'Max Mustermann' }
    }).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body).to.have.property('error')
    })
    })
    })
