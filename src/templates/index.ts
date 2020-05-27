/*---------------------------------------------------------
 * Mailgun Upload Template VSCode
 *
 * index.ts
 * Created  21/05/2020.
 * Updated  27/05/2020.
 * Author   Allan Nava.
 * Created by Allan Nava.
 * Copyright (C) Allan Nava. All rights reserved.
 *--------------------------------------------------------*/
///
export function getConfigTemplate(): string {
    return getDefaultConfigTemplate();
}
function getDefaultConfigTemplate() {
  return `
{
  "API_KEY": "MY_API_KEY_MAILGUN",
  "DOMAIN": "mg@example.com"
}
`;
}
///