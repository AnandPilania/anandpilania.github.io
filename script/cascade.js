
(function($)
{	
	/**************************************************************************/

	var Cascade=function(cascade,page,options,requestCurrent)
	{
		/**********************************************************************/

		var $this=this;

		$this.defaults=
		{
			openStart		:	'',
			title			:	'',
			meta			:
			{
				keywords	:	'',
				description	:	''
			}
		};

		$this.page=page;

		$this.options=$.extend($this.defaults,options);

		$this.cascade=$(cascade);
		$this.cascadeWindow=cascade.find('.cascade-window');
		$this.cascadeElement=cascade.find('.cascade-menu li');
		$this.cascadeNavigation=cascade.find('.cascade-navigation');

		$this.enable=false;

		$this.requestPrevious='';
		$this.requestCurrent=requestCurrent;
		$this.requestType=$this.requestCurrent=='' ? 1 : 2;

		$this.scrollbar='';

		$this.cascadeWindowWidth=600;
		$this.cascadeElementMargin=10;

		$this.cascadeMinimumTabCount=5;
		$this.cascadeMinimumTabVisibleCount=4;

		$this.cascadeElementWidth=0;

		/**********************************************************************/

		this.load=function()
		{
			$this.cascadeElementWidth=parseInt($this.cascadeElement.first().css('width'));

			$this.createTwitter();

			$(window).bind('resize',function() 
			{
				$this.setResponsive();
			});

			$this.setResponsive();

			var i=0,k=0;

			var image=$this.imageLoad($this.cascadeElement.first());
			image.bind('load',function() 
			{
				$this.cascadeElement.each(function() 
				{
					image=$this.imageLoad($(this).children('a').first());

					var left=($this.cascadeElementWidth*k)+($this.cascadeElementMargin*k);
					$(this).css('left',left);

					k++;

					$(image).bind('load',function() 
					{
						if((++i)==$this.cascadeElement.length)
						{
							var j=0;

							$this.cascade.removeClass('preloader');
							$this.cascadeElement.css('display','block');

							$this.cascadeElement.each(function() 
							{
								$(this).animate({height:parseInt($this.cascade.css('height')),opacity:1},getRandom(100,1000),'easeInOutQuint',function()
								{
									if((++j)==$this.cascadeElement.length)
									{
										$this.requestPrevious=$this.getURL('main');

										$this.cascadeElement.css({'position':'relative','float':'left','left':'0','margin-right':$this.cascadeElementMargin});

										if($.trim(window.location.hash).length==0) window.location=$this.getURL('main');

										$this.createCascadeMenuSlider();
										$this.enable=true;
										$this.handleRequest();
									};
								});
							});
						};			
					});
				});
			});
		};

		/**********************************************************************/
		/**********************************************************************/

		this.handleRequest=function()
		{     
			if($this.requestType==2)
			{
				$this.doRequest();
			}
			else
			{
				var start=false;
				if(window.location.hash=='') 
				{
					if($this.options.openStart.length) 
					{
						start=true;
						window.location.href=$this.getURL($this.options.openStart);
					}
				}

				if(!start)
				{
					var requestCurrent=$this.checkRequest();	
					if(requestCurrent!==false)
					{
						$this.requestCurrent=requestCurrent;
						if($this.requestCurrent!=$this.requestPrevious) $this.doRequest();
					}
				}

				$(window).bind('hashchange',function(event) 
				{
					event.preventDefault();

					if($this.isEnable()==false) return;

					var requestCurrent=$this.checkRequest();
					if(requestCurrent===false) return;

					$this.requestCurrent=requestCurrent;
					$this.doRequest();
				}); 
			}
		};	

		/**********************************************************************/

		this.doRequest=function()
		{
			if(!$this.enable) return(false);
			$this.enable=false;

			var open=$this.isOpen();

			if($this.requestCurrent=='main') $this.close();
			else if(open) $this.close({'onComplete':function() { $this.open(); }});
			else $this.open();    

			return(true);
		};

		/**********************************************************************/

		this.checkRequest=function()
		{
			var request=window.location.hash.substring(2);

			if(request=='main') return('main');

			for(var id in $this.page)
			{
				if(id==request) return(request);
			};

			return(false);
		};

		/**********************************************************************/
		/**********************************************************************/

		this.isOpen=function()
		{
			return($this.cascade.hasClass('open'));
		};

		/**********************************************************************/

		this.openComplete=function()
		{
			$('.cascade-menu').trigger('configuration',{mousewheel:false});
			
			var scriptPath=$this.getPage($this.requestCurrent,'js');

			$this.createScrollbar();

			$this.showPreloader(false);	

			jQuery.getScript('page/script/main.js',function() 
			{
				if(scriptPath!='')
					jQuery.getScript('page/script/'+scriptPath);
			});

			$this.setTitle();

			$this.enable=true;

			$this.requestPrevious=$this.requestCurrent;
			$('#'+$this.getPage($this.requestCurrent,'tab')+' a').attr('href',$this.getURL('main'));

			$this.createNavigation();
			$this.controlNavigation('open');
		};

		/**********************************************************************/

		this.setTitle=function()
		{
			var value='';

			try
			{
				value=$this.page[$this.requestCurrent].title;
			}
			catch(e) { }

			if(!value.length) value=$this.options.title;

			document.title=value;
		};

		/**********************************************************************/

		this.open=function()
		{
			$('.cascade-menu').trigger('slideTo',[0,0,false,{duration:0}]);
			$('.cascade-menu').trigger('configuration',{mousewheel:false});
			
			$this.controlNavigation('pending');

			var i=0,k=0;
			var tab=$this.getPage($this.requestCurrent,'tab');
			var pagePath=$this.getPage($this.requestCurrent,'html');

			var step=$this.getResponsiveStep();
			var margin=step>=2 ? -200 : 0;

			$('#'+tab).css('z-index',2);

			$('.cascade-menu li').each(function() 
			{
				var left=-1*(($this.cascadeElementWidth*k)+($this.cascadeElementMargin*k));

				k++;

				jQuery(this).animate({left:left},500,'easeOutExpo',function() 
				{
					i++;
					if(i==$this.cascadeElement.length)
					{
						$('.cascade-menu').animate({'margin-left':margin},100,'easeOutBounce',function() 
						{
							var className=$('#'+$this.getPage($this.requestCurrent,'tab')).attr('class').split(' ')[0].split('-')[0];

							$this.cascadeWindow.css('opacity','1').css('display','block').attr('class','cascade-window '+className);

							$this.cascadeWindow.animate({width:$this.cascadeWindowWidth},500,'easeOutBounce',function()
							{
								$this.cascade.addClass('open');

								if($this.requestType==1)
								{
									$this.showPreloader(true);
									$.get('page/'+pagePath,{},function(page) 
									{			
										$('.cascade-page').html(page);
										$this.openComplete();
									},
									'html');
								}
								else $this.openComplete();
							});
						});
					};
				});
			});
		};	

		/**********************************************************************/

		this.close=function(data)
		{		
			$this.setTitle();
			
			$this.controlNavigation('pending');
			
			if(!$this.isOpen()) 
			{
				$this.controlNavigation('close');
				$this.enable=true;
				return;
			}
			
			$(':input,a').qtip('destroy');

			$this.destroyScrollbar();
			$('.cascade-page').html('');

			if($this.requestPrevious!='')
				$('#'+$this.getPage($this.requestPrevious,'tab')+' a').attr('href',$this.getURL($this.requestPrevious));

			$this.cascadeWindow.animate({width:'0px',opacity:0},500,'easeOutBounce',function() 	
			{
				$this.cascadeWindow.css('display','none');
				$this.expand(data);
			});	
		};

		/**********************************************************************/

		this.expand=function(data)
		{
			var counter=0,done=0,left=0;

			$('.cascade-menu').css('margin-left',0);

			$this.cascadeElement.each(function() 
			{
				$(this).css('z-index',1);
				left+=$this.cascadeElementWidth+((counter++)>0 ? $this.cascadeElementMargin : 0);

				$(this).animate({left:0},500,'easeOutExpo',function()
				{
					done++;

					if(done==$this.cascadeElement.length)
					{
						$this.cascade.removeClass('open');
						
						if(typeof(data)!='undefined')
						{
							if(typeof(data.onComplete)!='undefined') data.onComplete.apply();
							else 
							{
								$this.enable=true;
								$this.controlNavigation('close');
							}
						}
						else 
						{
							$this.enable=true;	
							$this.controlNavigation('close');
						}
					};
				});
			});
		};		

		/**********************************************************************/
		/**********************************************************************/

		this.getFirstPage=function()
		{
			for(var id in $this.page) 
			{
				if($this.page[id]['main']==1) return(id);
			};

			return(false);
		};

		/**********************************************************************/

		this.getPrevPage=function()
		{
			var prev='';

			for(var id in $this.page)
			{
				if(id==$this.requestCurrent && prev!='') return(prev);
				else if($this.page[id]['main']==1) prev=id;
			};

			return(prev);
		};

		/**********************************************************************/

		this.getNextPage=function()
		{
			var n=false;
			var next=$this.getFirstPage();

			for(var id in $this.page)
			{
				if(n) 
				{
					if($this.page[id]['main']==1) return(id);
				};
				if(id==$this.requestCurrent) n=id;
			};

			return(next);
		};

		/**********************************************************************/

		this.getPage=function(id,property)
		{
			return($this.page[id][property]);
		};

		/**********************************************************************/

		this.getOpenStartPage=function()
		{
			for(var id in $this.page)
			{
				if($this.page[id]['openStart']==1) return(id);
			};

			return(false);
		};  

		/**********************************************************************/
		/**********************************************************************/

		this.createScrollbar=function()
		{
			$this.scrollbar=$('.cascade-window-content').jScrollPane({maintainPosition:false,autoReinitialise:true,autoReinitialiseDelay:100}).data('jsp');

			$('.cascade-window-content').bind('jsp-scroll-y',function() 
			{
				$(':input,a').qtip('hide');
			});  
		};

		/**********************************************************************/

		this.destroyScrollbar=function()
		{
			if($this.scrollbar!='') 
			{
				$this.scrollbar.destroy();
				$this.scrollbar='';
			};              
		};	

		/**********************************************************************/
		/**********************************************************************/

		this.createCascadeMenuSlider=function()
		{
			$('.cascade-menu').carouFredSel(
			{
				items: 
				{
					visible		:	$this.cascadeMinimumTabCount,
					minimum		:	$this.cascadeMinimumTabCount,
					width		:	parseInt($this.cascadeElement.first().css('width'))+$this.cascadeElementMargin
				},
				scroll: 
				{
					items		:	1,
					duration	:	500,
					fx			:	'directscroll'
				},
				auto			:	false,
				mousewheel		:	true,
				prev			:	'.cascade-navigation-slider-prev',
				next			:	'.cascade-navigation-slider-next'
			});		

			$('.cascade .caroufredsel_wrapper').css('width',parseInt($('.cascade .caroufredsel_wrapper').width())-$this.cascadeElementMargin);

			$this.setResponsive();
			$this.controlNavigation('close');
		};

		/**********************************************************************/
		/**********************************************************************/

		this.createNavigation=function()
		{
			var prev=$this.getPrevPage();				
			var next=$this.getNextPage();	

			$this.cascade.find('.cascade-navigation-prev').attr('href',$this.getURL(prev));
			$this.cascade.find('.cascade-navigation-next').attr('href',$this.getURL(next));	
		};	

		/**********************************************************************/

		this.controlNavigation=function(type)
		{
			$('.cascade-menu').trigger('configuration',{mousewheel:false});
			$('.cascade-navigation').css({'display':'none'});

			if(type!='pending')
			{
				if(type=='open') $('.cascade-navigation-next,.cascade-navigation-prev').css({'display':'block'});
				else if(type=='close') 
				{
					$('.cascade-menu').trigger('configuration',{mousewheel:true});
					$('.cascade-navigation-slider-prev,.cascade-navigation-slider-next').css({'display':'block'});
				}
			}
			
			if($this.cascadeElement.length<$this.cascadeMinimumTabCount)
				$('.cascade-navigation-slider-prev,.cascade-navigation-slider-next').css({'display':'none'});
		};

		/**********************************************************************/
		/**********************************************************************/

		this.imageLoad=function(object)
		{
			var image=$(document.createElement('img'));	
			var url=object.css('background-image').substring(4);

			url=url.substring(0,url.length-1).replace(/"/ig,'');

			if($.browser.msie) image.attr('src',url+'?i='+getRandom(1,10000));
			else image.attr('src',url);

			return(image);
		};

		/**********************************************************************/

		this.isEnable=function()
		{
			if(!$this.enable)
			{
				window.location.href=$this.getURL($this.requestCurrent);
				return(false);
			}  

			return(true);
		};

		/**********************************************************************/

		this.showPreloader=function(show)
		{
			if(show) $this.cascadeWindow.addClass('cascade-window-prealoder');
			else $this.cascadeWindow.removeClass('cascade-window-prealoder');
		};

		/**********************************************************************/

		this.getURL=function(page)
		{
			return(($this.requestType==1 ? '#!' : '?_escaped_fragment_=')+page);
		};

		/**********************************************************************/

		this.createTwitter=function()
		{
			$.getJSON('plugin/twitter-user-timeline/twitter-user-timeline.php',function(data)
			{
				if(data.length)
				{
					var list=$('<ul>');
					var userExp=/(^|\s)@(\w+)/g;
					var hashExp=/(^|\s)#(\w+)/g;

					$(data).each(function(index,value)
					{
						var text=linkify(value.text)
						text=text.replace(userExp,' <a href="http://www.twitter.com/$2">@$2</a>');
						text=text.replace(hashExp,' <a href="http://www.twitter.com/search?q=#$2&src=hash">#$2</a>');
						list.append($('<li>').append($('<p>').html(text)));
					});

					$('#latest-tweets').append(list);

					$('#latest-tweets ul').carouFredSel(
					{
						auto				: true,
						direction			: 'up',
						items: 
						{
							height			: $this.getTwitterDimension('height'),
							width			: $this.getTwitterDimension('width'),
							visible			: 1
						},
						scroll: 
						{
							items			: 1,
							duration		: 500,
							fx				: 'directscroll'
						}
					});
					
					$('#latest-tweets ul').find('a').attr('target','_blank');

					$this.setResponsive();
				}
			});				
		};

		/**********************************************************************/

		this.getTwitterDimension=function(type)
		{
			var step=$this.getResponsiveStep();
			var dimension=[[530,40],[585,40],[365,60],[165,160]];

			var index=type=='width' ? 0 : 1;

			return(dimension[step][index]);
		};

		/**********************************************************************/

		this.setResponsive=function()
		{
			var step=this.getResponsiveStep();

			margin=0;
			$this.cascadeWindowWidth=610;
			
			$this.cascadeMinimumTabCount=5;
			$this.cascadeMinimumTabVisibleCount=4;

			if(step==1)
			{
				$this.cascadeWindowWidth=400;
				$this.cascadeMinimumTabCount=4;
				$this.cascadeMinimumTabVisibleCount=3;
			}

			if(step==2)
			{
				$this.cascadeWindowWidth=410;
				$this.cascadeMinimumTabCount=3;
				$this.cascadeMinimumTabVisibleCount=2;
			}

			if(step==3)
			{
				$this.cascadeWindowWidth=200;
				$this.cascadeMinimumTabCount=2;
				$this.cascadeMinimumTabVisibleCount=1;
			}

			if(step>=2)
			{
				if($this.isOpen())
					margin=-1*$('.cascade-menu li').width();
			}

			if($this.isOpen())
			{
				$('.cascade-window').width($this.cascadeWindowWidth);
			}

			$('.cascade-menu').css('margin-left',margin);
			
			$('.cascade-menu').trigger('configuration',['items.minimum',$this.cascadeMinimumTabCount]);
			$('.cascade-menu').trigger('configuration',['items.visible',$this.cascadeMinimumTabVisibleCount]);

			var object=$('#latest-tweets');
			object.find('ul').trigger('configuration',{items:{width:$this.getTwitterDimension('width'),height:$this.getTwitterDimension('height')}});
			object.find('ul li,ul li p').css({width:$this.getTwitterDimension('width'),height:$this.getTwitterDimension('height')});

			$this.createNavigation();
			$this.controlNavigation($this.isOpen() ? 'open' : 'close');
		};

		/**********************************************************************/

		this.getResponsiveStep=function()
		{
			var width=parseInt($('body>div.content.main').css('width'));
			
			if(width==620) return(1);
			if(width==410) return(2);		
			if(width==200) return(3);
			
			return(0);
		};

		/**********************************************************************/
	};

	/**************************************************************************/

	$.fn.cascade=function(page,options,requestCurrent)
	{
		/**********************************************************************/

		var cascade=new Cascade(this,page,options,requestCurrent);
		cascade.load();

		/**********************************************************************/
	};

	/**************************************************************************/

})(jQuery);