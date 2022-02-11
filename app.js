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
app.get('/project/:id', (req, res, next) => {
    const id  = req.params.id;
    //if the user navigates to a route that does not exist (if the id is higher than 4 or not a number) - render the error page - else render the project page.
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
    const err = new Error('err');
    err.status = 404;
    err.message = "Page not found"
    next(err);
    
});

// Global error handler
app.use((err, req, res, next) => {
    if (err){
        console.log(err.status);
        console.log(err.message)
    }
    //if the error status is 404 - render the page-not-found template, else render the error template
    if(err.status === 404){
        res.render('page-not-found', { err });
    } else {
        err.message = err.message || "Something went wrong"
        err.status = err.status || 500
        res.render('error', { err })
    }
    
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`The application is running on port ${port}`)
});