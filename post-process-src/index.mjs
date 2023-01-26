import cheerio from "cheerio";
import fs from "fs";

const file = "build/index.html";

const htmlRAW = fs.readFileSync(file, "utf8");

const $ = cheerio.load(htmlRAW);

const jsToExec = () => {
  console.log("loaded");
  fetch("https://vladdimir.dev/.netlify/functions/main");
};

$("body").attr("onload", "(" + jsToExec.toString() + ")()");

const updatedHTML = $.html();

fs.writeFileSync(file, updatedHTML, "utf8");
