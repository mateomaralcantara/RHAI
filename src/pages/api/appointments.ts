import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "../../lib/supabaseAdmin";

type Body = {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  destination?: "usa" | "canada" | "europa" | "otros";
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    const { name, email, phone, message, destination } = req.body as Body;

    if (!name || !email) {
      return res.status(400).json({ ok: false, error: "Faltan campos obligatorios (name, email)" });
    }
    if (!destination) {
      return res.status(400).json({ ok: false, error: "Falta destination" });
    }

    const row = {
      name,
      email,
      phone: phone || null,
      message: message || null,
      destination, // <- guardamos destino
    };

    const { error, data } = await supabaseAdmin
      .from("appointments")
      .insert([row])
      .select("id")
      .single();

    if (error) {
      console.error("[appointments] insert error:", error);
      return res.status(500).json({ ok: false, error: "No se pudo guardar el registro" });
    }

    return res.status(201).json({ ok: true, id: data?.id });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ ok: false, error: "Error inesperado" });
  }
}
