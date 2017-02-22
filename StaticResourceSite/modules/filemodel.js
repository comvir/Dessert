/**
 * 文件模型
 * @param path 路径
 * @param content 内容
 * @param filename 文件名
 * @param hashCode 文件名hashCode
 */
var filemodel = function (path, content, filename, hashCode) {
    //路径
    this.path = path || '';
    //内容
    this.content = content || '';
    this.filename = filename || '';
    this.hashCode = hashCode || 0;
}
module.exports = filemodel;