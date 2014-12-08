require('angular').module('jnr.tune').service('jScoreSnippets', function () {

	var indexedDB = window.indexedDB || null,
		snippetsDB = {
			open: function() {
				var version = 1;
				var request = indexedDB.open('score-snippets', version);

				request.onsuccess = function(e) {
					snippetsDB.db = e.target.result;
					// Do some more stuff in a minute
				};

				// We can only create Object stores in a versionchange transaction.
				request.onupgradeneeded = function(e) {
					var db = e.target.result;

					// A versionchange transaction is started automatically.
					e.target.transaction.onerror = snippetsDB.onerror;

					if(db.objectStoreNames.contains('snippets')) {
						db.deleteObjectStore('snippets');
					}

					var store = db.createObjectStore('snippets', {keyPath: 'arrangementId'});
				};

				request.onerror = snippetsDB.onerror;
			},

			insert: function(arrangement, score) {
				if (!snippetsDB.inProgress[arrangement._id]) {
					var db = snippetsDB.db;
					var trans = db.transaction(['snippets'], 'readwrite');
					var store = trans.objectStore('snippets');

					snippetsDB.inProgress[arrangement._id] = true;
					var request = store.put({
						arrangementId: arrangement._id,
						score: score,
						timestamp: (new Date()).toISOString()
					});

					request.onsuccess = function(e) {
						// Re-render all the todo's
						delete snippetsDB.inProgress[arrangement._id];
					};

					request.onerror = function(e) {
						console.log(e.value);
					};
				}
			},

			getById: function(id, success, failure) {
				var db = snippetsDB.db;
				var trans = db.transaction(['snippets'], 'readwrite');
				var store = trans.objectStore('snippets');

				var request = store.get(id);
				request.onerror = failure;
				request.onsuccess = function(event) {
					var res = event.target.result;
					if (res) {
						success(res);
					} else {
						failure(res);
					}

				};
			},

			inProgress: {}
		};

	if (indexedDB) {
		snippetsDB.open();
	}

	return {
		cacheScore: function (arrangement, score) {
			snippetsDB.insert(arrangement, score);
		},
		getCachedScore: function (arrangement, existsCallback, notExistsCallback) {
			snippetsDB.getById(arrangement._id, existsCallback, notExistsCallback);
		}
	};
});