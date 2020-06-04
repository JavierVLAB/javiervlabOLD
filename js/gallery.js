var divGallery00 = '<div class="col-md-4 col-sm-6 portfolio-item">';
divGallery00 += '<a href="#project';
//id
var divGallery01 = '" class="portfolio-link" data-toggle="modal">';
divGallery01 += '<div class="portfolio-hover">';
divGallery01 += '<div class="portfolio-hover-content">';
divGallery01 += '<i class="fa fa-plus fa-3x"></i>';
divGallery01 += '</div>';
divGallery01 += '</div>';
divGallery01 += '<img src="';
//image
var divGallery02 = '" class="img-responsive" alt="">';
divGallery02 += '</a>';
divGallery02 += '<div class="portfolio-caption">';
divGallery02 += '<h4>';
//title
var divGallery03 = "</h4>";
divGallery03 += '<p class="text-muted">';
//category
var divGallery04 = '</p>';
divGallery04 += '</div>';
divGallery04 += '</div>';

var track1 = '" onclick="ga('
track1 += "'send', 'event', { eventCategory: '"

var track2 = "', eventAction: 'Click' })"
//track2 += '"'

var projectList;

var main = function(){

	// jQuery for page scrolling feature - requires jQuery Easing plugin

	$(function() {
	    $('a.page-scroll').bind('click', function(event) {
	        var $anchor = $(this);
	        $('html, body').stop().animate({
	            scrollTop: $($anchor.attr('href')).offset().top
	        }, 1500, 'easeInOutExpo');
	        event.preventDefault();
	    });
	});

	// Highlight the top nav as scrolling occurs
	$('body').scrollspy({
	    target: '.navbar-fixed-top'
	})

	// Closes the Responsive Menu on Menu Item Click
	$('.navbar-collapse ul li a').click(function() {
	    $('.navbar-toggle:visible').click();
	});


	//This function fix the error in .getJSON
	$.ajaxSetup({beforeSend: function(xhr){
		if (xhr.overrideMimeType){
		    xhr.overrideMimeType("application/json");
		}	
	}});
	
	$.getJSON("js/projectsList.json",function(data){
		projectList = data;
		for (var i = data.projects.length - 1; i >= 0 ; i--) {
			var num = "";
			num += projectList.projects[i].id < 10 ? "0" + projectList.projects[i].id : projectList.projects[i].id;

			$('#portfolio-gallery').append( divGallery00 + num	+ track1 + projectList.projects[i].title + track2
																+ divGallery01 + projectList.projects[i].imageUrl
																+ divGallery02 + projectList.projects[i].title
																+ divGallery03 + projectList.projects[i].category
																+ divGallery04);
		};

	});

	// This function set the height of the section. The minimal height is the height of the window
	$(function() {
	  	$('header, #services, #about, #contact').css({ minHeight: $(window).innerHeight() + 'px' });
	  	$('#contact').css({ minHeight: $(window).innerHeight() - 100 + 'px' });
	  	$(window).resize(function() {
	    	$('header, #services, #about, #contact').css({ minHeight: $(window).innerHeight() + 'px' });
	    	$('#contact').css({ minHeight: $(window).innerHeight() - 100 + 'px' });
	  	});
	});



	
};

$(document).ready(main);





