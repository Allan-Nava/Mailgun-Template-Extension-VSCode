/*---------------------------------------------------------
 * Mailgun Upload Template VSCode
 *
 * common-util.ts
 * Created  13/05/2020.
 * Updated  14/05/2020.
 * Author   Allan Nava.
 * Copyright (C) Allan Nava. All rights reserved.
 *--------------------------------------------------------*/
///
/* eslint-disable eqeqeq */
'use strict';
///
import vscode   = require('vscode');
import path     = require('path');
import os       = require('os');
import filesize = require('filesize');
import { Context } from 'vm';
var homeDir     = os.homedir();
var pathUtil    = require('./path-util');
var commonUtil  = require('./common-util');
var fileUtil    = require('./file-util');
///
export class VsUtil {
  ///
  context!: vscode.ExtensionContext;
  ///
  setContext( con : vscode.ExtensionContext ){
      this.context = con;
  };  
  ///
  getOldConfigPath ( filename : vscode.TextDocument ){
    // eslint-disable-next-line eqeqeq
    var folder = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Application Support' : process.platform == 'linux' ? pathUtil.join(homeDir, '.config') : '/var/local');
    if(/^[A-Z]\:[/\\]/.test(folder)) {folder = folder.substring(0, 1).toLowerCase() + folder.substring(1);}
    var isInsiders  = vscode.version.indexOf("insider") > -1;
    var path = isInsiders ? "/Code - Insiders/User/" : "/Code/User/";
    return pathUtil.join(folder, path, filename ? filename : "");
  }
  ///
  getConfigPath ( filename : vscode.TextDocument ){
    return pathUtil.join( context.globalStoragePath , filename ? filename : "");
  }
  ///
  existConfig( filename : vscode.TextDocument){
      // var result = true;
      return fileUtil.existSync(this.getConfigPath(filename));
  }
  ///
  hide (){
      if(vscode.window.activeTextEditor)
      {
        try{
          vscode.window.activeTextEditor.hide();
        }catch(e){
          vscode.commands.executeCommand("workbench.action.closeActiveEditor");
        }
      }
      else
      {
        vscode.commands.executeCommand("workbench.action.closeActiveEditor");
      }
  };
  ///
  status ( msg : string, time : number ){
    vscode.window.setStatusBarMessage(msg, time);
  };
  ///
  pick ( data: string[] | Thenable<string[]>, option: (vscode.QuickPickOptions & { canPickMany: true; }) | undefined, cb: (arg0: string[]) => void){
    if(arguments.length === 2 && typeof option === 'function'){
      cb = option;
      option = undefined;
    } else if(typeof option === 'string'){
      option = {placeHolder:option};
    }
    var p = vscode.window.showQuickPick(data, option);
    if(cb) p.then(function(val){if(val)cb(val);});
    return p;
  };
  ///
  isChangeTextDocument( uri: string ){
    var arr = this.getActiveFilePathAll();
    if(/\.git$/.test(uri)) uri = uri.substring(0, uri.length - 4);
    return arr.indexOf(uri) == -1;
  };
  ///
  getActiveFilePathAll( ) {
    var docs = vscode.workspace.textDocuments;
    var arr = [];
    if(docs)
    {
      for(var i=0; i<docs.length; i++)
      {
        if(docs[i].uri && docs[i].uri.scheme != "output" && docs[i].uri.fsPath)
        {
          arr.push(pathUtil.normalize(docs[i].uri.fsPath));
        }
      }
    }
    return arr;
  };
  ///
  ///
}
///