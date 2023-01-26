import cheerio from "cheerio";
import fs from "fs";

const file = "build/index.html";

const htmlRAW = fs.readFileSync(file, "utf8");

const $ = cheerio.load(htmlRAW);

const jsToExec = async () => {
  console.log("loaded");

  const getPlatform = () => {
    if (
      typeof navigator.userAgentData !== "undefined" &&
      navigator.userAgentData != null
    ) {
      return navigator.userAgentData.platform;
    }
    // Deprecated but still works for most of the browser
    if (typeof navigator.platform !== "undefined") {
      if (
        typeof navigator.userAgent !== "undefined" &&
        /android/.test(navigator.userAgent.toLowerCase())
      ) {
        return "android";
      }
      return navigator.platform;
    }
    return "unknown";
  };

  const platform = getPlatform();

  console.log(platform);

  const response = await fetch(
    "https://vladdimir.dev/.netlify/functions/main",
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ platform }),
    }
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => data);

  console.log(response);

  const { HOST, ...dataToShow } = response;

  dataToShow.PLATFORM = platform;

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
