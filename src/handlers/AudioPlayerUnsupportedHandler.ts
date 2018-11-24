import { HandlerInput, RequestHandler } from "ask-sdk-core";
import { Response } from "ask-sdk-model";

export class AudioPlayerUnsupportedHandler implements RequestHandler {
  public canHandle(handlerInput: HandlerInput): boolean {
    const request = handlerInput.requestEnvelope.request;
    return [
      "AudioPlayer.PlaybackStarted",
      "AudioPlayer.PlaybackFinished",
      "AudioPlayer.PlaybackStopped",
      "AudioPlayer.PlaybackFailed",
      "AudioPlayer.PlaybackNearlyFinished",
    ].indexOf(request.type) !== -1;
  }

  public handle(handlerInput: HandlerInput): Response {
    return handlerInput.responseBuilder.getResponse();
  }
}
