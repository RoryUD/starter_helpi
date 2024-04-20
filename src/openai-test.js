import OpenAIAPi from "openai";

const APIKey = "API_KEY_HERE";

const openai = new OpenAIAPi({ apiKey: APIKey, dangerouslyAllowBrowser: true });
export let completion;

async function main() {
  completion = await openai.chat.completions.create({
    messages: [
      { "role": "system", "content": "You are a helpful assistant designed to output JSON." },
      { "role": "user", "content": "Who won the world series in 2020?" }
    ],
    model: "gpt-3.5-turbo",
    response_format: { "type": "json_object" }
  });

  console.log(completion.choices[0]);
  console.log(completion.choices[0].message.content);
}

main();