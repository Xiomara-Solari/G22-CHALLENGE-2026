describe('Test RestfulBooker', function() {
  beforeEach(function() {
    cy.fixture('bookingData').as('datos');
    cy.visit('https://automationintesting.online/');
  });

  // Test ADMIN
  it('Navegar al panel de admin y loguearse con éxito', function() {
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
  it('Hay habitaciones disponibles', function() {
    cy.contains('h2', 'Our Rooms').should('be.visible');
    cy.get(':nth-child(1) > .card > .card-footer > .btn')
      .contains('Book now')
      .should('have.length.at.least', 1);
  });

  it('Acceder a las habitaciones disponibles desde la barra de navegación', function() {
    cy.contains('a', 'Rooms')
      .should('be.visible')
      .click();
    cy.contains('h2', 'Our Rooms').should('be.visible');
  });

  it('Debería completar el formulario de reserva con datos válidos', function() {
    cy.abrirHabitacionNumero(1);
    cy.get('.rbc-calendar').should('be.visible');

    cy.seleccionarRangoDeFechasEnElCalendario(10, 12);

    cy.get('button:contains("Reserve Now")').click();

    cy.completarFormularioDeReservaConDatosValidos('Natalia', 'Caporale', 'natalia@ejemplo.com', '011234567891');
    cy.get('button:contains("Reserve Now")').click();

    cy.get('.card-body')
      .should('be.visible')
      .and('contain.text', 'Booking Confirmed')
      .and('contain.text', 'Your booking has been confirmed for the following dates:');
  });

  // Prueba 3.2: Validaciones del formulario de reserva (Camino Negativo)
  it('Validar que el formulario de reserva muestre errores cuando se envía vacío', function() {
    cy.abrirHabitacionNumero(1);
    cy.get('.rbc-calendar').should('be.visible');
    cy.seleccionarRangoDeFechasEnElCalendario(10, 12);
    cy.get('button:contains("Reserve Now")').click();

    cy.get('.book-room').click();

    cy.get('.alert-danger').should('contain.text', 'must not be null');
    cy.get('.alert-danger').should('contain.text', 'size must be between');

    cy.get('.book-room').should('be.visible');
  });
});
