import { HtmlRenderData } from "types";
import buildHTML from "view/buildHTML";

export default class ResultsManager {
	constructor() {}

	private renderQuestionResult(
		isCorrect: boolean,
		questionIdx: number,
	): HtmlRenderData {
		const svg: HtmlRenderData = !isCorrect
			? {
					tag: "svg",
					class: "w-4 h-4 text-red-600",
					attrs: {
						xmlns: "http://www.w3.org/2000/svg",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						"stroke-width": 2,
						"stroke-linecap": "round",
						"stroke-linejoin": "round",
					},
					children: [
						{
							tag: "path",
							attrs: {
								d: "M18 6 6 18",
							},
							children: [],
						},
						{
							tag: "path",
							attrs: {
								d: "m6 6 12 12",
							},
							children: [],
						},
					],
				}
			: {
					tag: "svg",
					class: "w-4 h-4 text-green-600",
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
							tag: "path",
							attrs: {
								d: "M20 6 9 17l-5-5",
							},
							children: [],
						},
					],
				};

		return {
			tag: "div",
			class: "flex items-center gap-3 p-3 bg-secondary-alt rounded-lg",
			children: [
				{
					tag: "div",
					class: `
					  w-6 h-6 rounded-full flex items-center justify-center
						${isCorrect ? " bg-green-100" : " bg-red-100"}
					`,
					children: [svg],
				},
				{
					tag: "span",
					class: "text-sm",
					text: `Question ${questionIdx + 1}`,
					children: [],
				},
			],
		};
	}

	render(
		container: HTMLElement,
		correctQuestions: boolean[],
		resetCallback: () => void,
	): void {
		container.empty();

		buildHTML(container, [
			// Header
			{
				tag: "div",
				class: "text-center mb-8",
				children: [
					{
						tag: "div",
						class: "w-24 h-24 mx-auto mb-4 text-accent-light rounded-full flex items-center justify-center",
						children: [
							{
								tag: "svg",
								class: "w-12 h-12 text-accent-dark",
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
										tag: "path",
										attrs: { d: "M20 6 9 17l-5-5" },
										children: [],
									},
								],
							},
						],
					},
					{
						tag: "p",
						class: "text-3xl mb-2",
						text: "Quiz Complete!",
						children: [],
					},
					{
						tag: "p",
						class: "text-muted",
						text: "Here are your results",
						children: [],
					},
				],
			},
			// Score Box
			{
				tag: "div",
				class: "bg-secondary-alt rounded-lg p-6 mb-8 text-center",
				children: [
					{
						tag: "div",
						class: "text-5xl mb-2 text-accent",
						text: `${Math.round((correctQuestions.filter(Boolean).length / correctQuestions.length) * 100)}%`, // calculated percentage
						children: [],
					},
					{
						tag: "div",
						class: "text-muted",
						children: [
							{
								tag: "span",
								text: "You got ",
								children: [],
							},
							{
								tag: "span",
								class: "text-accent",
								text: `${correctQuestions.filter(Boolean).length}`,
								children: [],
							},
							{
								tag: "span",
								text: " out of ",
								children: [],
							},
							{
								tag: "span",
								class: "text-accent",
								text: `${correctQuestions.length}`,
								children: [],
							},
							{
								tag: "span",
								text: " questions correct",
								children: [],
							},
						],
					},
				],
			},
			{
				tag: "div",
				class: "space-y-2 mb-8",
				children: correctQuestions.map((isCorrect, index) =>
					this.renderQuestionResult(isCorrect, index),
				),
			},
			// Back to Start Button
			{
				tag: "button",
				class: "clickable-icon w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-accent hover:bg-accent-dark text-on-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
				clickHandler: () => resetCallback(),
				children: [
					{
						tag: "svg",
						class: "w-5 h-5",
						children: [],
					},
					{
						tag: "span",
						text: "Back to Start",
						children: [],
					},
				],
			},
		]);
	}
}
