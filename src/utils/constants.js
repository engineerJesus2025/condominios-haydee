export const USUARIOS = [
  { id: '1', usuario: '', correo: '', contra: '', },
  { id: '2', fecha: '', total: '', restante: '' },
  { id: '3', fecha: '', total: '', restante: '' },
]

export const LISTA_MENU = [
  {
    name: 'Inicio',
    icon: 'business',
    screen: 'Inicio',
    permission: true
  },
  {
    name: 'Pagos',
    icon: 'cash',
    screen: 'Pagos',
    permission: true
  },
  {
    name: 'Gastos',
    icon: 'cart',
    screen: 'Gastos',
    permission: true
  },
  {
    name: 'Mensualidad',
    icon: 'calendar-number',
    screen: 'Mensualidad',
    permission: true
  },
  {
    name: 'Cartelera Virtual',
    icon: 'tv',
    screen: 'CarteleraVirtual',
    permission: true
  }
]

export const DATA = [
  { id: '1', fecha: 'Enero del 2025', total: '0.19 Bs. / 0.00 $', restante: '0.14 Bs. / 0.00 $'},
  { id: '2', fecha: 'Febrero del 2025', total: '1.98 Bs. / 0.01 $', restante: '1.03 Bs. / 0.01 $' },
  { id: '3', fecha: 'Marzo del 2025', total: '163.23 Bs. / 0.84 $', restante: '109.09 Bs. / 0.56 $' },
  { id: '4', fecha: 'Abril del 2025', total: '113.10 Bs. / 0.58 $', restante: '92.10 Bs. / 0.47 $' },
  { id: '5', fecha: 'Mayo del 2025', total: '316.45 Bs. / 1.62 $', restante: '308.21 Bs. / 1.58 $' },
  { id: '6', fecha: 'Junio del 2025', total: '3.90 Bs. / 0.02 $', restante: '2.85 Bs. / 0.01 $' },
  { id: '7', fecha: 'Julio del 2025', total: '3.12 Bs. / 0.02 $', restante: '3.12 Bs. / 0.02 $' },
  { id: '8', fecha: 'Agosto del 2025', total: '7.99 Bs. / 0.04 $', restante: '7.99 Bs. / 0.04 $' },
  { id: '9', fecha: 'Julio del 2025', total: '3.12 Bs. / 0.02 $', restante: '3.12 Bs. / 0.02 $' },
  { id: '10', fecha: 'Agosto del 2025', total: '7.99 Bs. / 0.04 $', restante: '7.99 Bs. / 0.04 $' }
]

export const DATA_PAGOS = [
  { id: '1', fecha: '01/11/2025', monto: '33.40 Bs.', mensualidad: 'Octubre 2025', estado: 'Procesado', apartamento: 'Nro: 1-1' },
  { id: '2', fecha: '05/11/2025', monto: '45.00 Bs.', mensualidad: 'Octubre 2025', estado: 'Procesado', apartamento: 'Nro: 2-3' },
  { id: '3', fecha: '10/11/2025', monto: '28.75 Bs.', mensualidad: 'Octubre 2025', estado: 'Pendiente', apartamento: 'Nro: 4-2' },
  { id: '4', fecha: '15/11/2025', monto: '50.00 Bs.', mensualidad: 'Octubre 2025', estado: 'Procesado', apartamento: 'Nro: 3-4' },
  { id: '5', fecha: '20/11/2025', monto: '40.25 Bs.', mensualidad: 'Octubre 2025', estado: 'Pendiente', apartamento: 'Nro: 5-1' },
  { id: '6', fecha: '25/11/2025', monto: '60.00 Bs.', mensualidad: 'Octubre 2025', estado: 'Procesado', apartamento: 'Nro: 2-2' },
  { id: '7', fecha: '28/11/2025', monto: '35.50 Bs.', mensualidad: 'Octubre 2025', estado: 'Procesado', apartamento: 'Nro: 1-3' },
  { id: '8', fecha: '30/11/2025', monto: '42.00 Bs.', mensualidad: 'Octubre 2025', estado: 'Pendiente', apartamento: 'Nro: 4-1' },
  { id: '9', fecha: '02/12/2025', monto: '55.75 Bs.', mensualidad: 'Noviembre 2025', estado: 'Procesado', apartamento: 'Nro: 3-2' },
  { id: '10', fecha: '05/12/2025', monto: '48.00 Bs.', mensualidad: 'Noviembre 2025', estado: 'Pendiente', apartamento: 'Nro: 5-3' }
]

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
]

