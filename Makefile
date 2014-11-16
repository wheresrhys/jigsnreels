run-local: 
	export NO_SCRAPE=true DB=jnr_local ENV=development PORT=5000 DB_HOST=localhost; nodemon --watch server --watch node_modules server/app.js