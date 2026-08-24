export type ModuleManifest = {
  id: string;
  name: string;
  description: string;
  icon: string;
};

export const MODULE_CATALOG: ModuleManifest[] = [
  {
    id: "contact",
    name: "Formularios / Contacto",
    description: "Formulario de contacto con bandeja de mensajes para el cliente.",
    icon: "✉️",
  },
  {
    id: "blog",
    name: "Blog / Noticias",
    description: "Publicación de artículos y novedades con categorías.",
    icon: "📝",
  },
  {
    id: "catalog",
    name: "Catálogo / E-commerce",
    description: "Productos, carrito y pagos con MercadoPago.",
    icon: "🛒",
  },
  {
    id: "bookings",
    name: "Citas / Reservas",
    description: "Agenda de turnos con confirmación automática.",
    icon: "📅",
  },
  {
    id: "restaurant",
    name: "Restaurante",
    description: "Menú digital y reservas de mesa integradas.",
    icon: "🍽️",
  },
  {
    id: "loyalty",
    name: "Fidelización",
    description: "Socios, puntos, canjes y tarjetas QR.",
    icon: "⭐",
  },
];
