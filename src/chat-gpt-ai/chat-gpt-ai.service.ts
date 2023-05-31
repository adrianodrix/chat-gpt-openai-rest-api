import { Injectable } from '@nestjs/common';
import { Configuration, OpenAIApi, CreateCompletionRequest, CreateChatCompletionRequest } from "openai";
import { GetAIModelAnswer } from './model/get-ai-model-answer';
import { SetAITrainModel } from './model/set-ai-train-model';

const DEFAULT_MODEL_ID = "text-davinci-003"
const DEFAULT_TEMPERATURE = 0.9
const DEFAULT_MAX_TOKENS = 2048

@Injectable()
export class ChatGptAiService {
    private readonly openAiApi:OpenAIApi
    private selectedModelId:string|undefined

    constructor(){
        const configuration = new Configuration({
            organization: process.env.OPENAI_ORGANIZATION_ID,
            apiKey: process.env.OPENAI_API_KEY,
        });

        this.openAiApi = new OpenAIApi(configuration);
    }

    cleanModelId(modelId:string){
        if(modelId.includes(":")){
            modelId = modelId.replace(":", '-')
        }
        return modelId
    }

    setModelId(modelId:string){
        this.selectedModelId = this.cleanModelId(modelId)
    }

    async listModels() {
        const models = await this.openAiApi.listModels()
        return models.data
    }

    async getModelAnswer(input:GetAIModelAnswer){
        try {
            const { question, temperature, modelId, maxTokens } = input

            let model = DEFAULT_MODEL_ID
            if(modelId){
                model = modelId
            } else if (this.selectedModelId){
                model = this.selectedModelId
            }

            const params:CreateCompletionRequest = {
                prompt:question,
                model:this.cleanModelId(model),
                temperature:temperature!=undefined?temperature:DEFAULT_TEMPERATURE,
                max_tokens:maxTokens??DEFAULT_MAX_TOKENS
            }

            const response = await this.openAiApi.createCompletion(params);

            const {data} = response
            if(data.choices.length) {
                return data.choices
            }
            
            return data;

        } catch (error) {
            if (error.response) {
                console.log(error.response.status);
                console.log(error.response.data);
              } else {
                console.log(error.message);
              }
        }
    }

    async trainModel(input:SetAITrainModel){
        try {
            const { messages } = input

            const params:CreateChatCompletionRequest = {
               model:'gpt-3.5-turbo-0301',
               messages
            }

            const response = await this.openAiApi.createChatCompletion(params)
            return response.data

        } catch (error) {
            if (error.response) {
                console.log(error.response.status);
                console.log(error.response.data);
              } else {
                console.log(error.message);
              }
        }
    }
}
