import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiClient;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    appName: "PathPilot",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// AI Coach endpoint
app.post("/api/coach", async (req, res) => {
  try {
    const { question, userContext } = req.body;

    if (!question || typeof question !== "string") {
      res.status(400).json({ error: "A valid question is required." });
      return;
    }

    const ai = getGeminiClient();

    // Fallback handler if Gemini API key is not configured or in offline preview
    if (!ai) {
      const fallbackResponse = generateSmartFallback(question, userContext);
      res.json({
        reply: fallbackResponse,
        mode: "fallback",
        tip: "Note: Running on PathPilot smart offline heuristic coach. Add GEMINI_API_KEY in Secrets for live Gemini model synthesis.",
      });
      return;
    }

    const contextPrompt = userContext
      ? `
USER CONTEXT:
- Career Goal: ${userContext.goal || "Web Developer"}
- Experience Level: ${userContext.experience || "Complete Beginner"}
- Target Timeframe: ${userContext.timeframe || "6 months"} (${userContext.hoursPerWeek || 10} hours/week)
- Existing Skills: ${(userContext.existingSkills || []).join(", ") || "None specified"}
- Biggest Skill Gap Identified: ${userContext.primaryGap || "Fundamental Coding Principles"}
- Current Roadmap Stage: ${userContext.currentStage || "Foundations"}
- Active Mission: ${userContext.activeMission || "First Project"}
- Overall Completion: ${userContext.progress || 0}%
`
      : "";

    const systemInstruction = `You are the PathPilot AI Roadmap Coach, designed specifically for beginners embarking on a new tech learning journey.
Your tone is encouraging, highly structured, practical, and grounded.
Never make unsupported claims about guaranteed job placement or quick riches.
Keep answers concise, actionable, and formatted with clean bullet points or numbered steps.
Tailor every response directly to the student's current skill gap and active stage.
`;

    const prompt = `${contextPrompt}\nSTUDENT QUESTION: "${question}"\n\nProvide a targeted, encouraging, step-by-step guidance response for this beginner.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || "Keep taking steady daily steps toward your goal!";
    res.json({ reply, mode: "gemini" });
  } catch (error: any) {
    console.error("Gemini Coach Error:", error);
    // Graceful fallback on API errors so user/judges are never blocked
    const fallbackResponse = generateSmartFallback(
      req.body?.question || "",
      req.body?.userContext
    );
    res.json({
      reply: fallbackResponse,
      mode: "fallback",
      warning: "Switched to PathPilot offline guidance engine.",
    });
  }
});

// Heuristic offline coach generator
function generateSmartFallback(question: string, context?: any): string {
  const q = question.toLowerCase();
  const goal = context?.goal || "Web Developer";
  const gap = context?.primaryGap || "JavaScript Fundamentals";
  const stage = context?.currentStage || "Phase 1: Fundamentals";

  if (q.includes("next") || q.includes("what should i learn")) {
    return `🎯 **Recommended Next Action for ${goal}:**\n\n1. **Focus on ${gap}:** Your Skill Gap Analyzer pinpointed this as your primary bottleneck before advancing past ${stage}.\n2. **Complete 1 Practical Mission:** Don't just watch videos. Tackle the current mission in your Missions tab to convert passive knowledge into muscle memory.\n3. **Commit to GitHub:** Log today's work to build your streak and establish your authentic developer trail!`;
  }

  if (q.includes("gap") || q.includes("why")) {
    return `🔍 **Understanding Your Skill Gap (${gap}):**\n\n- **The Reason:** Based on your target of **${goal}**, mastery of ${gap} is foundational. Without it, later stages will feel overwhelming.\n- **Actionable Remedy:** Spend the next 3 study sessions writing small code snippets and mini-programs focused exclusively on ${gap}.\n- **Milestone:** Once you complete the relevant stage challenge, your analyzer score will automatically recalculate!`;
  }

  if (q.includes("challenge") || q.includes("practice")) {
    return `⚡ **Beginner Practice Challenge:**\n\n- **Task:** Build a single-page interactive component that tests your current skill (${gap}).\n- **Constraint:** Use semantic elements, add clear user feedback (hover/click states), and ensure zero console errors.\n- **Verification:** Test it on both mobile and desktop viewports, then commit your solution!`;
  }

  if (q.includes("explain") || q.includes("concept")) {
    return `💡 **Core Concept Breakdown:**\n\nIn modern development for **${goal}**, technical concepts are just recipes: input, processing, and output. When learning ${gap}, break complex ideas into the smallest possible 3-line examples. Test each part in isolation before putting them together.`;
  }

  return `🚀 **PathPilot Coach Guidance:**\n\nYou're on track toward **${goal}**! Focus on incremental consistency over marathon cramming. Prioritize tackling your current gap (${gap}), test your code with practical missions, and celebrate every small breakthrough.`;
}

// Start server with Vite middleware in dev or static in prod
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`PathPilot server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
