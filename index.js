const express = require("express");
const axios = require("axios");
const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get("/", (request, response) => {
  response.send("Recipe Bot - Try a conversation to find your next meal");
});
app.post("/", (request, response) => {
  console.log(request.body.queryResult.parameters);
  const { ingredient } = request.body.queryResult.parameters;
  axios(`http://www.recipepuppy.com/api/?i=${ingredient}`)
    .then(res => {
      console.log(res);

      const { results } = res.data;
      response.json({
        fulfillmentText: `With ${ingredient} you can prepare below meals.`,
        // fulfillmentMessages: [
        //   {
        //     card: {
        //       title: `${repository} (${stargazers_count})`,
        //       subtitle: `${description}`,
        //       imageUri: avatar_url,
        //       buttons: [
        //         {
        //           text: `${repository}`,
        //           postback: `${html_url}`
        //         }
        //       ]
        //     }
        //   }
        // ],
        fulfillmentMessages: results.map(result => {
          const { title } = result;
          return {
            card: {
              title
            }
          };
        }),
        source: "github",
        payload: {
          google: {
            expectUserResponse: false,
            richResponse: {
              items: [
                {
                  simpleResponse: {
                    textToSpeech: `With ${ingredient} you can prepare below meals.`
                  }
                }
              ]
            }
          }
        }
      });
    })
    .catch(err => {
      console.log("Error", err);
    });
});
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
