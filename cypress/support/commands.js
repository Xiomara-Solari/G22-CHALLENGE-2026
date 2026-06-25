Cypress.on('uncaught:exception', (err, runnable) => {
  // Ignorar el error 418
  if (err.message.includes('Minified React error #418')) {
    return false;
  }
  // Si no es el error 418, dejamos que rompa.
  return true;
});

/**
 * Comando personalizado: seleccionarFechasCalendario
 * Simula el arrastre (drag & drop) sobre el calendario para seleccionar un rango de fechas.
 *
 * @param {number} indexInicio - Indice del elemento .rbc-day-bg donde se inicia la seleccion.
 * @param {number} indexFin    - Indice del elemento .rbc-day-bg donde finaliza la seleccion.
 *
 * Uso: cy.seleccionarFechasCalendario(5, 10)
 */
Cypress.Commands.add('seleccionarFechasCalendario', (indexInicio, indexFin) => {
  // Verificar que los indices sean numeros validos
  expect(indexInicio, 'indexInicio debe ser un numero').to.be.a('number');
  expect(indexFin, 'indexFin debe ser un numero').to.be.a('number');

  // Obtener todos los elementos que representan los dias del calendario
  cy.get('.rbc-day-bg').then(($dias) => {
    // Verificar que los indices esten dentro del rango
    expect($dias.length, 'Existen suficientes dias en el calendario').to.be.gte(Math.max(indexInicio, indexFin) + 1);

    // Elemento de inicio: disparar mousedown con boton izquierdo (which: 1)
    cy.wrap($dias.eq(indexInicio))
      .trigger('mousedown', { which: 1, eventConstructor: 'MouseEvent' })
      .then(() => {
        // Elemento de fin: mover el mouse hasta la posicion final
        cy.wrap($dias.eq(indexFin))
          .trigger('mousemove', { eventConstructor: 'MouseEvent' })
          .trigger('mouseup', { force: true });
      });
  });
});

/**
 * Comando personalizado: completarFormularioReserva
 * Rellena los campos del formulario de reserva usando el atributo name como selector.
 * Cada campo se completa solo si el parametro no esta vacio, evitando errores en campos opcionales.
 *
 * @param {string} firstname - Nombre (input[name="firstname"]).
 * @param {string} lastname  - Apellido (input[name="lastname"]).
 * @param {string} email     - Correo electronico (input[name="email"]).
 * @param {string} phone     - Telefono (input[name="phone"]).
 *
 * Uso: cy.completarFormularioReserva('Natalia', 'Caporale', 'natalia@ejemplo.com', '01112345678')
 */
Cypress.Commands.add('completarFormularioReserva', (firstname, lastname, email, phone) => {
  // Completar firstname si no esta vacio
  if (firstname !== '') {
    cy.get('input[name="firstname"]').type(firstname);
  }
  // Completar lastname si no esta vacio
  if (lastname !== '') {
    cy.get('input[name="lastname"]').type(lastname);
  }
  // Completar email si no esta vacio
  if (email !== '') {
    cy.get('input[name="email"]').type(email);
  }
  // Completar phone si no esta vacio
  if (phone !== '') {
    cy.get('input[name="phone"]').type(phone);
  }
});

/**
 * Comando personalizado: enviarMensajeContacto
 * Rellena y envia el formulario de contacto del footer usando atributos data-testid.
 *
 * @param {Object} contacto - Objeto con las propiedades:
 *   { name, email, phone, subject, message }
 *
 * Uso:
 *   cy.enviarMensajeContacto({
 *     name: 'Grupo 22 Tester',
 *     email: 'grupo22@testing.com',
 *     phone: '123456789012',
 *     subject: 'Consulta de Reserva',
 *     message: 'Mensaje de prueba...'
 *   });
 */
Cypress.Commands.add('enviarMensajeContacto', (contacto) => {
  // Completar cada campo del formulario usando el atributo data-testid
  cy.get('[data-testid="ContactName"]').type(contacto.name);
  cy.get('[data-testid="ContactEmail"]').type(contacto.email);
  cy.get('[data-testid="ContactPhone"]').type(contacto.phone);
  cy.get('[data-testid="ContactSubject"]').type(contacto.subject);
  cy.get('[data-testid="ContactDescription"]').type(contacto.message);

  // Hacer clic en el boton de envio identificado por su ID
  cy.get('#submitContact').click();
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
