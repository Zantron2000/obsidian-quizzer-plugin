import {Plugin} from 'obsidian';
import {DEFAULT_SETTINGS, MyPluginSettings, SampleSettingTab} from "./settings";
import { extractCodeBlockContent } from 'utils';

// Remember to rename these classes and interfaces!

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'run-test',
			name: 'Run test',
			callback: async () => {
				const files = this.app.vault.getMarkdownFiles();
				await Promise.all(files.map(async (file) => {
					const meta = this.app.metadataCache.getFileCache(file);
					const codeSections = meta?.sections?.filter((section) => section.type === 'code');

					if (codeSections != null && codeSections.length > 0) {
						const content = await this.app.vault.read(file);
						codeSections.forEach((section) => {
							const codeBlock = extractCodeBlockContent(content, section.position);

							console.log(`File: ${file.path}, Language: ${codeBlock.type}, Content: ${codeBlock.content}`);
						});
					}
				}));
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));
	}

	onunload() {
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData() as Partial<MyPluginSettings>);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
