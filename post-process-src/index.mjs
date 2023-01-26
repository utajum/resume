import cheerio from "cheerio";
import fs from "fs";

const file = "build/index.html";

const htmlRAW = fs.readFileSync(file, "utf8");

const $ = cheerio.load(htmlRAW);

const jsToExec = async () => {
  console.log("loaded");

  const response = await fetch("https://vladdimir.dev/.netlify/functions/main")
    .then((response) => {
      return response.json();
    })
    .then((data) => data);

  console.log(response);

  const { HOST, ...dataToShow } = response;

  response &&
    document.getElementsByClassName("container")[0].insertAdjacentHTML(
      "beforeend",
      `<div id='client-info' style="border-top: 1px solid #ddd;">
        <h4>Your info:</h4>
        <pre style="max-width: 75%;">${JSON.stringify(
          dataToShow,
          null,
          4
        )}</pre>
      </div>
    `
    );
};

$("body").attr("onload", "(" + jsToExec.toString() + ")()");

const updatedHTML = $.html();

fs.writeFileSync(file, updatedHTML, "utf8");
