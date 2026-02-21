import { HtmlRenderData, QuestionManager, Quiz } from "types";
import MCManager from "./mcManager";
import buildHTML from "view/buildHTML";
import ErrorManager from "./errorManager";
import ResultsManager from "./resultsManager";
import TFManager from "./tfManager";
import SAManager from "./saManager";
import generateBookSVG from "view/svgs/generateBookSVG";
import generateTrophySVG from "view/svgs/generateTrophySVG";
import generateParagraph from "view/html/generateParagraph";
import generateListItem from "view/html/generateListItem";
import generateDiv from "view/html/generateDiv";

export class QuizManager {
	questionManagers: QuestionManager[] = [];
	questionIndex: number = 0;
	showStartMenu: boolean = true;
	container: HTMLElement;
	htmlContainer: HtmlRenderData = generateDiv(
		"bg-secondary rounded-lg shadow-lg p-8",
		[],
	);
	errorManager: ErrorManager;
	resultsManager: ResultsManager;
	correctQuestions: boolean[] = [];
	quizData?: Quiz;

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
			this.quizData = typedQuizData;

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
			generateDiv("text-center mb-8", [
				generateDiv("flex justify-center mb-4", [
					generateDiv(
						"w-16 h-16 bg-accent-light rounded-full flex items-center justify-center",
						[generateBookSVG("w-8 h-8 text-accent-dark")],
					),
				]),
				generateParagraph(this.quizData!.title, "text-3xl mb-2"),
				generateParagraph(this.quizData!.description, ""),
			]),
			// Stats
			generateDiv("grid grid-cols-3 gap-4 mb-8", [
				generateDiv("bg-secondary-alt rounded-lg p-4 text-center", [
					generateParagraph(
						this.questionManagers.length.toString(),
						"text-2xl mb-1",
					),
					generateParagraph("Questions", "text-sm text-muted"),
				]),
				generateDiv("bg-secondary-alt rounded-lg p-4 text-center", [
					generateParagraph(
						Math.ceil(this.questionManagers.length / 2).toString(),
						"text-2xl mb-1",
					),
					generateParagraph("Minutes", "text-sm text-muted"),
				]),
				generateDiv("bg-secondary-alt rounded-lg p-4 text-center", [
					generateDiv("flex items-center justify-center gap-1 mb-1", [
						generateTrophySVG("w-5 h-5 text-yellow-500"),
						generateParagraph("N/A", "text-2xl"),
					]),
					generateParagraph("Best Score", "text-sm text-muted"),
				]),
			]),
			// Instructions
			generateDiv(
				"bg-secondary-alt border border-blue-200 rounded-lg p-4 mb-8",
				[
					generateParagraph("Instructions:", "text-sm mb-2"),
					{
						tag: "ul",
						class: "text-sm text-muted space-y-1",
						children: [
							generateListItem(
								"Select the best answer for each question",
							),
							generateListItem(
								"Submit your answer when you're ready",
							),
							generateListItem(
								"Get instant feedback and see your final results at the end",
							),
						],
					},
				],
			),
			// Start Button
			{
				tag: "button",
				class: "clickable-icon progress-button",
				clickHandler: () => {
					this.showStartMenu = false;
					this.render();
				},
				text: "Start Quiz",
				children: [],
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
				generateDiv("p-4 border-b border-modifier", [
					generateDiv("flex items-center justify-between mb-2", [
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
					]),
					generateDiv("w-full bg-secondary-alt rounded-full h-2", [
						{
							tag: "div",
							class: "bg-accent h-2 rounded-full transition-all",
							attrs: {
								style: `width: ${((this.questionIndex + 1) / this.questionManagers.length) * 100}%`,
							},
							children: [],
						},
					]),
				]),
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
