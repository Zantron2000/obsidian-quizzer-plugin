import { HtmlRenderData } from "types";

export default function generateBookSVG(
	className: string,
	text: string,
): HtmlRenderData {
	return {
		tag: "svg",
		class: className,
		text,
		children: [],
	};
}
