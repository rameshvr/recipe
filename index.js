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
      const fullfilCards = results.map(result => {
        const { title, ingredients } = result;
        return {
          card: {
            title,
            subtitle: ingredients
          }
        };
      });

      const RecipeCards = results.map(result => {
        const { title, ingredients, href, thumbnail } = result;
        return {
          title,
          description: ingredients,
          image: {
            url: thumbnail.replace("http", "https"),
            accessibilityText: title
          },
          openUrlAction: {
            url: href.replace("http", "https")
          }
        };
      });

      const googleCards = [
        {
          simpleResponse: {
            textToSpeech: `With ${ingredient} you can prepare below meals.`
          }
        },
        {
          carouselBrowse: {
            items: RecipeCards
          }
        }
      ];

      response.json({
        fulfillmentText: `With ${ingredient} you can prepare below meals.`,
        fulfillmentMessages: fullfilCards,
        source: "",
        payload: {
          google: {
            expectUserResponse: true,
            richResponse: {
              items: googleCards
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
