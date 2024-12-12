import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";

export type ModelProvider = "openai" | "anthropic";

export function getChatModel(provider: ModelProvider): BaseChatModel {
  switch (provider) {
    case "openai":
      return new ChatOpenAI({
        openAIApiKey: process.env.OPENAI_API_KEY,
        modelName: "gpt-3.5-turbo",
        temperature: 0.6,
      });
    case "anthropic":
      return new ChatAnthropic({
        anthropicApiKey: process.env.ANTHROPIC_API_KEY,
        modelName: "claude-3-sonnet-20240229",
        temperature: 0.6,
      });
    default:
      throw new Error(`Unsupported model provider: ${provider}`);
  }
} 