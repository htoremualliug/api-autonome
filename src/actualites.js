const express = require('express');

function createRouter(db) {
  const router = express.Router();
  const owner = '';

  var dbStoragePath = './assets/autonome/img/custom-client/actualite';

  // the routes are defined here

	// SELECT ALL
	router.get('/list-actualites', function (req, res, next) {
		res.header("Access-Control-Allow-Origin", "https://rothwebsolutions.fr");
		next();
	  db.query(
		'SELECT no, title, img, descr, edit, created FROM actualites ORDER BY created DESC',
		[10*(req.params.page || 0)],
		(error, results) => {
		  if (error) {
			console.log(error);
			res.status(500).json({status: 'error'});
		  } else {
			res.status(200).json(results);
		  }
		}
	  );
	});
	
	// SELECT ONE
	router.get('/details-actualite/:no', function (req, res, next) {
	  db.query(
		'SELECT no, title, img, descr, edit, created FROM actualites WHERE no=?',
		[req.body.no],
		(error, result) => {
		  if (error) {
			console.log(error);
			res.status(500).json({status: 'error'});
		  } else {
			res.status(200).json(results);
		  }
		}
	  );
	});
	
	// EDIT
	router.put('/edit-actualite/:no', function (req, res, next) {
	  db.query(
		'UPDATE actualites SET title=?, img=?, descr=?, edit=?, created=? WHERE no=?',
		[req.body.title, req.body.img, req.body.descr, new Date(req.body.edit), new Date(req.body.created), req.params.no],
		(error) => {
		  if (error) {
			res.status(500).json({status: 'error'});
		  } else {
			//res.status(200).json({status: 'ok'});
			db.query(
				'SELECT no, title, img, descr, edit, created FROM actualites ORDER BY created DESC',
				[10*(req.params.page || 0)],
				(error, results) => {
				  if (error) {
					console.log(error);
					res.status(500).json({status: 'error'});
				  } else {
					res.status(200).json(results);
				  }
				}
			  );
		  }
		}
	  );
	});
	

	// ADD
	router.put('/add-actualite', function (req, res, next) {
	  db.query(
		'INSERT INTO actualites (title, img, descr, edit, created) VALUES (?,?,?,?,?)',
		[req.body.title, req.body.img, req.body.descr, new Date(req.body.edit), new Date(req.body.created)],
		(error) => {
		  if (error) {
			console.error(error);
			res.status(500).json({status: 'error'});
		  } else {
			//res.status(200).json({status: 'ok'});
			db.query(
				'SELECT no, title, img, descr, edit, created FROM actualites ORDER BY created DESC',
				[10*(req.params.page || 0)],
				(error, results) => {
				  if (error) {
					console.log(error);
					res.status(500).json({status: 'error'});
				  } else {
					res.status(200).json(results);
				  }
				}
			  );
		  }
		}
	  );
	});

	
	// DELETE
	router.delete('/delete-actualite/:no', function (req, res, next) {
	  db.query(
		'DELETE FROM actualites WHERE no=?',
		[req.params.no],
		(error) => {
		  if (error) {
			res.status(500).json({status: 'error'});
		  } else {
			// res.status(200).json({status: 'ok'});
			db.query(
				'SELECT no, title, img, descr, edit, created FROM actualites ORDER BY created DESC',
				[10*(req.params.page || 0)],
				(error, results) => {
				  if (error) {
					console.log(error);
					res.status(500).json({status: 'error'});
				  } else {
					res.status(200).json(results);
				  }
				}
			  );
		  }
		}
	  );
	});


	router.get('/is-used-image/:name', function (req, res, next) {	
		const fullPath = dbStoragePath+'/'+req.params.name;
		
		db.query(
			'SELECT img FROM actualites WHERE img LIKE ?',
			[fullPath],
		(error, results) => {
		  if (error) {
			console.log(error);
			res.status(500).json({status: 'error'});
		  } else {
			res.status(200).json(results);
		  }
		}
	  );
	});

  return router;
}

module.exports = createRouter;
