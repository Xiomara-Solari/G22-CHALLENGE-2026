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

  it('Acceder a las habitaciones disponibles desde la barra de navegación', () => {
    // Buscamos el botón "Rooms" en la barra de navegación y hacemos click
    cy.contains('a', 'Rooms')
      .should('be.visible')
      .click();
    // Verificamos que el contenedor general del listado sea visible.
    cy.contains('h2', 'Our Rooms').should('be.visible');

  });


  it('Debería completar el formulario de reserva con datos válidos', () => {
  
    cy.abrirHabitacionNumero(1);
    cy.get('.rbc-calendar').should('be.visible');

    cy.seleccionarRangoDeFechasEnElCalendario(10, 12);

     cy.get('button:contains("Reserve Now")').click();

    cy.completarFormularioDeReservaConDatosValidos('Natalia', 'Caporale', 'natalia@ejemplo.com', '011234567891');
    // Click en el botón de reserva para enviar el formulario
    cy.get('button:contains("Reserve Now")').click();

    //verificacion de la reserva
    cy.get('.card-body')
      .should('be.visible')
      .and('contain.text', 'Booking Confirmed') // Verifica que el mensaje de confirmación esté presente 
      .and('contain.text', 'Your booking has been confirmed for the following dates:');
  });
});



