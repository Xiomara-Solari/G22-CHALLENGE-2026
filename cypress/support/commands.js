Cypress.on('uncaught:exception', (err, runnable) => {
  // Ignorar el error 418
  if (err.message.includes('Minified React error #418')) {
    return false;
  }
  // Si no es el error 418, dejamos que rompa.
  return true;
});

Cypress.Commands.add('validarCalendarioHabitacion', (index) => {
  // Agarra la habitacion que le corresponde, segun el index que se le pase como parámetro.
  cy.get(`#rooms > .container > .row > :nth-child(${index})`)
    .find('.card > .card-footer > .btn')
    .should('be.visible')
    .click();
  // Valida que el calendario de reservas sea visible.
  cy.get('.rbc-calendar')
    .should('be.visible');

});
Cypress.Commands.add('obtenerListaHabitaciones', () => {
  // Le pegamos a la API interna de Shady Meadows
  return cy.request('https://automationintesting.online/room/')
    .then((response) => {
      // La API devuelve un objeto que contiene un array llamado 'rooms'
      const listaHabitaciones = response.body.rooms;

      // Devolvemos la lista completa para que la use el test
      return listaHabitaciones;
    });
});

Cypress.Commands.add('abrirHabitacionNumero', (index) => {
  cy.get('#rooms > .container > .row > div')
    .eq(0)
    .find('.card > .card-footer > .btn')
    .click();

});

Cypress.Commands.add('seleccionarRangoDeFechasEnElCalendario', (diaInicio, diaFin) => {
  cy.get('.rbc-month-view .rbc-date-cell:not(.rbc-off-range)')
    .should('have.length.at.least', 15)
    .then(($days) => {
      // Agarramos dos días de la segunda semana
      const elementoInicio = $days.eq(10);
      const elementoFin = $days.eq(12);

      // Intentamos hacer click directo en el elemento interactivo (usualmente el botón interno)
      // Si no tiene botón, el click con force: true en la celda debería registrarse
      cy.wrap(elementoInicio).find('button, a').then(($btn) => {
        if ($btn.length > 0) {
          cy.wrap($btn).click({ force: true });
        } else {
          cy.wrap(elementoInicio).click({ force: true });
        }
      });
      cy.wrap(elementoFin).find('button, a').then(($btn) => {
        if ($btn.length > 0) {
          cy.wrap($btn).click({ force: true });
        } else {
          cy.wrap(elementoFin).click({ force: true });
        }
      });
    });
});


Cypress.Commands.add('completarFormularioDeReservaConDatosValidos', (firstName, lastName, email, phone) => {
  cy.get('input[name="firstname"]').should('be.visible').type(firstName);
  cy.get('input[name="lastname"]').type(lastName);
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="phone"]').type(phone);
});
