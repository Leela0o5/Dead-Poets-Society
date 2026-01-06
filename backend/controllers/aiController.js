import OpenAI from "openai";
import { findById } from "../models/Poem";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateInsight = async (req, res) => {
  try {
    const { poemId } = req.params;

    //  Fetch the poem
    const poem = await findById(poemId);

    if (!poem) {
      return res.status(404).json({ message: "Poem not found" });
    }

    // Check Authorization
    // Only the author should trigger AI insights.
    if (poem.author.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to generate insights for this poem" });
    }

    //  Construct the prompt for ChatGPT
    const prompt = `
      Analyze the following poem. Provide a brief, insightful critique (max 3-4 sentences) touching on its theme, tone, and emotional resonance.
      
      Title: ${poem.title}
      Tags: ${poem.tags.join(", ")}
      Content:
      "${poem.content}"
    `;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
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

    // Extract the response text
    const insightText = completion.choices[0].message.content.trim();

    // 5. Save insight to Database
    poem.aiInsight = insightText;
    await poem.save();

    res.status(200).json({
      message: "Insight generated successfully",
      insight: insightText,
    });
  } catch (error) {
    console.error("OpenAI Error:", error);
    res.status(500).json({ message: "Failed to generate AI insight" });
  }
};

export default {
  generateInsight,
};
