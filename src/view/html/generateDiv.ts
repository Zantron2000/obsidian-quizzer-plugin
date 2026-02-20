import { HtmlRenderData } from "types";

export default function generateDiv(
	className: string,
	children: HtmlRenderData[],
): HtmlRenderData {
	return {
		tag: "div",
		class: className,
		children,
	};
}
