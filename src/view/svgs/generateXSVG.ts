import { HtmlRenderData } from "types";

export default function generateXSVG(className: string): HtmlRenderData {
	return {
		tag: "svg",
		class: className,
		attrs: {
			xmlns: "http://www.w3.org/2000/svg",
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
					d: "M18 6 6 18",
				},
				children: [],
			},
			{
				tag: "path",
				attrs: {
					d: "m6 6 12 12",
				},
				children: [],
			},
		],
	};
}
