import { App } from "obsidian";
import { QuizManager } from "./quizManager";
import ErrorManager from "./errorManager";
import {
	MultipleChoiceData,
	Quiz,
	ShortAnswerData,
	TrueFalseData,
} from "types";

export default class DailyQuizManager extends QuizManager {
	private static async getQuizFiles(app: App) {
		const files = app.vault.getFiles();
		const questions = [] as (
			| MultipleChoiceData
			| ShortAnswerData
			| TrueFalseData
		)[];

		await Promise.all(
			files.map(async (file) => {
				const cache = app.metadataCache.getFileCache(file);

				if (cache?.frontmatter?.["daily-quiz"] === "true") {
					const fileContent = await app.vault.cachedRead(file);

					cache.sections?.forEach((section) => {
						if (section.type === "code") {
							const codeContent = fileContent.substring(
								section.position.start.offset,
								section.position.end.offset,
							);

							if (codeContent.trim().startsWith("```quizz")) {
								const jsonContent = codeContent
									.replace(/^```quizz\s*/, "")
									.replace(/```$/, "")
									.trim();
								try {
									const parsedData: unknown =
										JSON.parse(jsonContent);
									const errorManager = new ErrorManager(
										parsedData,
									);
									if (errorManager.isValid) {
										const quizData = parsedData as Quiz;
										quizData.data.forEach((item) => {
											questions.push(item);
										});
									}
								} catch (error) {
									console.error(
										`Error parsing quiz data in file ${file.path}:`,
										error,
									);
								}
							}
						}
					});
				}
			}),
		);

		return questions;
	}

	public static async getQuizManager(containerEl: HTMLElement, app: App) {
		const questions = await this.getQuizFiles(app);
		const quizData: Quiz = {
			title: "Daily Quiz",
			description:
				"A quiz generated from all files with daily-quiz frontmatter",
			data: questions,
		};

		return new QuizManager(quizData, containerEl);
	}
}
