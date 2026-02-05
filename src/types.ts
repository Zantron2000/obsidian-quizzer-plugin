export interface MultipleChoiceData {
	type: string;
	question: string;
	answer: string;
	alternatives: string[];
}

export interface HtmlRenderData {
	tag: keyof HTMLElementTagNameMap | keyof SVGElementTagNameMap;
	text?: string;
	class?: string;
	children: HtmlRenderData[];
	id?: string;
	clickHandler?: () => void;
	attrs?: {
		[key: string]: string | number | boolean | null;
	};
}
