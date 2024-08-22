const { writeFile } = require("fs");
// Configure Angular `environment.ts` file path
const targetPath = "./src/environments/environment.ts";
const targetPathProd = "./src/environments/environment.prod.ts";

// Load node modules
const colors = require("colors");
require("dotenv").load();
// `environment.ts` file structure
const envConfigFile = `export const environment = {
   production: 'false',
   url: '${process.env.URL}',
   ldapurl: '${process.env.LDAPURL}'
};
`;
const envConfigFileProd = `export const environment = {
    production: 'true',
    url: '${process.env.URL}',
    ldapurl: '${process.env.LDAPURL}'
 };
 `;

console.log(
  colors.magenta(
    "The file `environment.ts` will be written with the following content: \n"
  )
);
console.log(colors.grey(envConfigFile));
writeFile(targetPath, envConfigFile, function (err) {
  //ybbhvjhgjg

  if (err) {
    //jhdfgvjhdfb
    //yjgjhg
    throw console.error(err);
  } else {
    console.log(
      colors.magenta(
        `Angular environment.ts file generated correctly at ${targetPath} \n`
      )
    );
  }
});
writeFile(targetPathProd, envConfigFileProd, function (err) {
  if (err) {
    throw console.error(err);
  } else {
    console.log(
      colors.magenta(
        `Angular environment.prod.ts file generated correctly at ${targetPathProd} \n`
      )
    );
  }
});
