import OpenAI from "openai";
import Poem from "../models/Poem.js";

let openai;

function getOpenAI() {
  if (!openai) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is missing. Check your .env file.");
    }

    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
}

export const generateInsight = async (req, res) => {
  try {
    const { poemId } = req.params;

    // Fetch the poem
    const poem = await Poem.findById(poemId);
    if (!poem) {
      return res.status(404).json({ message: "Poem not found" });
    }

    // Authorization check
    if (poem.author.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized to generate insights for this poem",
      });
    }

    // Prompt
    const prompt = `
Analyze the following poem. Provide a brief, insightful critique (3–4 sentences)
touching on theme, tone, and emotional resonance.

Title: ${poem.title}
Tags: ${poem.tags.join(", ")}
Content:
"${poem.content}"
`;

    // Call OpenAI
    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful literary assistant and poetry critic.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 150,
    });

    const insightText = completion.choices[0].message.content.trim();

    poem.aiInsight = insightText;
    await poem.save();

    res.status(200).json({
      message: "Insight generated successfully",
      insight: insightText,
    });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ message: error.message });
  }
};
