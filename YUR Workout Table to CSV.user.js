// ==UserScript==
// @name		YUR Workout Table to CSV
// @namespace		https://github.com/Bootscreen/YUR-Workout-Export-Script
// @version		0.3
// @description export the Workout table to Clipboard or File (Clipboard only works as global Button)
// @author		Bootscreen
// @match		https://whyyouare.web.app/workouts
// @match		https://app.yur.fit/workouts
// @require		https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant		GM_getValue
// @grant		GM_setValue
// @grant		GM_registerMenuCommand
// ==/UserScript==


/* globals GM_config */

//########################################################################################
//########################################################################################
//########################################################################################

var downloadIcon = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCI+DQogIDx0aXRsZT4NCiAgICBkb3dubG9hZA0KICA8L3RpdGxlPg0KICA8cGF0aCBkPSJNMTcgMTJ2NUgzdi01SDF2NWEyIDIgMCAwIDAgMiAyaDE0YTIgMiAwIDAgMCAyLTJ2LTV6Ii8+DQogIDxwYXRoIGQ9Ik0xMCAxNWw1LTZoLTRWMUg5djhINWw1IDZ6Ii8+DQo8L3N2Zz4NCg==";
var clipboardIcon = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgNzEgMTAwIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA3MSAxMDAiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxwYXRoIGQ9Ik03MCw3LjU4M0g1Ni42MjVWNS45NjFjMC0wLjU1LTAuNDUtMS0xLTFINDMuNDQzVjJjMC0xLjEtMC45LTItMi0ySDI5LjU1N2MtMS4xLDAtMiwwLjktMiwydjIuOTYxSDE1LjM3NSAgYy0wLjU1LDAtMSwwLjQ1LTEsMXYxLjYyM0gxYy0wLjU1LDAtMSwwLjQ1LTEsMVY5OWMwLDAuNTUsMC40NSwxLDEsMWg2OWMwLjU1LDAsMS0wLjQ1LDEtMVY4LjU4M0M3MSw4LjAzNCw3MC41NSw3LjU4Myw3MCw3LjU4M3ogICBNMzUuNSwyLjMxOWMxLjA5NCwwLDEuOTgxLDAuODg3LDEuOTgxLDEuOThjMCwxLjA5NC0wLjg4OCwxLjk4MS0xLjk4MSwxLjk4MWMtMS4wOTQsMC0xLjk4MS0wLjg4Ny0xLjk4MS0xLjk4MSAgQzMzLjUxOSwzLjIwNiwzNC40MDYsMi4zMTksMzUuNSwyLjMxOXogTTYzLjQ5NSw5Mi4zOTVjMCwwLjU1LTAuNDUsMS0xLDFIOC41MDVjLTAuNTUsMC0xLTAuNDUtMS0xVjE1LjE4OGMwLTAuNTUsMC40NS0xLDEtMWg1Ljg3ICB2MS42NjljMCwwLjU1LDAuNDUsMSwxLDFoNDAuMjVjMC41NSwwLDEtMC40NSwxLTF2LTEuNjY5aDUuODdjMC41NSwwLDEsMC40NSwxLDFWOTIuMzk1eiI+PC9wYXRoPjxyZWN0IHg9IjE0LjM3NSIgeT0iMjUuNSIgd2lkdGg9IjM4LjEyNSIgaGVpZ2h0PSIyLjM3NSI+PC9yZWN0PjxyZWN0IHg9IjE0LjM3NSIgeT0iMzEuNjI1IiB3aWR0aD0iMzguMTI1IiBoZWlnaHQ9IjIuMzc1Ij48L3JlY3Q+PHJlY3QgeD0iMTQuMzc1IiB5PSIzNy43NSIgd2lkdGg9IjI5LjEyNSIgaGVpZ2h0PSIyLjM3NSI+PC9yZWN0PjxyZWN0IHg9IjE0LjM3NSIgeT0iNTAiIHdpZHRoPSIzOC4xMjUiIGhlaWdodD0iMi4zNzUiPjwvcmVjdD48cmVjdCB4PSIxNC4zNzUiIHk9IjU2LjEyNSIgd2lkdGg9IjM4LjEyNSIgaGVpZ2h0PSIyLjM3NSI+PC9yZWN0PjxyZWN0IHg9IjE0LjM3NSIgeT0iNjIuMjUiIHdpZHRoPSIyOS4xMjUiIGhlaWdodD0iMi4zNzUiPjwvcmVjdD48L3N2Zz4=";
var observer;

//########################################################################################
//########################################################################################
//########################################################################################

GM_registerMenuCommand('YUR Workout Table to CSV Settings', opencfg, 'Y');
GM_registerMenuCommand('Export to File', export_data_to_file, 'F');

function opencfg()
{
	GM_config.open();
}

GM_config.init(
{
    id: 'yurworkoutexportconfig',
    title: 'YUR Workout Table to CSV',
	css:
			'#yurworkoutexportconfig { width:550px !important; height:auto !important; right:0 !important; left:0 !important; margin:auto !important; }'+
			'#yurworkoutexportconfig_wrapper { padding:1em; color:#333; }'+
			'#yurworkoutexportconfig .field_label { display:inline-block; line-height:30px; min-width:105px; }',
    fields:
    {
        blacklist:
        {
            label: 'Blacklist (one Workout per Line)',
            labelPos: 'above',
            type: 'textarea',
			default: 'SteamVR Home\noculus-dash\nGizmoVR\nOculus Mirror',
			size: 100,
        },
        delimiter:
        {
            label: 'CSV delimiter',
            labelPos: 'left',
            type: 'text',
			default: '\t',
        },
        duration_as_seconds:
        {
            label: 'Save duration as seconds or as HH:MM:SS',
            labelPos: 'left',
            type: 'checkbox',
            default: false,
        },
        global_button_ctc:
        {
            label: 'Show Copy to Clipboard Button in the menu bar',
            labelPos: 'left',
            type: 'checkbox',
            default: false,
        },
        global_button_ctf:
        {
            label: 'Show Copy to File Button in the menu bar',
            labelPos: 'left',
            type: 'checkbox',
            default: false,
        }
    },
    events:
    {
        save: function() {
            GM_config.close();
			set_buttons();
        }
    },
});


var fnCallback = function (mutations) {
	mutations.forEach(function (mutation) {
		if(mutation.addedNodes.length > 0)
		{
			mutation.addedNodes.forEach(function (node) {
				if(node.nodeName == "A" && node.className == "toolbar-button dashboard ng-star-inserted")
				{
					set_buttons(node);
				}
			});
		}
	});
};

(function() {
	observer = new MutationObserver(fnCallback);
	observer.observe(document.querySelector('body'), {childList: true, subtree: true});
// 	set_buttons();
})();


// <span _ngcontent-bja-c0="" class="inter-filler"></span>

function set_buttons (node_to_insert_before) {
	observer.disconnect();

	var ngcontent = "_ngcontent";

	if(document.getElementById("button_ctc") != null)
	{
		document.getElementById("button_ctc").remove();
		document.getElementById("spacer_ctc").remove();
	}
	if(document.getElementById("button_ctf") != null)
	{
		document.getElementById("button_ctf").remove();
		document.getElementById("spacer_ctf").remove();
	}

	for(var i = 0; i < node_to_insert_before.attributes.length; i++)
	{
		if(node_to_insert_before.attributes[i].name.startsWith("_ngcontent"))
		{
			ngcontent = node_to_insert_before.attributes[i].name;
		}
	}


	if(GM_config.get('global_button_ctc'))
	{
		var spacer = document.createElement("span");
		spacer.id = "spacer_ctc";
		spacer.setAttribute(ngcontent, '');
		spacer.className = 'inter-filler';
		var btn = document.createElement("a");
		btn.id = "button_ctc";
		btn.href = "javascript:void(0)";
		btn.setAttribute(ngcontent, '');
		btn.setAttribute('class', 'toolbar-button ctc ng-star-inserted');
		btn.innerHTML = "<div " + ngcontent + "=\"\" class=\"toolbar-icon\" style=\"filter: invert(0.7);background-image: url(" + clipboardIcon + "); background-repeat: no-repeat;height: 23px;margin-top: 5px;margin-bottom: 2px;background-size: contain;background-position: center;\"></div><div " + ngcontent + "=\"\" class=\"toolbar-label\" >Export to Clipboard</div>";
// 		btn.innerHTML = "<div " + ngcontent + "=\"\" class=\"toolbar-icon\" style=\"filter: invert(0.7);background-image: url(" + clipboardIcon + "); background-repeat: no-repeat;height: 23px;margin-top: 5px;background-size: contain;background-position: center;\"></div><div " + ngcontent + "=\"\" class=\"toolbar-label\" style=\"display: inline;vertical-align: middle;font-size: 11px;width: 100%; line-height: 1rem;\">Export to Clipboard</div>";
		btn.onclick = export_data_to_clipboard;
// 		btn.style.cssText = 'position:absolute;top:0px;left:100px;width:120px;height:50px;text-align: center;-webkit-filter: grayscale(100%) brightness(150%);filter: grayscale(100%) brightness(150%);color: #f94b2e;text-decoration: none;';
// 		document.body.appendChild(btn2);
		node_to_insert_before.parentNode.insertBefore(btn,node_to_insert_before);
		node_to_insert_before.parentNode.insertBefore(spacer,node_to_insert_before);
	}

	if(GM_config.get('global_button_ctf'))
	{
		var spacer2 = document.createElement("span");
		spacer2.id = "spacer_ctf";
		spacer2.setAttribute(ngcontent, '');
		spacer2.className = 'inter-filler';
		var btn2 = document.createElement("a");
		btn2.id = "button_ctf";
		btn2.href = "javascript:void(0)";
		btn2.setAttribute(ngcontent, '');
		btn2.setAttribute('class', 'toolbar-button ctf ng-star-inserted');
		btn2.innerHTML = "<div " + ngcontent + "=\"\" class=\"toolbar-icon\" style=\"filter: invert(0.7);background-image: url(" + downloadIcon + "); background-repeat: no-repeat;height: 23px;margin-top: 5px;margin-bottom: 2px;background-size: contain;background-position: center;\"></div><div " + ngcontent + "=\"\" class=\"toolbar-label\">Export to File</div>";
		btn2.onclick = export_data_to_file;
// 		btn2.style.cssText = 'position:absolute;top:0px;left:' + pos_left + 'px;width:120px;height:50px;text-align: center;-webkit-filter: grayscale(100%) brightness(150%);filter: grayscale(100%) brightness(150%);text-decoration: none;';
// 		document.body.appendChild(btn2);
		node_to_insert_before.parentNode.insertBefore(btn2,node_to_insert_before);
		node_to_insert_before.parentNode.insertBefore(spacer2,node_to_insert_before);
	}
}

function export_data_to_clipboard () {
	export_data();
}
function export_data_to_file () {
	export_data(true);
}

function export_data (download = false) {
	var csvContent = "";
	var tbrows = document.getElementsByClassName("workoutrow");
	var data = [];

	var blacklist = GM_config.get('blacklist').split('\n');
	var delimiter = GM_config.get('delimiter');
	var duration_as_seconds = GM_config.get('duration_as_seconds');

	if(tbrows.length <= 0)
	{
		return;
	}

	for(var i = 0; i < tbrows.length; i++)
	{
		var exists = false;
		var tbrow = tbrows[i];
		var date = new Date(Date.parse(tbrow.cells[0].innerText.replace(/(\r\n|\n|\r)/gm," ")));
		var duration = tbrow.cells[1].innerText.replace(/(\r\n|\n|\r)/gm," ");
		var name = tbrow.cells[2].innerText.replace(/(\r\n|\n|\r)/gm," ");
		var kcal = tbrow.cells[3].innerText.replace(/(\r\n|\n|\r)/gm," ").replace("…","").replace(" ","");
		if(!blacklist.includes(name))
		{
			for(var j = 0; j < data.length; j++)
			{
				if(data[j][0] == date.toLocaleDateString("de-DE",{year: "numeric", month: "2-digit", day: "2-digit"}) && data[j][2] == name)
				{
					exists = true;
					data[j][1] = toSeconds(data[j][1]) + toSeconds(duration);
					data[j][3] = parseInt(data[j][3]) + parseInt(kcal);
				}
			}

			if(!exists)
			{
				var row = [date.toLocaleDateString("de-DE",{year: "numeric", month: "2-digit", day: "2-digit"}),toSeconds(duration),name,parseInt(kcal)];
				data.push(row);
			}
		}
	}

	for(var k = 0; k < data.length; k++)
	{
		if(duration_as_seconds)
		{
			csvContent += data[k][0] + delimiter + data[k][1] + delimiter + "\"" + data[k][2] + "\"" + delimiter + data[k][3] + "\r\n";
		}
		else
		{
			csvContent += data[k][0] + delimiter + fromSeconds(data[k][1]) + delimiter + "\"" + data[k][2] + "\"" + delimiter + data[k][3] + "\r\n";
		}
	}

	if(data.length > 1)
	{
		if(!download)
		{
			copyToClipboard(csvContent);
			alert("Table copied to clipboard!");
		}
		else
		{
			openSaveFileDialog(csvContent, "workouts.csv", "text/csv");
		}
	}
}

function openSaveFileDialog (data, filename, mimetype) {

  if (!data) return;

  var blob = data.constructor !== Blob
    ? new Blob([data], {type: mimetype || 'application/octet-stream'})
    : data ;

  if (navigator.msSaveBlob) {
    navigator.msSaveBlob(blob, filename);
    return;
  }

  var lnk = document.createElement('a'),
      url = window.URL,
      objectURL;

  if (mimetype) {
    lnk.type = mimetype;
  }

  lnk.download = filename || 'untitled';
  lnk.href = objectURL = url.createObjectURL(blob);
  lnk.dispatchEvent(new MouseEvent('click'));
  setTimeout(url.revokeObjectURL.bind(url, objectURL));

}

function copyToClipboard(text) {
	var dummy = document.createElement("textarea");
	document.body.appendChild(dummy);
	dummy.value = text;
	dummy.select();
	document.execCommand("copy");
	document.body.removeChild(dummy);
}

function str_pad_left(string,pad,length) {
	return (new Array(length+1).join(pad)+string).slice(-length);
}

function fromSeconds(sec) {
	var time = sec;
	var hours = Math.floor(time / 3600);
	time = time - hours * 3600;
	var minutes = Math.floor(time / 60);
	var seconds = time - minutes * 60;

	return str_pad_left(hours,'0',2) + ":" + str_pad_left(minutes,'0',2) + ":" + str_pad_left(seconds,'0',2);
}

function toSeconds(time) {
	if(time === parseInt(time, 10))
	{
		return parseInt(time);
	}

	var timeparts = time.split(":");

	if(timeparts.length == 3)
	{
		return parseInt(timeparts[2]) + parseInt(timeparts[1]) * 60 + parseInt(timeparts[0]) * 60 * 60;
	}
	else if(timeparts.length == 2)
	{
		return parseInt(timeparts[1]) + parseInt(timeparts[0]) * 60;
	}
	else
	{
		return parseInt(time);
	}
}
