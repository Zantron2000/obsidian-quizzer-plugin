import { HtmlRenderData, MultipleChoiceData } from "types";
import buildHTML from "view/buildHTML";

export default class MCManager {
	static MULTIPLE_CHOICE_TYPES = ["multiple-choice", "mc"];
	isValid: boolean;
	errors: string[] = [];
	data: MultipleChoiceData;
	submitted: boolean;
	options: { label: string; explanation?: string }[];
	selectedIdx: number | null;

	static isMultipleChoiceQuestion(question: unknown): boolean {
		const type = (question as { type: string })?.type;

		return MCManager.MULTIPLE_CHOICE_TYPES.includes(type);
	}

	private static shuffle<T>(array: T[]): T[] {
		const shuffled = [...array];

		for (let i = shuffled.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
		}

		return shuffled;
	}

	constructor(questionData: unknown) {
		this.submitted = false;
		this.selectedIdx = null;
		this.isValid = true;
		this.errors = [];
		this.data = questionData as MultipleChoiceData;
		this.options = MCManager.shuffle([
			...this.data.alternatives,
			this.data.answer,
		]);
	}

	private renderOption(
		optionIdx: number,
		container: HTMLElement,
		progressCallback: (isCorrect: boolean) => void,
	): HtmlRenderData {
		return {
			tag: "button",
			clickHandler: () => {
				if (!this.submitted) {
					this.selectedIdx = optionIdx;
					this.render(container, progressCallback);
				}
			},
			class: `
				clickable-icon w-full flex justify-start text-center p-4 rounded-lg border-2 transition-all
				${this.getOptionClasses(optionIdx)}
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
							  ${this.getOptionBubbleClasses(optionIdx)}
							`,
							children: [],
						},
						{
							tag: "span",
							class: "text-lg text-gray-900",
							text: this.options[optionIdx]?.label,
							children: [],
						},
					],
				},
			],
		};
	}

	private getOptionClasses(optionIdx: number): string {
		if (this.submitted === false) {
			if (this.selectedIdx === optionIdx) {
				return "border-purple-600 bg-purple-50";
			} else {
				return "border-gray-200 hover:border-gray-300 bg-white";
			}
		} else {
			const isAnswer = this.isRightAnswer(optionIdx);

			if (isAnswer) {
				return "border-green-600 bg-green-50";
			} else if (optionIdx === this.selectedIdx) {
				return "border-red-600 bg-red-50";
			} else {
				return "border-gray-200 bg-white opacity-50";
			}
		}
	}

	private getOptionBubbleClasses(optionIdx: number): string {
		if (this.submitted === false) {
			if (this.selectedIdx === optionIdx) {
				return "border-purple-600 bg-purple-600";
			} else {
				return "border-gray-300 bg-white";
			}
		} else {
			const isAnswer = this.isRightAnswer(optionIdx);

			if (isAnswer) {
				return "border-green-600 bg-green-600";
			} else if (optionIdx === this.selectedIdx) {
				return "border-red-600 bg-red-600";
			} else {
				return "border-gray-300 bg-white";
			}
		}
	}

	private isRightAnswer(optionIdx: number): boolean {
		return this.options[optionIdx] === this.data.answer;
	}

	private generateFeedback(): HtmlRenderData {
		if (this.submitted === false) {
			return {
				tag: "div",
				class: "hidden",
				children: [],
			};
		}

		const explanation = this.options[this.selectedIdx!]?.explanation;
		const isCorrect = this.isRightAnswer(this.selectedIdx!);
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
						class: "space-y-3 mb-6",
						children: this.options.map((_, idx) =>
							this.renderOption(idx, container, progressCallback),
						),
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
							this.selectedIdx === null
								? { disabled: "true" }
								: {},
						class: `
							clickable-icon w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors
						`,
						clickHandler: () => {
							if (this.selectedIdx !== null) {
								if (!this.submitted) {
									this.submitted = true;
									this.render(container, progressCallback);
								} else {
									const isCorrect = this.isRightAnswer(
										this.selectedIdx,
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
