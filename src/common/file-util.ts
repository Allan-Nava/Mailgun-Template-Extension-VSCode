/*---------------------------------------------------------
 * Mailgun Upload Template VSCode
 *
 * file-util.ts
 * Created  14/05/2020.
 * Updated  14/05/2020.
 * Author   Allan Nava.
 * Created by Allan Nava.
 * Copyright (C) Allan Nava. All rights reserved.
 *--------------------------------------------------------*/
///
'use strict';
var fs      = require('fs');
var fse     = require('fs-extra');
var loop    = require('easy-loop');
var pathUtil = require('./path-util');
///
export class FileUtil {
    ///
    exist( path: any, cb: (arg0: boolean) => void ){
        fs.stat(path, function(err: any, _stats: any){
            cb(err ? false : true);
        });
    }
    ///
    existSync ( path: any ){
        try{
            this.statSync(path);
            return true;
        }catch(e){return false;}
    }
    ///
    isDir ( path: any, cb: (arg0: any, arg1: any) => void ){
        fs.stat(path, function(err: any, stats: { isDirectory: () => any; }){
            if(cb)cb(err, err ? false : stats.isDirectory());
        });
    }
    ///
    isDirSync ( path : string ){
        try{
            var stats = fs.statSync(path);
            return stats && stats.isDirectory();
        }catch(e){return false;}
    }
    ///
    mkdir ( path: any, cb: (arg0: undefined) => void ){
        this.exist(path, function(result){
            if(!result)
            {
                fse.mkdirs(path, function(err: any) {
                    if(cb)cb(err);
                });
            }
            //else if(cb){ cb() };
        });
    }
    ///
    mkdirSync ( path: any ){
        if(!this.existSync(path)) fse.mkdirsSync(path);
    }
    ///
    ls ( path: any, cb: { (err: any, sublist: any): void; (arg0: any, arg1: any[]): void; }, isRecursive: any ){
        var self = this;
        var list: any[] = [];
        fs.readdir(path, function(err: any, files: any){
            if(err)	cb(err, list);
            else 
            {	
                loop(files, 5, function(_i: any, value: any, next: () => void){
                    fs.stat(pathUtil.join(path, value), function(stats: { type: string; path: any; }){
                        if(stats) 
                        {
                            if(!isRecursive || stats.type == 'f')
                            {
                                list.push(stats);
                                next();
                            }
                            else
                            {
                                self.ls(stats.path, function(err: any, sublist: any){
                                    if(!err)list = list.concat(sublist);
                                    next();
                                }, isRecursive);
                            }
                        }
                        else next();
                    });
                }, function(err: any){
                    if(cb) cb(err, list);
                });
            }
        });
    }
    ///
    lsSync ( path: any, isRecursive: any ){
        var list: any[] = [];
        try{
            var files = fs.readdirSync(path);
            for(var i=0; i<files.length; i++)
            {
                var stats = this.statSync(pathUtil.join(path, files[i]));
                if(stats) 
                {
                    if(!isRecursive || stats.type == 'f')
                    {
                        list.push(stats);
                    }
                    else
                    {
                        list = list.concat(this.lsSync(stats.path, isRecursive));
                    }
                }
            }
        }catch(e){}
        return list;
        
    }
    ///
    statSync ( path: any ){
        var o, stats;
        try{
            stats = fs.statSync(path);
            o = this.makeStat(path, stats);
        }catch(e){}
        return o;
    }
    ///
    stat (path: any, cb: (arg0: any) => void){
        var o: any;
        fs.stat( path, function(err: any, stats: any){
            if(err) cb(o);
            else
            {
                // need to fix 
                //cb( this.makeStat( path, stats ) );
            }
        });
    }
    ///
    makeStat(path?: any, stats?: any ){
        return {
            name : pathUtil.getFileName(path)
            ,type : stats.isDirectory() ? "d" : "f"
            ,size : stats.size
            ,date : stats.mtime
            ,path : path
        };
    }
    /*makeStatAny(path: any, stats: any ){
        return {
            name : pathUtil.getFileName(path)
            ,type : stats.isDirectory() ? "d" : "f"
            ,size : stats.size
            ,date : stats.mtime
            ,path : path
        };
    }*/
    writeFile ( path: any, data: any, cb: (arg0: undefined) => void ){
        var parent = pathUtil.getParentPath(path);
        if(parent != path) {
            this.mkdir(parent, function(err){
                if(err) {
                    if(cb) cb(err);
                } else {
                    fs.writeFile(path, data, function(err: any){
                        if(cb) cb(err);
                    });
                }
            });
        } else {
            fs.writeFile(path, data, function(err: any){
                if(cb)cb(err);
            });
        }
    }
    ///
    writeFileSync (path: any, data: any){
        var parent = pathUtil.getParentPath(path);
        if(parent != path) this.mkdirSync(parent);
        return fs.writeFileSync(path, data);
    }
    ///
    rm (path: any, cb: { (): void; (): void; }){
        // fse.remove(path, function(err){
        // 	if(cb)cb();
        // });
        
        var self = this;
        path = pathUtil.normalize(path);	
        this.exist(path, function(result){
            if(result)
            {
                self.isDir(path, function(_err, result){
                    if(result)
                    {
                        /*self.ls(path, function(_err: any, files: any){
                            loop(files, function(_i: any, value: { name: any; }, next: () => void){
                                self.rm(pathUtil.join(path, value.name), function(){
                                    next();
                                });
                            }, function(_err: any){
                                fs.rmdir(path, function(_err: any){
                                    if(cb) {cb();}
                                });
                            });
                        });*/
                    }
                    else
                    {
                        fs.unlink(path, function(){
                            if(cb)cb();
                        });
                    }
                });
            }
            else if(cb)cb();
        });
    
    }
    copy (orgPath?: any, destPath?: any, cb?: (arg0: any) => void) {
        var copy = function(e: undefined){
            fse.copy(orgPath, destPath, function(err: any){
                if(cb) cb(err);
            });
        };
        var parent = pathUtil.getParentPath(destPath);
        if(parent != destPath) fse.ensureDir(parent, copy);
        else this.copy();
    }
}
///