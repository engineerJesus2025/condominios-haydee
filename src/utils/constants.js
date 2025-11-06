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
    name: 'Caja Chica',
    icon: 'wallet',
    screen: 'CajaChica',
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
  },
  {
    name: 'Apartamentos',
    icon: 'business',
    screen: 'Apartamentos',
    permission: true
  },
  {
    name: 'Solicitud Gasto',
    icon: 'document-text',
    screen: 'SolicitudGasto',
    permission: true
  },
  {
    name: 'Presupuesto Mensual',
    icon: 'calculator',
    screen: 'Presupuesto',
    permission: true
  },
  {
    name: 'Año Fiscal',
    icon: 'calendar',
    screen: 'AnioFiscal',
    permission: true
  },
  {
    name: 'Reportes',
    icon: 'list',
    isExpandable: true,
    permission: true,
    children: [
      { name: 'Reportes PDF', icon: 'document', screen: 'ReportesPDF', permission: true },
      { name: 'Reportes Estadísticos', icon: 'stats-chart', screen: 'ReportesEstadisticos', permission: true }
    ]
  },
  {
    name: 'Configuración',
    icon: 'settings',
    isExpandable: true,
    permission: true,
    children: [
      { name: 'Proveedores', icon: 'car', screen: 'Proveedores', permission: true },
      { name: 'Bancos', icon: 'card', screen: 'Bancos', permission: true },
      { name: 'Tipo de Gasto', icon: 'grid', screen: 'TipoGasto', permission: true }
    ]
  },
  {
    name: 'Usuarios',
    icon: 'people',
    screen: 'Usuarios',
    permission: true
  },
  {
    name: 'Seguridad',
    icon: 'shield-checkmark',
    isExpandable: true,
    permission: true,
    children: [
      { name: 'Roles', icon: 'person-circle', screen: 'Roles', permission: true },
      { name: 'Bitácora', icon: 'archive', screen: 'Bitacora', permission: true }
    ]
  },
  {
    name: 'Notificaciones',
    icon: 'notifications',
    screen: 'Notificaciones',
    permission: true
  },
  {
    name: 'Mantenimiento',
    icon: 'build',
    screen: 'Mantenimiento',
    permission: true
  }
]

export const NOTIF_DATA = [
  { id: '1', title: 'Mensualidad de Apartamentos', text: 'Ya se asignaron las mensualidades de este mes' },
  { id: '2', title: 'Mensualidad de Apartamentos', text: 'Ya se asignaron las mensualidades de este mes' },
  { id: '3', title: 'Mensualidad de Apartamentos', text: 'Ya se asignaron las mensualidades de este mes' },
  { id: '4', title: 'Mensualidad de Apartamentos', text: 'Ya se asignaron las mensualidades de este mes' }
]

export const DATA = [
  { id: '1', mes: 'Enero del 2025', totalBs: '0.19 Bs.', totalUsd: '0.00 $', restanteBs: '0.14 Bs.', restanteUsd: '0.00 $' },
  { id: '2', mes: 'Febrero del 2025', totalBs: '1.98 Bs.', totalUsd: '0.01 $', restanteBs: '1.03 Bs.', restanteUsd: '0.01 $' },
  { id: '3', mes: 'Marzo del 2025', totalBs: '163.23 Bs.', totalUsd: '0.84 $', restanteBs: '109.09 Bs.', restanteUsd: '0.56 $' },
  { id: '4', mes: 'Abril del 2025', totalBs: '113.10 Bs.', totalUsd: '0.58 $', restanteBs: '92.10 Bs.', restanteUsd: '0.47 $' },
  { id: '5', mes: 'Mayo del 2025', totalBs: '316.45 Bs.', totalUsd: '1.62 $', restanteBs: '308.21 Bs.', restanteUsd: '1.58 $' },
  { id: '6', mes: 'Junio del 2025', totalBs: '3.90 Bs.', totalUsd: '0.02 $', restanteBs: '2.85 Bs.', restanteUsd: '0.01 $' },
  { id: '7', mes: 'Julio del 2025', totalBs: '3.12 Bs.', totalUsd: '0.02 $', restanteBs: '3.12 Bs.', restanteUsd: '0.02 $' },
  { id: '8', mes: 'Agosto del 2025', totalBs: '7.99 Bs.', totalUsd: '0.04 $', restanteBs: '7.99 Bs.', restanteUsd: '0.04 $' },
  { id: '9', mes: 'Julio del 2025', totalBs: '3.12 Bs.', totalUsd: '0.02 $', restanteBs: '3.12 Bs.', restanteUsd: '0.02 $' },
  { id: '10', mes: 'Agosto del 2025', totalBs: '7.99 Bs.', totalUsd: '0.04 $', restanteBs: '7.99 Bs.', restanteUsd: '0.04 $' }
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
