import { HtmlRenderData } from "types";

const buildHTML = (el: HTMLElement | SVGElement, data: HtmlRenderData[]) => {
	const svgTags = new Set<keyof SVGElementTagNameMap>([
		"svg",
		"path",
		"circle",
		"rect",
		"ellipse",
		"line",
		"polyline",
		"polygon",
		"g",
		"defs",
		"use",
		"symbol",
	]);

	data.forEach((item) => {
		let childEl: HTMLElement | SVGElement;

		if (!svgTags.has(item.tag as keyof SVGElementTagNameMap)) {
			childEl = el.createEl(item.tag as keyof HTMLElementTagNameMap, {
				text: item.text,
				cls: item.class,
				attr: item.attrs,
			});
		} else {
			childEl = el.createSvg(item.tag as keyof SVGElementTagNameMap, {
				attr: item.attrs,
			});

			childEl.setAttribute("class", item.class || "");
		}

		if (item.id) {
			childEl.id = item.id;
		}

		if (item.clickHandler) {
			childEl.addEventListener("click", item.clickHandler);
		}
		if (item.inputHandler !== null && childEl instanceof HTMLInputElement) {
			childEl.addEventListener("input", (e) => {
				const target = e.target as HTMLInputElement;
				item.inputHandler!(target.value);
			});
		}

		if (item.children.length > 0) {
			buildHTML(childEl, item.children);
		}
	});
};

export default buildHTML;
