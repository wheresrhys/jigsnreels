module.exports = {
    sass: {
        dev: {
            options: {
                style: 'expanded'
            },
            files: {
                './public/styles/main.css': './public/styles/main.scss'
            }
        },
        dist: {
            options: {
                style: 'compressed'
            },
            files: {
                './dist/public/styles/main.css': './public/styles/main.scss'
            }
        }
    }
};