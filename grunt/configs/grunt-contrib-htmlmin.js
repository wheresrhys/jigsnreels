module.exports = {
    htmlmin: {           
        dist: {
            options: {                                 
                removeComments: true,
                collapseWhitespace: true
            },
            files: [
                {
                    './dist/public/index.html': './public/index.html'
                },
                {
                    expand: true,     // Enable dynamic expansion.
                    // cwd: './public/views/',      // Src matches are relative to this path.
                    src: ['public/views/**/*.html'], // Actual pattern(s) to match.
                    dest: 'dist/',   // Destination path prefix.
                    ext: '.html'   // Dest filepaths will have this extension.
                }
            ]
        }
    }
};