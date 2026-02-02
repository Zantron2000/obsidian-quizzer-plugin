export interface MultipleChoiceData {
	type: string;
	question: string;
	answer: string;
	choices: string[];
}

export interface htmlRenderData {
	tag: keyof HTMLElementTagNameMap;
	text?: string;
	class?: string;
	children: htmlRenderData[];
	attrs?: {
		[key: string]: string | number | boolean | null;
	};
}
