import { HandlerInput, RequestHandler } from "ask-sdk-core";
import { Response } from "ask-sdk-model";
import { DateTime } from "luxon";
import { getAdventskalender, getRemainingDays } from "../utils";
import { AmazonHelpIntentHandler } from "./AMAZON_HelpIntentHandler";

export class DateIntentHandler implements RequestHandler {
  public canHandle(handlerInput: HandlerInput): boolean {
    const request = handlerInput.requestEnvelope.request;
    return request.type === "IntentRequest" && request.intent.name === "DateIntent"
      || request.type === "LaunchRequest";
  }

  public async handle(handlerInput: HandlerInput): Promise<Response> {
    const today = DateTime.local().set({
      day: DateTime.local().day,
      month: DateTime.local().month,
      year: DateTime.local().year,
    });
    let date = today;
    let isDateFromSlot = false;
    if (handlerInput.requestEnvelope.request.type === "IntentRequest") {
      const slotValue = handlerInput.requestEnvelope.request.intent.slots.date.value;
      const slotDate = Date.parse(slotValue);
      if (slotDate) {
        date = DateTime.fromMillis(slotDate);
        isDateFromSlot = true;
      }
    }

    const isDateInFuture = false && date.diff(today, "days").days > 1;
    const isDateInAdvent = date.month === 12 && date.day <= 24;
    if (isDateInFuture && isDateInAdvent) {
      return handlerInput.responseBuilder
        .speak(`Du hast ein Datum in der Zukunft gewählt.
          Es kann nur der heutige Tag oder vergangene Tage gewählt werden.
          Bitte wähle einen anderen Tag.`)
        .withShouldEndSession(false)
        .getResponse();
    } else if (!isDateInAdvent) {
      if (isDateFromSlot) {
        return handlerInput.responseBuilder
          .speak(`Der gewählte Tag liegt nicht im Advent.
            Bitte wähle einen Tag zwischen dem 1. und dem 24. Dezember.`)
          .withShouldEndSession(false)
          .getResponse();
      } else {
        const remainingDays = getRemainingDays();
        if (remainingDays > 0) {
          return handlerInput.responseBuilder
            .speak(AmazonHelpIntentHandler.getHelpText())
            .withShouldEndSession(true)
            .getResponse();
        } else {
          return handlerInput.responseBuilder
            .speak(`Die Adventszeit ist vorrüber.
              Du kannst dir die Musikstücke auch nachträglich anhören, indem du nach einem Datum frägst.
              ${AmazonHelpIntentHandler.reprompt}`)
            .reprompt(AmazonHelpIntentHandler.reprompt)
            .withShouldEndSession(false)
            .getResponse();
        }
      }
    }

    const data = getAdventskalender(date);
    let text = "Hier ist das Lied ";
    if (Math.floor(date.diff(today, "days").days) === -1) {
      text += "von gestern";
    } else if (Math.floor(date.diff(today, "days").days) === 0) {
      text += "von heute";
    } else {
      text += `vom <say-as interpret-as="date">????${date.toFormat("LLdd")}</say-as>.`;
    }
    return handlerInput.responseBuilder
      .speak(text)
      .addAudioPlayerPlayDirective("REPLACE_ALL", data.audioUrl, date.toFormat("yyyy-LL-dd"), 0, undefined, {
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
