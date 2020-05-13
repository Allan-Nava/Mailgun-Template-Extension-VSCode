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
'use strict';
import crypto = require('crypto');
///
export class CommonUtil {
    ///
    lpad ( n : number ){
        return n < 10 ? "0" + n : n;
    }
    ///
    getNow(){
        var d = new Date();
        return d.getFullYear() + "-" + this.lpad(d.getMonth()+1) + "-" + this.lpad(d.getDate()) + " " + this.lpad(d.getHours()) + ":" + this.lpad(d.getMinutes()) + ":" + this.lpad(d.getSeconds()); 
    }
    ///
    md5( str : string ){
        const hash = crypto.createHash('md5');
        hash.update(str);
        return hash.digest('hex');
    }  
    ///
}
///