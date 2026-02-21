import { HtmlRenderData, QuestionManager, TrueFalseData } from "types";
import buildHTML from "view/buildHTML";
import generateParagraph from "view/html/generateParagraph";
import generateCheckSVG from "view/svgs/generateCheckSVG";
import generateXSVG from "view/svgs/generateXSVG";

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
							class: "text-lg",
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
				return "selected-option";
			} else {
				return "option";
			}
		} else {
			const isAnswer = this.isRightAnswer(label);

			if (isAnswer) {
				return "correct-option";
			} else if (label === this.selected) {
				return "incorrect-option";
			} else {
				return "ignored-option";
			}
		}
	}

	private getOptionBubbleClasses(label: boolean): string {
		if (this.submitted === false) {
			if (this.selected === label) {
				return "selected-option-bubble";
			} else {
				return "border-modifier bg-secondary";
			}
		} else {
			const isAnswer = this.isRightAnswer(label);

			if (isAnswer) {
				return "correct-option-bubble";
			} else if (label === this.selected) {
				return "incorrect-option-bubble";
			} else {
				return "ignored-option-bubble";
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
			? generateXSVG("w-4 h-4 text-red-600")
			: generateCheckSVG("w-4 h-4 text-green-600");

		return {
			tag: "div",
			class: `
			  rounded-lg px-4 py-2 mb-2
				${isCorrect ? "border-2 border-green-200" : "border-2 border-red-200"}
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
					generateParagraph(this.data.question, "text-xl mb-6"),
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
				class: "p-4 border-t border-modifier",
				children: [
					{
						tag: "button",
						attrs:
							this.selected === null ? { disabled: "true" } : {},
						text: this.submitted ? "Move On" : "Submit Answer",
						class: "clickable-icon progress-button",
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
						children: [],
					},
				],
			},
		]);
	}
}
