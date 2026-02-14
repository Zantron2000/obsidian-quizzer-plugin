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
	}

	onunload() {}
}
