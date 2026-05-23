export const MOCK_EMPRESAS = [
  {
    id: '1',
    nombre: 'Textiles Andina SA',
    cuit: '20-12345678-9',
    condicion: { label: 'Responsable Inscripto', pill: 'pill-green' },
    actividad: 'Fabricación de indumentaria',
    pais: '🇦🇷 AR',
  },
  {
    id: '2',
    nombre: 'Lanas del Sur SRL',
    cuit: '30-98765432-1',
    condicion: { label: 'Monotributo', pill: 'pill-blue' },
    actividad: 'Comercio mayorista de hilados',
    pais: '🇦🇷 AR',
  },
  {
    id: '3',
    nombre: 'Tejidos Colón',
    cuit: '33-11223344-5',
    condicion: { label: 'Responsable Inscripto', pill: 'pill-green' },
    actividad: 'Producción textil',
    pais: '🇦🇷 AR',
  },
  {
    id: '4',
    nombre: 'Global Yarns Ltd.',
    cuit: 'GB-123456789',
    condicion: { label: 'Exento', pill: 'pill-gray' },
    actividad: 'Importación de materias primas',
    pais: '🇬🇧 GB',
  },
  {
    id: '5',
    nombre: 'Modas Bariloche',
    cuit: '27-44556677-3',
    condicion: { label: 'Monotributo', pill: 'pill-blue' },
    actividad: 'Venta minorista de prendas',
    pais: '🇦🇷 AR',
  },
]

export const MOCK_INDIVIDUOS = [
  {
    id: '1',
    nombre: 'Laura',
    apellido: 'Gómez',
    empresa: 'Textiles Andina SA',
    tipo: { label: 'Proveedora', pill: 'pill-blue' },
    correo: 'lgomez@textiles.com',
    telefono: '+54 11 4321-0000',
  },
  {
    id: '2',
    nombre: 'Carlos',
    apellido: 'Ibarra',
    empresa: 'Lanas del Sur SRL',
    tipo: { label: 'Cliente', pill: 'pill-green' },
    correo: 'c.ibarra@lanassur.com',
    telefono: '+54 351 555-1234',
  },
  {
    id: '3',
    nombre: 'Marta',
    apellido: 'Pereira',
    empresa: '—',
    tipo: { label: 'Operaria', pill: 'pill-orange' },
    correo: 'mpereira@knitsys.ar',
    telefono: '+54 11 2233-4455',
  },
  {
    id: '4',
    nombre: 'Jorge',
    apellido: 'Villanueva',
    empresa: 'Global Yarns Ltd.',
    tipo: { label: 'Proveedora', pill: 'pill-blue' },
    correo: 'j.villanueva@globalyarns.co.uk',
    telefono: '+44 20 7946-0958',
  },
  {
    id: '5',
    nombre: 'Ana',
    apellido: 'Rondón',
    empresa: 'Modas Bariloche',
    tipo: { label: 'Cliente', pill: 'pill-green' },
    correo: 'ardon@modasbari.com',
    telefono: '+54 294 445-6789',
  },
]

export const MOCK_HILADOS = [
  { id: '1', nombre: 'Merino 4/16', tipo: 'Lana merina', color: '🟤 Tostado', stock: 48, estado: { label: 'OK', pill: 'pill-green' } },
  { id: '2', nombre: 'Acrílico 2/30', tipo: '100% Acrílico', color: '⚫ Negro', stock: 120, estado: { label: 'OK', pill: 'pill-green' } },
  { id: '3', nombre: 'Shetland Mix', tipo: 'Lana / Acrílico 50/50', color: '⬜ Crudo', stock: 9, estado: { label: 'Bajo stock', pill: 'pill-red' } },
  { id: '4', nombre: 'Algodón Peinado', tipo: '100% Algodón', color: '🔵 Azul marino', stock: 75, estado: { label: 'OK', pill: 'pill-green' } },
  { id: '5', nombre: 'Cashmerino', tipo: 'Cachemira / Merino', color: '🟣 Burdeos', stock: 3, estado: { label: 'Bajo stock', pill: 'pill-red' } },
  { id: '6', nombre: 'Viscosa Brillante', tipo: '100% Viscosa', color: '🔴 Rojo', stock: 32, estado: { label: 'OK', pill: 'pill-green' } },
]

export const MOCK_STOCK = [
  { id: '1', codigo: 'BUZ-001', nombre: 'Buzo cuello redondo', talle: 'M', color: 'Negro', cantidad: 45, estado: { label: 'Disponible', pill: 'pill-green' } },
  { id: '2', codigo: 'BUZ-001', nombre: 'Buzo cuello redondo', talle: 'L', color: 'Negro', cantidad: 30, estado: { label: 'Disponible', pill: 'pill-green' } },
  { id: '3', codigo: 'CAR-005', nombre: 'Cardigan botones', talle: 'S', color: 'Crudo', cantidad: 8, estado: { label: 'Bajo stock', pill: 'pill-orange' } },
  { id: '4', codigo: 'CAR-005', nombre: 'Cardigan botones', talle: 'M', color: 'Burdeos', cantidad: 22, estado: { label: 'Disponible', pill: 'pill-green' } },
  { id: '5', codigo: 'VES-012', nombre: 'Vestido manga larga', talle: 'S', color: 'Azul marino', cantidad: 0, estado: { label: 'Sin stock', pill: 'pill-red' } },
  { id: '6', codigo: 'VES-012', nombre: 'Vestido manga larga', talle: 'M', color: 'Tostado', cantidad: 15, estado: { label: 'Disponible', pill: 'pill-green' } },
  { id: '7', codigo: 'PUL-003', nombre: 'Pullover escote en V', talle: 'XL', color: 'Negro', cantidad: 5, estado: { label: 'Bajo stock', pill: 'pill-orange' } },
]

export const MOCK_PLAN = [
  { id: '1', orden: '#0024', producto: 'Buzo cuello redondo — 60u M/L', estado: { label: 'En proceso', pill: 'pill-orange' }, inicio: '12/05/2025', fin: '26/05/2025', responsable: 'Marta P.' },
  { id: '2', orden: '#0023', producto: 'Cardigan botones — 30u S/M', estado: { label: 'En proceso', pill: 'pill-orange' }, inicio: '05/05/2025', fin: '20/05/2025', responsable: 'M. Andrade' },
  { id: '3', orden: '#0022', producto: 'Pullover escote en V — 25u XL', estado: { label: 'Planificada', pill: 'pill-blue' }, inicio: '20/05/2025', fin: '03/06/2025', responsable: 'Marta P.' },
  { id: '4', orden: '#0021', producto: 'Vestido manga larga — 40u S', estado: { label: 'Finalizada', pill: 'pill-green' }, inicio: '01/04/2025', fin: '28/04/2025', responsable: 'L. Gómez' },
  { id: '5', orden: '#0020', producto: 'Buzo cuello redondo — 80u XS/S', estado: { label: 'Finalizada', pill: 'pill-green' }, inicio: '10/03/2025', fin: '01/04/2025', responsable: 'M. Andrade' },
  { id: '6', orden: '#0019', producto: 'Chaleco sin mangas — 20u M', estado: { label: 'Demorada', pill: 'pill-red' }, inicio: '15/04/2025', fin: '10/05/2025', responsable: 'L. Gómez' },
]

export const MOCK_DESARROLLOS = [
  { id: '1', nombre: 'Buzo oversize v2', descripcion: 'Nueva moldería para talle único', estado: { label: 'En desarrollo', pill: 'pill-orange' }, responsable: 'M. Andrade', fecha: 'Abr 2025' },
  { id: '2', nombre: 'Cardigan tejido abierto', descripcion: 'Punto calado, hilo Cashmerino', estado: { label: 'Muestra', pill: 'pill-blue' }, responsable: 'L. Gómez', fecha: 'Mar 2025' },
  { id: '3', nombre: 'Chaleco reversible', descripcion: 'Dos caras: liso / trenzado', estado: { label: 'Aprobado', pill: 'pill-green' }, responsable: 'M. Andrade', fecha: 'Feb 2025' },
  { id: '4', nombre: 'Vestido punto fantasía', descripcion: 'Punto jacquard, colección invierno', estado: { label: 'Pausado', pill: 'pill-gray' }, responsable: 'Marta P.', fecha: 'Ene 2025' },
  { id: '5', nombre: 'Pullover infantil', descripcion: 'Línea niños 2-8 años', estado: { label: 'En desarrollo', pill: 'pill-orange' }, responsable: 'L. Gómez', fecha: 'May 2025' },
]
