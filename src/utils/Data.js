export const DATA_USUARIOS = [
  { id: '1', usuario: 'Jesús (Admin)', correo: 'admin@haydee.com', contra: '12345', rol: 'administrador' },
  { id: '2', usuario: 'Francisco (Presi)', correo: 'presidente@haydee.com', contra: '12345', rol: 'presidente' },
  { id: '3', usuario: 'Rafa (Contador)', correo: 'contador@haydee.com', contra: '12345', rol: 'contador' },
  { id: '4', usuario: 'Carlos (Apto 4B)', correo: 'propietario@haydee.com', contra: '12345', rol: 'propietario' },
  { id: '5', usuario: 'Visitante', correo: 'invitado@haydee.com', contra: '12345', rol: 'invitado' }
];


export const DATA_MENSUALIDAD = [
  { 
    id: '1', 
    fecha: 'Enero del 2025', 
    total: '150.00 Bs.', 
    restante: '0.00 Bs.',
    desglose: [
      { id: '1', categoria: 'Conserjería', monto: '60.00', porcentaje: 40, color: '#3498db' },
      { id: '2', categoria: 'Servicios', monto: '30.00', porcentaje: 20, color: '#e67e22' },
      { id: '3', categoria: 'Ascensores', monto: '45.00', porcentaje: 30, color: '#9b59b6' },
      { id: '4', categoria: 'Fondo Reserva', monto: '15.00', porcentaje: 10, color: '#2ecc71' }
    ]
  },
  { 
    id: '2', 
    fecha: 'Febrero del 2025', 
    total: '180.00 Bs.', 
    restante: '180.00 Bs.',
    desglose: [
      { id: '1', categoria: 'Pintura Fachada', monto: '90.00', porcentaje: 50, color: '#e74c3c' },
      { id: '2', categoria: 'Conserjería', monto: '54.00', porcentaje: 30, color: '#3498db' },
      { id: '3', categoria: 'Servicios', monto: '36.00', porcentaje: 20, color: '#e67e22' }
    ]
  },
  { id: '3', fecha: 'Marzo del 2025', total: '163.23 Bs. / 0.84 $', restante: '109.09 Bs. / 0.56 $' },
  { id: '4', fecha: 'Abril del 2025', total: '113.10 Bs. / 0.58 $', restante: '92.10 Bs. / 0.47 $' },
  { id: '5', fecha: 'Mayo del 2025', total: '316.45 Bs. / 1.62 $', restante: '308.21 Bs. / 1.58 $' },
  { id: '6', fecha: 'Junio del 2025', total: '3.90 Bs. / 0.02 $', restante: '2.85 Bs. / 0.01 $' },
  { id: '7', fecha: 'Julio del 2025', total: '3.12 Bs. / 0.02 $', restante: '3.12 Bs. / 0.02 $' },
  { id: '8', fecha: 'Agosto del 2025', total: '7.99 Bs. / 0.04 $', restante: '7.99 Bs. / 0.04 $' },
  { id: '9', fecha: 'Julio del 2025', total: '3.12 Bs. / 0.02 $', restante: '3.12 Bs. / 0.02 $' },
  { id: '10', fecha: 'Agosto del 2025', total: '7.99 Bs. / 0.04 $', restante: '7.99 Bs. / 0.04 $' }
];

export const DATA_PAGOS = [
  { id: '1', fecha: '01/11/2025', monto: '33.40 Bs.', mensualidad: 'Octubre 2025', estado: 'Procesado', apartamento: 'Nro: 1-1', banco: 'Banesco', referencia: '00348271' },
  { id: '2', fecha: '05/11/2025', monto: '45.00 Bs.', mensualidad: 'Octubre 2025', estado: 'Procesado', apartamento: 'Nro: 2-3', banco: 'Provincial', referencia: '00192833' },
  { id: '3', fecha: '10/11/2025', monto: '28.75 Bs.', mensualidad: 'Octubre 2025', estado: 'Pendiente', apartamento: 'Nro: 4-2', banco: 'Mercantil', referencia: '00928374' },
  { id: '4', fecha: '15/11/2025', monto: '50.00 Bs.', mensualidad: 'Octubre 2025', estado: 'Procesado', apartamento: 'Nro: 3-4', banco: 'Pago Móvil', referencia: '01029384' },
  { id: '5', fecha: '20/11/2025', monto: '40.25 Bs.', mensualidad: 'Octubre 2025', estado: 'Pendiente', apartamento: 'Nro: 5-1', banco: 'Venezuela', referencia: '01928374' },
  { id: '6', fecha: '25/11/2025', monto: '60.00 Bs.', mensualidad: 'Octubre 2025', estado: 'Procesado', apartamento: 'Nro: 2-2', banco: 'Bancamiga', referencia: '00293847' },
  { id: '7', fecha: '28/11/2025', monto: '35.50 Bs.', mensualidad: 'Octubre 2025', estado: 'Procesado', apartamento: 'Nro: 1-3', banco: 'Banesco', referencia: '01928375' },
  { id: '8', fecha: '30/11/2025', monto: '42.00 Bs.', mensualidad: 'Octubre 2025', estado: 'Pendiente', apartamento: 'Nro: 4-1', banco: 'Provincial', referencia: '00192834' },
  { id: '9', fecha: '02/12/2025', monto: '55.75 Bs.', mensualidad: 'Noviembre 2025', estado: 'Procesado', apartamento: 'Nro: 3-2', banco: 'Pago Móvil', referencia: '00928375' },
  { id: '10', fecha: '05/12/2025', monto: '48.00 Bs.', mensualidad: 'Noviembre 2025', estado: 'Pendiente', apartamento: 'Nro: 5-3', banco: 'Mercantil', referencia: '01928376' }
];

export const DATA_GASTOS = [
  { id: '1', fecha: '01/11/2025', monto: '33.40 Bs.', tipo: 'Fijo', tipo_gasto: 'Gastos Administrativos', proveedor: 'Proveedor 1', descripcion: 'Cualquier cosa' },
  { id: '2', fecha: '05/11/2025', monto: '45.00 Bs.', tipo: 'Variable', tipo_gasto: 'Servicio de gas', proveedor: 'Proveedor 2', descripcion: 'Cualquier cosa' },
  { id: '3', fecha: '10/11/2025', monto: '28.75 Bs.', tipo: 'Fijo', tipo_gasto: 'Servicios Publicos', proveedor: 'Proveedor 3', descripcion: 'Cualquier cosa' },
  { id: '4', fecha: '15/11/2025', monto: '50.00 Bs.', tipo: 'Variable', tipo_gasto: 'Un tipo cualquiera', proveedor: 'Proveedor 4', descripcion: 'Cualquier cosa' },
  { id: '5', fecha: '20/11/2025', monto: '40.25 Bs.', tipo: 'Fijo', tipo_gasto: 'Los Escalona programan', proveedor: 'Proveedor 5', descripcion: 'Cualquier cosa' },
  { id: '6', fecha: '25/11/2025', monto: '60.00 Bs.', tipo: 'Variable', tipo_gasto: 'Servicio de Agua', proveedor: 'Proveedor 6', descripcion: 'Cualquier cosa' },
  { id: '7', fecha: '28/11/2025', monto: '35.50 Bs.', tipo: 'Variable', tipo_gasto: 'Servicio de Agua', proveedor: 'Proveedor 7', descripcion: 'Cualquier cosa' },
  { id: '8', fecha: '30/11/2025', monto: '42.00 Bs.', tipo: 'Variable', tipo_gasto: 'Servicio de Agua', proveedor: 'Proveedor 8', descripcion: 'Cualquier cosa' },
  { id: '9', fecha: '02/12/2025', monto: '55.75 Bs.', tipo: 'Variable', tipo_gasto: 'Servicio de Agua', proveedor: 'Proveedor 9', descripcion: 'Cualquier cosa' },
  { id: '10', fecha: '05/12/2025', monto: '48.00 Bs.', tipo: 'Variable', tipo_gasto: 'Servicio de Agua', proveedor: 'Proveedor 10', descripcion: 'Cualquier cosa' }
];

export const DATA_PUBLICACIONES = [
  {
    id: '1',
    titulo: 'Asamblea Ordinaria',
    descripcion: 'Se convoca a todos los propietarios a la asamblea anual para discutir el presupuesto de este año.',
    tipo: 'evento',
    fecha: '10/03/2026', // Formato estricto DD/MM/YYYY
    imagen: null
  },
  {
    id: '2',
    titulo: 'Corte de Agua Programado',
    descripcion: 'Por limpieza del tanque subterráneo, no habrá agua desde las 8:00 AM hasta las 2:00 PM.',
    tipo: 'aviso',
    fecha: '12/03/2026',
    imagen: null
  },
  {
    id: '3',
    titulo: 'Mantenimiento de Ascensores',
    descripcion: 'El ascensor de la torre A estará en mantenimiento preventivo durante la mañana.',
    tipo: 'evento',
    fecha: '15/03/2026',
    imagen: null
  }
];

export const DATA_BANCOS = [
  'Banesco', 'Provincial', 'Mercantil', 'Bancamiga', 'Venezuela', 'Pago Móvil'
];

export const MESES_PENDIENTES = [
  { id: 1, mes: 'Noviembre 2025', monto: '50.00' },
  { id: 2, mes: 'Diciembre 2025', monto: '50.00' },
  { id: 3, mes: 'Enero 2026', monto: '55.00' }
];

export const DATA_DEUDAS_PENDIENTES = [
  { id: '1', concepto: 'Mensualidad Noviembre 2025', monto: 50.00, vencimiento: '05/11/2025' },
  { id: '2', concepto: 'Mensualidad Diciembre 2025', monto: 50.00, vencimiento: '05/12/2025' },
  { id: '3', concepto: 'Cuota Especial (Reparación Ascensor)', monto: 50.75, vencimiento: '15/12/2025' }
];