run-local: 
	export DB=jnr_local ENV=development PORT=5000 DB_HOST=localhost; nodemon server/app.js