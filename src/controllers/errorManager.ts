import { Validator } from "jsonschema";
import MCManager from "./mcManager";
import { ErrorMessage, HtmlRenderData } from "types";
import buildHTML from "view/buildHTML";

export default class ErrorManager {
	private static quizzSchema = {
		type: "object",
		required: ["title", "description"],
		properties: {
			title: { type: "string", format: "non-empty-string" },
			description: { type: "string", format: "non-empty-string" },
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
				required: ["label"],
				properties: {
					label: { type: "string", format: "non-empty-string" },
					explanation: { type: "string", format: "non-empty-string" },
				},
			},
			alternatives: {
				type: "array",
				minItems: 1,
				items: {
					type: "object",
					required: ["label"],
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
						if (MCManager.isMultipleChoiceQuestion(question)) {
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

	renderError(errorIdx: number): HtmlRenderData {
		const error = this.errors[errorIdx];

		return {
			tag: "div",
			class: "bg-red-50 border border-red-200 rounded-lg p-4",
			children: [
				{
					tag: "div",
					class: "flex items-start gap-3",
					children: [
						{
							tag: "div",
							class: "w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
							children: [
								{
									tag: "svg",
									class: "w-4 h-4 text-red-600",
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
											tag: "circle",
											attrs: {
												cx: 12,
												cy: 12,
												r: 10,
											},
											children: [],
										},
										{
											tag: "line",
											attrs: {
												x1: 12,
												x2: 12,
												y1: 8,
												y2: 12,
											},
											children: [],
										},
										{
											tag: "line",
											attrs: {
												x1: 12,
												x2: 12.01,
												y1: 16,
												y2: 16,
											},
											children: [],
										},
									],
								},
							],
						},
						{
							tag: "div",
							class: "flex-1",
							children: [
								{
									tag: "div",
									class: "text-sm text-red-800 mb-1",
									text:
										error!.questionIndex == null
											? "General Error"
											: `Question ${error!.questionIndex + 1}`,
									children: [],
								},
								{
									tag: "div",
									class: "text-xs font-mono text-gray-600 mb-2 bg-gray-100 px-2 py-1 rounded inline-block",
									text: error!.path,
									children: [],
								},
								{
									tag: "div",
									class: "text-sm text-gray-900",
									children: [
										{
											tag: "span",
											class: "font-medium text-red-900",
											text: "property: ",
											children: [],
										},
										{
											tag: "span",
											text: error!.message,
											children: [],
										},
									],
								},
							],
						},
					],
				},
			],
		};
	}

	render(container: HTMLElement): void {
		buildHTML(container, [
			// Header
			{
				tag: "div",
				class: "bg-red-50 border-b border-red-200 p-6",
				children: [
					{
						tag: "div",
						class: "flex items-start gap-4",
						children: [
							{
								tag: "div",
								class: "w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0",
								children: [
									{
										tag: "svg",
										class: "w-6 h-6 text-red-600",
										attrs: {
											xmlns: "http://www.w3.org/2000/svg",
											viewBox: "0 0 24 24",
											fill: "none",
											stroke: "currentColor",
											"stroke-width": "2",
											"stroke-linecap": "round",
											"stroke-linejoin": "round",
										},
										children: [
											{
												tag: "path",
												attrs: {
													d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
												},
												children: [],
											},
											{
												tag: "path",
												attrs: {
													d: "M14 2v5a1 1 0 0 0 1 1h5",
												},
												children: [],
											},
											{
												tag: "path",
												attrs: {
													d: "m14.5 12.5-5 5",
												},
												children: [],
											},
											{
												tag: "path",
												attrs: {
													d: "m9.5 12.5 5 5",
												},
												children: [],
											},
										],
									},
								],
							},
							{
								tag: "div",
								children: [
									{
										tag: "p",
										class: "text-2xl mb-1 text-gray-900",
										text: "Invalid Quiz Data",
										children: [],
									},
									{
										tag: "p",
										class: "text-gray-700",
										text: `Your quiz configuration contains ${this.errors.length} validation error(s) that must be fixed before proceeding.`,
										children: [],
									},
								],
							},
						],
					},
				],
			},
			// Error List
			{
				tag: "div",
				class: "p-6",
				children: [
					{
						tag: "div",
						class: "space-y-4",
						children: this.errors.map((_, idx) =>
							this.renderError(idx),
						),
					},
					// Instructions
					{
						tag: "div",
						class: "mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4",
						children: [
							{
								tag: "p",
								class: "text-sm mb-2 text-gray-900",
								text: "How to fix:",
								children: [],
							},
							{
								tag: "ul",
								class: "text-sm text-gray-700 space-y-1",
								children: [
									{
										tag: "li",
										text: "Review your quiz JSON configuration file",
										children: [],
									},
									{
										tag: "li",
										text: "Ensure all required properties are present",
										children: [],
									},
									{
										tag: "li",
										text: "Verify that property types match the expected format",
										children: [],
									},
									{
										tag: "li",
										text: "Check for typos in property names",
										children: [],
									},
								],
							},
						],
					},
				],
			},
		]);
	}
}
