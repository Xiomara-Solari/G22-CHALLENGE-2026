describe('Test RestfulBooker', () => {
  beforeEach(() => {
    // Visitamos la página principal con la opción para ignorar códigos de estado erróneos
    cy.visit('https://automationintesting.online/', { failOnStatusCode: false });
  });

// Test ADMIN
  it('Navegar al panel de admin y loguearse con éxito', () => {
    cy.contains('a', 'Admin panel')
      .scrollIntoView()
      .should('be.visible')
      .click();
    cy.url().should('include', '/admin');
    cy.get('#username').type('admin');
    cy.get('#password').type('password');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/admin/rooms'); 
  });

// Test Rooms Catalog
  it('Hay habitaciones disponibles', () => {
    // Verifica que el contenedor general del listado sea visible.
    cy.contains('h2', 'Our Rooms').should('be.visible');
// revisar!! el cy.get me parece horrible, pero no encontré otra forma de acceder a los elementos de las habitaciones. Si alguien tiene una mejor idea mejor

    cy.get(':nth-child(1) > .card > .card-footer > .btn')
      .contains('Book now')
      .should('have.length.at.least', 1); // Verifica que haya como mínimo 1 habitación cargada
});
});
