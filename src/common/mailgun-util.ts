/*---------------------------------------------------------
 * Mailgun Upload Template VSCode
 *
 * mailgun-util.ts
 * Created  14/05/2020.
 * Updated  29/08/2020.
 * Author   Allan Nava.
 * Created by Allan Nava.
 * Copyright (C) Allan Nava. All rights reserved.
 *--------------------------------------------------------*/
///
import { Api } from "./api";
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
  async uploadTemplate( content : string , templateName : string ){
    console.log(` uploadTemplate ${content} | template`);
    let data = {
              'name': `${templateName}`,
              'description': 'template description',
              'template': content,
            };
    /*const data = new FormData();
    data.append('name', `${templateName}`);
    data.append('description', 'template description');
    data.append('template', content );*/
    ///
    let config = {
      auth: {
        username: "api",
        password: this.apiKey
      },
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
        //'Content-Type': 'application/json'
      }
    };
    console.log(`data=${JSON.stringify(data)} | config ${JSON.stringify(config)}`);
    return await this.requests.post(
      `https://api.mailgun.net/v3/${this.domain}/templates`, 
      data,
      config,
    ).then(function (response) {
      console.log(`response= ${response} | ${response.data} | ${response.config}`);
      return response;
      //return response;
    })
    .catch(function (error) {
      console.log(`error= ${error}`);
      return error;
      //return error;
    });
  }
}
///