// @ts-nocheck
import { useState } from "react";

const DESTS = [
  { id: "usa",    label: "Estados Unidos", emoji: "🇺🇸" },
  { id: "canada", label: "Canadá",         emoji: "🇨🇦" },
  { id: "europa", label: "Europa",         emoji: "🇪🇺" },
  { id: "otros",  label: "Otros países",   emoji: "🌎"  },
];

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    destination: "", // <- requerido
  });
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setOk(null);
    setError(null);

    try {
      const resp = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok || !data.ok) throw new Error(data.error || "No se pudo guardar el registro");

      setOk(true);
      setForm({ name: "", email: "", phone: "", message: "", destination: "" });
    } catch (err) {
      setOk(false);
      setError(err?.message || "Ups, algo salió mal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white shadow rounded-2xl p-6 space-y-5">
      <div>
        <label className="block text-sm font-medium mb-1">Nombre*</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Juan Pérez"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email*</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full border rounded-lg px-3 py-2"
          placeholder="correo@dominio.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Teléfono</label>
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2"
          placeholder="+1 809..."
        />
      </div>

      {/* DESTINO (requerido) */}
      <div>
        <label className="block text-sm font-medium mb-2">Destino*</label>
        <div className="grid grid-cols-2 gap-3">
          {DESTS.map((d) => (
            <label
              key={d.id}
              className={`cursor-pointer border rounded-xl px-4 py-3 flex items-center gap-3
                ${form.destination === d.id ? "ring-2 ring-blue-500" : "hover:bg-gray-50"}`}
            >
              <input
                type="radio"
                name="destination"
                value={d.id}
                checked={form.destination === d.id}
                onChange={handleChange}
                className="sr-only"
                required
              />
              <span className="text-2xl">{d.emoji}</span>
              <span className="font-medium">{d.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Mensaje</label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2"
          rows={4}
          placeholder="Cuéntame qué necesitas…"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl px-4 py-3 font-semibold bg-black text-white disabled:opacity-60"
      >
        {loading ? "Enviando..." : "Enviar"}
      </button>

      {ok === true && <p className="text-green-700 text-sm">¡Listo! Te contactaremos pronto. ✅</p>}
      {ok === false && <p className="text-red-700 text-sm">Error: {error}</p>}
    </form>
  );
}
