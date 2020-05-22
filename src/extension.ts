/*---------------------------------------------------------
 * Mailgun Upload Template VSCode
 *
 * extension.ts
 * Created  13/05/2020.
 * Updated  21/05/2020.
 * Author   Allan Nava.
 * Created by Allan Nava.
 * Copyright (C) Allan Nava. All rights reserved.
 *--------------------------------------------------------*/
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import {
	commands,
	ExtensionContext,
	InputBoxOptions,
	OpenDialogOptions,
	Uri,
	window,
	workspace
} from 'vscode';
import * as _ from "lodash";
import * as mkdirp from "mkdirp";
import { existsSync, lstatSync, writeFile } from "fs";
import { getConfigTemplate } from './templates';
///
//var Mailgun = require('mailgun').Mailgun;
const CONFIG_NAME = "mailgun-config.json";
const CONFIG_PATH = `${workspace.workspaceFolders}/${CONFIG_NAME}.json`;
///
///
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "mailgun-upload-template-vscode" is now active!');
	///
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = commands.registerCommand('mailgun-upload-template-vscode.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		window.showInformationMessage('Hello World from Mailgun Upload Template!');
	});
	/// Added the test command
	context.subscriptions.push(disposable);
	///
	let configMailgun = commands.registerCommand('mailgun-upload-template-vscode.config', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		//vscode.window.showInformationMessage('Hello World from Mailgun Upload Template!');
		console.log('configMailgun Congratulations, your extension "mailgun-upload-template-vscode.config" is now active!');
		console.log(JSON.stringify(workspace.getConfiguration('hello')));
		createConfigMailgun();
	});
	/// Added the command for creation configMailgun
	context.subscriptions.push(configMailgun);
	///
	let uploadTemplateMailgun = commands.registerCommand('mailgun-upload-template-vscode.upload',  async (uri: Uri) => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		//vscode.window.showInformationMessage('Hello World from Mailgun Upload Template!');
		console.log('configMailgun Congratulations, your extension "mailgun-upload-template-vscode.upload" is now active!');
		console.log("uri:", Uri);
		///
		let targetDirectory;
		if (_.isNil(_.get(uri, "fsPath")) || !lstatSync(uri.fsPath).isFile()) {
			targetDirectory = await promptForTargetDirectory();
			window.showErrorMessage("Please select a valid file");
		} else {
			targetDirectory = uri.fsPath;
		}
		///
		console.log(`targetDirectory ${targetDirectory}`);
		///
	});
	/// Added the upload template command
	context.subscriptions.push(uploadTemplateMailgun);
	///
}
///
// this method is called when your extension is deactivated
export function deactivate() {}
///
window.onDidChangeActiveTextEditor(function(event){
	console.log("onDidChangeActiveTextEditor "+event);
});
///
async function promptForTargetDirectory(): Promise<string | undefined> {
	console.log("promptForTargetDirectory()");
	const options: OpenDialogOptions = {
	  canSelectMany: false,
	  openLabel: "Select a folder to create",
	  canSelectFolders: true
	};
  
	return window.showOpenDialog(options).then(uri => {
	  if (_.isNil(uri) || _.isEmpty(uri)) {
		return undefined;
	  }
	  return uri[0].fsPath;
	});
}
///
///
function createConfigMailgun( ) {
	if (existsSync(CONFIG_PATH)) {
	  throw Error(`${CONFIG_PATH} already exists`);
	}
	return new Promise(async (resolve, reject) => {
	  writeFile(CONFIG_PATH, getConfigTemplate(), "utf8", error => {
		if (error) {
		  reject(error);
		  return;
		}
		resolve();
	  });
	});
}
//
function createDirectory(targetDirectory: string): Promise<void> {
	return new Promise((resolve, reject) => {
	  mkdirp(targetDirectory, { mode: '0777' }).then(made => {
		  if(made){
			  return reject(made);
		  }
		  resolve();
	  });
	});
}
///