const auth = {
  username: "sunilhari",
  password: "personal access token"
};
const express = require("express");
const axios = require("axios");
const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get("/", (request, response) => {
  response.send("Star-Gazer Here ...");
});
app.post("/", (request, response) => {
  console.log(request.body.queryResult.parameters);
  const { organization, repository } = request.body.queryResult.parameters;
  axios(`https://api.github.com/repos/${organization}/${repository}`, {
    auth
  })
    .then(res => {     
      const {
        description,
        stargazers_count,
        language,
        html_url,
        organization: { avatar_url }
      } = res.data;
      response.json({
        fulfillmentText: `${repository} has ${stargazers_count} stars on github.To briefly descirbe about the project ${repository} is ${description}`,
        fulfillmentMessages: [
          {
            card: {
              title: `${repository} (${stargazers_count})`,
              subtitle: `${description}`,
              imageUri: avatar_url,
              buttons: [
                {
                  text: `${repository}`,
                  postback: `${html_url}`
                }
              ]
            }
          }
        ],
        source: "github",
        payload: {
          google: {
            expectUserResponse: false,
            richResponse: {
              items: [
                {
                  simpleResponse: {
                    textToSpeech: `${repository} has ${stargazers_count} stars on github.To briefly descirbe about the project ${repository} is ${description}`
                  }
                }
              ]
            }
          }
        }
      });
    })
    .catch(() => {
      console.log("Error")
    });
});
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
