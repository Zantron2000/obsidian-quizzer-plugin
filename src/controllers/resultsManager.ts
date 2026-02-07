import buildHTML from "view/buildHTML";

export default class ResultsManager {
	constructor() {}

	render(container: HTMLElement) {
		container.empty();

		buildHTML(container, [
			// Header
			{
				tag: "div",
				class: "text-center mb-8",
				children: [
					{
						tag: "div",
						class: "w-24 h-24 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center",
						children: [
							{
								tag: "svg",
								class: "w-12 h-12 text-purple-600",
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
						tag: "h2",
						class: "text-3xl mb-2 text-gray-900",
						text: "Quiz Complete!",
						children: [],
					},
					{
						tag: "p",
						class: "text-gray-600",
						text: "Here are your results",
						children: [],
					},
				],
			},
			// Score Box
			{
				tag: "div",
				class: "bg-gray-50 rounded-lg p-6 mb-8 text-center",
				children: [
					{
						tag: "div",
						class: "text-5xl mb-2 text-purple-600",
						text: "85%", // dummy value for percentage
						children: [],
					},
					{
						tag: "div",
						class: "text-gray-700",
						children: [
							{
								tag: "span",
								text: "You got ",
								children: [],
							},
							{
								tag: "span",
								class: "text-purple-600",
								text: "8", // dummy value for score
								children: [],
							},
							{
								tag: "span",
								text: " out of ",
								children: [],
							},
							{
								tag: "span",
								class: "text-purple-600",
								text: "10", // dummy value for totalQuestions
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
			// Question Results List
			{
				tag: "div",
				class: "space-y-2 mb-8",
				children: [
					// Example for 3 questions, mix correct/incorrect
					{
						tag: "div",
						class: "flex items-center gap-3 p-3 bg-gray-50 rounded-lg",
						children: [
							{
								tag: "div",
								class: "w-6 h-6 rounded-full flex items-center justify-center bg-green-100",
								children: [
									{
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
												attrs: { d: "M20 6 9 17l-5-5" },
												children: [],
											},
										],
									},
								],
							},
							{
								tag: "span",
								class: "text-sm text-gray-700",
								text: "Question 1",
								children: [],
							},
						],
					},
				],
			},
			// Back to Start Button
			{
				tag: "button",
				class: "w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-lg flex items-center justify-center gap-2 transition-colors",
				clickHandler: () => {}, // dummy function
				children: [
					{
						tag: "svg",
						class: "w-5 h-5",
						children: [], // Home icon placeholder
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
