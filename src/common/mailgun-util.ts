/*---------------------------------------------------------
 * Mailgun Upload Template VSCode
 *
 * mailgun-util.ts
 * Created  14/05/2020.
 * Updated  11/06/2020.
 * Author   Allan Nava.
 * Created by Allan Nava.
 * Copyright (C) Allan Nava. All rights reserved.
 *--------------------------------------------------------*/
///
import { Api } from "./api";
import { AxiosRequestConfig} from "axios";
import { Uri } from "vscode";
///
///
export class MailgunUtil {
  domain: string;
  apiKey: string;
  requests : Api;
  ///
  constructor ( domain: string, apiKey : string ) {
    if (!apiKey) {
      throw new Error('apiKey value must be defined!');
    }
    this.apiKey = apiKey;
    this.domain = domain;
    //("api", "YOUR_API_KEY")
    this.requests = new Api(  );
    // need to be added the api key for all requests
  }
  ///
  getContent(uri : Uri){
    // need to implement this method
    //getTextDocument(uri);
    
  }
  ///
  async uploadTemplate( content : string ){
    console.log(` uploadTemplate ${content}`);
    let response = await this.requests.post(
      `https://api.mailgun.net/v3/${this.domain}/templates`, 
      {
        auth: {
          username: "api",
          password: this.apiKey
        }
      }
      //config=("api", this.apiKey),
    );
      //data={'name': 'template.name',
      //      'description': 'template description'})
    console.log(` uploadTemplate status= ${response.status} | data = ${response.data}`);
    return response;
  }
}
///