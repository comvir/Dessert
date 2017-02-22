/**
 * 文件模型
 * @param {String} path 路径
 * @param {Buffer} content 内容
 * @param {String} filename 文件名
 * @param {String} hashCode 文件名hashCode
 */
var filemodel = function (path, content, filename, hashCode) {
    //路径
    this.path = path || '';
    //内容
    this.content = content || new Buffer(0);
    this.filename = filename || '';
    this.hashCode = hashCode || 0;
}
module.exports = filemodel;