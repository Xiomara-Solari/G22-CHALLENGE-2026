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