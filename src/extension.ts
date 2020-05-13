/*---------------------------------------------------------
 * Mailgun Upload Template VSCode
 *
 * extension.ts
 * Created  13/05/2020.
 * Updated  14/05/2020.
 * Author   Allan Nava.
 * Created by Allan Nava.
 * Copyright (C) Allan Nava. All rights reserved.
 *--------------------------------------------------------*/
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
///
var commonUtil 	= require('./common/common-util');
var vsUtil 		= require('./common/vs-util');
var fileUtil 	= require('./common/file-util');
var cryptoUtil 	= require('./common/crypto-util');
///
//var Mailgun = require('mailgun').Mailgun;
const CONFIG_NAME = "mailgun-simple.json";
let CONFIG_PATH: String, CONFIG_PATH_TEMP, WAIT_COPY_PATH, REMOTE_WORKSPACE_TEMP_PATH;
///
///
function moveOldConfigFile(){
	let oldConfig = vsUtil.getOldConfigPath(CONFIG_NAME);
	if(!fileUtil.existSync(CONFIG_PATH) && fileUtil.existSync(oldConfig)) {
	  fileUtil.copy(oldConfig, CONFIG_PATH, (e: any) => {
		if(!e){fileUtil.rm(oldConfig);}
	  });
	}
}
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "mailgun-upload-template-vscode" is now active!');
	//var mg = new Mailgun('api-key');
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('mailgun-upload-template-vscode.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from Mailgun Upload Template!');
	});
	/// Added the test command
	context.subscriptions.push(disposable);
	///
	let configMailgun = vscode.commands.registerCommand('mailgun-upload-template-vscode.config', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		//vscode.window.showInformationMessage('Hello World from Mailgun Upload Template!');
		console.log('configMailgun Congratulations, your extension "mailgun-upload-template-vscode.config" is now active!');
	});
	/// Added the command for creation configMailgun
	context.subscriptions.push(configMailgun);
	///
	let uploadTemplateMailgun = vscode.commands.registerCommand('mailgun-upload-template-vscode.upload', ( item ) => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		//vscode.window.showInformationMessage('Hello World from Mailgun Upload Template!');
		console.log('configMailgun Congratulations, your extension "mailgun-upload-template-vscode.upload" is now active!');
		console.log("item:", item);
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