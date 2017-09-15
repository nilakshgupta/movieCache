movieSearch = null;

hideDivs();
// Functions
function getNewMovies(movie) {
    var queryURL = "https://api.themoviedb.org/3/search/movie?api_key=d53b802d30d38d0bf73c24dabc4a5c8d&language=en-US&query=" + movie;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).done(function(response) {

        for (var i = 0; i < 1; i++) {
            var movieInfoDiv = $("<div>");
            movieInfoDiv.addClass("movie-info");
            var pTitle = $("<p>");
            var pReleased = $("<p>");
            var pPlot = $("<p>");
            var pNotice = $("<p>");
            pNotice.addClass("informational");
            pNotice.text("click on the poster for more stuff!");
            pPlot.addClass("clear");
            pPlot.addClass("movie-plot");
            var movieTitle = response.results[i].title;
            var movieRelDate = getYear(response.results[i].release_date);
            var movieId = response.results[i].id;
            var moviePoster = response.results[i].poster_path;
            var moviePlot = response.results[i].overview;

            pTitle.text("Title: " + movieTitle);
            pTitle.addClass("movie-title");
            pReleased.addClass("movie-released");
            pReleased.text("Released: " + movieRelDate);
            pPlot.text(moviePlot);

            var movieImg = $("<img>");
            movieImg.attr("src", "https://image.tmdb.org/t/p/w185/" + moviePoster);
            movieImg.addClass("img-responsive")
            movieImg.addClass("poster");
            movieImg.attr("data-name", movieId);
            movieImg.attr("title", movieTitle);

            movieInfoDiv.append(pTitle);
            movieInfoDiv.append(pReleased);
            movieInfoDiv.append(movieImg);
            movieInfoDiv.append(pNotice);
            movieInfoDiv.append(pPlot);

            $('#posters').append(movieInfoDiv);

        }

    });
    queryURL = "";
    movie = "";
};


function makeButton(title, id) {
    var newButton = $("<button>");
    newButton.addClass("btn btn-primary move-button");
    //
    newButton.addClass("float-left");
    newButton.attr("data-name", id);
    newButton.attr("title", title);
    newButton.text("click me");
    return newButton;

}


function displayGoodies() {
    clearGoodies();
    $("#review-panel").show();
    $("#trailer-panel").show();
    $("#recomendation-panel").show();
    var title = $(this).attr("title");
    var dataName = $(this).attr("data-name");
    getTrailerId(dataName);
    getRecomendationId(dataName);
    getNytData(title);
    //scroll to top of trailer div
    $('html, body').animate({
        scrollTop: ($('#trailer-panel').offset().top)
    }, 500);

}


function getTrailerId(x) {
    var queryURL = "https://api.themoviedb.org/3/movie/" + x + "/videos?api_key=d53b802d30d38d0bf73c24dabc4a5c8d&language=en-US"
    console.log(queryURL);
    $.ajax({
        url: queryURL,
        method: "GET"
    }).done(function(response) {

        var trailerArr = [];
        var featuretteArr = [];

        for (var i = 0; i < response.results.length; i++) {
            if (response.results[i].type === "Trailer") {
                var youtubeId = response.results[i].key;
                trailerArr.push(response.results[i].key);
                // getYtData(youtubeId);

            } else {
                var youtubeId = response.results[i].key;
                featuretteArr.push(response.results[i].key);
                // getYtData(youtubeId);
            }


        }
        // due to the way themoviedb handles trailers, this is needed to get the most relevant result if trailer type is 'Trailer' we prefer to show that, otherwise well show 'featurette'
        if (trailerArr.length > 0) {
            getYtData(trailerArr[0]);

        } else {
            getYtData(featuretteArr[0]);

        }

    });
}

function getRecomendationId(x) {
    var recommendationUrl = "https://api.themoviedb.org/3/movie/" + x + "/recommendations?api_key=d53b802d30d38d0bf73c24dabc4a5c8d&language=en-US&page=1";
    $.ajax({
        url: recommendationUrl,
        method: 'GET',
    }).done(function(recommendation) {
        for (var i = 0; i < 12; i++) {
            var userRecommendation = recommendation.results[i].title;

            console.log(recommendation.results[i].title);
            $("#recomendation").append("<tr><td>" + recommendation.results[i].title + "</td></tr>"

            );

        }
    });
}


function getNytData(title) {
    var reviewUrl = "https://api.nytimes.com/svc/movies/v2/reviews/search.json?api-key=03e9ed8edb0944dbb5c1b7e983811b8b&query=" + title;
    console.log(reviewUrl);
    $.ajax({
        url: reviewUrl,
        method: 'GET',
    }).done(function(result) {
        for (var i = 0; i < result.results.length; i++) {
            $("#reviews > tbody").prepend("<tr><td>" + result.results[i].link.suggested_link_text + "</td><td>" + "<a href='" + result.results[i].link.url + "' target='_blank' >" + result.results[i].link.url + "</a>" + "</td></tr>");
           
        }
    })
}


function getYtData(title) {
    var youTubeUrl = "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + title + " Trailer" + "&key=AIzaSyBFSTdHGhgwD7sUXEQ0UlXSKkro4SP3EnA";
    $.ajax({
        url: youTubeUrl,
        method: 'GET'
    }).done(function(response) {
        var results = response.items;
        for (var i = 0; i < results.length; i++) {
            displayVideo(results[0]);
        }
    });
}


function clearResults() {
    $("#posters").empty();
    $("#trailers").empty();
    $("#reviews-results").empty();
    $("#movie-input").empty();
    $("#recomendation-results").empty();
}


function clearGoodies() {
    $("#trailers").empty();
    $("#reviews-results").empty();
    $("#recomendation-results").empty();

}


function hideDivs() {
    $("#poster-panel").hide();
    $("#review-panel").hide();
    $("#trailer-panel").hide();
    $("#recomendation-panel").hide();
}

function resetDivs() {
    $("#review-panel").hide();
    $("#trailer-panel").hide();
    $("#recomendation-panel").hide();
}


function displayVideo(result, i) {
    var vid = document.createElement('div');
    vid.className = "embed-responsive-item"; //resonsive embed
    vidId = 'vid' + i;
    vid.id = vidId;
    $("#trailers").append(vid);
    var player = new YT.Player(vidId, {
        videoId: result.id.videoId,
        events: {
            'onReady': onPlayerReady
        }
    });

    function onPlayerReady(e) {
        var myId = e.target.a.id;
        var duration = e.target.getDuration();
        if (duration === 0) {
            $("#trailers").empty(e.target.a);
        } else {
            var myId = e.target.a.id;
        }
    }
}


//updated form submit
$("#movie-form").submit(function(event) {
    input = $("#movie-input").val().trim();
    // not using autocomplete result
    if (input != '' && movieSearch == null) {
        event.preventDefault();
        clearResults();
        resetDivs(); //rehide
        var movie = $("#movie-input").val().trim();
        getNewMovies(movie);
        getNytData(movie);
        getYtData(movie);
        $('.ui-menu').hide(); // hide autocomplete options
        scrollPoster();
        $("#poster-panel").show();

        movieSearch = null;
        // if were are using the autcomplete recommendation
    } else if (movieSearch != null) {
        event.preventDefault();
        clearResults();
        resetDivs();
        var movie = window.movieSearch;
        getNewMovies(movie);
        getNytData(movie);
        getYtData(movie);
        $("#poster-panel").show();
        scrollPoster();
        movieSearch = null; // reset var

    } else {
        // console.log("do nothing");
    }

});


$(document).on("click", ".poster", displayGoodies);


// validate
$("#movie-form").validate();

//Autocomplete

$(function() {
    var getAjax = function(request, response) {
        var getTitle = "https://api.themoviedb.org/3/search/movie?" + "&query=" + request.term + "&api_key=d53b802d30d38d0bf73c24dabc4a5c8d";
        $.ajax({
            url: getTitle,
            method: 'GET',
        }).done(function(data) {
            // use map to format as JQuery autocomplete expects
            response($.map(data.results, function(item) {
                return {
                    label: item.title,
                    value: item.name
                }
            }));
        })

    }
    var selectItem = function(event, ui) {
        event.preventDefault()
        $("#movie-input").val(ui.item.value);
        window.movieSearch = ui.item.value;
        return false;
    }

    $("#movie-input").autocomplete({
        source: getAjax,
        // select: selectItem,
        select: function(event, ui) {
            $("#movie-input").val(ui.item.value);
            movieSearch = ui.item.value;
            $("#movie-form").submit(); // submit form on selection - mouse or enter key

        },
        autoFocus: true,
        minLength: 2,
        change: function() {
            $("#movie-input").val("").css("display", 2);
        }
    });
});

//momentjs to get year of relesae

function getYear(date) {
    var dateFormat = "YYYY-MM-DD";
    var convertedDate = moment(date, dateFormat);
    year = convertedDate.format("YYYY");
    return year;
}

function scrollPoster() {
    $('html, body').animate({
        scrollTop: ($('#poster-panel').offset().top)
    }, 500);
}