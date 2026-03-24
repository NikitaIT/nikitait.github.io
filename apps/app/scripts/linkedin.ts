import { writeFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import { getAbsPath } from "./path";

const template = `
<script src="https://platform.linkedin.com/badges/js/profile.js" async defer type="text/javascript"></script>

<div class="badge-base LI-profile-badge" data-locale="en_US" data-size="medium" data-theme="light" data-type="VERTICAL" data-vanity="nikita-fedorov-041243126" data-version="v1"><a class="badge-base__link LI-simple-link" href="https://pl.linkedin.com/in/nikita-fedorov-041243126?trk=profile-badge">Nikita Fedorov</a></div>
`;

const dom = new JSDOM(template, {
  runScripts: "dangerously",
  resources: "usable",
  pretendToBeVisual: true,
  url: "https://example.com/", // Set a base URL for relative links
});
dom.window.onload = () => {
  setTimeout(() => {
    // Wait for scripts to finish running, adjust delay as necessary
    const outerHTML = dom.serialize();

    const filePath = `../public/github-stats/linkedin-badge.html`;
    const path = getAbsPath(filePath);
    // Save the static HTML to a file
    writeFileSync(path, outerHTML, "utf-8");
    console.log("LinkedIn badge prerendered to linkedin-badge.html");
  }, 1000); // 10-second delay; adjust as needed based on observation
};
