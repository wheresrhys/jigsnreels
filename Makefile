

test: 
	@./node_modules/.bin/gulp test

run-local: 
	export NO_SCRAPE=true DB=jnr_local ENV=development PORT=5000 DB_HOST=localhost; nodemon --watch server server/app.js

deploy:
	@./node_modules/.bin/gulp default img
	# Pre-deploy clean
	npm prune --production

	# Package+deploy
	@./node_modules/.bin/haikro build deploy \
		--app jigsnreels \
		--heroku-token $(HEROKU_AUTH_TOKEN) \
		--commit `git rev-parse HEAD` \