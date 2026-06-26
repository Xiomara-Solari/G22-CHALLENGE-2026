describe('Test RestfulBooker - Shady Meadows', function() {

  // =========================================================================
  // Configuracion global: se ejecuta antes de cada test.
  // Se cargan los datos de prueba desde el fixture y se navega a la URL base
  // para garantizar que cada test arranque desde un estado limpio y
  // completamente independiente.
  // =========================================================================
  beforeEach(function() {
    cy.fixture('bookingData').as('datos');
    cy.visit('https://automationintesting.online/');
  });

  // =========================================================================
  // 3.1 - Reserva Exitosa como Usuario Invitado
  // =========================================================================
  it('Debería completar una reserva exitosa como usuario invitado', function() {
    // -----------------------------------------------------------------------
    // Paso 1: Verificar que el catalogo de habitaciones se haya cargado
    // correctamente antes de intentar interactuar con el.
    // Se comprueba que el titulo "Our Rooms" sea visible y que exista al
    // menos un boton "Book now" disponible. Esto evita falsos positivos
    // por intentar seleccionar una habitacion que aun no se renderizo.
    // -----------------------------------------------------------------------
    cy.contains('h2', 'Our Rooms').should('be.visible');
    cy.get('#rooms .card-footer .btn').should('have.length.at.least', 1);

    // -----------------------------------------------------------------------
    // Paso 2: Abrir el formulario de reserva de la primera habitacion.
    // El comando personalizado `abrirHabitacionNumero` se encarga de hacer
    // clic en el boton "Book now" de la habitacion indicada y despliega el
    // calendario interactivo de reservas (react-big-calendar).
    // -----------------------------------------------------------------------
    cy.abrirHabitacionNumero(0);

    // -----------------------------------------------------------------------
    // Paso 3: Validar que el calendario interactivo se haya desplegado
    // correctamente. Sin el calendario visible, no es posible seleccionar
    // un rango de fechas, por lo que esta asercion es critica para
    // continuar con el flujo.
    // -----------------------------------------------------------------------
    cy.get('.rbc-calendar').should('be.visible');

    // -----------------------------------------------------------------------
    // Paso 4: Seleccionar un rango de fechas en el calendario.
    // Se utiliza el comando personalizado que recibe los indices de las
    // celdas de fecha (check-in y check-out) y simula la interaccion
    // del usuario sobre el calendario mensual.
    // -----------------------------------------------------------------------
    cy.seleccionarRangoDeFechasEnElCalendario(10, 12);

    // -----------------------------------------------------------------------
    // Paso 5: Abrir el formulario de datos personales haciendo clic en
    // "Reserve Now". Este boton despliega los campos de nombre, apellido,
    // email y telefono para completar la reserva.
    // -----------------------------------------------------------------------
    cy.get('button:contains("Reserve Now")').click();

    // -----------------------------------------------------------------------
    // Paso 6: Completar el formulario con datos validos provenientes
    // EXCLUSIVAMENTE del fixture cargado en el beforeEach.
    // El uso de `this.datos.reservaValida` garantiza que los datos de
    // prueba sean centralizados, reutilizables y faciles de modificar.
    // -----------------------------------------------------------------------
    cy.completarFormularioReserva(
      this.datos.reservaValida.firstname,
      this.datos.reservaValida.lastname,
      this.datos.reservaValida.email,
      this.datos.reservaValida.phone
    );

    // -----------------------------------------------------------------------
    // Paso 7: Confirmar la reserva haciendo clic en "Reserve Now".
    // Este segundo clic en el mismo boton envía el formulario ya completo
    // al servidor para procesar la reserva.
    // -----------------------------------------------------------------------
    cy.get('button:contains("Reserve Now")').click();

    // -----------------------------------------------------------------------
    // Paso 8: Validar que la reserva se haya creado exitosamente.
    // Se verifica que aparezca el cartel de confirmacion con el texto
    // "Booking Confirmed" y el detalle de las fechas seleccionadas.
    // Esta asercion sobre la UI es la unica forma de garantizar que el
    // flujo completo (frontend + backend) funcionó correctamente.
    // -----------------------------------------------------------------------
    cy.get('.card-body')
      .should('be.visible')
      .and('contain.text', 'Booking Confirmed')
      .and('contain.text', 'Your booking has been confirmed for the following dates:');
  });

  // =========================================================================
  // 3.2 - Validaciones del Formulario de Reserva (Camino Negativo)
  // =========================================================================
  it('Validar que el formulario de reserva muestre errores cuando se envía vacío', function() {
    // -----------------------------------------------------------------------
    // Paso 1: Abrir el formulario de reserva de la primera habitacion.
    // -----------------------------------------------------------------------
    cy.abrirHabitacionNumero(0);
    cy.get('.rbc-calendar').should('be.visible');

    // -----------------------------------------------------------------------
    // Paso 2: Seleccionar un rango de fechas en el calendario.
    // Es necesario seleccionar fechas antes de poder abrir el formulario,
    // ya que la validacion del lado del servidor requiere este paso previo.
    // -----------------------------------------------------------------------
    cy.seleccionarRangoDeFechasEnElCalendario(10, 12);

    // -----------------------------------------------------------------------
    // Paso 3: Abrir el formulario de reserva haciendo clic en "Reserve Now".
    // -----------------------------------------------------------------------
    cy.get('button:contains("Reserve Now")').click();

    // -----------------------------------------------------------------------
    // Paso 4: Enviar el formulario VACIO (sin completar ningun campo).
    // -----------------------------------------------------------------------
    cy.get('button:contains("Reserve Now")').click();

    // -----------------------------------------------------------------------
    // Paso 5: Verificar que aparezcan los mensajes de error del servidor.
    // -----------------------------------------------------------------------
    cy.get('.alert-danger').should('contain.text', 'must not be null');
    cy.get('.alert-danger').should('contain.text', 'size must be between');

    // -----------------------------------------------------------------------
    // Paso 6: Verificar que el formulario SIGUE ABIERTO en pantalla.
    // Si la reserva se hubiera creado (lo cual no deberia ocurrir con datos
    // vacios), el formulario desapareceria. 
    // -----------------------------------------------------------------------
    cy.get('.book-room').should('be.visible');
  });

  // =========================================================================
  // 3.3 - Formulario de Contacto (Pie de Pagina)
  // =========================================================================
  it('Debería enviar el formulario de contacto con datos válidos', function() {
    // -----------------------------------------------------------------------
    // Paso 1: Hacer scroll hasta el boton de envio para asegurar que el
    // formulario de contacto (ubicado en el footer de la pagina) sea
    // completamente visible e interactivo.
    // -----------------------------------------------------------------------
    cy.get('#submitContact').scrollIntoView().should('be.visible');

    // -----------------------------------------------------------------------
    // Paso 2: Completar y enviar el formulario de contacto con datos
    // validos provenientes del fixture. 
    // -----------------------------------------------------------------------
    cy.enviarMensajeContacto(this.datos.contactoValido);

    // -----------------------------------------------------------------------
    // Paso 3: Validar que el mensaje se haya enviado correctamente.
    // -----------------------------------------------------------------------
    cy.contains('.contact', 'Thanks for getting in touch')
      .should('be.visible')
      .and('contain.text', this.datos.contactoValido.name);
  });

});
