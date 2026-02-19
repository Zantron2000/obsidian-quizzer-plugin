import { HtmlRenderData, MultipleChoiceData, QuestionManager } from "types";
import buildHTML from "view/buildHTML";
import generateParagraph from "view/html/generateParagraph";
import generateCheckSVG from "view/svgs/generateCheckSVG";
import generateXSVG from "view/svgs/generateXSVG";

export default class MCManager implements QuestionManager {
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
							class: "text-lg",
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
				return "border-accent";
			} else {
				return "border-modifier hover:border-modifier-hover bg-secondary-alt";
			}
		} else {
			const isAnswer = this.isRightAnswer(optionIdx);

			if (isAnswer) {
				return "border-green-600";
			} else if (optionIdx === this.selectedIdx) {
				return "border-red-600";
			} else {
				return "border-modifier opacity-50";
			}
		}
	}

	private getOptionBubbleClasses(optionIdx: number): string {
		if (this.submitted === false) {
			if (this.selectedIdx === optionIdx) {
				return "border-accent bg-accent";
			} else {
				return "border-modifier bg-secondary";
			}
		} else {
			const isAnswer = this.isRightAnswer(optionIdx);

			if (isAnswer) {
				return "border-green-600 bg-green-600";
			} else if (optionIdx === this.selectedIdx) {
				return "border-red-600 bg-red-600";
			} else {
				return "border-modifier";
			}
		}
	}

	private isRightAnswer(optionIdx: number): boolean {
		return this.options[optionIdx]?.label === this.data.answer.label;
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
			? generateXSVG("w-4 h-4 text-red-600")
			: generateCheckSVG("w-4 h-4 text-green-600");

		return {
			tag: "div",
			class: `
			  rounded-lg px-4 py-2 mb-2 border-2
				${isCorrect ? "border-green-200" : "border-red-200"}
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
								generateParagraph(
									isCorrect ? "Correct!" : "Incorrect",
									`mb-2 ${isCorrect ? "text-green-600" : "text-red-600"}`,
								),
								generateParagraph(
									explanation ?? "",
									"text-sm text-muted",
								),
							],
						},
					],
				},
			],
		};
	}

	public reset(): void {
		this.selectedIdx = null;
		this.submitted = false;
		this.options = MCManager.shuffle(this.options);
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
					generateParagraph(this.data.question, "text-xl mb-6"),
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
				class: "p-4 border-t border-modifier",
				children: [
					{
						tag: "button",
						attrs:
							this.selectedIdx === null
								? { disabled: "true" }
								: {},
						class: `
							clickable-icon w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-accent hover:bg-accent-dark text-on-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors
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
