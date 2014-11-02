


run-local: 
	export DB=jnr_dev ENV=development PORT=5000 DB_HOST=localhost; nodemon server/app.js