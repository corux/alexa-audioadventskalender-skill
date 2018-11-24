import { DefaultApiClient, SkillBuilders } from "ask-sdk-core";
import {
    AmazonFallbackIntentHandler,
    AmazonHelpIntentHandler,
    AmazonResumeIntentHandler,
    AmazonStopIntentHandler,
    AmazonUnsupportedAudioPlayerIntentsHandler,
    AudioPlayerUnsupportedHandler,
    CustomErrorHandler,
    DateIntentHandler,
    SessionEndedHandler,
} from "./handlers";
import { LogInterceptor, TimezoneInterceptor } from "./interceptors";

export const handler = SkillBuilders.custom()
    .addRequestHandlers(
        new AudioPlayerUnsupportedHandler(),
        new AmazonUnsupportedAudioPlayerIntentsHandler(),
        new AmazonStopIntentHandler(),
        new AmazonResumeIntentHandler(),
        new AmazonHelpIntentHandler(),
        new AmazonFallbackIntentHandler(),
        new DateIntentHandler(),
        new SessionEndedHandler(),
    )
    .addErrorHandlers(
        new CustomErrorHandler(),
    )
    .addRequestInterceptors(
        new LogInterceptor(),
        new TimezoneInterceptor(),
    )
    .addResponseInterceptors(
        new LogInterceptor(),
    )
    .withApiClient(new DefaultApiClient())
    .lambda();
