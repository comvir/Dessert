var FileModel = require('./filemodel');
var fs = require("fs");
var path = require("path");
//文件库
var _fileRepository = [];
//监视器库
var _watcherRepository = [];
/**
*取得文件
*@param {Array} files 文件列表
*@param {Function} callback 回调函数，输出合并的文件内容
*@param {Array} excludefiles 被排除的文件数组
*/
var getFiles = function (files, callback,excludefiles) {
    if (files) {
        var widthoutLoadFiles = [];
        var combineFileContent = '';
        files.forEach(function (filename) {
            var hashcode = filename.getHashCode();
            if (excludefiles&&excludefiles[hashcode]) {
                return true;
            }
            var file = _fileRepository[hashcode];
            if (file) {
                combineFileContent +=file.content;
            } else {
                widthoutLoadFiles.push(filename);
            }
        });
        if (widthoutLoadFiles.length) {
            loadFiles(widthoutLoadFiles, function (excludefiles) {
                var files = this;
                getFiles(files, callback, excludefiles);
            }.bind(files));
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
 * @param {Function} callback 回调,返回被排除的文件hashCode数组
 * @param {Array} excludefiles 被排除的文件数组hashCode数组
 */
var loadFiles = function (files, callback, excludefiles) {
    if (files.length === 0) {
        if (callback) {
            callback();
        }
    } else {
        var filename = files.shift();
        var filepath = path.join('./public', filename);
        fs.readFile(filepath, function (err, data) {
            var selfdata = this;
            var hashcode = selfdata.filename.getHashCode();
            if (err) {
                if (!selfdata.excludefiles) {
                    selfdata.excludefiles = [];
                }
                selfdata.excludefiles[hashcode] = true;
            } else {
                 var filecontent = data.toString("utf8");
                var filemodel = new FileModel(selfdata.filepath, filecontent,selfdata.filename, hashcode);
                _fileRepository[hashcode] = filemodel;
                watchFile(filemodel);
            }
            if (selfdata.files.length === 0) {
                if (selfdata.callback) {
                    selfdata.callback(selfdata.excludefiles);
                }
            } else {
                loadFiles(selfdata.files, selfdata.callback, selfdata.excludefiles);
            }
        }.bind({ filename: filename, filepath: filepath, files: files, callback: callback, excludefiles: excludefiles}));
    }
}
/**
 * 监视文件变化
 * @param filemodel
 */
var watchFile = function (filemodel) {
    if (filemodel) {
        _watcherRepository[filemodel.hashCode] = fs.watch(filemodel.path, function (eventType, filename) {
            var filemodel = this;
            delete _fileRepository[filemodel.hashCode];
            var watcher = _watcherRepository[filemodel.hashCode];
            if (watcher) {
                watcher.close();
                delete _watcherRepository[filemodel.hashCode];
            }
            var files = [filemodel.filename];
            loadFiles(files);
        }.bind(filemodel));
    }
}
module.exports.getFiles = getFiles;