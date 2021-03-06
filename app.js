const express = require('express');
const data = require('./data.json');
const { projects } = data;
const app = express();

app.set('view engine', 'pug');
app.use('/static', express.static('public'));

// Index route
app.get('/', (req, res) => {
    res.locals.projects = data.projects;
    res.render('index'); 
});


// About route
app.get('/about', (req, res) => {
    res.render('about')    
});


// Project route
app.get('/:id', (req, res, next) => {
    const { id } = req.params;
    //if the user navigates to a route that does not exist - render the error page - else render the project page.
    if (id > projects.length - 1 || isNaN(id)){
        next();
    } else {
        const project_name = projects[id].project_name
        const description = projects[id].description
        const technologies = projects[id].technologies
        const image_urls = projects[id].image_urls
        const live_link = projects[id].live_link
        const github_link = projects[id].github_link
        const templateData = {project_name, description, technologies, image_urls, live_link, github_link}
        res.render('project', templateData);
    }
});


// 404 handler
app.use((req, res, next) =>{
    console.log("Page not found")
    res.status(404).render('page-not-found')
    
});

// Global error handler
app.use((err, req, res, next) => {
    if (err){
        console.log("Something went wrong")
    }
    if(err.status === 404){
        res.status(404).render('page-not-found', { err });
    } else {
        err.message = err.message || "Something went wrong"
        res.status(err.status || 500).render('error', { err })
    }
    
});



app.listen(3000, () => {
    console.log("The application is running on localhost:3000")
});


/* error testing
app.get('/error', (req, res) => {
    const err = new Error();
 err.status = 505
throw err
    res.render(error);
}); */


// Frågor till Olov:
// Bilder. Måste det vara samma antal på alla?
// alt.