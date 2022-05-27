const { exec } = require("child_process");
const path = require("path")

let absolutePath = path.join(__dirname);
let pathToImageList = absolutePath + "\\myimages.imgdb-imglist.txt";
let pathToSaveDB = absolutePath + "/download/database.imgdb";
console.log(pathToImageList)
console.log(pathToSaveDB)
exec("arcoreimg.exe build-db --input_image_list_path=" + pathToImageList + " --output_db_path="+ pathToSaveDB , (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});