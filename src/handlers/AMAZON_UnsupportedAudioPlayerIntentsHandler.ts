import { HandlerInput, RequestHandler } from "ask-sdk-core";
import { Response } from "ask-sdk-model";

export class AmazonUnsupportedAudioPlayerIntentsHandler implements RequestHandler {
  public canHandle(handlerInput: HandlerInput): boolean {
    const request = handlerInput.requestEnvelope.request;
    return request.type === "IntentRequest" &&
      [
        "AMAZON.LoopOffIntent",
        "AMAZON.LoopOnIntent",
        "AMAZON.PreviousIntent",
        "AMAZON.RepeatIntent",
        "AMAZON.ShuffleOffIntent",
        "AMAZON.ShuffleOnIntent",
      ].indexOf(request.intent.name) !== -1;
  }

  public handle(handlerInput: HandlerInput): Response {
    return handlerInput.responseBuilder
      .speak("Diesen Befehl verstehe ich nicht.")
      .withShouldEndSession(true)
      .getResponse();
  }
}
