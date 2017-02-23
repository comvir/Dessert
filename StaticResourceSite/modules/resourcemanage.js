var FileModel = require('./filemodel');
var fs = require("fs");
var path = require("path");
//文件库
var _fileRepository = [];
/**
*取得文件
*@param {Array} files 文件列表
*@param {Function} callback 回调函数，输出合并的文件内容
*/
var getFiles = function (files, callback) {
    if (files) {
        var widthoutLoadFiles = [];
        var combineFileContent = '';
        files.forEach(function (filename) {
            var hashcode = filename.getHashCode();
            var file = _fileRepository[hashcode];
            if (file) {
                combineFileContent +=file.content;
            } else {
                widthoutLoadFiles.push(filename);
            }

        });
        if (widthoutLoadFiles.length) {
            loadFiles(widthoutLoadFiles, function () {
                getFiles(files, callback);
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
var loadFiles = function (files, callback) {
    if (files.length === 0) {
        if (callback) {
            callback();
        }
    } else {
        var filename = files.shift();
        var filepath = path.join('./public', filename);
        fs.readFile(filepath, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                var filecontent = data.toString("utf8");
                var hashcode = filename.getHashCode();
                var filemodel = new FileModel(filepath, filecontent,filename, hashcode);
                _fileRepository[hashcode] = filemodel;
                watchFile(filemodel);
                if (files.length === 0) {
                    if (callback) {
                        callback();
                    }
                } else {
                    loadFiles(files, callback);
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
        delete _fileRepository[filemodel.hashCode];
        watcher.close();
        var files = [filemodel.filename];
        loadFiles(files);
    });
}
module.exports.getFiles = getFiles;