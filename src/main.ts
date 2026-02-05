import { Plugin } from "obsidian";
import {
	DEFAULT_SETTINGS,
	MyPluginSettings,
	SampleSettingTab,
} from "./settings";
import { QuizManager } from "controllers/quizManager";

export default class QuizzerPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

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

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			(await this.loadData()) as Partial<MyPluginSettings>,
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
