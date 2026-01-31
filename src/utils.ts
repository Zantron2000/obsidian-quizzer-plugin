import { Pos } from "obsidian";
import { CodeBlock } from "./types";

export const extractCodeBlockContent = (content: string, position: Pos) : CodeBlock => {
    const regex = /```(\w+)?\n([\s\S]*?)\n```/g;
    const code = content.substring(position.start.offset, position.end.offset);
    const match = regex.exec(code);

    return {
        type: match?.[1]?.trim() ?? "",
        content: match?.[2] ?? "",
    };
}