import { MultipleChoiceData } from "types";

export default class MCManager {
	static MULTIPLE_CHOICE_TYPES = ["multiple-choice", "mc"];
	isValid: boolean;
	errors: string[] = [];
	data: MultipleChoiceData;

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

		if (validationErrors.length > 0) {
			this.isValid = false;
			this.errors = validationErrors;
		} else {
			this.isValid = true;
			this.errors = [];
			this.data = questionData as MultipleChoiceData;
		}
	}

	public render(
		container: HTMLElement,
		progressCallback: (isCorrect: boolean) => void,
	): void {}
}
