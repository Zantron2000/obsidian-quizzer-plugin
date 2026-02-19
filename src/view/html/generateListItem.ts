import { HtmlRenderData } from "types";

export default function generateListItem(text: string): HtmlRenderData {
	return {
		tag: "li",
		text,
		children: [],
	};
}
