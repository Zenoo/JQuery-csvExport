(function($){
    $.fn.extend({
        csvExport: function(options) {
            this.defaultOptions = {
                escapeContent:true,
                title:'Exported_Table',
                beforeStart : function(none, table) {},
                onStringReady : function(none, currentString) {}
            };

            var settings = $.extend({}, this.defaultOptions, options);

            //MULTIPLE OBJECTS HANDLER
            return this.each(function() {
                var $this = $(this);
                var real = {x:0,y:0};
                var toExpand = {x:[],y:[]}; // Objects to insert : { ori : {x:0,y:O}, toDo : xxx, done : xxx }
                var theString = '';
                
                //BEFORESTART CALLBACK
                settings.beforeStart.call(undefined,$this);
                
                $this.children().children('tr').each(function(){ 
                	var currentTR = $(this);
                	
                	currentTR.children().each(function(){ 
                		var currentTD = $(this);
                		
                		spanChecker();
                		
                		/* CURRENT TD HANDLER __START */
                		if(currentTD.is('[colspan]')){
                			toExpand.x.push({
                							ori:{x:real.x,y:real.y},
                							toDo:+currentTD.attr('colspan'),
                							done:1
                						});
                		}
                	
		            	if(currentTD.is('[rowspan]')){
		        			toExpand.y.push({
		        							ori:{x:real.x,y:real.y},
		        							toDo:+currentTD.attr('rowspan'),
		        							done:1
		        						});
		        		}
                	
                		theString+='"'+contentCheckup(currentTD.html())+'",';
                		real.x++;
                		/* CURRENT TD HANDLER __END */
                		
                	});
                	
                	theString = theString.substring(0, theString.length - 1);
                	theString+='\r\n';
            		real.x=0;
            		real.y++;
                });
                
                settings.onStringReady.call(undefined,theString);
                
                var a = document.createElement('a');
        	    a.href = 'data:application/vnd.ms-excel;base64,' + window.btoa(unescape(encodeURIComponent(theString)));
        	    a.download = settings.title + '.csv';
        	    a.click();
    
    			function spanChecker(){
    				var colspanHandler = true;
            		while(colspanHandler){
            			var broken = false;
            			
            			//ROWSPAN CHECKER
                        for(var i = 0; i < toExpand.y.length; i++){
                        	
                        	if(deleteChecker(toExpand.y,i) && i > 0){ // Move on if task done
                        		i--;
                        	} 
                    		
                        	if(toExpand.y.length > 0){
                        		if(real.x == toExpand.y[i].ori.x){
                        			if(real.y == toExpand.y[i].ori.y + toExpand.y[i].done){
                        				theString+='"",';
                        				toExpand.y[i].done++;
                        				broken=true;
                        				real.x++;
                        				break;
                        			}
                        		}
                        	}
                        }
                        
                        //COLSPAN CHECKER
                        for(var i = 0; i < toExpand.x.length; i++){
                        	
                        	if(deleteChecker(toExpand.x,i) && i > 0){ // Move on if task done
                        		i--;
                        	} 
                    		
                        	if(toExpand.x.length > 0){
                        		if(real.y == toExpand.x[i].ori.y){
                        			if(real.x == toExpand.x[i].ori.x + toExpand.x[i].done){
                        				theString+='"",';
                        				toExpand.x[i].done++;
                        				broken=true;
                        				real.x++;
                        				break;
                        			}
                        		}
                        	}
                        }
                        
                        if(!broken) colspanHandler=false;
            		}
    			}

            });
            
            function deleteChecker(parent,pos){
            	if(parent[pos].toDo == parent[pos].done){
            		parent.splice(pos,pos+1);
            		return true;
            	}
            	else return false;
            }
            
            function contentCheckup(data){
            	data = data.replace(/\./g, ',');
				if(settings.escapeContent) return data.replace(/([\\"])/g,'\\$1');
				else return data;
			}
            
        }
    });
})(jQuery);