var express = require('express');
var router = express.Router();

var db = require('../config/db/db');
var query = db.RunQuery;

var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt-nodejs');

const SECRET = 'aWikiAnhPham1509';

/* GET all categories */
router.get('/categories', getAllCats);

/* GET categories' posts */
router.route('/categories/:catID/posts/')
    .get(getCategoryPosts);

/* GET a post */
router.get('/categories/:catID/posts/:postID', getPost);

/* GET all posts */
router.route('/posts')
    .get(getAllPost);

router.route('/authenticate')
    .post(login);

router.use(checkToken);

function checkToken(req, res, next) {
    //console.log(req.headers);
    var token = req.headers['wiki-token'];

    if (token) {
        jwt.verify(token, SECRET, function (err, decoded) {
            if (err) {
                return res.json({message: 'Failed to authenticate token.'})
            }
            else {
                //console.log(decoded);
                //req.decoded = decoded;
                next();
            }
        })
    }
    else {
        return res.status(403).send({
            message: "No token provided."
        });
    }
}

/* POST new category */
router.post('/categories', createNewCat);

router.route('/categories/:catID')
    /* GET category's info */
    .get(getCategoryInfo)
    /* UPDATE a category */
    .put(updateCategory)
    /* DELETE a category */
    .delete(deleteCategory);

router.route('/categories/:catID/posts/:postID')
    .put(updatePost)
    .delete(deletePost);

router.route('/posts')
    /* POST new post */
    .post(createNewPost);

router.route('/users')
    /* GET all users listing. */
    .get(getAllUsers)
    /* POST new user*/
    .put(addNewUser);

router.route('/users/:userID')
    .get(getUserInfo)
    .put(updateUser)
    .delete(deleteUser);

function getAllUsers(req, res, next) {
    query('SELECT * FROM Users', function (result) {
        res.json(result);
    })
}

function addNewUser(req, res, next) {
    query('INSERT INTO Users', function (result) {
        res.json(result);
    })
}

function getUserInfo(req, res, next) {
    query('SELECT * FROM Users WHERE UserID = ' + req.params.userID, function (result) {
        res.json(result);
    })
}

function updateUser(req, res, next) {
    query('UPDATE Users WHERE UserID = ' + req.params.userID, function (result) {
        res.json(result);
    })
}

function deleteUser(req, res, next) {
    query('SELECT * FROM Users WHERE UserID = ' + req.params.userID, function (result) {
        res.json(result);
    })
}

function login(req, res, next) {
    if (req.is("application/json")) {
        query("SELECT * FROM Users WHERE Username = '" + req.body.username + "'", function (result) {
            if (result.length < 1) {
                //res.status(304);
                res.json({message: "User not found."});
            }
            else {
                if (!bcrypt.compareSync(req.body.password, result[0].Password)) {
                    //res.status(304);
                    res.json({message: "Password does not match."})
                }
                else {
                    var token = jwt.sign(result[0], SECRET, {expiresIn: 86400});
                    //res.status(201);
                    res.json({message: "Login successfully.", token: token});

                }
            }
        });
    }
    else {
        //res.status(304);
        res.json({message: "Nothing else!"});
    }
}

function getAllPost(req, res, next) {
    query('SELECT * FROM Posts', function (result) {
        res.json(result);
    });
}

function createNewPost(req, res, next) {
    query('INSERT INTO Posts ()', function (result) {
        res.json(result);
    });
}

function getCategoryPosts(req, res, next) {
    query('SELECT * FROM Posts WHERE CategoryID = ' + req.params.catID, function (result) {
        res.json(result);
    });
}

function getAllCats(req, res, next) {
    query('SELECT * FROM Categories', function (result) {
        res.json(result);
    });
}

function createNewCat(req, res, next) {
    query('INSERT INTO Categories ()', function (result) {
        res.json(result);
    });
}

function getCategoryInfo(req, res, next) {
    query('SELECT * FROM Categories WHERE CategoryID = ' + req.params.catID, function (result) {
        res.json(result);
    });
}

function updateCategory(req, res, next) {
    query('UPDATE Categories ()', function (result) {
        res.json(result);
    });
}

function deleteCategory(req, res, next) {
    query('UPDATE Categories ()', function (result) {
        res.json(result);
    });
}

function getPost(req, res, next) {
    query('SELECT * FROM Posts\
        WHERE CategoryID = ' + req.params.catID + ' AND \
        PostID = ' + req.params.postID, function (result) {
        res.json(result);
    });
}

function updatePost(req, res, next) {
    query('UPDATE Posts ()', function (result) {
        res.json(result);
    });
}

function deletePost(req, res, next) {
    query('UPDATE Posts ()', function (result) {
        res.json(result);
    });
}

module.exports = router;
