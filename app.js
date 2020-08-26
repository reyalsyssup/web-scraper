const express = require("express"),
app = express(),
axios = require("axios"),
cheerio = require("cheerio");

const sites = require("./sites");
const PORT = process.env.PORT || 3000;

let stories = [];

// axios only works for sites that don't need their js to load
// if they need js to load, like a react app, then you can use puppeteer instead of axios
axios(sites[0]).then(res => {
    const html = res.data;
    // unlike jquery, you have to guive cheerio the html
    const $ = cheerio.load(html);
    $(".story-block").each((index, value) => {
        let heading = $(value).find("a").text();
        let link = $(value).find("a").attr("href");
        // some links go to a new route, dont have an https, so this is my fix
        if(link && (link[0] === "\\" || link[0] == "/")) link = "https://news.com.au"+link;
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