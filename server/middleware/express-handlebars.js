const path = require('path');
const handlebars = require('express-handlebars');

const VIEWS_PATH = path.join(__dirname, '../views');

module.exports = app => {
    const hbs = handlebars.create({
        defaultLayout: 'main',
        extname: '.hbs',
        helpers: {
            isEqual(param1, param2, options) {
                if (param1 === param2) {
                    return options.fn(this);
                }
                
                return options.inverse(this);
            }
        }
    })
    
    app.engine('hbs', hbs.engine);
    app.set('view engine', 'hbs');
    app.set('views', VIEWS_PATH);
}