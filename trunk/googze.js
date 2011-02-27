var Googze = {
	enabled: true,
	satellite: true,
	streets: false,
	streets_type: 'google'
};

$('#googze').attr('style', 'background-color: #ccffcc; border: 1px solid #ffccff; padding-left: 20px; padding-top: 5px;');

if ($.cookie('googze') == undefined) {
	$.cookie('googze', serialize(Googze));
} else {
	eval('Googze=' + $.cookie('googze'));
}

$('#googze_satellite').live('click', function() {
	Googze.satellite = this.checked;
	$.cookie('googze', serialize(Googze));
	googzeRebuildUI();
});

$('#googze_streets').live('click', function() {
	Googze.streets = this.checked;
	$.cookie('googze', serialize(Googze));
	googzeRebuildUI();
});

$('#googze_streets_type').live('change', function() {
	Googze.streets_type = this.value;
	$.cookie('googze', serialize(Googze));
	googzeRebuildUI();
});

googzeRebuildUI();


var wazeToGoogle = function() {
	if (!Googze.enabled) {
		return;
	}

	try {
		setTimeout(wazeToGoogle, 4000);
		var rWorld = /\/tiles\/a(\d+)\.jpeg/i; // Reg Expression for World server (Bing maps)

		var nWorld = document.getElementById('Aerial');
		if (nWorld != null) {
			nWorld = nWorld.getElementsByTagName('img'); // DOM nodes for World server

			// Replace World server
			for (var i in nWorld) {
				if (nWorld[i].mm$tileId) {
					var tilex = nWorld[i].mm$tileId.x;
					var tiley = nWorld[i].mm$tileId.y;
					var tilez = nWorld[i].mm$tileId.levelOfDetail - 8;
					if ((Googze.satellite) && (Googze.streets)) {
						var rP = 'http://googze.betterfly.lt/image.php?x=' + tilex + '&y=' + tiley + '&z=' + tilez + '&layers[]=satellite&layers[]=streets&streets_type=' + Googze.streets_type;
					} else if (Googze.streets) {
						if (Googze.streets_type == 'osm') {
							var rP = 'http://b.tile.openstreetmap.org/' + tilez + '/' + tilex + '/' + tiley + '.png';
						} else if (Googze.streets_type == 'google_landmarks') {
							var rP = 'http://mt1.google.com/vt/lyrs=m@144&hl=en&x=' + tilex + '&s=&y=' + tiley + '&z=' + tilez + '&s=Galileo';
						} else {
							var rP = 'http://mt1.google.com/vt/lyrs=h@144&hl=en&x=' + tilex + '&s=&y=' + tiley + '&z=' + tilez + '&s=Galileo';
						}
					} else {
						var rP = 'http://khm0.google.com/kh/v=67&x=' + tilex + '&y=' + tiley + '&z=' + tilez+ '&s=Galileo';
					}
					nWorld[i].setAttribute('src', rP);
				}
			}
		}

		/*
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
		}*/
	} catch(err) { console.log(err); };
};

wazeToGoogle();

function googzeRebuildUI() {
	var html = '';
	if (Googze.enabled) {
		html += 'Googze is <span style="color: green;">enabled</span> (<a href="#" onclick="googzeSetEnabled(false); return false;">disable</a>) ';
	} else {
		html += 'Googze is <span style="color: red;">disabled</span> (<a href="#" onclick="googzeSetEnabled(true); return false;">enable</a>) ';
	}

	html += '<input type="checkbox" id="googze_satellite" style="width: 20px; margin-left: 20px; margin-top: 3px;"';
	if (Googze.satellite) { html += ' checked="checked"'; }
	html += ' /><label for="googze_satellite">Satellite imagery</label>';

	html += '<input type="checkbox" id="googze_streets" style="width: 20px; margin-left: 20px; margin-top: 3px;"';
	if (Googze.streets) { html += ' checked="checked"'; }
	html += ' /><label for="googze_streets">Streets</label>';
	
	html += '<select id="googze_streets_type" style="width: 180px; margin-left: 5px;">';
	html += '<option value="google">Google Maps (streets only)</option>';
	if (!Googze.satellite) {
		html += '<option value="google_landmarks"';
		if (Googze.streets_type == 'google_landmarks') {
		    html += ' selected="selected"';
		}
		html += '>Google Maps (with landmarks)</option>';
	}
	html += '<option value="osm"';
	if (Googze.streets_type == 'osm') {
		html += ' selected="selected"';
	}
	html += '>Open Street Map</option>';
	html += '</select>';


	$('#googze').html(html);
}

function googzeSetEnabled(enabled) {
	Googze.enabled = enabled;
	$.cookie('googze', serialize(Googze));
	googzeRebuildUI();
	wazeToGoogle();
}

// Shamelessly stolen from http://blog.stchur.com/2007/04/06/serializing-objects-in-javascript/
function serialize(_obj) {
	// Let Gecko browsers do this the easy way
	if (typeof _obj.toSource !== 'undefined' && typeof _obj.callee === 'undefined') {
		return _obj.toSource();
	}
	// Other browsers must do it the hard way
	switch (typeof _obj) {
		// numbers, booleans, and functions are trivial: just return the object
		// itself since its default .toString() gives us exactly what we want
		case 'number': case 'boolean': case 'function':
			return _obj; break;

		// for JSON format, strings need to be wrapped in quotes
		case 'string':
			return '\'' + _obj + '\''; break;

		case 'object':
			var str;
			if (_obj.constructor === Array || typeof _obj.callee !== 'undefined') {
				str = '['; var i, len = _obj.length; for (i = 0; i < len-1; i++) {
				str += serialize(_obj[i]) + ','; } str += serialize(_obj[i]) + ']';
			} else {
				str = '{'; var key; for (key in _obj) { str += key + ':' +
				serialize(_obj[key]) + ','; } str = str.replace(/\,$/, '') + '}';
			} return str; break;

		default:
			return 'UNKNOWN'; break;
	}
}