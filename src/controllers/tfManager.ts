import { HtmlRenderData, QuestionManager, TrueFalseData } from "types";
import buildHTML from "view/buildHTML";

export default class TFManager implements QuestionManager {
	static TRUE_FALSE_TYPES = ["true-false", "tf"];
	isValid: boolean;
	errors: string[] = [];
	data: TrueFalseData;
	submitted: boolean;
	selected: boolean | null;

	static isTrueFalseQuestion(question: unknown): boolean {
		const type = (question as { type: string })?.type;

		return TFManager.TRUE_FALSE_TYPES.includes(type);
	}

	constructor(questionData: unknown) {
		this.submitted = false;
		this.selected = null;
		this.isValid = true;
		this.errors = [];
		this.data = questionData as TrueFalseData;
	}

	private renderOption(
		label: boolean,
		container: HTMLElement,
		progressCallback: (isCorrect: boolean) => void,
	): HtmlRenderData {
		return {
			tag: "button",
			clickHandler: () => {
				if (!this.submitted) {
					this.selected = label;
					this.render(container, progressCallback);
				}
			},
			class: `
				clickable-icon w-full flex justify-start text-center p-4 rounded-lg border-2 transition-all
				${this.getOptionClasses(label)}
			`,
			children: [
				{
					tag: "div",
					class: "flex items-center gap-3",
					children: [
						{
							tag: "div",
							class: `
							  w-5 h-5 rounded-full border-2 flex items-center justify-center 
							  ${this.getOptionBubbleClasses(label)}
							`,
							children: [],
						},
						{
							tag: "span",
							class: "text-lg text-gray-900",
							text: label ? "True" : "False",
							children: [],
						},
					],
				},
			],
		};
	}

	private getOptionClasses(label: boolean): string {
		if (this.submitted === false) {
			if (this.selected === label) {
				return "border-purple-600 bg-purple-50";
			} else {
				return "border-gray-200 hover:border-gray-300 bg-white";
			}
		} else {
			const isAnswer = this.isRightAnswer(label);

			if (isAnswer) {
				return "border-green-600 bg-green-50";
			} else if (label === this.selected) {
				return "border-red-600 bg-red-50";
			} else {
				return "border-gray-200 bg-white opacity-50";
			}
		}
	}

	private getOptionBubbleClasses(label: boolean): string {
		if (this.submitted === false) {
			if (this.selected === label) {
				return "border-purple-600 bg-purple-600";
			} else {
				return "border-gray-300 bg-white";
			}
		} else {
			const isAnswer = this.isRightAnswer(label);

			if (isAnswer) {
				return "border-green-600 bg-green-600";
			} else if (label === this.selected) {
				return "border-red-600 bg-red-600";
			} else {
				return "border-gray-300 bg-white";
			}
		}
	}

	private isRightAnswer(label: boolean): boolean {
		return label === this.data.answer.label;
	}

	private generateFeedback(): HtmlRenderData {
		if (this.submitted === false) {
			return {
				tag: "div",
				class: "hidden",
				children: [],
			};
		}

		const isCorrect = this.isRightAnswer(this.selected!);
		const explanation = isCorrect
			? this.data.answer.explanation
			: this.data.incorrectExplanation;
		const svg: HtmlRenderData = !isCorrect
			? {
					tag: "svg",
					class: "w-4 h-4 text-red-600",
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
				}
			: {
					tag: "svg",
					class: "w-4 h-4 text-green-600",
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

		return {
			tag: "div",
			class: `
			  rounded-lg px-4 py-2 mb-2
				${isCorrect ? "bg-green-50 border-2 border-green-200" : "bg-red-50 border-2 border-red-200"}
				${explanation ? "block" : "hidden"}
			`,
			children: [
				{
					tag: "div",
					class: "flex items-start gap-3",
					children: [
						{
							tag: "div",
							class: `
								w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0
								${isCorrect ? "bg-green-100" : "bg-red-100"}
							`,
							children: [svg],
						},
						{
							tag: "div",
							children: [
								{
									tag: "div",
									class: `mb-2 ${isCorrect ? "text-green-900" : "text-red-900"}`,
									text: isCorrect ? "Correct!" : "Incorrect",
									children: [],
								},
								{
									tag: "div",
									class: "text-sm text-gray-700",
									text: explanation,
									children: [],
								},
							],
						},
					],
				},
			],
		};
	}

	public reset(): void {
		this.submitted = false;
		this.selected = null;
	}

	public render(
		container: HTMLElement,
		progressCallback: (isCorrect: boolean) => void,
	): void {
		container.empty();

		buildHTML(container, [
			// Question
			{
				tag: "div",
				class: "p-8",
				children: [
					{
						tag: "p",
						class: "text-xl mb-6 text-gray-900",
						text: this.data.question,
						children: [],
					},
					// Options
					{
						tag: "div",
						class: "flex gap-4 mb-6",
						children: [
							this.renderOption(
								true,
								container,
								progressCallback,
							),
							this.renderOption(
								false,
								container,
								progressCallback,
							),
						],
					},
					// Feedback after submission
					this.generateFeedback(),
				],
			},
			// Navigation
			{
				tag: "div",
				class: "p-4 border-t border-gray-200",
				children: [
					{
						tag: "button",
						attrs:
							this.selected === null ? { disabled: "true" } : {},
						class: `
							clickable-icon w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors
						`,
						clickHandler: () => {
							if (this.selected !== null) {
								if (!this.submitted) {
									this.submitted = true;
									this.render(container, progressCallback);
								} else {
									const isCorrect = this.isRightAnswer(
										this.selected,
									);

									progressCallback(isCorrect);
								}
							}
						},
						children: [
							{
								tag: "svg",
								class: "w-4 h-4",
								children: [],
							},
							{
								tag: "span",
								text: this.submitted
									? "Move On"
									: "Submit Answer",
								children: [],
							},
						],
					},
				],
			},
		]);
	}
}
