import { Plugin, addIcon } from "obsidian";
import { QuizManager } from "controllers/quizManager";

export default class QuizzerPlugin extends Plugin {
	async onload() {
		this.registerMarkdownCodeBlockProcessor(
			"quizz",
			async (source, el, ctx) => {
				let quizData = [] as unknown;
				try {
					quizData = JSON.parse(source) as unknown;
				} catch {
					el.createEl("div", {
						text: "Invalid JSON format provided",
					});
					return;
				}

				const quizManager = new QuizManager(quizData, el);
				quizManager.render();
			},
		);

		addIcon(
			"Q",
			`<g transform="scale(0.75)" translate(-8.55 -14.11)"><path d="M102.61 107.83c10.8-9.85 16.84-24.08 16.84-39.9 0-29.73-21.33-53.82-55.45-53.82S8.55 38.21 8.55 67.93c0 29.73 21.33 53.82 55.45 53.82 7.69 0 14.72-1.23 21.01-3.47l5.97 8.54a2.08 2.08 0 0 0 2.28.81l16.51-4.75c.64-.19 1.16-.67 1.39-1.31.22-.63.13-1.33-.26-1.89zM64 95.89c-17.72 0-28.81-12.52-28.81-27.96S46.27 39.97 64 39.97s28.81 12.52 28.81 27.96c0 6.65-2.07 12.76-5.82 17.56l-7.26-10.38a2.09 2.09 0 0 0-2.28-.81l-16.52 4.75c-.64.19-1.16-.67-1.39 1.31-.22.63-.13 1.33.26 1.89l9.27 13.25c-1.62.24-3.3.39-5.07.39" fill="currentColor"/></g>`,
		);
		this.addRibbonIcon("Q", "Create a daily quiz", (evt: MouseEvent) => {
			console.log("HI");
		});
	}

	onunload() {}
}
