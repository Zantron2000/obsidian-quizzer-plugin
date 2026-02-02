import { htmlRenderData } from "types";

const svgTags = ["svg", "path"];

const buildHTML = (el: HTMLElement, data: htmlRenderData[]) => {
	el.innerHTML = ""; // Clear existing content

	data.forEach((item) => {
		const childEl = el.createEl(item.tag, {
			text: item.text,
			cls: item.class,
			attr: item.attrs,
		});

		if (item.children.length > 0) {
			buildHTML(childEl, item.children);
		}
	});
};

export default buildHTML;
