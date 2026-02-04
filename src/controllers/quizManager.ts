import { HtmlRenderData } from "types";
import MCManager from "./mcManager";
import buildHTML from "view/buildHTML";

export class QuizManager {
	questionManagers: MCManager[] = [];
	errors: string[] = [];
	questionIndex: number = 0;
	showStartMenu: boolean = true;
	htmlContainer: HtmlRenderData = {
		tag: "div",
		class: "bg-white rounded-lg shadow-lg p-8 border border-gray-200",
		children: [],
	};

	constructor(quizData: unknown) {
		this.questionManagers = [];
		this.errors = [];

		this.prepareQuestionManagers(quizData);
	}

	prepareQuestionManagers(quizData: unknown): void {
		if (!Array.isArray(quizData)) {
			this.errors.push("Quiz data should be an array of questions.");
		} else {
			(quizData as unknown[]).forEach((question) => {
				if (MCManager.isMultipleChoiceQuestion(question)) {
					const mcManager = new MCManager(question);
					this.questionManagers.push(mcManager);
				}
			});
		}
	}

	#buildStartMenu(): HtmlRenderData[] {
		return [
			// Header
			{
				tag: "div",
				class: "text-center mb-8",
				children: [
					{
						tag: "div",
						class: "flex justify-center mb-4",
						children: [
							{
								tag: "div",
								class: "w-16 h-16 bg-accent-light rounded-full flex items-center justify-center",
								children: [
									{
										tag: "svg",
										class: "w-8 h-8 text-accent",
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
												attrs: { d: "M12 7v14" },
												children: [],
											},
											{
												tag: "path",
												attrs: {
													d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
												},
												children: [],
											},
										],
									},
								],
							},
						],
					},
					{
						tag: "p",
						class: "text-3xl mb-2 text-gray-900",
						text: "Multiple Choice Quiz",
						children: [],
					},
					{
						tag: "p",
						class: "text-gray-600",
						text: "Test your knowledge with interactive questions",
						children: [],
					},
				],
			},
			// Stats
			{
				tag: "div",
				class: "grid grid-cols-3 gap-4 mb-8",
				children: [
					{
						tag: "div",
						class: "bg-gray-50 rounded-lg p-4 text-center",
						children: [
							{
								tag: "div",
								class: "text-2xl mb-1 text-gray-900",
								text: this.questionManagers.length.toString(),
								children: [],
							},
							{
								tag: "div",
								class: "text-sm text-gray-600",
								text: "Questions",
								children: [],
							},
						],
					},
					{
						tag: "div",
						class: "bg-gray-50 rounded-lg p-4 text-center",
						children: [
							{
								tag: "div",
								class: "text-2xl mb-1 text-gray-900",
								text: Math.ceil(
									this.questionManagers.length / 2,
								).toString(),
								children: [],
							},
							{
								tag: "div",
								class: "text-sm text-gray-600",
								text: "Minutes",
								children: [],
							},
						],
					},
					{
						tag: "div",
						class: "bg-gray-50 rounded-lg p-4 text-center",
						children: [
							{
								tag: "div",
								class: "flex items-center justify-center gap-1 mb-1",
								children: [
									{
										tag: "svg",
										class: "w-5 h-5 text-yellow-500",
										attrs: {
											xmlns: "http://www.w3.org/2000/svg",
											width: "24",
											height: "24",
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
													d: "M10 14.66v1.626a2 2 0 0 1-.976 1.696A5 5 0 0 0 7 21.978",
												},
												children: [],
											},
											{
												tag: "path",
												attrs: {
													d: "M14 14.66v1.626a2 2 0 0 0 .976 1.696A5 5 0 0 1 17 21.978",
												},
												children: [],
											},
											{
												tag: "path",
												attrs: {
													d: "M18 9h1.5a1 1 0 0 0 0-5H18",
												},
												children: [],
											},
											{
												tag: "path",
												attrs: { d: "M4 22h16" },
												children: [],
											},
											{
												tag: "path",
												attrs: {
													d: "M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z",
												},
												children: [],
											},
											{
												tag: "path",
												attrs: {
													d: "M6 9H4.5a1 1 0 0 1 0-5H6",
												},
												children: [],
											},
										],
									},
									{
										tag: "div",
										class: "text-2xl text-gray-900",
										text: "N/A",
										children: [],
									},
								],
							},
							{
								tag: "div",
								class: "text-sm text-gray-600",
								text: "Best Score",
								children: [],
							},
						],
					},
				],
			},
			// Instructions
			{
				tag: "div",
				class: "bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8",
				children: [
					{
						tag: "p",
						class: "text-sm mb-2 text-gray-900",
						text: "Instructions:",
						children: [],
					},
					{
						tag: "ul",
						class: "text-sm text-gray-700 space-y-1",
						children: [
							{
								tag: "li",
								text: "Select the best answer for each question",
								children: [],
							},
							{
								tag: "li",
								text: "You can navigate between questions freely",
								children: [],
							},
							{
								tag: "li",
								text: "Submit your answers when you're ready",
								children: [],
							},
						],
					},
				],
			},
			// Start Button
			{
				tag: "button",
				class: "cursor-pointer w-full bg-accent hover:bg-accent-dark text-white hover:text-white py-4 rounded-lg flex items-center justify-center gap-2 clickable-icon transition-colors",
				clickHandler: () => console.log(this),
				children: [
					{
						tag: "svg",
						class: "w-4 h-4",
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
									d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",
								},
								children: [],
							},
						],
					},
					{
						tag: "span",
						text: "Start Quiz",
						children: [],
					},
				],
			},
		];
	}

	render(el: HTMLElement): void {
		const container = el.createEl(
			this.htmlContainer.tag as keyof HTMLElementTagNameMap,
			{
				cls: this.htmlContainer.class,
			},
		);

		if (this.errors.length > 0) {
			container.createEl("div", { text: "Errors in quiz data:" });
			this.errors.forEach((error) => {
				container.createEl("div", { text: `- ${error}` });
			});
		} else if (this.showStartMenu) {
			buildHTML(container, this.#buildStartMenu());
		}
	}
}
