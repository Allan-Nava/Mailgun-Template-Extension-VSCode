/*---------------------------------------------------------
 * Mailgun Upload Template VSCode
 *
 * index.ts
 * Created  21/05/2020.
 * Updated  11/06/2020.
 * Author   Allan Nava.
 * Created by Allan Nava.
 * Copyright (C) Allan Nava. All rights reserved.
 *--------------------------------------------------------*/
///
export function getConfigTemplate(apiKey : string, domain : string): string {
    return getDefaultConfigTemplate(apiKey, domain);
}
function getDefaultConfigTemplate(apiKey : string, domain : string) {
return `{
  "API_KEY": "${apiKey}",
  "DOMAIN": "${domain}"
}
`;
}
///