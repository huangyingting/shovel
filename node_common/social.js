import * as Environment from "~/node_common/environment";
import * as ScriptLogging from "~/node_common/script-logging";
import * as Strings from "~/common/strings";

import { IncomingWebhook } from "@slack/webhook";

// NOTE(jim): #fil-slate-textile-api
const textileURL = `https://hooks.slack.com/services/${Environment.TEXTILE_SLACK_WEBHOOK_KEY}`;
const textileWebhook = new IncomingWebhook(textileURL);

export const sendTextileSlackMessage = ({
  user = { username: "UNDEFINED" },
  message,
  functionName,
  code,
  file,
}) => {
  if (Strings.isEmpty(Environment.TEXTILE_SLACK_WEBHOOK_KEY)) {
    return;
  }

  const userProfileURL = `https://slate.host/${user.username}`;
  const userURL = `<${userProfileURL}|${user.username}>`;
  const source = `${Environment.SOURCE}`;
  const fileURL = `https://github.com/filecoin-project/slate/blob/main/${file}`;
  const slackFileURL = `<${fileURL}|${file}>`;

  try {
    textileWebhook.send({
      text: `*Source code —* ${slackFileURL} \n*Source client —* ${source} \n*Callsite —* \`${functionName}\`\n*User —* ${userURL}\n\n> ${message}\n\n*Textile error code —* ${code}`,
    });
  } catch (e) {
    ScriptLogging.error("SHOVEL          ", e.message);
  }
};
