# Ball Shoes Locker

> An inventory application that categorizes basketball shoes based on their brand name

[Link to Deployed Project](https://floating-ravine-86506.herokuapp.com/)

# Features
- Create/update shoe products with name, brand, price, quantity, and image (optional) information
- Create/update brands with a brand name and an image file (optional)
- Increment, decrement shoe quantity with a click
- When there are no more shoes left in stock, an alert goes out to the owner's email
- Change email address by submiting the Alert Email form

# Getting Started

## Clone repository

```
git clone git@github.com:djl2e/inventory-application.git
cd inventory-application
```

## Set up environmental variables

```
DATABASE_URL= <MongoDB URL>
SECRET_KEY = <JWT Strategy Secret Key>
AWS_SECRET_KEY = <AWS S3 Secret Ke>
AWS_KEY_ID = <AWS S3 Access Key Id>
AWS_BUCKET = <AWS S3 Bucket Name>
EMAIL = <Email Address Sending Alerts From>
EMAIL_PASSWORD = <Email Password>
```

## Install packages and start client

```
// from root directory
npm i // install npm dependencies
npm start // start the server - listens on localhost:3000
```

# Deployment (Heroku)

- [Create a Heroku Account](https://id.heroku.com/login)
- [Install Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
- In the terminal, from the root directory, run the following command lines:
```
heroku create
git push heroku main
```

# Built With
- Express
- MongoDB
- Amazon S3 Bucket
- Sharp
- Multer
- Nodemailer
- EJS

# Authors

- [Daniel Joseph Lee](https://github.com/djl2e)

# Images From:
- [danielygo](https://www.flickr.com/photos/danielygo)
- [joeyschwab](https://www.flickr.com/photos/joeyschwab)
- [taylorsiebert](https://unsplash.com/@taylorsiebert)
- [usama_1248](https://unsplash.com/@usama_1248)
- [wallpaper dog](https://wallpaper.dog/)
- [yallu_yy](https://unsplash.com/@yallu_yy)
- [weareambitious](https://unsplash.com/@weareambitious)
