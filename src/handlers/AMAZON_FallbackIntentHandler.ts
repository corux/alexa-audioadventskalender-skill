import { HandlerInput, RequestHandler } from "ask-sdk-core";
import { Response } from "ask-sdk-model";
import { AmazonHelpIntentHandler } from "./AMAZON_HelpIntentHandler";

export class AmazonFallbackIntentHandler implements RequestHandler {
  public canHandle(handlerInput: HandlerInput): boolean {
    const request = handlerInput.requestEnvelope.request;
    return request.type === "IntentRequest" && request.intent.name === "AMAZON.FallbackIntent";
  }

  public async handle(handlerInput: HandlerInput): Promise<Response> {
    return handlerInput.responseBuilder
      .speak(`Der evangelischer Adventskalender Skill kann dir dabei nicht helfen.
        Du kannst mich nach einem Datum fragen, um den Adventskalender zu öffnen.
        ${AmazonHelpIntentHandler.reprompt}`)
      .reprompt(AmazonHelpIntentHandler.reprompt)
      .withShouldEndSession(false)
      .getResponse();
  }
}
