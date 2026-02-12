import { HtmlRenderData, QuestionManager, ShortAnswerData } from "types";
import buildHTML from "view/buildHTML";

export default class SAManager implements QuestionManager {
	static SHORT_ANSWER_TYPES = ["short-answer", "sa"];
	isValid: boolean;
	errors: string[] = [];
	data: ShortAnswerData;
	submitted: boolean;
	input: string | null;

	static isShortAnswerQuestion(question: unknown): boolean {
		const type = (question as { type: string })?.type;

		return SAManager.SHORT_ANSWER_TYPES.includes(type);
	}

	constructor(questionData: unknown) {
		this.submitted = false;
		this.input = null;
		this.isValid = true;
		this.errors = [];
		this.data = questionData as ShortAnswerData;
	}

	private isRightAnswer(label: string): boolean {
		if (this.data.caseSensitive === false) {
			return (
				this.data.answer.toLowerCase() === label.toLowerCase() ||
				this.data.acceptableVariations?.some(
					(variation) =>
						variation.toLowerCase() === label.toLowerCase(),
				) ||
				false
			);
		}

		return (
			label === this.data.answer ||
			this.data.acceptableVariations?.some(
				(variation) => variation === label,
			) ||
			false
		);
	}

	public reset(): void {
		this.submitted = false;
		this.input = null;
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
						text: "Sample question text",
						class: "text-xl mb-6 text-gray-900",
						children: [],
					},
					{
						tag: "div",
						class: "mb-6",
						children: [
							{
								tag: "input",
								class: "clickable-icon cursor-pointer w-full text-base! py-6! px-4! border-2 border-gray-200 rounded-lg focus:border-purple-600 focus:outline-none disabled:bg-gray-50 disabled:cursor-not-allowed text-gray-900",
								attrs: {
									type: "text",
									value: "user input",
									placeholder: "Type your answer here...",
								},
								children: [],
							},
						],
					},
					// Feedback block (example: submitted && incorrect)
					{
						tag: "div",
						class: "rounded-lg p-4 mb-6 bg-amber-50 border-2 border-amber-200 hidden",
						children: [
							{
								tag: "div",
								class: "flex items-start gap-3",
								children: [
									{
										tag: "div",
										class: "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-amber-100",
										children: [
											{
												tag: "span",
												text: "✖",
												class: "w-4 h-4 text-amber-600",
												children: [],
											},
										],
									},
									{
										tag: "div",
										class: "flex-1",
										children: [
											{
												tag: "div",
												text: "Your answer was marked incorrect",
												class: "mb-2 text-amber-900",
												children: [],
											},
											{
												tag: "div",
												class: "text-sm text-gray-700 mb-3",
												children: [
													{
														tag: "div",
														class: "mb-1",
														children: [
															{
																tag: "span",
																text: "Your answer:",
																class: "text-gray-600",
																children: [],
															},
															{
																tag: "span",
																text: " user-submitted-answer",
																class: "font-medium",
																children: [],
															},
														],
													},
													{
														tag: "div",
														children: [
															{
																tag: "span",
																text: "Correct answer:",
																class: "text-gray-600",
																children: [],
															},
															{
																tag: "span",
																text: " expected-correct-answer",
																class: "font-medium",
																children: [],
															},
														],
													},
												],
											},
											{
												tag: "button",
												text: "Actually I was Correct",
												class: "flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm rounded-lg transition-colors",
												clickHandler: () => {
													/* dummy override handler */
												},
												children: [
													{
														tag: "span",
														text: "⟳",
														class: "w-4 h-4",
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
				],
			},
			// Navigation
			{
				tag: "div",
				class: "p-4 border-t border-gray-200",
				children: [
					{
						tag: "button",
						attrs: this.input === null ? { disabled: "true" } : {},
						class: `
							clickable-icon w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors
						`,
						clickHandler: () => {
							if (this.input !== null) {
								if (!this.submitted) {
									this.submitted = true;
									this.render(container, progressCallback);
								} else {
									const isCorrect = this.isRightAnswer(
										this.input,
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
