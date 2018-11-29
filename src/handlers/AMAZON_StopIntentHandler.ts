import { HandlerInput, RequestHandler } from "ask-sdk-core";
import { Response } from "ask-sdk-model";

export class AmazonStopIntentHandler implements RequestHandler {
  public canHandle(handlerInput: HandlerInput): boolean {
    const request = handlerInput.requestEnvelope.request;
    return request.type === "PlaybackController.PauseCommandIssued"
      || request.type === "IntentRequest"
      && [
        "AMAZON.CancelIntent",
        "AMAZON.StopIntent",
        "AMAZON.PauseIntent",
      ].indexOf(request.intent.name) !== -1;
  }

  public handle(handlerInput: HandlerInput): Response {
    return handlerInput.responseBuilder
      .addAudioPlayerStopDirective()
      .withShouldEndSession(true)
      .getResponse();
  }
}
