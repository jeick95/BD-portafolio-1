import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const conversations = new Map();

function getOrCreateHistory(sessionId) {
  if (!conversations.has(sessionId)) {
    conversations.set(sessionId, []);
  }
  return conversations.get(sessionId);
}

const MODELS = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "mixtral-8x7b-32768"];

const SYSTEM_PROMPT =
  "Eres Jeick AI, el asistente oficial del portafolio de Base de Datos II de Aranda Navarro Jeick. " +
  "Eres profesional, moderno y amigable. Responde preguntas generales y también sobre el portafolio. " +
  "Puedes hablar de: programación, bases de datos, tecnología, y los proyectos del curso. " +
  "Responde en español de forma clara y concisa.";

async function generateWithGroq(message, systemInstruction, history) {
  const errors = [];
  const messages = [
    { role: "system", content: systemInstruction },
    ...history.map((h) => ({
      role: h.role === "model" ? "assistant" : h.role,
      content: h.parts[0].text,
    })),
    { role: "user", content: message },
  ];

  for (const model of MODELS) {
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ model, messages, temperature: 0.7, max_tokens: 1024 }),
      });

      if (res.status === 429) {
        errors.push(`${model}: cuota agotada`);
        continue;
      }

      const data = await res.json();
      if (!res.ok) {
        errors.push(`${model}: ${data.error?.message || res.statusText}`);
        continue;
      }

      return data.choices[0].message.content;
    } catch (err) {
      errors.push(`${model}: ${err.message}`);
    }
  }

  throw new Error("Todos los modelos fallaron:\n" + errors.join("\n"));
}

app.post("/chat", async (req, res) => {
  try {
    const { message, sessionId = "default" } = req.body;
    if (!message) return res.status(400).json({ error: "Mensaje requerido" });

    const history = getOrCreateHistory(sessionId);
    const reply = await generateWithGroq(message, SYSTEM_PROMPT, history);

    history.push({ role: "user", parts: [{ text: message }] });
    history.push({ role: "model", parts: [{ text: reply }] });

    res.json({ reply, sessionId });
  } catch (error) {
    console.error("Error en /chat:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.post("/chat-context", async (req, res) => {
  try {
    const { message, sessionId = "default" } = req.body;
    if (!message) return res.status(400).json({ error: "Mensaje requerido" });

    const history = getOrCreateHistory(sessionId);

    const { data: perfiles, error: errPerfiles } = await supabase
      .from("perfiles")
      .select("*")
      .limit(10);

    if (errPerfiles) console.error("Error Supabase perfiles:", errPerfiles.message);

    const contextPrompt =
      SYSTEM_PROMPT +
      "\n\nAquí tienes información de la base de datos del portafolio:\n" +
      "USUARIOS DEL SISTEMA:\n" +
      JSON.stringify(perfiles || [], null, 2) +
      "\n\nUsa esta información para responder preguntas sobre usuarios, perfiles, roles y datos del sistema.";

    const reply = await generateWithGroq(message, contextPrompt, history);

    history.push({ role: "user", parts: [{ text: message }] });
    history.push({ role: "model", parts: [{ text: reply }] });

    res.json({ reply, sessionId });
  } catch (error) {
    console.error("Error en /chat-context:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.post("/clear", (req, res) => {
  const { sessionId = "default" } = req.body;
  conversations.delete(sessionId);
  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor activo en puerto ${PORT}`);
});
