/**
 * 获取字符串的哈希值
 * @param {Boolean} caseSensitive
 * @return {Number} hashCode
 */
String.prototype.getHashCode = function (caseSensitive) {
    var str = this;
    if (!caseSensitive) {
        str = str.toLowerCase();
    }
    var hash = 1315423911, i, ch;
    for (i = str.length - 1; i >= 0; i--) {
        ch = str.charCodeAt(i);
        hash ^= ((hash << 5) + ch + (hash >> 2));
    }

    return (hash & 0x7FFFFFFF);
}