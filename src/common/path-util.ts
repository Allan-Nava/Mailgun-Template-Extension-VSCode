/*---------------------------------------------------------
 * Mailgun Upload Template VSCode
 *
 * path-util.ts
 * Created  13/05/2020.
 * Updated  14/05/2020.
 * Author   Allan Nava.
 * Copyright (C) Allan Nava. All rights reserved.
 *--------------------------------------------------------*/
///
'use strict';
import path = require('path');
///
export class PathUtil {
    ///
    getFileName ( p : string ) {
        return path.basename(p);
    };
    ///
    getParentPath ( p : string ) {
        return path.dirname(p);
    };
    ///
    normalize ( p : string ) {
        return path.normalize(p).replace(/\\/g, '/');
    };
    ///
    join(){
        var p = "";
        for(var i=0; i<arguments.length; i++){
          p = path.join(p, arguments[i]);
        }
        return this.normalize(p);
    };
    ///
    parse ( p : string ){
        return path.parse(p);
    };
    ///
    getRelativePath ( base : string , path : string ){
        if(path.indexOf(base) === 0)
        {
          return path.substring(base.length);
        }
        else return path;
    };
    ///
}
///