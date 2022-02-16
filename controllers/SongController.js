const Song = require("../models/SongModel");
const { body, validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
const auth = require("../middlewares/jwt");
const utility = require("../helpers/utility");
var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

// Song Schema
function SongData(data) {
	this.id = data._id;
	this.Title= data.Title;
	this.Subtitles = data.Subtitles;
	this.BasedOn = data.BasedOn;
	this.SongBooks = data.SongBooks;
	this.VerseOrder = data.VerseOrder;
	this.SongTheme = data.SongTheme;
	this.ChoresIntro = data.ChoresIntro;
	this.History = data.History;
}

/**
 * Song List.
 * 
 * @returns {Object}
 */
exports.songList = [
	auth,
	function (req, res) {
		try {
			Song.find().then((songs)=>{
				if(songs.length > 0){
					return apiResponse.successResponseWithData(res, "Operation success", songs);
				}else{
					return apiResponse.successResponseWithData(res, "Operation success", []);
				}
			});
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Song Detail.
 * 
 * @param {string}      id
 * 
 * @returns {Object}
 */
exports.songDetail = [
	auth,
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.successResponseWithData(res, "Operation success", {});
		}
		try {
			Song.findById(req.params.id).then((song)=>{                
				if(song !== null){
					let songData = new SongData(song);
					return apiResponse.successResponseWithData(res, "Operation success", songData);
				}else{
					return apiResponse.successResponseWithData(res, "Operation success", {});
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Book store.
 * 
 * @param {string}      title 		required
 * @param {string}      subtitles	
 * @param {string}      basedOn		
 * @param {string}      songTheme	
 * @param {string}      choresIntro	
 * @param {string}      history		
 * 
 * @returns {Object}
 */
exports.songStore = [
	auth,
	body("title", "Title must not be empty.").isLength({ min: 1 }).trim(),
	sanitizeBody("*").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			var song = new Song(
				{ 
					Title: req.body.title,
					Subtitles: req.body.subtitles,
					BasedOn: req.body.basedOn,
					SongTheme: req.body.songTheme,
					ChoresIntro: req.body.choresIntro,
					History: `${req.user.email}/${utility.getDate()}/Create/${JSON.stringify(req.body)}`
				}
			);

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				//Save book.
				song.save(function (err) {
					if (err) { return apiResponse.ErrorResponse(res, err); }
					let songData = new SongData(song);
					return apiResponse.successResponseWithData(res,"Book add Success.", songData);
				});
			}
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err.message);
		}
	}
];

/**
 * Book update.
 * 
 * @param {string}      title 
 * @param {string}      description
 * @param {string}      isbn
 * 
 * @returns {Object}
 */
exports.bookUpdate = [
	auth,
	body("title", "Title must not be empty.").isLength({ min: 1 }).trim(),
	body("description", "Description must not be empty.").isLength({ min: 1 }).trim(),
	body("isbn", "ISBN must not be empty").isLength({ min: 1 }).trim().custom((value,{req}) => {
		return Book.findOne({isbn : value,user: req.user._id, _id: { "$ne": req.params.id }}).then(book => {
			if (book) {
				return Promise.reject("Book already exist with this ISBN no.");
			}
		});
	}),
	sanitizeBody("*").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			var book = new Book(
				{ title: req.body.title,
					description: req.body.description,
					isbn: req.body.isbn,
					_id:req.params.id
				});

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				if(!mongoose.Types.ObjectId.isValid(req.params.id)){
					return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
				}else{
					Book.findById(req.params.id, function (err, foundBook) {
						if(foundBook === null){
							return apiResponse.notFoundResponse(res,"Book not exists with this id");
						}else{
							//Check authorized user
							if(foundBook.user.toString() !== req.user._id){
								return apiResponse.unauthorizedResponse(res, "You are not authorized to do this operation.");
							}else{
								//update book.
								Book.findByIdAndUpdate(req.params.id, book, {},function (err) {
									if (err) { 
										return apiResponse.ErrorResponse(res, err); 
									}else{
										let bookData = new BookData(book);
										return apiResponse.successResponseWithData(res,"Book update Success.", bookData);
									}
								});
							}
						}
					});
				}
			}
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];
