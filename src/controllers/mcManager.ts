import { HtmlRenderData, MultipleChoiceData } from "types";
import buildHTML from "view/buildHTML";

export default class MCManager {
	static MULTIPLE_CHOICE_TYPES = ["multiple-choice", "mc"];
	isValid: boolean;
	errors: string[] = [];
	data: MultipleChoiceData;
	submitted: boolean;
	options: string[];
	selectedIdx: number | null;

	static isMultipleChoiceQuestion(question: unknown): boolean {
		const type = (question as { type: string })?.type;

		return MCManager.MULTIPLE_CHOICE_TYPES.includes(type);
	}

	validateData(questionData: unknown): string[] {
		const errors: string[] = [];

		if (typeof questionData !== "object" || questionData === null) {
			errors.push("Question data should be an object.");
		} else {
			const mcData = questionData as MultipleChoiceData;

			if (typeof mcData.question !== "string") {
				errors.push("Question text must be a string.");
			} else if (mcData.question.trim() === "") {
				errors.push("Question text cannot be empty.");
			}

			if (typeof mcData.answer !== "string") {
				errors.push("Answer must be a string.");
			} else if (mcData.answer.trim() === "") {
				errors.push("Answer cannot be empty.");
			}

			if (!Array.isArray(mcData.alternatives)) {
				errors.push("Alternatives must be an array of strings.");
			} else if (mcData.alternatives.length < 2) {
				errors.push("There must be at least two alternatives.");
			} else {
				mcData.alternatives.forEach((alternative, index) => {
					if (typeof alternative !== "string") {
						errors.push(
							`Alternative at index ${index} must be a string.`,
						);
					} else if (alternative.trim() === "") {
						errors.push(
							`Alternative at index ${index} cannot be empty.`,
						);
					}
				});
			}
		}

		return errors;
	}

	constructor(questionData: unknown) {
		const validationErrors = this.validateData(questionData);

		this.submitted = false;
		this.selectedIdx = null;

		if (validationErrors.length > 0) {
			this.isValid = false;
			this.errors = validationErrors;
			this.options = [];
		} else {
			this.isValid = true;
			this.errors = [];
			this.data = questionData as MultipleChoiceData;
			this.options = ["A", "B", "C", "D"];
		}
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
							text: this.options[optionIdx],
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
					{
						tag: "div",
						class: "rounded-lg px-4 py-2 mb-2 bg-green-50 border-2 border-green-200",
						attrs: { hidden: !this.submitted },
						children: [
							{
								tag: "div",
								class: "flex items-start gap-3",
								children: [
									{
										tag: "div",
										class: "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-green-100",
										children: [
											{
												tag: "svg",
												class: "w-4 h-4 text-green-600",
												children: [],
											},
										],
									},
									{
										tag: "div",
										children: [
											{
												tag: "div",
												class: "mb-2 text-green-900",
												text: "Correct!",
												children: [],
											},
											{
												tag: "div",
												class: "text-sm text-gray-700",
												text: "Dummy explanation",
												children: [],
											},
										],
									},
								],
							},
						],
					},
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
