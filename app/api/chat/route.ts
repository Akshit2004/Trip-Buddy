import { NextResponse } from "next/server";
import ollama from "ollama";

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        const systemPrompt = {
            role: "system",
            content: `You are Orbit, a helpful and enthusiastic AI travel assistant. 
      Your goal is to help users plan their trips by asking genuine, thoughtful questions to understand their preferences, budget, and interests.
      
      Guidelines:
      - Be natural, conversational, and friendly.
      - Don't just list places; try to understand the "vibe" the user is looking for.
      - Ask one or two clarifying questions at a time to narrow down options (e.g., "Are you looking for a relaxing beach vacation or an adventurous mountain trek?", "What kind of budget do you have in mind?").
      - Consider constraints like time, budget, and travel companions.
      - Keep your responses concise but helpful.
      - Use emojis sparingly but effectively to add personality. 🪐
      
      Current Context: The user is asking for help planning a trip.`,
        };

        const chatMessages = [systemPrompt, ...messages];

        const response = await ollama.chat({
            model: "gemma2:2b",
            messages: chatMessages,
            stream: true,
        });

        const stream = new ReadableStream({
            async start(controller) {
                for await (const part of response) {
                    controller.enqueue(new TextEncoder().encode(part.message.content));
                }
                controller.close();
            },
        });

        return new NextResponse(stream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
            },
        });
    } catch (error) {
        console.error("Error in chat API:", error);
        return NextResponse.json(
            { error: "Failed to process chat request" },
            { status: 500 }
        );
    }
}
