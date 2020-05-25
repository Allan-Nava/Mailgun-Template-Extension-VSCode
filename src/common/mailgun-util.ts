/*---------------------------------------------------------
 * Mailgun Upload Template VSCode
 *
 * mailgun-util.ts
 * Created  14/05/2020.
 * Updated  14/05/2020.
 * Author   Allan Nava.
 * Created by Allan Nava.
 * Copyright (C) Allan Nava. All rights reserved.
 *--------------------------------------------------------*/
///
///
export class MailgunUtil {
    domain: string;
    publicApiKey: string;
    apiKey: string;
    auth: string;
    username: any;
    mute: any;
    timeout: any;
    host: any;
    endpoint: any;
    protocol: any;
    port: any;
    retry: any;
    testMode: any;
    testModeLogger: any;
    proxy: any;
    options: { host: any; endpoint: any; protocol: any; port: any; auth: any; proxy: any; timeout: any; retry: any; testMode: any; testModeLogger: any; };
    mailgunTokens: {};
    ///
    constructor ( options: any ) {
        if (!options.apiKey) {
          throw new Error('apiKey value must be defined!');
        }
        //this.domain = domain;
        this.username = 'api';
        this.apiKey = options.apiKey;
        this.publicApiKey = options.publicApiKey;
        this.domain = options.domain;
        this.auth = [this.username, this.apiKey].join(':');
        this.mute = options.mute || false;
        this.timeout = options.timeout;

        this.host = options.host || 'api.mailgun.net';
        this.endpoint = options.endpoint || '/v3';
        this.protocol = options.protocol || 'https:';
        this.port = options.port || 443;
        this.retry = options.retry || 1;

        this.testMode = options.testMode;
        this.testModeLogger = options.testModeLogger;

        if (options.proxy) {
        this.proxy = options.proxy;
        }

        this.options = {
            host: this.host,
            endpoint: this.endpoint,
            protocol: this.protocol,
            port: this.port,
            auth: this.auth,
            proxy: this.proxy,
            timeout: this.timeout,
            retry: this.retry,
            testMode: this.testMode,
            testModeLogger: this.testModeLogger
        };

        this.mailgunTokens = {};
    }
    ///
    getDomain ( method : string , resource : string ) {
        let d = this.domain;
        // filter out API calls that do not require a domain specified
        if ((resource.indexOf('/routes') >= 0) ||
          (resource.indexOf('/lists') >= 0) ||
          (resource.indexOf('/address') >= 0) ||
          (resource.indexOf('/domains') >= 0)) {
          d = '';
        } else if ((resource.indexOf('/messages') >= 0) &&
          (method === 'GET' || method === 'DELETE')) {
          d = `domains/${this.domain}`;
        }
        return d;
    }
    ///
    // getRequestOptions (resource) {
    //     let o = this.options;

    //     // use public API key if we have it for the routes that require it
    //     if ((resource.indexOf('/address/validate') >= 0 ||
    //         (resource.indexOf('/address/parse') >= 0)) &&
    //     this.publicApiKey) {
    //     const copy = Object.assign({}, this.options);

    //     copy.auth = [this.username, this.publicApiKey].join(':');
    //     o = copy;
    //     }

    //     return o;
    // }

    // request (method, resource, data, fn) {
    //     let fullpath = resource;
    //     const domain = this.getDomain(method, resource);

    //     if (domain) {
    //     fullpath = '/'.concat(domain, resource);
    //     }

    //     const req = new Request(this.options);

    //     return req.request(method, fullpath, data, fn);
    // }

    // post (path, data, fn) {
    //     const req = new Request(this.options)

    //     return req.request('POST', path, data, fn)
    // }

    // get (path, data, fn) {
    //     const req = new Request(this.options)

    //     return req.request('GET', path, data, fn)
    // }

    // delete (path, data, fn) {
    //     const req = new Request(this.options)

    //     return req.request('DELETE', path, data, fn)
    // }

    // put (path, data, fn) {
    //     const req = new Request(this.options)

    //     return req.request('PUT', path, data, fn)
    // }*/
}
///