import { Validator } from "jsonschema";
import MCManager from "./mcManager";
import { ErrorMessage } from "types";

export default class ErrorManager {
	private static quizzSchema = {
		type: "object",
		required: ["title", "description"],
		properties: {
			title: { type: "string", pattern: "\\S" },
			description: { type: "string", pattern: "\\S" },
			data: {
				type: "array",
				minItems: 1,
				items: {
					type: "object",
					required: ["type"],
					properties: {
						type: {
							type: "string",
							enum: ["multiple-choice", "mc"],
						},
					},
				},
			},
		},
	};

	private static multipleChoiceSchema = {
		type: "object",
		required: ["type", "question", "answer", "alternatives"],
		properties: {
			type: {
				type: "string",
				enum: ["multiple-choice", "mc"],
			},
			question: { type: "string", format: "non-empty-string" },
			answer: {
				type: "object",
				required: ["label", "explanation"],
				properties: {
					label: { type: "string", format: "non-empty-string" },
					explanation: { type: "string" },
				},
			},
			alternatives: {
				type: "array",
				minItems: 1,
				items: {
					type: "object",
					required: ["label", "explanation"],
					properties: {
						label: { type: "string", format: "non-empty-string" },
						explanation: { type: "string" },
					},
				},
			},
		},
	};

	private static validateQuizData(
		quizData: unknown,
		validator: Validator,
	): ErrorMessage[] {
		const badQuestionIndexes = new Set<number>();
		const errors: ErrorMessage[] = [];
		const quizValidationResult = validator.validate(
			quizData,
			ErrorManager.quizzSchema,
		);

		if (!quizValidationResult.valid) {
			quizValidationResult.errors.forEach((error) => {
				const { path, message, property } = error;

				if (path[0] === "data" && typeof path[1] === "number") {
					badQuestionIndexes.add(path[1]);
					errors.push({
						questionIndex: path[1],
						path: property,
						message: message,
					});
				} else {
					errors.push({
						path: property,
						message: message,
					});
				}
			});
		}

		if (Array.isArray((quizData as { data?: unknown[] })?.data)) {
			(quizData as { data: unknown[] }).data.forEach(
				(question, index) => {
					if (!badQuestionIndexes.has(index)) {
						const typedQuestion = question as { type: string };

						if (
							MCManager.isMultipleChoiceQuestion(
								typedQuestion?.type,
							)
						) {
							const mcValidationResult = validator.validate(
								question,
								ErrorManager.multipleChoiceSchema,
							);

							if (!mcValidationResult.valid) {
								mcValidationResult.errors.forEach((error) => {
									const { message, property } = error;
									errors.push({
										questionIndex: index,
										path: property,
										message: message,
									});
								});
							}
						}
					}
				},
			);
		}

		return errors;
	}

	public errors: ErrorMessage[] = [];
	public isValid: boolean;

	constructor(questionData: unknown) {
		Validator.prototype.customFormats["non-empty-string"] = (
			input: string,
		) => {
			if (typeof input === "string") {
				return input.trim().length > 0;
			}

			return true;
		};

		const validator = new Validator();
		this.errors = ErrorManager.validateQuizData(questionData, validator);
		if (this.errors.length > 0) {
			this.isValid = false;
		} else {
			this.isValid = true;
		}
	}

	render(container: HTMLElement): void {}
}
