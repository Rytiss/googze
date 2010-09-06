// ==UserScript==
// @name         Googze
// @namespace    http://code.google.com/p/googze
// @description  Show aerial photos from Google Maps in Waze cartouche editor
// @include      *waze.com/cartouche*
// @copyright    Rytis Slatkevičius
// ==/UserScript==

var wazeToGoogle = function() {
	try {
		setTimeout(wazeToGoogle, 4000);
		var rWorld = /\/get_datadoors_tile\/(?:\d+)\/L(\d+)\/R(\w+)\/C(\w+)\.JPG/i; // Reg Expression for World server

		var nWorld = document.getElementById("OpenLayers.Layer.ArcGISCache_8");
		if (nWorld != null) {
			nWorld = nWorld.childNodes; // DOM nodes for World server
		
			// Replace World server
			for (var i in nWorld) {
				var src = nWorld[i].firstChild.src;
				var matches = src.match(rWorld);
				if (matches != null) {
					matches[2] = parseInt(matches[2], 16);
					matches[3] = parseInt(matches[3], 16);
					var rP = 'http://khm0.google.com/kh/v=67&x=' + matches[3] + '&y=' + matches[2] + '&z=' + matches[1] + '&s=Galileo'; // Replacement of the Reg Expression
					nWorld[i].firstChild.setAttribute("src", rP);
				}
			}
		}
		
		var rUS = /BBOX=(-?\d+\.\d+),(-?\d+\.\d+),/i; // Reg Expression for US server
		var nUS = document.getElementById("DynamicWMS_9");
		if (nUS != null) {
			// We need to inject a script to retrieve data from Waze
			var script = document.createElement('script');
			script.innerHTML = 'var st = document.getElementById("googze_script"); st.innerHTML = "Googze state: <div id=\'googze_resolution\'>" + window.g_map.getResolution() + "</div><div id=\'googze_zoom\'>" + window.g_map.getZoom() + "</div><div id=\'googze_bounds_left\'>" + window.g_map.maxExtent.left + "</div><div id=\'googze_bounds_top\'>" + window.g_map.maxExtent.top + "</div>";';
			document.getElementsByTagName('head')[0].appendChild(script);

			nUS = nUS.childNodes; // Dom nodes for US server
			// Replace US server
			var res = document.getElementById('googze_resolution').innerHTML;
			var bounds_left = document.getElementById('googze_bounds_left').innerHTML;
			var bounds_top = document.getElementById('googze_bounds_top').innerHTML;
 			var z = document.getElementById('googze_zoom').innerHTML;
			
			for (var i in nUS) {
				var src = nUS[i].firstChild.src;
				var matches = src.match(rUS);
				if (matches != null) {
    					var x = Math.round ((bounds_left - matches[1]) / (res * 256));
    					var y = Math.round ((matches[2] - bounds_top) / (res * 256));
					
					var rP = 'http://khm0.google.com/kh/v=67&x=' + x + '&y=' + y + '&z=' + z + '&s=Galileo'; // Replacement of the Reg Expression
					nUS[i].firstChild.setAttribute("src", rP);
				}
			}
		}
	} catch(err) { console.log(err); };
};

var scriptDiv = document.createElement('div');
scriptDiv.id = 'googze_script';
document.body.appendChild(scriptDiv);

wazeToGoogle();
