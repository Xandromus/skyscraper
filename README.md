# SkyScraper

SkyScraper is a web-scraping news app deployed to Heroku, using MongoDB, Express, Node, and Handlebars, and scraping news stories from SKY News.


## Description

[SkyScraper](https://skyscrape-r.herokuapp.com/)

![SkyScraper](https://github.com/Xandromus/skyscraper/blob/master/skyscraper.png)

SkyScraper allows users to scrape up to 10 articles at a time from the SKY News website, which are then stored in a database. The users are then provided with cards displaying the article image, headline (with a link to the original article), and summary (if available).

New articles added subsequently to the SKY News website can be scraped and will then appear at the top of the article list. Only articles that don't already exist in the database are added with each scrape, and the user receives a notification of how many new articles were added.

Each card has a save button which allows the user to move the article to the saved articles page, accessible via the navbar. From the saved articles page, the user has two options:

1. Delete the article from the saved articles page, thus moving it back to the home page.

2. Add notes to the article in the add notes dialog modal. These notes are persistent, and will remain associated with the article even if it is deleted from the saved articles page. The notes can also be deleted from the article at any time as long as the article has been moved to the saved articles page.


## Concepts Used

- Web scraping
- Node and Express servers
- Handlebars templating
- MVC (Model-View-Controller) design pattern
- NoSQL database
- API endpoints
- HTML URL routing
- Node require and module exports


## Technologies Used

- HTML5/CSS3
- BootStrap
- Javascript
- jQuery
- Node.js
- Express.js
- Handlebars.js
- MongoDB
- Mongoose
- Heroku
- mLab


## Future Development

Future development would involve the following:
 
1. Creating a user login and profile

2. Association of saved articles with user profie

3. Association of saved notes with user profile

4. The ability to delete articles from the database entirely


## Node Packages Used

- body-parser
- cheerio
- express
- express-handlebars
- mongoose
- path
- request


## Authors

- **Xander Rapstine** - [Xander Rapstine](https://github.com/Xandromus)