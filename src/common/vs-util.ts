/*---------------------------------------------------------
 * Mailgun Upload Template VSCode
 *
 * common-util.ts
 * Updated 13/05/2020.
 * Created by Allan Nava.
 * Copyright (C) Allan Nava. All rights reserved.
 *--------------------------------------------------------*/
///
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
        var folder = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Application Support' : process.platform == 'linux' ? pathUtil.join(homeDir, '.config') : '/var/local');
        if(/^[A-Z]\:[/\\]/.test(folder)) folder = folder.substring(0, 1).toLowerCase() + folder.substring(1);
        var isInsiders  = vscode.version.indexOf("insider") > -1;
        var path = isInsiders ? "/Code - Insiders/User/" : "/Code/User/";
        return pathUtil.join(folder, path, filename ? filename : "");
    }
    ///
    getConfigPath ( filename : vscode.TextDocument ){
        return pathUtil.join( context.globalStoragePath , filename ? filename : "");
      }
    ///
}
///