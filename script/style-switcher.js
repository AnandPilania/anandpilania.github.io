
/******************************************************************************/
/******************************************************************************/

function _switchTab()
{
	var tabColor=$('#style-switcher-tab-color').val();
	var tabNumber=$('#style-switcher-tab-number').val();
	var tabContent=$('#style-switcher-tab-content').val();

	/***/
	
	if(tabNumber=='0')
	{
		$('#style-switcher-tab-color').parent().css('display','none');
		$('#style-switcher-tab-content').parent().css('display','none');
		
		$('#style-switcher-tab-color').val(0);
		$('#style-switcher-tab-content').val(0);
		
		return(false);
	}
	else
	{
		$('#style-switcher-tab-color').parent().css('display','block');
	}
	
	/***/
	
	if(tabColor=='0') 
	{	
		$('#style-switcher-tab-content').parent().css('display','none');
		$('#style-switcher-tab-content').val(0);
		
		return(false);
	}
	else
	{
		$('#style-switcher-tab-content').parent().css('display','block');
	}
	
	/***/
	
	if(tabContent=='0') return(false);

	$('#tab-'+tabNumber).attr('class',tabColor+'-'+tabContent);
	return(true);
}

/******************************************************************************/

function _switchHeader()
{
	var className=$('#style-switcher-header').val();
	if(className=='0') return(false);
	
	$('body').attr('class','background-'+className);
	return(true);
}

/******************************************************************************/

$(document).ready(function() 
{
	$('#style-switcher-header').bind('change',function() { _switchHeader(); });
	$('#style-switcher-tab-color').bind('change',function() { _switchTab(); });
	$('#style-switcher-tab-number').bind('change',function() { _switchTab(); });
	$('#style-switcher-tab-content').bind('change',function() { _switchTab(); });
	
	$('#style-switcher-close').bind('click',function() 
	{
		$('#style-switcher-content').toggle();
		$('#style-switcher-close').html($('#style-switcher-content').css('display')=='block' ? '-' : '+');
	});
	
	$('#style-switcher-tab-color').val(0);
	$('#style-switcher-tab-number').val(0);	
	$('#style-switcher-tab-content').val(0);
	
	$('#style-switcher-tab-color').parent().css('display','none');
	$('#style-switcher-tab-content').parent().css('display','none');
});

/******************************************************************************/
/******************************************************************************/