import { HtmlRenderData } from "types";

export default function generateCheckSVG(className: string): HtmlRenderData {
	return {
		tag: "svg",
		class: className,
		attrs: {
			xmlns: "http://www.w3.org/2000/svg",
			width: 24,
			height: 24,
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			"stroke-width": 2,
			"stroke-linecap": "round",
			"stroke-linejoin": "round",
		},
		children: [
			{
				tag: "path",
				attrs: {
					d: "M20 6 9 17l-5-5",
				},
				children: [],
			},
		],
	};
}
