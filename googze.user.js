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
		var rE = /\/get_datadoors_tile\/(?:\d+)\/L(\d+)\/R(\w+)\/C(\w+)\.JPG/; // Reg Expression
		var nodes = document.getElementById("OpenLayers.Layer.ArcGISCache_8").childNodes;
		for (var i in nodes) {
			var src = nodes[i].firstChild.src;
			var matches = src.match(rE);
			if (matches != null) {
				matches[2] = parseInt(matches[2], 16);
				matches[3] = parseInt(matches[3], 16);
				var rP = 'http://khm0.google.com/kh/v=67&x=' + matches[3] + '&y=' + matches[2] + '&z=' + matches[1] + '&s=Galileo'; // Replacement of the Reg Expression
				nodes[i].firstChild.setAttribute("src", rP);
			}
		}
	} catch(err) { console.log(err); };
};
wazeToGoogle();