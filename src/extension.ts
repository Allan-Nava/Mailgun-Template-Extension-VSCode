/*---------------------------------------------------------
 * Mailgun Upload Template VSCode
 *
 * extension.ts
 * Created  13/05/2020.
 * Updated  15/05/2020.
 * Author   Allan Nava.
 * Created by Allan Nava.
 * Copyright (C) Allan Nava. All rights reserved.
 *--------------------------------------------------------*/
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode 		from 'vscode';
//import * as crypto 		from 'crypto';
///
import{ VsUtil }  		from './common/vs-util';
import{ CommonUtil }  	from './common/common-util';
import { FileUtil }		from './common/file-util';
import { CryptoUtil} 	from './common/crypto-util';
var commonUtil 	= new CommonUtil();
var vsUtil 		= new VsUtil();
var fileUtil	= new FileUtil();
var cryptoUtil 	= new CryptoUtil();
///
var outputChannel 	= null;
///
//var Mailgun = require('mailgun').Mailgun;
const CONFIG_NAME 					= "mailgun-simple.json";
const CONFIG_MAILGUN_WORKSPACE_TEMP	= "mailgun-workspace-temp";
let CONFIG_PATH: String, CONFIG_PATH_TEMP: any, WAIT_COPY_PATH, REMOTE_WORKSPACE_TEMP_PATH;
///
///

function moveOldConfigFile(){
	let oldConfig = vsUtil.getOldConfigPath(CONFIG_NAME);
	if(!fileUtil.existSync(CONFIG_PATH) && fileUtil.existSync(oldConfig)) {
	  fileUtil.copy(oldConfig, CONFIG_PATH, (e: any) => {
		if(!e){fileUtil.rm(oldConfig as any);}
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
	vsUtil.setContext(context);
	///
	var subscriptions 	= [];
	outputChannel 		= vsUtil.getOutputChannel("mailgun-upload-template-vscode");
	CONFIG_PATH 		= vsUtil.getConfigPath(CONFIG_NAME);
	CONFIG_PATH_TEMP 	= vsUtil.getConfigPath("mailgun-upload-template-vscode-temp.json");
	// REMOTE_TEMP_PATH = vsUtil.getConfigPath(CONFIG_FTP_TEMP);
	moveOldConfigFile();
	//console.log("mailgun-upload-template-vscode start : ", CONFIG_PATH);
	//console.log("mailgun-upload-template-vscode WorkSpacePath :", vsUtil.getWorkspacePath());
	// destroy(true);

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
		//console.log(JSON.stringify(vscode.workspace.getConfiguration('hello')));
		/*var configSet = initConfig();
		if(configSet.result){
		  fileUtil.writeFile(CONFIG_PATH_TEMP, JSON.stringify(configSet.json, null, '\t'), function(){
			vsUtil.openTextDocument(CONFIG_PATH_TEMP);
		  });
		}*/
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
		var localFilePath = vsUtil.getActiveFilePathAndMsg(item, "Please select a file to upload");
    	console.log("localFilePath:",localFilePath);
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
vscode.window.onDidChangeActiveTextEditor(function(event){
	console.log("onDidChangeActiveTextEditor "+event);
});
///
function setDefaultConfig(config: string | any[]){
	for(var i=0; i<config.length; i++)
	{
	  if(config[i].autosave === undefined) {config[i].autosave = true;}
	  if(config[i].confirm === undefined) {config[i].confirm = true;}
	  if(config[i].path === undefined) {config[i].path = "/";}
	}
	return config;
}
function writeConfigFile( json: any ){
	fileUtil.writeFileSync(CONFIG_PATH, cryptoUtil.encrypt(JSON.stringify(json, null, '\t')));
	fileUtil.rm(CONFIG_PATH_TEMP);
}
function initConfig(){
	var result = true;
	var json = vsUtil.getConfig(CONFIG_NAME);
	try{
	  json = cryptoUtil.decrypt(json);
	  json = JSON.parse(json);
	}catch(e){
	  //
	  try{
		json = JSON.parse(json);
		writeConfigFile(json);
	  }catch(ee){
		if(json === undefined){
		  //
		  json = { name:"MY_API_KEY", };
		  writeConfigFile(json);
		}else{
		  	vsUtil.error("Check mailgun-upload-template-vscode config file syntax.");
		   	fileUtil.writeFile(CONFIG_PATH_TEMP, json, function(){
			 	vsUtil.openTextDocument(CONFIG_PATH_TEMP);
		   	});
		  	result = false;
		}
	  }   
	}
	json = setDefaultConfig(json);
	return {result:result, json:json};
}
function getConfig(){
	var json = {};
	var config = initConfig();
	if(config.result)
	{
		json = config.json;
	}
	return json;
}