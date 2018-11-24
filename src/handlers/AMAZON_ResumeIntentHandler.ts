import { HandlerInput, RequestHandler } from "ask-sdk-core";
import { IntentRequest, Response } from "ask-sdk-model";
import { DateTime } from "luxon";
import { getAdventskalender } from "../utils";

export class AmazonResumeIntentHandler implements RequestHandler {
  public canHandle(handlerInput: HandlerInput): boolean {
    const request = handlerInput.requestEnvelope.request;

    return request.type === "IntentRequest" &&
      [
        "AMAZON.StartOverIntent",
        "AMAZON.ResumeIntent",
        "AMAZON.NextIntent",
      ].indexOf(request.intent.name) !== -1;
  }

  public async handle(handlerInput: HandlerInput): Promise<Response> {
    if (handlerInput.requestEnvelope.context.AudioPlayer) {
      const token = handlerInput.requestEnvelope.context.AudioPlayer.token;
      const tokenDate = new Date(token);
      if (tokenDate) {
        const date = DateTime.fromJSDate(tokenDate);
        const data = getAdventskalender(date);
        let offset = 0;
        const intentName = (handlerInput.requestEnvelope.request as IntentRequest).intent.name;
        if (intentName !== "AMAZON.StartOverIntent") {
          // resume playback with 10sec rewind
          const previousOffset = handlerInput.requestEnvelope.context.AudioPlayer.offsetInMilliseconds;
          offset = Math.max(0, previousOffset - 10000);
        }
        return handlerInput.responseBuilder
          .addAudioPlayerPlayDirective("REPLACE_ALL", data.audioUrl, date.toFormat("yyyy-LL-dd"), offset, undefined, {
            backgroundImage: {
              sources: [
                {
                  url: data.imageUrl,
                },
              ],
            },
            title: data.title,
          })
          .withShouldEndSession(true)
          .getResponse();
      }
    }

    return handlerInput.responseBuilder
      .withShouldEndSession(true)
      .getResponse();
  }
}
