(function($){
	$.fn.extend({
		csvExport: function(options) {
			this.defaultOptions = {
				escapeContent: true,
				title: 'Exported_Table.csv',
				beforeStart: function() {},
				onStringReady: function() {}
			};

			const settings = $.extend({}, this.defaultOptions, options);

			//MULTIPLE OBJECTS HANDLER
			return this.each(function() {
				const $this = $(this);
				const real = {
					x: 0,
					y: 0
				};
				// Objects to insert : { ori : {x:0,y:O}, toDo : xxx, done : xxx }
				const toExpand = {
					x: [],
					y: []
				};
				let theString = '';

				function deleteChecker(parent, pos){
					if(parent[pos].toDo == parent[pos].done){
						parent.splice(pos, pos+1);

						return true;
					}
			
					return false;
				}
				
				function spanChecker(){
					let colspanHandler = true;
	
					while(colspanHandler){
						let broken = false,
							directions = ['y', 'x'];

						for(let k = 0; k< directions.length; k++){
							const direction = directions[k];
							const other = direction == 'y' ? 'x' : 'y';
	
							for(let i = 0; i < toExpand[direction].length; i++){
							
								// Move on if task done
								if(deleteChecker(toExpand[direction], i) && i > 0){
									i--;
								}
								
								if(toExpand[direction].length > 0){
									if(real[other] == toExpand[direction][i].ori[other]){
										if(real[direction] == toExpand[direction][i].ori[direction] + toExpand[direction][i].done){
											theString+='"",';
											toExpand[direction][i].done++;
											broken=true;
											real.x++;
											break;
										}
									}
								}
							}
						}
						
						if(!broken) colspanHandler=false;
					}
				}

				function contentCheckup(data){
					if(settings.escapeContent) return data.replace(/([\\"])/g, '\\$1');
					
					return data;
				}

				function b64toBlob(b64Data, contentType, sliceSize) {
					contentType = contentType || '';
					sliceSize = sliceSize || 512;
				
					let byteCharacters = atob(b64Data);
					let byteArrays = [];
				
					for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
						let slice = byteCharacters.slice(offset, offset + sliceSize),
							byteNumbers = new Array(slice.length);

						for (let i = 0; i < slice.length; i++) {
							byteNumbers[i] = slice.charCodeAt(i);
						}
						
						let byteArray = new Uint8Array(byteNumbers);
						
						byteArrays.push(byteArray);
					}
				
					let blob = new Blob(byteArrays, {type: contentType});

					return blob;
				}
				
				//BEFORESTART CALLBACK
				settings.beforeStart.call(null, $this);
				
				$('tr', $this).each(function(){
					const currentTR = $(this);
					
					currentTR.children().each(function(){
						const currentTD = $(this);
						
						spanChecker();
						
						/* CURRENT TD HANDLER __START */
						if(currentTD.is('[colspan]')){
							toExpand.x.push({
								ori: {
									x: real.x,
									y: real.y
								},
								toDo: +currentTD.attr('colspan'),
								done: 1
							});
						}
				
						if(currentTD.is('[rowspan]')){
							toExpand.y.push({
								ori: {
									x: real.x,
									y: real.y
								},
								toDo: +currentTD.attr('rowspan'),
								done: 1
							});
						}

						let currentCellString = '',
							currentCellNodes = currentTD[0].childNodes;

						for(let i = 0; i < currentCellNodes.length; i++){
							currentCellString += (currentCellNodes[i].innerText || currentCellNodes[i].textContent.replace(/\s/g, '').length ? currentCellNodes[i].textContent : '') + ' ';
						}
						currentCellString = contentCheckup(currentCellString).trim();
						
						theString+='"'+currentCellString+'",';
						real.x++;
						/* CURRENT TD HANDLER __END */
					});
					
					theString = theString.substring(0, theString.length - 1);
					theString+='\r\n';
					real.x=0;
					real.y++;
				});
				
				settings.onStringReady.call(null, theString);

				const
					fileData = window.btoa(unescape(encodeURIComponent(theString))),
					title = settings.title;
				
				// IE Fix
				if(navigator.userAgent.indexOf('MSIE ') > 0 || navigator.userAgent.match(/Trident.*rv\:11\./)){
					const blobObject = b64toBlob(fileData);

					window.navigator.msSaveOrOpenBlob(blobObject, title);
				}else{
					const a = document.createElement('a');

					a.href = 'data:application/vnd.ms-excel;base64,' + fileData;
					a.download = title;

					// Append to current DOM to allow click trigger
					a.style.display = 'none';
					document.body.appendChild(a);

					a.click();

					// Cleanup
					a.remove();
				}
			});
		}
	});
}(jQuery));