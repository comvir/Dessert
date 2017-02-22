var express = require('express');
var resourcemanage = require('../modules/resourcemanage');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    var files = req.query.f || req.query.files;
    if (files) {
        resourcemanage.getFiles(files.split(','), function (content) {
            res.send(content);
        });
    } else {
        res.render('index', { title: 'StaticResource' });
    }
});
module.exports = router;