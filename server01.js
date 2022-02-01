
var express = require("express")
var app = express()
const PORT = process.env.PORT || 3000;
var path = require("path")
var hbs = require('express-handlebars');
const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: true }));
context = {
    subject: "ćwiczenie 3 - dane z tablicy obiektów",
    menuList: [
        { a: "main", href: "/" },
        { a: "register", href: "/register" },
        { a: "login", href: "/login" },
        { a: "admin", href: "/admin" }
    ],
    komunikat: "zarejestrowano pomyślnie",
    loggedIn: false,
    users: [],
    id: 0,
    kobiety: [],
    mezczyzni: []
}

app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }));
app.set('view engine', 'hbs');

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})

app.get("/", function (req, res) {
    res.render('menu.hbs', context);
})

app.get("/register", function (req, res) {
    res.render('register.hbs', context);
})

app.get("/index", function (req, res) {
    res.render('view2.hbs', context);
})

app.get("/login", function (req, res) {
    res.render('login.hbs', context);
})
app.get("/admin", function (req, res) {
    if (context.loggedIn) {
        res.render('admin.hbs', context);
    }
    else {
        context.komunikat = "brak dostępu"
        res.render('komunikat.hbs', context);
    }
})
app.get("/logout", function (req, res) {
    context.loggedIn = false
    context.komunikat = "wylogowano"
    res.render('komunikat.hbs', context);
    context.menuList.splice(context.menuList.length, 1)
})
app.get("/sort", function (req, res) {
    if (context.loggedIn) {
        res.render('sort.hbs', context);
    }
    else {
        context.komunikat = "brak dostępu"
        res.render('komunikat.hbs', context);
    }
})
app.get("/gender", function (req, res) {
    if (context.loggedIn) {
        res.render('gender.hbs', context);
    }
    else {
        context.komunikat = "brak dostępu"
        res.render('komunikat.hbs', context);
    }
})
app.get("/show", function (req, res) {
    if (context.loggedIn) {
        res.render('show.hbs', context);
    }
    else {
        context.komunikat = "brak dostępu"
        res.render('komunikat.hbs', context);
    }
})
app.post("/login", function (req, res) {
    console.log(req.body)
    let log = false
    for (i in context.users) {
        if (req.body.login == context.users[i].login && req.body.password == context.users[i].password) {
            log = true
            context.loggedIn = true
        }
    }
    if (log) {
        res.render('admin.hbs', context)
    } else {
        context.komunikat = "nie udało się zalogować"
        res.render('komunikat.hbs', context);
    }
})
app.post("/sortby", function (req, res) {
    if (context.loggedIn) {
        console.log(req.body)
        if (req.body.sort == 'rosnaco') {
            context.users.sort(function (a, b) {
                return parseFloat(a.wiek) - parseFloat(b.wiek);
            });
            res.render('sortrosnaco.hbs', context);
        }
        if (req.body.sort == 'malejaco') {
            context.users.sort(function (a, b) {
                return parseFloat(b.wiek) - parseFloat(a.wiek);
            });
            res.render('sortmalejaco.hbs', context);
        }
    }
    else {
        context.komunikat = "brak dostępu"
        res.render('komunikat.hbs', context);
    }
})
app.post("/register", function (req, res) {
    let check = true
    if (req.body.plec == undefined) {
        req.body.plec = "undefined"
    }
    if (req.body.uczen == undefined) {
        req.body.uczen = false
    } else {
        req.body.uczen = true
    }
    for (i in context.users) {
        if (req.body.login == context.users[i].login)
            check = false
    }
    if (check) {
        req.body.id = context.id
        context.id++
        context.users.push(req.body)
        console.log(context.users)
        context.komunikat = "zarejestrowano pomyślnie"
        if (req.body.plec == 'k') {
            context.kobiety.push(req.body)
        } else {
            context.mezczyzni.push(req.body)
        }
    }
    else {
        context.komunikat = "ten login już istnieje"
    }
    res.render('komunikat.hbs', context);
})
