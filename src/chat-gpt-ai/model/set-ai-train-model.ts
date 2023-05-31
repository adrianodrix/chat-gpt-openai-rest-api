import { IsString,  IsNotEmpty} from "class-validator"
import { ChatCompletionRequestMessage } from "openai";

export class SetAITrainModel {
    messages: Array<ChatCompletionRequestMessage>
}
