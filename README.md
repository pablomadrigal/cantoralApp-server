# Cantoral App server API Project Structure

Based on ([https://github.com/maitraysuthar/rest-api-nodejs-mongodb]("https://github.com/maitraysuthar/rest-api-nodejs-mongodb"))

## Getting started

This project will run on **NodeJs** using **MongoDB** as database.

## Software Requirements

- Node.js **8+**
- MongoDB **3.6+** (Recommended **4+**)

## Project structure

```sh
.
├── app.js
├── package.json
├── bin
│   └── www
├── controllers
│   ├── AuthController.js
│   └── AuthorController.js
│   └── SongController.js
│   └── MailController.js
├── models
│   ├── AuthorModel.js
│   └── UserModel.js
│   └── SongModel.js
├── routes
│   ├── api.js
│   ├── auth.js
│   ├── author.js
│   └── mail.js
│   └── song.js
├── middlewares
│   ├── jwt.js
├── helpers
│   ├── apiResponse.js
│   ├── constants.js
│   ├── mailer.js
│   └── utility.js
├── test
│   ├── testConfig.js
│   ├── auth.js
│   ├── author.js
│   └── song.js
└── public
    ├── index.html
    └── stylesheets
        └── style.css
```

## Bugs or improvements

Every project needs improvements, Feel free to report any bugs or improvements. Pull requests are always welcome.

## License

This project is open-sourced software licensed under the MIT License. See the LICENSE file for more information.
