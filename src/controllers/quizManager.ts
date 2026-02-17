import { HtmlRenderData, QuestionManager, Quiz } from "types";
import MCManager from "./mcManager";
import buildHTML from "view/buildHTML";
import ErrorManager from "./errorManager";
import ResultsManager from "./resultsManager";
import TFManager from "./tfManager";
import SAManager from "./saManager";

export class QuizManager {
	questionManagers: QuestionManager[] = [];
	questionIndex: number = 0;
	showStartMenu: boolean = true;
	container: HTMLElement;
	htmlContainer: HtmlRenderData = {
		tag: "div",
		class: "bg-secondary rounded-lg shadow-lg p-8",
		children: [],
	};
	errorManager: ErrorManager;
	resultsManager: ResultsManager;
	correctQuestions: boolean[] = [];

	private static shuffle<T>(array: T[]): T[] {
		const shuffled = [...array];

		for (let i = shuffled.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
		}

		return shuffled;
	}

	constructor(quizData: unknown, el: HTMLElement) {
		this.questionManagers = [];
		this.errorManager = new ErrorManager(quizData);
		this.resultsManager = new ResultsManager();

		this.container = el.createEl(
			this.htmlContainer.tag as keyof HTMLElementTagNameMap,
			{
				cls: this.htmlContainer.class,
			},
		);

		if (this.errorManager.isValid) {
			const typedQuizData = quizData as Quiz;

			typedQuizData.data.forEach((questionData) => {
				if (MCManager.isMultipleChoiceQuestion(questionData)) {
					const mcManager = new MCManager(questionData);
					this.questionManagers.push(mcManager);
				} else if (TFManager.isTrueFalseQuestion(questionData)) {
					const tfManager = new TFManager(questionData);
					this.questionManagers.push(tfManager);
				} else if (SAManager.isShortAnswerQuestion(questionData)) {
					const saManager = new SAManager(questionData);
					this.questionManagers.push(saManager);
				}
			});
		}

		this.questionManagers = QuizManager.shuffle(this.questionManagers);
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
						class: "text-3xl mb-2",
						text: "Multiple Choice Quiz",
						children: [],
					},
					{
						tag: "p",
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
						class: "bg-secondary-alt rounded-lg p-4 text-center",
						children: [
							{
								tag: "div",
								class: "text-2xl mb-1",
								text: this.questionManagers.length.toString(),
								children: [],
							},
							{
								tag: "div",
								class: "text-sm text-muted",
								text: "Questions",
								children: [],
							},
						],
					},
					{
						tag: "div",
						class: "bg-secondary-alt rounded-lg p-4 text-center",
						children: [
							{
								tag: "div",
								class: "text-2xl mb-1",
								text: Math.ceil(
									this.questionManagers.length / 2,
								).toString(),
								children: [],
							},
							{
								tag: "div",
								class: "text-sm text-muted",
								text: "Minutes",
								children: [],
							},
						],
					},
					{
						tag: "div",
						class: "bg-secondary-alt rounded-lg p-4 text-center",
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
										class: "text-2xl",
										text: "N/A",
										children: [],
									},
								],
							},
							{
								tag: "div",
								class: "text-sm text-muted",
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
				class: "bg-secondary-alt border border-blue-200 rounded-lg p-4 mb-8",
				children: [
					{
						tag: "p",
						class: "text-sm mb-2",
						text: "Instructions:",
						children: [],
					},
					{
						tag: "ul",
						class: "text-sm text-muted space-y-1",
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
				class: "cursor-pointer w-full bg-accent hover:bg-accent-dark text-on-accent py-4 rounded-lg flex items-center justify-center gap-2 clickable-icon transition-colors",
				clickHandler: () => {
					this.showStartMenu = false;
					this.render();
				},
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

	progress(isCorrect: boolean): void {
		this.questionIndex += 1;
		this.correctQuestions.push(isCorrect);

		this.render();
	}

	reset(): void {
		this.questionIndex = 0;
		this.correctQuestions = [];
		this.showStartMenu = true;
		this.questionManagers = QuizManager.shuffle(this.questionManagers);
		this.questionManagers.forEach((qm) => qm.reset());

		this.render();
	}

	render(): void {
		this.container.empty();

		if (!this.errorManager.isValid) {
			this.errorManager.render(this.container);
		} else if (this.showStartMenu) {
			buildHTML(this.container, this.#buildStartMenu());
		} else if (this.questionIndex < this.questionManagers.length) {
			const currentQM = this.questionManagers[this.questionIndex]!;
			buildHTML(this.container, [
				// Progress Bar
				{
					tag: "div",
					class: "p-4 border-b border-gray-200",
					children: [
						{
							tag: "div",
							class: "flex items-center justify-between mb-2",
							children: [
								{
									tag: "span",
									class: "text-sm text-muted",
									text: `Question ${this.questionIndex + 1} of ${this.questionManagers.length}`,
									children: [],
								},
								{
									tag: "span",
									class: "text-sm text-muted",
									text: `${this.questionIndex} answered`,
									children: [],
								},
							],
						},
						{
							tag: "div",
							class: "w-full bg-secondary-alt rounded-full h-2",
							children: [
								{
									tag: "div",
									class: "bg-accent h-2 rounded-full transition-all",
									attrs: {
										style: `width: ${((this.questionIndex + 1) / this.questionManagers.length) * 100}%`,
									},
									children: [],
								},
							],
						},
					],
				},
			]);

			const questionContainer = this.container.createEl("div", {});
			currentQM.render(questionContainer, (isCorrect) =>
				this.progress(isCorrect),
			);
		} else {
			this.resultsManager.render(
				this.container,
				this.correctQuestions,
				() => this.reset(),
			);
		}
	}
}
