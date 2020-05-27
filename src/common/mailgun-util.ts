/*---------------------------------------------------------
 * Mailgun Upload Template VSCode
 *
 * mailgun-util.ts
 * Created  14/05/2020.
 * Updated  27/05/2020.
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
  domain: String;
  apiKey: String;
  requests : Api;
  ///
  constructor ( domain: String, apiKey : String ) {
    if (!apiKey) {
      throw new Error('apiKey value must be defined!');
    }
    this.apiKey = apiKey;
    this.domain = domain;
    //("api", "YOUR_API_KEY")
    this.requests = new Api();
    // need to be added the api key for all requests
  }
  ///
  getContent(uri : Uri){
    // need to implement this method
    //getTextDocument(uri);
    
  }
  ///
  uploadTemplate(){
    let data = this.requests.post(
      `https://api.mailgun.net/v3/${this.domain}/templates`, );
      //auth=("api", "YOUR_API_KEY"),
      //data={'name': 'template.name',
      //      'description': 'template description'})
    return data;
  }
}
///