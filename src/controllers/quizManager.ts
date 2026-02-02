/* eslint-disable obsidianmd/ui/sentence-case */
import { htmlRenderData } from "types";
import MCManager from "./mcManager";
import buildHTML from "view/buildHTML";

export class QuizManager {
	questionManagers: MCManager[] = [];
	errors: string[] = [];
	questionIndex: number = 0;
	htmlContent: htmlRenderData[] = [
		{
			tag: "div",
			class: "bg-white rounded-lg shadow-lg p-8 border border-gray-200",
			children: [
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
											tag: "div",
											class: "w-8 h-8 text-accent",
											text: "[BookOpen Icon]",
											children: [],
										},
									],
								},
							],
						},
						{
							tag: "h1",
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
									text: "10",
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
									text: "5",
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
											tag: "div",
											class: "w-5 h-5 text-yellow-500",
											text: "[Trophy Icon]",
											children: [],
										},
										{
											tag: "div",
											class: "text-2xl text-gray-900",
											text: "85%",
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
							tag: "h3",
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
									text: "• Select the best answer for each question",
									children: [],
								},
								{
									tag: "li",
									text: "• You can navigate between questions freely",
									children: [],
								},
								{
									tag: "li",
									text: "• Submit your answers when you're ready",
									children: [],
								},
							],
						},
					],
				},
				// Start Button
				{
					tag: "button",
					class: "w-full bg-accent hover:bg-accent-dark text-white py-4 rounded-lg flex items-center justify-center gap-2 transition-colors",
					children: [
						{
							tag: "div",
							class: "w-5 h-5",
							text: "[Play Icon]",
							children: [],
						},
						{
							tag: "span",
							text: "Start Quiz",
							children: [],
						},
					],
				},
			],
		},
	];

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

	render(el: HTMLElement): void {
		if (this.errors.length > 0) {
			el.createEl("div", { text: "Errors in quiz data:" });
			this.errors.forEach((error) => {
				el.createEl("div", { text: `- ${error}` });
			});
		} else {
			buildHTML(el, this.htmlContent);
		}
	}
}
