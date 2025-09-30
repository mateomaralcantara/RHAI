// pages/api/appointments.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "../../lib/supabaseAdmin";

type Body = {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  destination?: string; // opcional: usa "usa", "canada", "europa", "otros"
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    const { name = "", email = "", phone = "", message = "", destination = "" } = (req.body || {}) as Body;

    // Validación mínima
    if (!name.trim() || !email.trim()) {
      return res.status(400).json({ ok: false, error: "Faltan campos obligatorios (name, email)" });
    }

    const { error, data } = await supabaseAdmin
      .from("appointments")
      .insert([
        {
          name: name.trim(),
          email: email.trim(),
          phone: phone?.trim() || null,
          message: message?.trim() || null,
          destination: destination?.trim() || null,
          // status se mantiene por default = 'new'
        },
      ])
      .select("id")
      .single();

    if (error) {
      console.error("[appointments] insert error:", error);
      return res.status(500).json({ ok: false, error: "No se pudo guardar el registro" });
    }

    return res.status(201).json({ ok: true, id: data?.id });
  } catch (e: any) {
    console.error("[appointments] unexpected:", e);
    return res.status(500).json({ ok: false, error: "Error inesperado" });
  }
}
