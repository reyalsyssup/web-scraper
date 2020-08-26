const express = require("express"),
app = express(),
axios = require("axios"),
cheerio = require("cheerio");

const sites = require("./sites");
const PORT = process.env.PORT || 3000;

let stories = [];

axios(sites[0]).then(res => {
    const html = res.data;
    // unlike jquery, you have to guive cheerio the html
    const $ = cheerio.load(html);
    $(".story-block").each((index, value) => {
        let heading = $(value).find("a").text();
        let link = $(value).find("a").attr("href");
        stories.push({
            heading: heading,
            link: link
        });
    });
}).catch(error => console.log(error));

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
    res.render("index", {stories: stories});
});

app.listen(PORT, console.log(`Server listening on http://localhost:${PORT}`));