import { addServiceItem, moveSection, toggleSectionVisible, updateSection } from "@/app/admin/(dash)/tenants/actions";
import { SubmitButton } from "@/components/admin/submit-button";
import type { Section } from "@/db/schema";

const TYPE_LABELS: Record<string, string> = {
  hero: "Hero",
  services: "Servicios",
  about: "Nosotros",
  gallery: "Galería",
  contact: "Contacto",
  footer: "Footer",
};

const EDITABLE_TYPES = new Set(Object.keys(TYPE_LABELS));

type Content = Record<string, unknown>;

function str(content: Content, key: string): string {
  const v = content[key];
  return typeof v === "string" ? v : "";
}

const inputClass =
  "w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-sky-500";

function Field({
  label,
  name,
  defaultValue,
  textarea,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue: string;
  textarea?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-gray-500">{label}</span>
      {textarea ? (
        <textarea
          name={name}
          rows={4}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className={inputClass}
        />
      ) : (
        <input
          type="text"
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className={inputClass}
        />
      )}
    </label>
  );
}

function SaveButton() {
  return (
    <SubmitButton className="rounded-full bg-sky-600 px-5 py-2 text-xs font-semibold text-white transition hover:bg-sky-500">
      Guardar cambios
    </SubmitButton>
  );
}

function ServicesItems({ content }: { content: Content }) {
  const items = Array.isArray(content.items)
    ? (content.items as { icon?: string; title?: string; description?: string }[])
    : [];

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="rounded-xl border border-gray-100 bg-gray-50/60 p-3">
          <div className="grid gap-3 sm:grid-cols-[70px_1fr]">
            <Field label="Ícono" name="itemIcon" defaultValue={item.icon ?? ""} />
            <Field label={`Servicio ${i + 1}`} name="itemTitle" defaultValue={item.title ?? ""} />
          </div>
          <div className="mt-3">
            <Field label="Descripción" name="itemDesc" defaultValue={item.description ?? ""} />
          </div>
          <label className="mt-2 inline-flex items-center gap-2 text-xs text-red-600">
            <input type="checkbox" name="itemRemove" value={i} className="accent-red-600" />
            Quitar este servicio al guardar
          </label>
        </div>
      ))}
    </div>
  );
}

function SectionBody({ section }: { section: Section }) {
  const c = section.content;

  switch (section.type) {
    case "hero":
      return (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Etiqueta superior" name="eyebrow" defaultValue={str(c, "eyebrow")} />
            <Field label="Título principal" name="title" defaultValue={str(c, "title")} />
          </div>
          <Field label="Subtítulo" name="subtitle" defaultValue={str(c, "subtitle")} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Texto del botón" name="ctaText" defaultValue={str(c, "ctaText")} />
            <Field label="Link del botón" name="ctaHref" defaultValue={str(c, "ctaHref")} />
          </div>
        </>
      );
    case "services":
      return (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Título" name="title" defaultValue={str(c, "title")} />
            <Field label="Subtítulo" name="subtitle" defaultValue={str(c, "subtitle")} />
          </div>
          <ServicesItems content={c} />
        </>
      );
    case "about":
      return (
        <>
          <Field label="Título" name="title" defaultValue={str(c, "title")} />
          <Field label="Texto" name="body" defaultValue={str(c, "body")} textarea />
        </>
      );
    case "gallery":
      return (
        <>
          <Field label="Título" name="title" defaultValue={str(c, "title")} />
          <Field
            label="URLs de imágenes (una por línea)"
            name="images"
            defaultValue={Array.isArray(c.images) ? (c.images as string[]).join("\n") : ""}
            textarea
            placeholder="https://ejemplo.com/foto1.jpg"
          />
        </>
      );
    case "contact":
      return (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Título" name="title" defaultValue={str(c, "title")} />
            <Field label="Subtítulo" name="subtitle" defaultValue={str(c, "subtitle")} />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Email de contacto" name="email" defaultValue={str(c, "email")} />
            <Field label="Teléfono / WhatsApp" name="phone" defaultValue={str(c, "phone")} />
            <Field label="Dirección" name="address" defaultValue={str(c, "address")} />
          </div>
        </>
      );
    case "footer":
      return <Field label="Texto del pie" name="text" defaultValue={str(c, "text")} />;
    default:
      return (
        <p className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800">
          Este tipo de sección no tiene editor disponible todavía.
        </p>
      );
  }
}

export function SectionEditor({
  section,
  tenantId,
}: {
  section: Section;
  tenantId: string;
}) {
  const label = TYPE_LABELS[section.type] ?? section.type;
  const isServices = section.type === "services";
  const hasEditorForm = EDITABLE_TYPES.has(section.type);

  return (
    <section id={`sec-${section.id}`} className="scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-6">
      {/* Encabezado + controles fuera del formulario principal */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 font-semibold text-gray-900">
          {label}
          {!section.visible && (
            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-medium text-gray-500">
              oculta
            </span>
          )}
        </h3>
        <div className="flex items-center gap-2">
          <form action={moveSection}>
            <input type="hidden" name="sectionId" value={section.id} />
            <input type="hidden" name="tenantId" value={tenantId} />
            <input type="hidden" name="dir" value="up" />
            <SubmitButton
              title="Subir"
              className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs text-gray-600 transition hover:bg-gray-50"
            >
              ↑
            </SubmitButton>
          </form>
          <form action={moveSection}>
            <input type="hidden" name="sectionId" value={section.id} />
            <input type="hidden" name="tenantId" value={tenantId} />
            <input type="hidden" name="dir" value="down" />
            <SubmitButton
              title="Bajar"
              className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs text-gray-600 transition hover:bg-gray-50"
            >
              ↓
            </SubmitButton>
          </form>
          <form action={toggleSectionVisible}>
            <input type="hidden" name="sectionId" value={section.id} />
            <input type="hidden" name="tenantId" value={tenantId} />
            <SubmitButton className="rounded-full border border-gray-200 px-3.5 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50">
              {section.visible ? "Ocultar" : "Mostrar"}
            </SubmitButton>
          </form>
        </div>
      </div>

      {hasEditorForm ? (
        <form action={updateSection} className="mt-5 space-y-4">
          <input type="hidden" name="sectionId" value={section.id} />
          <input type="hidden" name="tenantId" value={tenantId} />
          <input type="hidden" name="type" value={section.type} />

          <SectionBody section={section} />

          <div className="flex items-center justify-between pt-1">
            <SaveButton />
            {isServices && (
              <span className="text-[11px] leading-tight text-gray-400">
                Para quitar un servicio marcá el checkbox y guardá.
                <br />
                “Agregar” añade una fila vacía al final.
              </span>
            )}
          </div>
        </form>
      ) : null}

      {isServices && (
        <form action={addServiceItem} className="mt-4 border-t border-dashed border-gray-200 pt-4">
          <input type="hidden" name="sectionId" value={section.id} />
          <input type="hidden" name="tenantId" value={tenantId} />
          <SubmitButton className="rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-xs font-semibold text-sky-700 transition hover:bg-sky-100">
            ＋ Agregar servicio
          </SubmitButton>
        </form>
      )}
    </section>
  );
}
