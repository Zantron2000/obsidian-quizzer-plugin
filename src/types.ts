export interface MultipleChoiceData {
	type: string;
	question: string;
	answer: {
		label: string;
		explanation?: string;
	};
	alternatives: {
		label: string;
		explanation?: string;
	}[];
}

export interface TrueFalseData {
	type: string;
	question: string;
	answer: {
		label: boolean;
		explanation?: string;
	};
	incorrectExplanation?: string;
}

export interface ShortAnswerData {
	type: string;
	question: string;
	answer: string;
	acceptableVariations?: string[];
	caseSensitive?: boolean;
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

export interface Quiz {
	title: string;
	description?: string;
	data: [MultipleChoiceData];
}

export interface ErrorMessage {
	questionIndex?: number;
	message: string;
	path: string;
}

export interface QuestionManager {
	reset(): void;
	render(
		container: HTMLElement,
		progressCallback: (isCorrect: boolean) => void,
	): void;
}
