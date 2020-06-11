/*---------------------------------------------------------
 * Mailgun Upload Template VSCode
 *
 * extension.ts
 * Created  13/05/2020.
 * Updated  27/05/2020.
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
	workspace,
	ConfigurationTarget,
	version
} from 'vscode';
import * as os from 'os';
import * as _ from "lodash";
import * as mkdirp from "mkdirp";
import { existsSync, lstatSync, writeFile, fstat } from "fs";
import { join } from '@fireflysemantics/join';
import { getConfigTemplate } from './templates';
import { MailgunUtil } from './common/mailgun-util';
///
//var Mailgun = require('mailgun').Mailgun;
const CONFIG_NAME = "mailgun-config.json";
let CONFIG_PATH : string;
let homeDir = os.homedir();
//const CONFIG_PATH = `${workspace.workspaceFolders?.toLocaleString()}/${CONFIG_NAME}.json`;
///
///
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "mailgun-upload-template-vscode" is now active!');
	///
	CONFIG_PATH = getConfigPath(CONFIG_NAME);
	/// https://github.com/Microsoft/vscode-extension-samples/blob/master/configuration-sample/src/extension.ts
	//console.log(ConfigurationTarget.Workspace);
	console.log(`CONFIG_PATH = ${CONFIG_PATH}`);
	///
	let configMailgun = commands.registerCommand('mailgun-upload-template-vscode.config', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		//vscode.window.showInformationMessage('Hello World from Mailgun Upload Template!');
		console.log('configMailgun Congratulations, your extension "mailgun-upload-template-vscode.config" is now active!');
		//
		// Display a status bar message to show progress
        window.setStatusBarMessage('Creating the config file ....');
		createConfigMailgun();
	});
	//console.log("configMailgun ", configMailgun);
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
		let targetFile;
		if (_.isNil(_.get(uri, "fsPath")) || !lstatSync(uri.fsPath).isFile()) {
			targetFile = await promptForTargetFiles();
			window.showErrorMessage("Please select a valid file");
		} else {
			targetFile = uri.fsPath;
		}
		///
		console.log(`targetFile ${targetFile}`);
		if(! checkConfigFile()){
			window.showErrorMessage("Please provide your config file!");
		}
		///
		let config = getConfigFile();
		console.log(config);
		let mailgun = new MailgunUtil(  "domain",  "" );
		mailgun.uploadTemplate();
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
async function promptForTargetFiles(): Promise<string | undefined> {
	console.log("promptForTargetFiles()");
	const options: OpenDialogOptions = {
	  canSelectMany: false,
	  openLabel: "Select a file to upload",
	  canSelectFolders: false,
	  canSelectFiles: true,
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
	console.log(`createConfigMailgun ${CONFIG_PATH}`);
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
function checkConfigFile(){
	if (existsSync(CONFIG_PATH)) {
		return true;
	}
	return false;
}
///
function getConfigFile(){
	workspace.openTextDocument(CONFIG_PATH).then((document) => {
		let text = document.getText();
		console.log("text",text);
		return text;
	});
}
///
function getConfigPath(filename: any){
	// eslint-disable-next-line eqeqeq
	var folder = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Application Support' : process.platform == 'linux' ? join(homeDir, '.config') : '/var/local');
	if(/^[A-Z]\:[/\\]/.test(folder)) folder = folder.substring(0, 1).toLowerCase() + folder.substring(1);
	var isInsiders  = version.indexOf("insider") > -1;
	var path = isInsiders ? "/Code - Insiders/User/" : "/Code/User/";
	return join(folder, path, filename ? filename : "");
}
