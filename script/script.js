
/*****************************************************************/

function getRandom(min,max)
{
	return((Math.floor(Math.random()*(max-min)))+min);
}

/*****************************************************************/

function clearInput(object,action,defaulValue)
{
	object=$(object);
	var value=jQuery.trim(object.val());

	if(action=='focus')
	{
		if(value==defaulValue) object.val('');
	}
	else if(action=='blur')
	{
		if(value=='') object.val(defaulValue);
	}
}

/*****************************************************************/

function blockForm(formId,action)
{
	if(action=='block')
		$('#'+formId).find('.block').block({message:false,overlayCSS:{opacity:'0.3'}});
	else $('#'+formId).find('.block').unblock();
}

/*****************************************************************/

function filterGallery(e,object)
{
	e.preventDefault();

	object=$(object);
	
	var filter='',i=0;
	
	var value=object.prop('tagName').toLowerCase()=='select' ? object.val().split(' ') : object.attr('class').split(' ');
	
	for(i=0;i<value.length;i++) 
	{
		if(value[i].indexOf('filter-all')!=-1) { filter=''; break; }
		if(value[i].indexOf('filter-')!=-1) filter+=' .'+value[i];			
	}

	$('.gallery-list').isotope(
	{
		filter			:	filter,
		animationEngine	:	'jquery'
	});	
	
	$('.gallery-list .fancybox-image').each(function()
	{
		$(this).attr('_rel',$(this).attr('rel'));
		$(this).removeAttr('rel');
	});
	
	$('.gallery-list .fancybox-image').each(function() 
	{
		var visible=!$(this).parent('li').hasClass('isotope-hidden');
		
		if(visible) 
		{
			$(this).attr('rel',$(this).attr('_rel'));
			$(this).removeAttr('_rel');
		}
	});
	
	$('.filter-list li a').removeClass('selected');
	$('.filter-select-box').val('filter-all');
	
	for(i=0;i<value.length;i++) 
	{
		$('.filter-list li a.'+value[i]).addClass('selected');
		$('.filter-select-box option[value="'+value[i]+'"]').attr('selected','selected');
	}
}

/*****************************************************************/