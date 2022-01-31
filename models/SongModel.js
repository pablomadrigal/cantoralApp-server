var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var SongBookSchema = new Schema({
	BookName: {type: String, required: true},
	Number: {type: String, required: true},
});

var ChorSchema = new Schema({
	Beginning: {type: Number, required: true},
	End: {type: Number, required: true},
	Type: {type: String, required: true}
});

var LineSchema = new Schema({
	LineNumber: {type: Number, required: true},
	Letter: {type: String, required: true},
	Chores: {type: [ChorSchema]}
});

var VerseSchema = new Schema({
	VerseName: {type: String, required: true},
	VerseType: {type: String},
	Lines: {type: [LineSchema], required: true}
});

var SongSchema = new Schema({
	Title: {type: String, require: true},
	Subtitles: {type: [String]},
	BasedOn: {type: String},
	SongBooks: {type: [SongBookSchema]},
	VerseOrder: {type:[String], required: true},
	SongTheme: {type:[String]},
	ChoresIntro: {type:[ChorSchema]},
	Verses: {type: [VerseSchema], required: true},
	History: {type: String}
}, {timestamps: true});

mongoose.model("Song", SongSchema);