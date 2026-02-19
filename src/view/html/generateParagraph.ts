import { HtmlRenderData } from "types";

export default function generateParagraph(
	text: string,
	className: string,
): HtmlRenderData {
	return {
		tag: "p",
		class: className,
		text,
		children: [],
	};
}
