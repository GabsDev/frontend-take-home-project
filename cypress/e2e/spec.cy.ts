describe('My Canvas Test', () => {
  it('finds the content and make sure be visible"', () => {
    cy.visit('http://localhost:3000')
    cy.get('canvas.border.border-gray-400').should('be.visible');
  })
})