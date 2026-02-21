# Quizzer

**Quizzer** is an Obsidian plugin that allows you to create and manage quizzes within your Obsidian vault. It provides a user-friendly interface for creating and taking quizzes.

## Features

- **Quiz Creation**: Easily create quizzes with the following types of questions
    - Multiple Choice
    - True/False
    - Short Answer
- **Quiz Management**: View and manage your quizzes in a dedicated interface.
- **Daily Quiz**: Automatically generate a daily quiz based on your notes.

## Usage

### Installation

1. Download the latest release of the Quizzer plugin from the [GitHub repository](https://github.com/Zantron2000/obsidian-quizzer-plugin)
2. In your Obsidian vault, create a folder named `quizzer` under the `.obsidian` directory if it doesn't already exist.
3. Copy the downloaded plugin files into the `quizzer` folder.
4. Open the code and run `npm install` and `npm run build` to build the plugin.
5. In Obsidian, go to Settings > Community Plugins and enable the Quizzer plugin

### Generating a Quiz

To generate a quiz, create a markdown block using the `quizz` identifier.

and enter in the following JSON format:

```json
{
	"title": "A string representing the title of the quiz",
	"description": "A string representing the description of the quiz",
	"data": [] // An array of question objects
}
```

The data array should be populated with different types of questions. Quizzer currently supports the following questions:

1. Multiple Choice Questions

```json
{
	"type": "multiple-choice", // Defines the question as a multiple choice question
	"question": "What is the capital of France?", // The question being asked
	"answer": {
		"label": "Paris", // The correct answer to the question
		"explanation": "Paris is the capital city of France." // An optional explanation that can be shown after the question is answered
	},
	"alternatives": [
		{
			"label": "London", // An alternative answer to the question
			"explanation": "London is the capital city of the United Kingdom." // An optional explanation that can be shown after the question is answered
		}
	]
}
```

2. True/False Questions

```json
{
	"type": "true-false", // Defines the question as a true/false question
	"question": "The Earth is flat.", // The question being asked
	"answer": {
		"label": "False", // The correct answer to the question
		"explanation": "The Earth is an oblate spheroid, meaning it is mostly spherical but slightly flattened at the poles." // An optional explanation that can be shown after the question is answered
	},
	"incorrectExplanation": "Look man I don't know what to tell you." // An optional explanation that can be shown if the user answers incorrectly
}
```

3. Short Answer Questions

```json
{
	"type": "short-answer", // Defines the question as a short answer question
	"question": "What is this plugin called", // The question being asked
	"answer": "Quizzer", // The correct answer to the question
	"acceptableVariations": ["Quizzer Plugin"], // An array of acceptable variations of the correct answer
	"caseSensitive": false // A boolean indicating whether the answer should be case sensitive (default is true)
}
```

### Generating a Daily Quiz

The daily quiz combines all the questions from your vault and generates a quiz for you to take each day. To generate a daily quiz, create a markdown block with the `dailyquiz` identifier.

Or click the "Generate Daily Quiz" button in the right sidebar. This will create a daily quiz in the root of your vault.

**Important Note**: The daily quiz will only pull questions from quizzes in notes that have the property `daily-quiz` set to `true`
