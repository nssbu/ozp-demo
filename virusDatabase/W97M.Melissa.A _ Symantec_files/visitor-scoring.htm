$(document).ready(function () {
	var pageId = $('meta[name="om.score_id"]').attr("content"); // get vsid meta value as key for JSON
	var pageScore = $('meta[name="om.score_value"]').attr("content"); // get vsid meta value as key for JSON
	var scoreVal = $.cookie("symcSCScore"); // get current score value from cookie if present
	var dateVal = $.cookie("symcSCDate"); // get date value from cookie if present

	if (typeof dateVal === "undefined") {
		var date = new Date();
		var thirty_days = date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000)); // add 30 days per requirement
		// write symcSCDate cookie if not present
		$.cookie("symcSCDate", thirty_days, {
			expires: 30,
			path: "/",
			domain: +window.location.hostname
		});
	}

	if (typeof pageId !== "undefined" && typeof pageScore !== "undefined") {
		var score = pageScore;
		var score = parseInt(score);
		var updatedScore = score;
		if (typeof scoreVal !== "undefined") {
			var updatedScore = parseInt(scoreVal) + score;
		}
		$.cookie("symcSCScore", updatedScore, {
			expires: 30,
			path: "/",
			domain: +window.location.hostname
		});
	}
	//DEBUG ONLY
	if (window.location.href.indexOf("vsScore=1") != -1) {

		var d = document.createElement('div');
		$(d).addClass("VSLinks").appendTo($(".headerPane"));
		$("<h3>Visitor Scoring</h3>").appendTo(".VSLinks");
		var pageScore = $('meta[name="om.score_id"]').attr("content");
		if (typeof pageScore !== "undefined") {
			$.getJSON("/content/en/us/global/listing_generator/scores.json", function (data) {
				$.each(data.scores.score, function (i, item) {
					if (data.scores.score[i].id == pageScore) {
						var score = data.scores.score[i].value;
						var score = parseInt(score);
						$('<div>page type:score ' + pageScore + ':' + score + '</div>').appendTo(".VSLinks");
					}
				});
			});
		}

		$('a[data-score-id], li[data-score-id]').each(function () {
			var type = $(this).data("score-id");
			$.getJSON("/content/en/us/global/listing_generator/scores.json", function (data) {
				$.each(data.scores.score, function (i, item) {
					if (data.scores.score[i].id == type) {
						var score = data.scores.score[i].value;
						var score = parseInt(score);
						$('<div>link type:score ' + type + ':' + score + '</div>').appendTo(".VSLinks");
						$('a[data-score-id], li[data-score-id]').css({
							backgroundColor: "rgba(242, 100, 54,.2)",
							border: "1px dashed #fff"
						});
					}
				});
			});
		});

		$(".VSLinks").css({
			backgroundColor:"#fff",
			marginLeft: "10px",
			padding: "10px",
			border: "3px solid rgb(242, 100, 54)",
			width: "175px"
		});

		$('a[data-score-id], li[data-score-id]').mousedown(function () {
			var type = $(this).data("score-id");
			$.getJSON("/content/en/us/global/listing_generator/scores.json", function (data) {
				$.each(data.scores.score, function (i, item) {
					if (data.scores.score[i].id == type) {
						var score = data.scores.score[i].value;
						var score = parseInt(score);
						alert('link type:score: ' + type + ':' + score + ", updated cookie val:" + $.cookie("symcSCScore"));
					}
				});

			});
			return false;
		});

	}
	//DEBUG ONLY
});

$(function () {
	// update score for onclick events that have "data-score-id" attribute
	$( "body" ).on( "mousedown", "a[data-score-id],li[data-score-id]", function(event) {
		var scoreVal = $.cookie("symcSCScore");
		if (typeof scoreVal === 'undefined') {
			var scoreVal = 0;
		};
		var type = $(this).data("score-id");
		// JSON lookup for onclick events
		$.getJSON("/content/en/us/global/listing_generator/scores.json", function (data) {
			var score = 0;
			$.each(data.scores.score, function (i, item) {
				// examples: data.scores.score[i].id, data.scores.score[i].type, data.scores.score[i].value
				if (data.scores.score[i].id == type) {
					score = data.scores.score[i].value;
					score = parseInt(score);
					var updatedScore = parseInt(scoreVal) + score;
					$.cookie("symcSCScore", updatedScore, {
						expires: 30,
						path: "/",
						domain: +window.location.hostname
					});
					// send data to omniture
					trackVisitorScore(data.scores.score[i].id, data.scores.score[i].value);
					event.stopPropagation();
				}
			});
		});
	});

});

var dateVal = $.cookie("symcSCDate");
if (typeof dateVal !== "undefined") {
	var vs_date = $.cookie("symcSCDate"); //symcSCDate value from when cookie was originally written
	var date_now = $.now(); // current date 
	// if date_now is greater than symcSCDate value - expire both cookies
	if (date_now > vs_date) {
		$.removeCookie('symcSCScore', {
			path: '/'
		});
		$.removeCookie('symcSCDate', {
			path: '/'
		});
	}
}