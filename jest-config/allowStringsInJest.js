//just save a copy of this script under ./scripts/

const fs = require("fs");

/** returns an arrays with as many indexes as "target" appeards on input */
const findIndexes = (input, target) => {
  const indexes = [];
  var currentIndex = 0;
  while (currentIndex < input.length) {
    currentIndex = input.indexOf(target, currentIndex)
    if (currentIndex >= 0) {
      indexes.push(currentIndex)
      currentIndex++
    }
    else {
      currentIndex = input.length
    }
  }
  return indexes
}

const config = JSON.parse(fs.readFileSync("./config/config.json").toString());
const targetLang = "en-us"

/** create a folder in node_modules, with an exportable string loc Js object created "gulp build" 
* please ensure you define an existing language ( usually "en-us" is fine )
*/
Object.keys(config.localizedResources).forEach((stringModule, index) => {
  const stringModuleFilePath = Object.values(config.localizedResources)[index].replace("{locale}", targetLang)
  const stringModuleFolder = `node_modules/${stringModule}`
  if (!fs.existsSync(stringModuleFolder)) {
    fs.mkdirSync(stringModuleFolder);
  }
  const fileRawContent = fs.readFileSync(stringModuleFilePath, "utf8");
  const secondOpenCurlyBracket = findIndexes(fileRawContent, "{")[1]
  let fileUsefulContent = fileRawContent.slice(secondOpenCurlyBracket + 1)
  fileUsefulContent = fileUsefulContent.slice(0, fileUsefulContent.indexOf("}"))
  fs.writeFileSync(`node_modules/${stringModule}/index.js`, `module.exports = {${fileUsefulContent}}`);
  fs.writeFileSync(`node_modules/${stringModule}/package.json`, `{"name":"${stringModule.toLowerCase()}","main":"index.js"}`);
});