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
