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
		var rE = /http:\/\/(?:.*?)MapServer\/tile\/(\d+)\/(\d+)\/(\d+)\.png\?token=(?:.*?)/; // Reg Expression
		var rP = 'http://khm0.google.com/kh/v=65&x=$3&y=$2&z=$1&s=Galileo'; // Replacement of the Reg Expression
		
		var nodes = document.getElementById("OpenLayers.Layer.TMS_8").childNodes;
		for (var i in nodes) {
			var src = nodes[i].firstChild.src;
			;
			nodes[i].firstChild.setAttribute("src", src.replace(rE, rP));
		}
	} catch(err) {};
}

wazeToGoogle();