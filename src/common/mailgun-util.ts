/*---------------------------------------------------------
 * Mailgun Upload Template VSCode
 *
 * mailgun-util.ts
 * Created  14/05/2020.
 * Updated  12/06/2020.
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
  uploadTemplate( content : string , templateName : string ){
    console.log(` uploadTemplate ${content} | template`);
    let data = {
              'name': `template.${templateName}`,
              'description': 'template description',
              'template': content,
              'engine': 'handlebars',
              'comment': 'version comment'
            };
    console.log(`data=${JSON.stringify(data)}`);
    this.requests.post(
      `https://api.mailgun.net/v3/${this.domain}/templates`, 
      data,
      {
        auth: {
          username: "api",
          password: this.apiKey
        }
      }
      //config=("api", this.apiKey),
    ).then(function (response) {
      console.log(`response= ${response}`);
      return response;
    })
    .catch(function (error) {
      console.log(`error= ${error}`);
      return error;
    });
    //console.log(` uploadTemplate status= ${response.status} | data = ${response.data}`);
    //return response;
  }
}
///