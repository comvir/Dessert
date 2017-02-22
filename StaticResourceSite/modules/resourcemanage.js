﻿var FileModel = require('./filemodel');
var fs = require("fs");
var path = require("path");
//文件库
var _fileRepository = [];
/**
*取得文件
*@param {Array} files 文件列表
*@param {Function} callback 回调函数，输出合并的文件内容
*/
module.exports.getFiles = function (files, callback) {
    if (files) {
        var widthoutLoadFiles = [];
        var combineFileContent = new Buffer(0);
        files.forEach(function (filename) {
            var hashcode = filename.getHashCode();
            var file = _fileRepository[hashcode];
            if (file) {
                combineFileContent = Buffer.concat([combineFileContent, file.content]);
            } else {
                widthoutLoadFiles.push(filename);
            }

        });
        if (widthoutLoadFiles.length) {
            loadFiles(widthoutLoadFiles, function (content) {
                combineFileContent = Buffer.concat([combineFileContent,content]);
                if (callback) {
                    callback(combineFileContent);
                }
            });
        } else {
            if (callback) {
                callback(combineFileContent);
            }
        }
    }
}
/**
 * 读取文件
 * @param {Array} files 文件列表
 * @param {Function} callback 回调,返回合并的文件内容
 * @param {String} content 拼接内容
 */
var loadFiles = function (files, callback, content) {
    var combineFileContent = content||new Buffer(0);
    if (files.length === 0) {
        if (callback) {
            callback(combineFileContent);
        }
    } else {
        var filename = files.shift();
        var filepath = path.join('./public', filename);
        fs.readFile(filepath, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                var filecontent = new Buffer(data);
                combineFileContent = Buffer.concat([combineFileContent,filecontent]);
                var hashcode = filename.getHashCode();
                var filemodel = new FileModel(filepath, filecontent,filename, hashcode);
                _fileRepository[hashcode] = filemodel;
                watchFile(filemodel);
                if (files.length === 0) {
                    if (callback) {
                        callback(combineFileContent);
                    }
                } else {
                    loadFiles(files, callback, combineFileContent);
                }
            }
        });
    }
}
/**
 * 监视文件变化
 * @param filemodel
 */
var watchFile = function (filemodel) {
    var watcher= fs.watch(filemodel.path, function (eventType, filename) {
        if (eventType === "rename") {
            delete _fileRepository[filemodel.hashCode];
            watcher.close();
        } else if (eventType === "change") {
            var files = [filemodel.filename];
            loadFiles(files);
        }
    });
}