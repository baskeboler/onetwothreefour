var debug = require('debug')('onetwothreefour:search');
var Q = require('q');


function searchHandler(model, defaultSort) {
    return function (req, res, next) {
        var page = req.query.page || 1,
            pageSize = req.query.pageSize || 10,
            sort = req.query.sort || defaultSort || 'name',
            deferred = Q.defer();
        page--;
        debug(`page=${page}, pageSize=${pageSize}, sort=${sort}`);
        var searchString = req.searchString,
            query = {
                $text: {
                    $search: searchString,
                    $caseSensitive: false
                }
            };
        model.count(query, (err, total) => {
            if (err) deferred.resolve(0);
            else deferred.resolve(total);
        });
        model.find(query)
            .sort(sort)
            .skip(page * pageSize)
            .limit(pageSize)
            .exec((err, docs) => {
                if (err) {
                    debug(err);
                    res.status(500).send({ message: 'db error' });
                } else {
                    var result = docs ? docs : [];
                    Q.when(deferred.promise, (total) => {
                        res.set('X-Total-Elements', total);
                        res.set('X-Page-Size', pageSize);
                        res.set('X-Page', page + 1);
                        res.send(result);
                    });
                }
            });
    };
}

module.exports = searchHandler;