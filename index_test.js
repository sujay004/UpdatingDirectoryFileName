var fs = require('fs');
var http = require('http');
const streamToBlob = require('stream-to-blob')
const multer = require('multer');
const express = require('express');
const app = express();
var serveStatic = require('serve-static');

var staticBasePath = './Spelling Bee';

var serve = serveStatic(staticBasePath, { 'index': false });

var word = "abandoned".toLocaleLowerCase();

// var moveFrom = "Spelling Bee";
var moveFrom = "new_files";
// var moveFrom = "test";

const axios = require('axios');

var mysql = require('mysql');
const { resolve } = require('path');
const { rejects } = require('assert');



// specify the path to the file, and create a buffer with characters we want to write
var path = 'log.txt';
var buffer = 'New File' + new Date() + '\n';

var con = mysql.createConnection({

    host: "35.164.241.198",
    user: "devuser",
    password: "dVXTeRWMrBiNHt54",
    database: "spelling_bee"

});

let storeMap = new Map();

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    con.query("SELECT id,question FROM question where question_path is Null", async function (err, result, fields) {
        // if any error while executing above query, throw error
        if (err) console.log(err);
        // if there is no error, you have the result
        // console.log(result);
        for (var i = 0; i < result.length;) {
            word = result[i].question.toLocaleLowerCase();
            // if (word.startsWith('t')) {
                console.log(result[i])
                buffer += '\n\nCurrent Word = ' + result[i].question;
                // console.log(buffer)
                storeMap.set(word, {
                    definition: 0,
                    origin: 0,
                    pronounciation: 0,
                    sentence: 0,
                    none: 1,
                })
                await updateData(result[i]);
                if (result.length - 1 != i) {
                    i++;
                }

            // }
            if (result.length - 1 == i) {
                buffer += "\n\nValues..";
                i++;

                // open the file in writing mode, adding a callback function where we do the actual writing
                fs.open(path, 'w', function (err, fd) {
                    if (err) {
                        throw 'could not open file: ' + err;
                    }
                    setTimeout(() => {
                        storeMap.forEach((value, key, map) => {
                            buffer += "\n\n" + `${key}: ${JSON.stringify(value)}`;
                        });
                        const buffer1 = new Buffer(buffer);
                        // write the contents of the buffer, from position 0 to the end, to the file descriptor returned in opening our file
                        fs.write(fd, buffer1, 0, buffer1.length, null, function (err) {
                            if (err) throw 'error writing file: ' + err;
                            fs.close(fd, function () {
                                console.log('wrote the file successfully');
                            });
                        });
                    }, 3000)

                });
            }
        }

    });

});


function updateData(e) {

    return new Promise(async (resolve, reject) => {
        const tempObj = e;
        fs.readdir(moveFrom, async function (err, files) {
            if (err) {
                console.error("Could not list the directory.", err);
                process.exit(1);
            }
            let mapValue = storeMap.get(word);
            files.forEach(function (file, index) {
                // console.log(file)
                var splitWord = file.split(".");
                var splitFirstWord = splitWord[0].split(" ");

                // console.log("splitWord ", splitWord, splitFirstWord);
                // if(word=="masseuse"){
                //     console.log("mass",storeMap.get(word))
                // }
                if (splitFirstWord.includes(word)) {
                    const path = "/audiofiles/" + file;

                    if (splitFirstWord.includes("definition")) {
                        // console.log("splitWord = ", file, splitWord, splitFirstWord, 'definition',path);
                        const query = "update question_hints as qh inner join question as q on qh.question_id=q.id set details_path= '" + path + "' where q.id = '" + tempObj.id + "' and qh.question_hint_type_id = 2";
                        buffer += "\n" + query;
                        console.log(query);
                        con.query(query, function (err, result1, fields1) {
                            if (err) {
                                console.log(err)
                                buffer += '\nerror =' + err;
                            }
                            if (mapValue) {
                                mapValue.definition = 1;
                                mapValue.none = 0;
                                storeMap.set(word, mapValue)
                            }

                            // throw err;
                            // console.log(result1);
                        })



                    }
                    if (splitFirstWord.includes("origin")) {
                        const query = "update question_hints as qh inner join question as q on qh.question_id=q.id set details_path= '" + path + "' where q.id = '" + tempObj.id + "' and qh.question_hint_type_id = 4";

                        // console.log("splitWord = ", file, splitWord, splitFirstWord, 'origin');
                        buffer += "\n" + query;

                        console.log(query)
                        con.query(query, function (err, result1, fields1) {
                            if (err) {
                                console.log(err)
                                buffer += '\nerror =' + err;
                            }
                            // console.log(result1)
                            if (mapValue) {
                                mapValue.origin = 1;
                                mapValue.none = 0;
                                storeMap.set(word, mapValue)
                            }
                        })

                    }
                    if (splitFirstWord.includes("sentence")) {
                        const query = "update question_hints as qh inner join question as q on qh.question_id=q.id set details_path= '" + path + "' where q.id = '" + tempObj.id + "' and qh.question_hint_type_id = 3";
                        // console.log("splitWord = ", file, splitWord, splitFirstWord, 'origin');
                        buffer += "\n" + query;
                        console.log(query)
                        con.query(query, function (err, result1, fields1) {
                            if (err) {
                                console.log(err)
                                buffer += '\nerror =' + err;
                            }
                            // console.log(result1)
                            if (mapValue) {
                                mapValue.sentence = 1;
                                mapValue.none = 0;
                                storeMap.set(word, mapValue)
                            }
                        })

                    }

                    if (splitFirstWord.includes("pronounciation")) {
                        // console.log("splitWord = ", file, splitWord, splitFirstWord, 'sentence');
                        const query = "update question_hints as qh inner join question as q on qh.question_id=q.id set details_path= '" + path + "' where q.id = '" + tempObj.id + "' and qh.question_hint_type_id = 1";
                        // console.log("splitWord = ", file, splitWord, splitFirstWord, 'origin');
                        buffer += "\n" + query;
                        console.log(query)
                        con.query(query, function (err, result1, fields1) {
                            if (err) {
                                console.log(err)
                                buffer += '\nerror =' + err;
                            }
                            // console.log(result1)
                            if (mapValue) {
                                mapValue.pronounciation = 1;
                                mapValue.none = 0;
                                storeMap.set(word, mapValue)
                            }
                        })

                    }
                    if (splitFirstWord.length == 1 && splitFirstWord[0] == word) {
                        // console.log("splitWord = ", file, splitWord, splitFirstWord, 'empty');
                        buffer += "\nUPDATE question SET question_path = '" + path + "' WHERE id = '" + tempObj.id + "' ";
                        console.log("UPDATE question SET question_path = '" + path + "' WHERE id = '" + tempObj.id + "' ")
                        con.query("UPDATE question SET question_path = '" + path + "' WHERE id = '" + tempObj.id + "' ", function (err, result1, fields1) {
                            if (err) {
                                console.log(err)
                                buffer += '\nerror =' + err;
                            }

                            const query = "update question_hints as qh inner join question as q on qh.question_id=q.id set details_path= '" + path + "' where q.id = '" + tempObj.id + "' and qh.question_hint_type_id = 1";
                            // console.log("splitWord = ", file, splitWord, splitFirstWord, 'origin');
                            buffer += "\n" + query;
                            console.log(query)
                            con.query(query, function (err, result1, fields1) {
                                if (err) {
                                    console.log(err)
                                    buffer += '\nerror =' + err;
                                }
                                // console.log(result1)
                                // if (mapValue) {
                                //     mapValue.pronounciation = 1;
                                //     mapValue.none = 0;
                                //     storeMap.set(word, mapValue)
                                // }
                            })
                            // console.log(result1)
                        })

                    }
                    // if (!splitFirstWord.includes("definition") && !splitFirstWord.includes("origin") && !splitFirstWord.includes("origin") && !splitFirstWord.includes("pronounciation")) {
                    //     console.warn("Word not matching any audio file..Please check it..");
                    //     buffer += "\nWord not matching any audio file..Please check it..";
                    //     if (mapValue) {
                    //         storeMap.set(word, {
                    //             definition: 0,
                    //             origin: 0,
                    //             pronounciation: 0,
                    //             sentence: 0,
                    //             none: 1,
                    //         })
                    //     }
                    // }
                }



                // fs.createReadStream(__dirname + '\\tBack.png');

                // "test/" + file
                // fs.readFile("tBack.png", 'utf8', async function (err, data) {
                //     if (err) throw err;
                //     console.log('hello---  ',__dirname+"\\tBack.png", fs.createReadStream(__dirname+'\\tBack.png'))
                // axios
                //     .post('https://whatever.com/todos', {
                //         todo: fs.createReadStream(__dirname + '/Spelling Bee/' + data)
                //     })
                //     .then(res => {
                //         console.log(`statusCode: ${res.statusCode}`)
                //         console.log(res)
                //     })
                //     .catch(error => {
                //         console.error(error)
                //     })

                // // console.log(data);
                // // const blob = await streamToBlob(data)
                // // console.log("blob-- ",blob)
                // const json = JSON.stringify({ blob: data.toString("base64") });
                // // console.log("blob-- ", json)
                // // const json1 = getJsonString();
                // const parsed = JSON.parse(json);
                // // retrieve the original buffer of data
                // const buff = Buffer.from(parsed.blob, "base64");
                // var array = new Uint8Array([0x04, 0x06, 0x07, 0x08]);
                // var blob = new Blob([array]);
                // console.log(buff, array, blob)
            });
            setTimeout(() => {
                console.log("mass",storeMap.get(word))
                resolve(true);
            }, 1000)

            // const buf = fs.readFileSync("test/" + file);
            // console.log(Buffer.from(buf));
            // const stream = new stream.Readable() // any Node.js readable stream

            // });
        });
    })

}








var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

//will be using this for uplading
const upload = multer({ storage: storage });



var staticServe = function (req, res) {
    res.statusCode = 200;
    res.write('ok');
    return res.end();
};

var httpServer = http.createServer(staticServe);

http.createServer(function (req, res) {
    if (req.url == '/fileupload') {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            var oldpath = files.filetoupload.path;
            var newpath = 'C:/Users/Your Name/' + files.filetoupload.name;
            fs.rename(oldpath, newpath, function (err) {
                if (err) throw err;
                res.write('File uploaded and moved!');
                res.end();
            });
        });
    } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
        res.write('<input type="file" name="filetoupload"><br>');
        res.write('<input type="submit">');
        res.write('</form>');
        return res.end();
    }
});




httpServer.listen(8080);

