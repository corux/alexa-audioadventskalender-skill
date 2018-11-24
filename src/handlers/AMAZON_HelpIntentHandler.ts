import { HandlerInput, RequestHandler } from "ask-sdk-core";
import { Response } from "ask-sdk-model";
import { getRemainingDays } from "../utils";

export class AmazonHelpIntentHandler implements RequestHandler {

  public static readonly reprompt = "Von welchem Tag möchtest du die Türe öffnen?";

  public static getHelpText() {
    const remainingDays = getRemainingDays();
    let text = "Dieser Skill spielt zu jedem Tag im Advent ein instrumentales Musikstück ab. ";
    if (remainingDays > 0) {
      if (remainingDays > 1) {
        text += `Es sind noch ${remainingDays} Tage bis zum 1. Dezember. `;
      } else {
        text += `Es ist noch ${remainingDays} Tag bis zum 1. Dezember. `;
      }
      text += "Dann gibt es das erste Lied.";
    } else {
      text += AmazonHelpIntentHandler.reprompt;
    }

    return text;
  }

  public canHandle(handlerInput: HandlerInput): boolean {
    const request = handlerInput.requestEnvelope.request;
    return request.type === "IntentRequest" && request.intent.name === "AMAZON.HelpIntent";
  }

  public async handle(handlerInput: HandlerInput): Promise<Response> {
    const remainingDays = getRemainingDays();
    const text = AmazonHelpIntentHandler.getHelpText();
    if (remainingDays > 0) {
      return handlerInput.responseBuilder
        .speak(text)
        .withShouldEndSession(true)
        .getResponse();
    }

    return handlerInput.responseBuilder
      .speak(text)
      .reprompt(AmazonHelpIntentHandler.reprompt)
      .withShouldEndSession(false)
      .getResponse();
  }
}
