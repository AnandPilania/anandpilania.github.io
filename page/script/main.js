/******************************************************************************/
/*	Image preloader															  */
/******************************************************************************/

$('.image-preloader img').each(function() 
{
	$(this).attr('src',$(this).attr('src') + '?i='+getRandom(1,100000));
	$(this).bind('load',function() 
	{ 
		$(this).parent().first().css('background-image','none'); 
		$(this).animate({opacity:1},1000); 
	});
});

/******************************************************************************/
/*	Nivo slider																  */
/******************************************************************************/

$('#slider').nivoSlider({directionNav:false});

/******************************************************************************/
/*	Fancybox for images														  */
/******************************************************************************/

var helpers={title:{type:'inside'}};
helpers.buttons={skipSingle:true};	

$('.fancybox-image').fancybox(
{	
	type					:	'image',
	helpers					:	helpers
});

/******************************************************************************/
/*	Fancybox for youtube videos												  */
/******************************************************************************/

var helpers={title:{type:'inside'}};
helpers.media={};

$('.fancybox-video-youtube').fancybox(
{
	helpers					:	helpers
});

/******************************************************************************/
/*	Fancybox for vimeo videos												  */
/******************************************************************************/

var helpers={title:{type:'inside'}};
helpers.media={};

$('.fancybox-video-vimeo').fancybox(
{
	helpers					:	helpers
});

/******************************************************************************/
/*	Captify for portfolio images											  */
/******************************************************************************/

$('.gallery-list img').captify();

/******************************************************************************/
/*	Hover for portfolio images												  */
/******************************************************************************/

$('.gallery-list').hover(

    function() {},
    function()
    {
        $(this).find('li img').animate({opacity:1},250);
    }	

);

$('.gallery-list li').hover(

    function() 
    {
        $(this).siblings('li').find('img').css('opacity',0.5);
        $(this).find('img').animate({opacity:1},250);
    },

    function()
    {
        $(this).find('img').css('opacity',1);	
    }

);
	
/******************************************************************************/
/*	Portfolio filter														  */
/******************************************************************************/

$(window).resize(function()
{
	$('.gallery-list').isotope(
	{
		masonry			: {columnWidth:185},
		resizable		: false,
		itemSelector	: 'li',
		animationEngine : 'jquery'
	});
});	

$('.filter-list li a').bind('click',function(e) 
{
	filterGallery(e,this);
});

$('.filter-select-box').bind('change',function(e)
{
	filterGallery(e,this)
});
				
/******************************************************************************/
/*	Skill list animation													  */
/******************************************************************************/

var i=0;
$('.skill-list-item-level span').each(function() 
{
    $(this).delay(((i++)*50)).animate({opacity:1},500);
});

/******************************************************************************/
/*	Google Maps																  */
/******************************************************************************/

try
{
	var coordinate=new google.maps.LatLng(29.803621,-95.37811);

	var mapOptions= 
	{
		zoom:15,
		center:coordinate,
		streetViewControl:false,
		mapTypeControl:false,
		zoomControlOptions: 
		{
			position:google.maps.ControlPosition.RIGHT_CENTER
		},
		panControlOptions: 
		{
			position:google.maps.ControlPosition.LEFT_CENTER
		},
		mapTypeId:google.maps.MapTypeId.ROADMAP
	};

	var googleMap=new google.maps.Map(document.getElementById('map'),mapOptions);

	var markerOptions=
	{
		map:googleMap,
		position:coordinate,
		icon:mainURL+'image/map_marker.png'
	}

	new google.maps.Marker(markerOptions);
	
	$(window).resize(function() 
	{
		try {googleMap.setCenter(coordinate);}
		catch(e) {}
	});	
}
catch(e) {}	

/******************************************************************************/
/*	Contact form															  */
/******************************************************************************/

$('#contact-form').submit(function() 
{
	submitContactForm();
	return(false);
});

$('#contact-form-reset').bind('click',function(e) 
{
	e.preventDefault();
	$('#contact-form').find('input[type="text"],textarea').val('').blur();
});

$('label.infield').inFieldLabels();

/******************************************************************************/
/******************************************************************************/