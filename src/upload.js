const express = require('express');
const multer = require('multer');
var fileExtension = require('file-extension')
const config = require('../config.json');

function createRouter() {
	const router = express.Router();

	var newFileName = '';
	
	var diskStoragePath = config.diskStoragePath;

	// Configure Storage
	var storage = multer.diskStorage({

		// Setting directory on disk to save uploaded files
		destination: function (req, file, cb) {
			cb(null, diskStoragePath)
		},

		// Setting name of file saved
		filename: function (req, file, cb) {
			newFileName = file.fieldname + '-' + Date.now() + '.' + fileExtension(file.originalname);
			cb(null, newFileName)
		}
	})

	// File filter, fonction upload image
	var upload = multer({
		storage: storage,
		limits: {
			// Setting Image Size Limit to 2MBs
			fileSize: 2000000
		},
		fileFilter(req, file, cb) {
			if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
				//Error 
				cb(new Error('Please upload JPG and PNG images only!'))
			}
			//Success 
			cb(undefined, true)
		}
	})


	//ROUTES WILL GO HERE
	router.get('/', function (req, res) {
		res.json({ message: 'Server Started!' });
	});


	router.post('/uploadfile', upload.single('uploadedImage'), (req, res, next) => {
		const file = req.file
		if (!file) {
			const error = new Error('Please upload a file')
			error.httpStatusCode = 400
			return next(error)
		}
		res.status(200).send({
			statusCode: 200,
			status: 'success',
			uploadedFile: file,
			newFileName: './assets/img/custom-client/actualite/' + newFileName
		})

	}, (error, req, res, next) => {
		res.status(400).send({
			error: error.message,
			statusCode: 400
		})
	})


	router.get('/list-images', function (req, res, next) {
		//requiring path and fs modules
		const path = require('path');
		const fs = require('fs');
		//joining path of directory 
		const directoryPath = path.join(diskStoragePath, 'Documents');
		//passsing directoryPath and callback function
		fs.readdir(diskStoragePath, function (err, files) {
			//handling error
			if (err) {
				return console.log('Unable to scan directory: ' + err);
			} else {
				res.status(200).send({
					statusCode: 200,
					status: 'success',
					fileList: files
				})
			}
		});
	}, (error, req, res) => {
		res.status(400).send({
			error: error.message
		})
	})
	
	router.delete('/delete-image/:name', function (req, res, next) {
		const fileName = req.params.name;
		const fs = require('fs')
		const path = diskStoragePath + '/' + fileName;

		fs.unlink(path, (err) => {
		  if (err) {
			console.error(err)
			return
		  } else {
			  res.status(200).send({
					statusCode: 200,
					status: 'success'
				})
		  }
		})
		
	}, (error, req, res) => {
		res.status(400).send({
			error: error.message
		})
	})
	
	return router;
}

module.exports = createRouter;