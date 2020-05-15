/*---------------------------------------------------------
 * Mailgun Upload Template VSCode
 *
 * crypto-util.ts
 * Created  15/05/2020.
 * Updated  15/05/2020.
 * Author   Allan Nava.
 * Created by Allan Nava.
 * Copyright (C) Allan Nava. All rights reserved.
 *--------------------------------------------------------*/
///
'use strict';
import * as crypto 	from 'crypto';
import * as fs      from 'fs';
import * as path    from 'path';
///
export class CryptoUtil {
    private privateKey: string;
    private publicKey: string;
    private enabled: boolean;

    constructor() {
      this.privateKey   = fs.readFileSync(path.join(__dirname, "key.pub")).toString();
      this.publicKey    = fs.readFileSync(path.join(__dirname, "key")).toString();
      this.enabled      = true;
    }
  
    isEnabled(): boolean {
      return this.enabled;
    }
  
    encrypt(plaintext: string): string {
      if (!this.enabled)
        return plaintext;
  
      let buffer = new Buffer(plaintext);
      let encrypted = crypto.privateEncrypt(this.privateKey, buffer);
  
      return encrypted.toString('base64');
    }
  
    decrypt(cypher: string): string {
      if (!this.enabled)
        return cypher;
  
      let buffer    = Buffer.from(cypher, 'base64');
      let plaintext = crypto.publicDecrypt(this.publicKey, buffer);
  
      return plaintext.toString('utf8');
    }
  }