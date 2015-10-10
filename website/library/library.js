/********************************************************
Eine freie JavaScript Bibliothek von Clemens Damke
Copyright:	2010-2012
Version:	2.2
Author:		Clemens Damke
Based on:	jQuery, jPlayer and jQuery Easing Plugin
********************************************************/

// Start
$(document).ready(function() {
	if(navigator.appName=="Netscape" || navigator.appName=="Opera") {
		kernel.Init.init(function() {
			function oeffnen(pfad) {
				$("#wrap").empty();
				$.get(unescape(pfad), {}, function(data) {
					eval(kernel.Init.check(data));
				}, "html");
			}
			
			if(!location.hash && $("#wrap").html() == "") {
				$("#wrap").append("<div style='text-align:center; margin-top:200px; font-size:25px;'>Name der jAnimation-Datei:</div><input type='text' id='datei' style='font-size:20px;background-color:#cccccc; padding:5px; width:400px; margin-left:250px; margin-top:50px;border:1px solid #aaaaaa;'><div style='text-align:center; margin-top:50px; font-size:20px;'>Beispiele:<br><a href='#' id='1' style='color:#ff0000;text-decoration:none;font-weight:bold;font-size:16px;'>Anf&auml;nger</a> &middot; <a href='#' id='2' style='color:#ff0000;text-decoration:none;font-weight:bold;font-size:16px;'>Fortgeschrittener</a> &middot; <a href='#' id='3' style='color:#ff0000;text-decoration:none;font-weight:bold;font-size:16px;'>Experte</a><br><br>Dokumentation:<br><a href='jAnimation-Befehle.pdf' style='color:#ff0000;text-decoration:none;font-weight:bold;font-size:16px;' target='_blank;'>PDF &ouml;ffnen</a></div>");
				$("#datei").change(function() {
					location.href="#"+escape($(this).val());
					location.reload();
				});
				$("a").click(function() {
					if($(this).attr("id"))
						oeffnen("beispiele/beispiel" +$(this).attr("id")+ ".js");
				});
			}
			else {
				h=location.hash;
				h=h.split("#");
				h=h[1];
				oeffnen("meineDateien/" +h);
			}
		});
	}
	else
		$("body").html("<h1>Ihr Browser wird leider nicht unterst&uuml;tzt!</h1>Verwenden Sie doch bitte Safari, Firefox oder Opera.");
});
//

var kernel = {
	tick:[],
	wart:[],
	tastDowns:[],
	objekte:{wrap:{0:"objekt"}},
	objekteOrder:[],
	BugdubVar:0,
	//soundEffectNum:0,
	tastActions:[[],[],[]],
	isArray: function(obj) {
		return(typeof(obj.length)=="undefined")?false:true;
	},
	px2int: function(num) {
		return String(num).split("p")[0]*1;
	},
	trimmen: function(str) {
		if(typeof(str) == "string")
			return String(str).replace(/^\s+|\s+$/g, '');
		return str;
	},
	lines2array: function(data) {
		data = data.split("\n");
		var dataNeu = [];
		for(var u=0;u<data.length;u++) {
			var zeile = data[u].split("\r");
			for(var w=0;w<zeile.length;w++)
				dataNeu.push(zeile[w]);
		}
		return dataNeu;
	},
	fileKernel: function(str) {
		parts=String(str).split(".");
		if(parts.length > 1)
			parts.pop();
		return parts.join(".");
	},
	deg2rad: function(z) {
		return (z*Math.PI/180);
	},
	fixTransform: function(z) {
		return Math.round(z.toFixed(15)*Math.pow(10,15))/Math.pow(10,15);
	},
	Init: {
		init: function(funktion) {
			$("noscript").remove();
			$.get("library/Konfiguration.txt", {}, function(data) {
				data=kernel.lines2array(data);
				for(var i=0;i<data.length;i++) {
					var wert=data[i].split(":");
					data[i]=wert[1];
				}
				var head="";
				var titel="jAnimation";
				var farbe="url('library/img/bg.gif')";
				var zeit=500;
				var effekt = "0.8); background-image:url(\"library/img/effekt.png\"); background-repeat:no-repeat;";
				if(data[0]==1) {
					head="<a href='javascript:location.replace(\"#\");location.reload()' style='position:absolute;top:10px;left:10px;color:#ff0000;font-weight:bold;text-decoration:none; width:200px;height:30px;line-height:30px;text-shadow:0 0 5px #000000;'>Home</a><h1 style='text-align:center; margin-top:20px;color:#ffffff;text-shadow:3px 3px 5px #000000; font-size:40px; display:none;'>jAnimation <sub style='font-size:22px;'>2.2</sub></h1>";
					if(location.hash) {
						zeit = 0;
						effekt = "1); ";
					}
					setTimeout(funktion, 0);
				}
				else {
					zeit = 0;
					effekt = "1); ";
					if(data[2]!=0)
						titel=data[2]
					if(data[1]!=0 && (!location.hash || location.hash=="#"))
						Einbinden(data[1]);
					else
						Einbinden(location.hash.split("#")[1])
					if(data[3]!=0)
						farbe=data[3];
				}
				
				$("body, div, span").css("margin", 0).css("padding", 0).css("font-size", "16px").css("font-family", "Helvetica").css("overflow", "hidden").css("cursor", "default");
				$("head").append("<title>"+titel+"</title>");
				$("body").attr("unselectable", "on").css({ background:farbe, mozUserSelect:"none", webkitUserSelect:"none", khtmlUserSelect:"none", userSelect:"none" }).append(head).append("<div id='wrap' style='width:900px;height:600px;background-color:rgba(255, 255, 255, "+effekt+" border:1px solid #444444; position:absolute; left:50%; top:50%; margin-left:-450px; margin-top:-300px; overflow:hidden;display:none;'></div>").append("<div id='music' style='display:none;'></div>").append("<div id='preloadBox' style='width:0;height:0;overflow:hidden;'></div>");
				if(data[0] == 1) $("h1").slideDown(2*zeit, function() {
					$("#wrap").show(zeit, function() {
						$("#wrap > input").focus();
					});
				});
				else $("#wrap").show();
			}, "html");
		},
		blockToFunction: function(data) {
			replaces=[
				[
					/(Warten.*)?{/g,
					function($0, $1) {
						if($1)
							return $0.replace(/\{/, "")+'function(e, Taste, Wert) {';
						return '\nfunction(e, Taste, Wert) {\n';
					}
				],
				[/MausOben/g, "MausOben(e)"],
				[/MausLinks/g, "MausLinks(e)"],
				[/Aufrufer/g, "this"],
				[/Liste\(/g, "new Array("],
				[/SchleifeAbbruch()/g, "break"],
				[/MathePi/g, "Math.PI"],
				[/MatheE/g, "Math.E"],
				[/ gleich /g, " == "],
				[/ ungleich /g, " != "],
				[/ groesser /g, " > "],
				[/ kleiner /g, " < "],
				[/ und /g, " && "],
				[/ oder /g, " || "],
				[/([^,\s\(]+) beruehrt ([^,\s\)]+)/g, "WennBeruehrt($1, $2)"]
			];
			
			for(var i=0;i<replaces.length;i++)
				data = data.replace(replaces[i][0], replaces[i][1]);
			return data;
		},
		funcCheck: function(data, option) {
			var names = ["Einbinden", "Warten", "VorladenBilder", "VorladenMusik", "VorladenVideos"];
			var optionals = [0, 1, 0, 0, 0];
			if(!option) {
				var doIt="";
				data=kernel.lines2array(data);
				for(var p=0;p<data.length;p++) {
					wert=data[p];
					for(var o=0;o<names.length;o++) {
						if(new RegExp(names[o], "g").exec(wert)) {
							nachKlammer=wert.split("(");
							nachKlammer.shift();
							vorKlammer=nachKlammer.join("(").split(")");
							vorKlammer.pop();
							param=vorKlammer.join(")");
							
							if(param.split(",").length<=1 || optionals[o]!=1) {
								data[p]=names[o]+"("+param+", function(e, Taste, Wert) {";
								doIt+="})";
							}
						}
					}
				}
				data[data.length-1] = doIt+data[data.length-1];
				return data.join("\n");
			}
			else {
				for(var p=0;p<names.length;p++)
					data=data.split(names[p]).join("Ungueltig");
				return data;
			}
		},
		checkEnde: function(data) {
			var jump=0;
			var dataString = data.join("\n");
			var funcPartArray = dataString.split("function(e, Taste, Wert) {");
			var anfang=funcPartArray[0]+"function(e, Taste, Wert) {";
			funcPartArray.shift();
			data = kernel.lines2array(funcPartArray.join("function(e, Taste, Wert) {"));
			for(var e=0;e<data.length;e++) {
				var wert=data[e];
				var ergebnis = wert.match(/function\(e\, Taste\, Wert\) {/g);
				if(ergebnis)
					jump=jump+ergebnis.length;
				ergebnis = wert.match(/\}/g);
				if(ergebnis) {
					if(jump==0) {
						var teil = data.slice(0, e+1);
						var tLast = teil[teil.length-1].split("}");
						var ende = "}"+tLast[tLast.length-1];
						tLast.pop();
						tLast = tLast.join("}");
						teil[teil.length-1] = tLast;
						
						return [teil.join("\n"), anfang, ende];
					}
					else
						jump=jump-ergebnis.length;
				}
				else if(jump>0) {
					var alt=data[e];
					data[e]=kernel.Init.funcCheck(data[e], 1);
				}
			}
			return [data.join("\n"), anfang, ""];
		},
		check: function(data) {
			data = kernel.lines2array(kernel.Init.blockToFunction("Funktion({\n"+data+"\n})"));
			var funktionen = [];
			var reg=/function\(e\, Taste\, Wert\) {/;
			for(var i=0;i<data.length;i++) {
				var wert=data[i];
				if(reg.exec(wert)) {
					var end = kernel.Init.checkEnde(data.slice(i, data.length));
					funktionen[funktionen.length] = [end[0], i, end[1], end[2]];
				}
			}
			for(var i=0;i<funktionen.length;i++) {
				var v=funktionen[i];
				v = [kernel.Init.funcCheck(v[0]), v[1], v[2], v[3]];
				
				var ausg = kernel.lines2array(v[2]+v[0]+v[3]);
				var durch=ausg.length;
				
				for(var e=0;e<durch;e++)
					data[e+v[1]] = ausg[e];
				
			}
			return data.join("\n");
		}
	},
	Run: {
		objekteSuch: function(name, index) {
			if(!kernel.objekte[name])
				return 0;
			if(!index)
				return kernel.objekte[name][0];
			else
				return kernel.objekte[name];
			//0:name nicht vorhanden
			//"gruppe":name ist gruppe
			//"objekt":name ist objekt
		},
		umwandlung: function(name, schrift) {
			if(typeof(name) != "object") {
				name=String(name).split(",");
				for(var q=0;q<name.length;q++) {
					if(kernel.Run.objekteSuch(name[q])=="objekt")
						name[q]="#"+name[q];
					else if(kernel.Run.objekteSuch(name[q])=="gruppe")
						name[q]="."+name[q];
					else if(name[q]=="Wand")
						name[q]="#wrap";
					if(schrift)
						name[q]=name[q]+ " span";
				}
				return name.join(", ");
			}
			else
				return "#" +name.id;
		},
		zZuteilung: function() {
			for(var i=0;i<kernel.objekteOrder.length;i++)
				$("#"+kernel.objekteOrder[i]).css("z-index", i+1);
		},
		platzhalter: function(wert, ersatz) {
			if(wert=="X" || wert=="*" || wert=="x")
				return ersatz;
			else
				return wert;
		},
		ausgabeKuerzen: function(array) {
			$.each(array, function(i,v) {
				array[i] = kernel.trimmen(v);
				if(isFinite(array[i]))
					array[i] = array[i]*1;
			});
			if(array.length < 2)
				return array[0];
			return array;
		},
		gruppenEcke: function(name) {
			var smallX="l";
			var smallY="l";
			$.each($(name), function(i,v) {
				var t=kernel.px2int($(v).css("top"));
				var l=kernel.px2int($(v).css("left"));
				if(t < smallY || smallY=="l")
					smallY=t;
				if(l < smallX || smallX=="l")
					smallX=l;
			});
			return [smallX, smallY];
		},
		gruppenEnde: function(name) {
			var bigX="l";
			var bigY="l";
			$.each($(name), function(i,v) {
				var wid=kernel.px2int($(v).css("width"));
				var hei=kernel.px2int($(v).css("height"));
				var t=kernel.px2int($(v).css("top"))+wid;
				var l=kernel.px2int($(v).css("left"))+hei;
				if(t > bigY || bigY=="l")
					bigY=t;
				if(l > bigX || bigX=="l")
					bigX=l;
			});
			return [bigX, bigY];
		},
		objekt: function(name, kindVon, art) {
			if(!kernel.Run.objekteSuch(name)) {
				if(kindVon==undefined)
					kindVon="#wrap";
				kindVon = kernel.Run.umwandlung(kindVon);
				var erg="rechtecke";
				var color="black";
				if(art==1)
					erg="kreise";
				else if(art==2) {
					erg="bilder";
					color="none";
				}
				else if(art==3)
					erg="videos";
				else if(art==4) {
					erg="sequenz";
					color="none;background-size:100% 100%";
				}
				var style = "position:absolute;top:0px;left:0px;width:100px;height:100px;background-color:"+color+";overflow:hidden;";
				$(kindVon).append("<div id='" +name+ "' style='"+style+"' name='" +erg+ "'></div>");
				kernel.objekte[name] = {0:"objekt"};
				kernel.objekteOrder.push(name);
				kernel.Run.zZuteilung();
			}
		},
		normalReturn: function(name, ret) {
			var ar=[];
			$.each($(name), function(i,v) {
				var id=$(v).attr("id");
				ar[i]=[];
				for(var e = 0; e < ret.length; e++) {
					var o = ret[e];
					var se;
					switch(o[0]) {
						case "css":
							se = $(v).css(o[1]);
							break;
						case "obj":
							se = kernel.objekte[id][o[1]];
							break;
						case "own":
							se = o[1](id,$(v));
					}
					if(o[2])
						se = o[2](se);
					ar[i][e] = se;
				}
				ar[i] = kernel.Run.ausgabeKuerzen(ar[i]);
			});
			return kernel.Run.ausgabeKuerzen(ar);
		},
		bgSrc: function(v) {
			return v.split("url('")[0].split(")")[0];
		},
		loopName: function(name, func) {
			$.each($(kernel.Run.umwandlung(name)), function(i,v) {
				var id = $(v).attr("id");
				var gruppe = $(v).attr("class");
				var name = $(v).attr("name");
				func({
					name:id,
					gruppe:gruppe,
					typ:name,
					objekt:$(v),
					index:i
				});
			});
		},
		easeDict: function(type) {
			switch(type) {
				case "beschleunigen":
					return "easeInQuad";
				case "entschleunigen":
					return "easeOutQuad";
				case "einwackeln":
					return "easeInElastic";
				case "auswackeln":
					return "easeOutElastic";
				case "aufprallen":
					return "easeOutBounce";
				case "zirkularbeschleunigen":
					return "easeInCirc";
				case "zirkularentschleunigen":
					return "easeOutCirc";
				default:
					return "linear";
			}
		},
		music: {
			playing: 0,
			sounds: true,
			path: "meineMusik",
			start: function(file, repeat, callback) {
				var t = this;
				if(!t.sounds)
					return;
				var chosen = t.playing;
				$("#music .m"+chosen).attr("class", "unstoppable");
				
				$("#music").append("<div class='m"+chosen+"'></div>");
				setTimeout(function() {
					$("#music .m"+chosen).jPlayer({
						ready: function(e) {
							$(this).jPlayer("setMedia", { mp3:t.path+"/"+file+".mp3" }).jPlayer("play");
							if(!e.jPlayer.html.used)
								$(this).data("noHtmlAudioSupport", true);
						},
						ended: function() {
							$(this).jPlayer(repeat?"play":"destroy");
							callback?callback():false;
							if(!repeat)
								$(this).remove();
						},
						supplied: "mp3",
						solution: "html,flash"
					});
				}, 0);
				t.playing++;
				if(t.playing>999999)
					t.playing = 0;
				return chosen;
			},
			end: function(play) {
				if(!this.sounds)
					return;
				$("#music .m"+play).jPlayer("destroy").remove();
			},
			mute: function(play) {
				if(!this.sounds)
					return;
				$("#music .m"+play).jPlayer("mute");
			},
			unmute: function(play) {
				if(!this.sounds)
					return;
				$("#music .m"+play).jPlayer("unmute");
			},
			activate: function() {
				this.sounds = true;
			},
			deactivate: function() {
				this.sounds = false;
			},
			toggle: function() {
				this.sounds = !this.sounds;
			},
			ready: function(play, f) {
				if(!this.sounds)
					return;
				var e = $("#music .m"+play);
				if(e.data("noHtmlAudioSupport"))
					f(play);
				else
					e.bind($.jPlayer.event.canplaythrough, function() {
						f(play);
					});
			}
		}
	}
};

/**
Creators
**/
function Rechteck(name, kindVon) {
	kernel.Run.objekt(name, kindVon, 0);
}
function Kreis(name, kindVon) {
	kernel.Run.objekt(name, kindVon, 1);
	ObjektGroesse(name, 100, 100);
}
function Bild(name, kindVon) {
	kernel.Run.objekt(name, kindVon, 2);
}
function Video(name, kindVon) {
	kernel.Run.objekt(name, kindVon, 3);
}
function Sequenz(name, kindVon) {
	kernel.Run.objekt(name, kindVon, 4);
	kernel.objekte[name]["seq"] = { pos:0, speed:0.05, timer:null, repeat:1, len:1 };
}
//

function ObjektGruppe(name, gruppe) {
	var elemente = String(name).split(",");
	name=kernel.Run.umwandlung(name);
	$(name).attr("class", gruppe);
	if(kernel.Run.objekteSuch(gruppe) == 0)
		kernel.objekte[gruppe] = {0:"gruppe"};
	for(var q=0;q<elemente.length;q++) {
		if(kernel.Run.objekteSuch(elemente[q]) == "gruppe")
			kernel.objekte[elemente[q]] = null;
	}
}

function ObjektName(name, neu) {
	var name2=kernel.Run.umwandlung(name);
	var name3=name2.split(", ");
	for(var i=0;i<name3.length;i++)
		name3[i]=name3[i].split("#")[1];
	if(!kernel.Run.objekteSuch(neu) && neu != undefined) {
		$(name2).attr("id", neu);
		kernel.objekte[neu] = kernel.objekte[name];
		kernel.objekte[name] = null;
	}
	return kernel.Run.ausgabeKuerzen(name3);
}

function ObjektPosition(name, posX, posY) {
	if(posX!==undefined && posY!==undefined)
		ObjektBewegen(name, 0, posX, posY);
	return kernel.Run.normalReturn(kernel.Run.umwandlung(name),[["css","left",kernel.px2int], ["css", "top",kernel.px2int]]);
}

function ObjektPositionUm(name, posX, posY) {
	name = kernel.Run.umwandlung(name);
	if(posX!==undefined && posY!==undefined)
		ObjektBewegenUm(name, 0, posX, posY);
}

function ObjektEcken(name, radius, s) {
	name = kernel.Run.umwandlung(name);
	if(radius!=undefined && ($(name).attr("name")!="kreise" || s)) {
		$(name).css("-webkit-border-radius", radius+"px").css("-moz-border-radius", radius+"px").css("-o-border-radius", radius+"px").css("border-radius", radius+"px");
		$.each($(name), function(i,v) {
			var id=$(v).attr("id");
			kernel.objekte[id]["radius"]=radius;
		});
	}
	return kernel.Run.normalReturn(name,[["obj","radius"]]);
}

function ObjektNeigung(name, winkel) {
	name = kernel.Run.umwandlung(name);
	if(winkel!=undefined) {
		$(name).css("-webkit-transform", "rotate("+winkel+"deg)").css("-moz-transform", "rotate("+winkel+"deg)").css("-o-transform", "rotate("+winkel+"deg)").css("transform", "rotate("+winkel+"deg)");
		$.each($(name), function(i,v) {
			var id=$(v).attr("id");
			kernel.objekte[id]["winkel"]=winkel;
		});
	}
	return kernel.Run.normalReturn(name,[["obj","winkel"]]);
}

function ObjektGroesse(name, breite, hoehe) {
	var nalt = name;
	name = kernel.Run.umwandlung(name);
	if(breite!=undefined)
		ObjektVerformen(name, 0, breite, hoehe);
	var nArr=name.split(", ");
	for(var i=0;i<nArr.length;i++)
		if(nArr[i]=="#wrap")
			$("#wrap").css("margin-left", breite/-2).css("margin-top", hoehe/-2);
	
	return kernel.Run.normalReturn(name,[["css","width",kernel.px2int], ["css", "height",kernel.px2int]]);
}

function ObjektSkalierung(name, faktor, dann) {
	ObjektSkalieren(name, 0, faktor, dann);
}

function ObjektAbstaende(name, mar, pad) {
	name = kernel.Run.umwandlung(name);
	if(mar!=undefined && pad!=undefined) {
		mar=kernel.Run.platzhalter(mar, kernel.px2int($(name).css("margin")));
		pad=kernel.Run.platzhalter(pad, kernel.px2int($(name).css("padding")));
		$(name).css({ margin:mar, padding:pad });
	}
	
	return kernel.Run.normalReturn(name,[["css","margin",kernel.px2int], ["css", "padding",kernel.px2int]]);
}

/**
Quelle
**/
function ObjektQuelle(name, farbe, bild) {
	var bgs=[];
	var i=0;
	kernel.Run.loopName(name, function(data) {
		var vName = data.typ;
		var id = data.name;
		var v = data.objekt;
		if(farbe) {
			if(vName == "bilder") {
				farbe=kernel.Run.platzhalter(farbe, v.children("img").css("src"));
				if(!v.children("img").attr("style"))
					v.append("<img alt='' style='width:100%;height:100%;position:absolute;display:none;z-index:0;'>");
				
				v.children("img").attr("src", "meineBilder/"+farbe).css("display", "block");
			}
			else if(vName == "sequenz") {
				farbe=kernel.Run.platzhalter(farbe, kernel.Run.bgSrc(v.css("background-image")));
				v.css({ backgroundImage:"url('meineBilder/" +farbe+ "')" });
			}
			else if(vName == "videos") {
				var datei = kernel.fileKernel(farbe);
				v.jPlayer("destroy").jPlayer({ ready:function() {
					$(this).jPlayer("setMedia", { m4v:"meineVideos/"+datei+".mov", ogv:"meineVideos/"+datei+".ogg" }).jPlayer("play");
				},
				ended:function() {
					$(this).jPlayer("destroy");
					var i = kernel.objekte[id];
					if(i["vidDone"])
						i["vidDone"]();
				},
				supplied:"m4v,ogv", solution:"html,flash" });
				kernel.objekte[id][5] = farbe;
			}
			else {
				farbe=kernel.Run.platzhalter(farbe, v.css("background-color"));
				v.css("background-color", farbe);
				if(farbe=="transparent")
					v.css("background", "none");
				if(bild) {
					bild=kernel.Run.platzhalter(bild, v.css("background-image"));
					v.css("background-image", "url('meineBilder/" +bild+ "')");
				}
			}
		}
		//return
		if(vName != "bilder" && vName != "videos")
			bgs[i]=[v.css("background-color"), kernel.Run.bgSrc(v.css("background-image"))];
		else if(vName == "bilder") {
			var img = v.children("img").attr("src").split("/");
			img.shift();
			bgs[i] = img.join("/");
		}
		else
			bgs[i]=kernel.objekte[id][5];
		i++;
	});
	
	return kernel.Run.ausgabeKuerzen(bgs);
}

function ObjektFarbe(name, farbe, bild) {
	return ObjektQuelle(name, farbe, bild);
}

function ObjektLinie(name, farbe, dicke, stil) {
	name = kernel.Run.umwandlung(name);
	if(farbe && dicke!=undefined) {
		switch(stil) {
			case "3D":
				stil = "outset";
				break;
			case "gestrichelt":
				stil = "dashed";
				break;
			case "gepunktet":
				stil = "dotted";
				break;
			default:
				stil = "solid";
				break;
		}
		$(name).css("border", dicke+ "px " +stil+ " " +farbe);
		$.each($(name), function(i,v) {
			var id=$(v).attr("id");
			kernel.objekte[id][3]=[farbe, dicke, stil];
		});
	}
	return kernel.Run.normalReturn(name,[["obj",3,function(v) {
		return !v?[0,0,0]:v;
	}]]);
}

function ObjektSichtbar(name, sichtbar) {
	ObjektVerblassen(name, 0, sichtbar);
	
	name=kernel.Run.umwandlung(name);
	return kernel.Run.normalReturn(name,[["css","opacity"]]);
}

function ObjektMaus(name, zeiger) {
	name = kernel.Run.umwandlung(name);
	
	switch(zeiger) {
		case "klick":
			zeiger = "pointer";
			break;
		case "fadenkreuz":
			zeiger = "crosshair";
			break;
		case "bewegen":
			zeiger = "move";
			break;
		case "warten":
			zeiger = "wait";
			break;
		default:
			zeiger = "default";
			break;
	}
	if(zeiger!=undefined)
		$(name).css("cursor", zeiger);
	
	return kernel.Run.normalReturn(name,[["css","cursor"]]);
}

/**
Schrift
**/
function Schrift(name, text) {
	name = kernel.Run.umwandlung(name);
	if(text!=undefined) {
		$.each($(name), function(i,v) {
			var id = $(v).attr("id");
			$("#"+id+" > span").empty().remove();
		});
		$(name).append("<span>" +text+ "</span>");
	}
	return kernel.Run.normalReturn(name,[["own",function(id,e) {
		return e.children("span").html();
	}]]);
}

function SchriftArt(name, art) {
	name = kernel.Run.umwandlung(name);
	if(art)
		$(name).css("font-family", art);
	
	return kernel.Run.normalReturn(name,[["css","font-family"]]);
}
function SchriftGroesse(name, groesse) {
	name = kernel.Run.umwandlung(name);
	if(groesse!=undefined)
		$(name).css("font-size", groesse+"px");
	
	return kernel.Run.normalReturn(name,[["css","font-size",kernel.px2int]]);
}
function SchriftFarbe(name, farbe) {
	name = kernel.Run.umwandlung(name);
	if(farbe)
		$(name).css("color", farbe);
	
	return kernel.Run.normalReturn(name,[["css","color"]]);
}
function SchriftAusrichtung(name, richtung) {
	name = kernel.Run.umwandlung(name);
	if(richtung) {
		switch(richtung) {
			case "block":
				richtung = "justify";
				break;
			case "zentriert":
				richtung = "center";
				break;
			case "rechts":
				richtung = "right";
				break;
			case "links":
				richtung = "left";
				break;
			default:
				break;
		}
		$(name).css("text-align", richtung);
	}
	
	return kernel.Run.normalReturn(name,[["css","text-align"]]);
}
function SchriftDicke(name, dicke) {
	name = kernel.Run.umwandlung(name);
	if(dicke)
		$(name).css("font-weight", dicke=="fett"?"bold":"normal");
	
	return kernel.Run.normalReturn(name,[["css","font-weight", function(v) {
		return v=="bold"?"fett":"normal";
	}]]);
}

function SchriftZeilenhoehe(name, hoehe) {
	name = kernel.Run.umwandlung(name);
	if(hoehe!=undefined)
		$(name).css("line-height", hoehe+"px");
		
	return kernel.Run.normalReturn(name,[["css","line-height",kernel.px2int]]);
}

function SchriftHintergrund(name, farbe, bild) {
	name = kernel.Run.umwandlung(name, 1);
	if(farbe) {
		farbe=kernel.Run.platzhalter(farbe, $(name).css("background-color"));
		if(farbe=="transparent")
			farbe="none";
		$(name).css("background-color", farbe);
		if(farbe=="transparent")
			$(name).css("background", farbe);
	}
	if(bild) {
		bild=kernel.Run.platzhalter(bild, $(name).css("background-image"));
		$(name).css("background-image", "url('" +bild+ "')");
	}
	
	return kernel.Run.normalReturn(name,[["css","background-color"],["css","background-image",kernel.Run.bgSrc]]);
}

function SchriftSichtbar(name, sichtbar) {
	name = kernel.Run.umwandlung(name, 1);
	if(sichtbar!=undefined)
		$(name).css("opacity", sichtbar);
	
	return kernel.Run.normalReturn(name,[["css","opacity"]]);
}

function Stoppen(aktion) {
	if(!aktion) {
		$.each(kernel.tick, function(i, v) {
			clearInterval(v);
		});
		kernel.tick = [];
		$.each(kernel.wart, function(i, v) {
			clearTimeout(v);
		});
		kernel.wart = [];
	}
	else {
		if(aktion[2]) {
			clearInterval(aktion[0]);
			kernel.tick = ListeLoeschen(kernel.tick, aktion[1]);
		}
		else {
			clearTimeout(aktion[0]);
			kernel.wart = ListeLoeschen(kernel.wart, aktion[1]);
		}
	}	
}

function Warten(zeit, code, special) {
	if(!code)
		code=function(){};
	if(!special)
		kernel.wart.push(setTimeout(code, zeit*1000));
	else
		setTimeout(code, zeit*1000);
	var added = kernel.wart.length-1;
	return [kernel.wart[added], added, 0];
}

function Wiederholen(zeit, code) {
	if(!code)
		code="";
	kernel.tick.push(setInterval(code, zeit*1000));
	var added = kernel.tick.length-1;
	return new Array(kernel.tick[added], added, 1);
}

function ObjektBewegen(name, zeit, posX, posY, fertig, art) {
	if(!fertig)
		fertig=function(){};
	var small=kernel.Run.gruppenEcke(kernel.Run.umwandlung(name));
	var smallX=small[0];
	var smallY=small[1];
	
	kernel.Run.loopName(name, function(data) {
		var v = data.objekt;
		var t=kernel.px2int(v.css("top"));
		var l=kernel.px2int(v.css("left"));
		var changes = { top:(posY+(t-smallY)+"px"), left:(posX+(l-smallX)+"px") };
		if(smallX == posX)
			delete changes["left"]
		if(smallY == posY)
			delete changes["top"]
		changes.top = kernel.Run.platzhalter(changes.top, t)
		changes.left = kernel.Run.platzhalter(changes.left, l)
		v.animate(changes, { queue:false, duration:zeit*1000, easing:kernel.Run.easeDict(art), complete:fertig });
		fertig=function(){};
	});
}

function ObjektBewegenUm(name, zeit, posX, posY, fertig, art) {
	var small=kernel.Run.gruppenEcke(kernel.Run.umwandlung(name));
	ObjektBewegen(name, zeit, posX+small[0], posY+small[1], fertig, art);
}

function ObjektVerformen(name, zeit, breite, hoehe, fertig, art) {
	if(!fertig)
		fertig=function(){};
	kernel.Run.loopName(name, function(data) {
		var v = data.objekt;
		var halt = kernel.px2int(v.css("height"));
		var walt = kernel.px2int(v.css("width"));
		if(data.typ=="kreise") {
			var h=breite;
			if(h < halt)
				Warten(zeit, function(){ ObjektEcken(data.name, h, 1); }, 1);
			else
				ObjektEcken(data.name, h, 1);
		}
		else
			var h=hoehe;
		var changes = { width:breite+"px", height:h+"px" };
		if(halt == h)
			delete changes["height"];
		if(walt == breite)
			delete changes["width"];
		v.animate(changes, { queue:false, duration:zeit*1000, easing:kernel.Run.easeDict(art), complete:fertig });
		fertig=function(){};
	});
}

function ObjektSkalieren(name, zeit, faktor, fertig, art, small) {
	if(!fertig)
		fertig=function(){};
	
	if(!small)
		small=kernel.Run.gruppenEcke(kernel.Run.umwandlung(name));
	var groupX=small[0];
	var groupY=small[1];
	
	kernel.Run.loopName(name, function(data) {
		var v = data.objekt;
		var y=kernel.px2int(v.css("top"));
		var x=kernel.px2int(v.css("left"));
		var newy=(y-groupY)*faktor+groupY;
		var newx=(x-groupX)*faktor+groupX;
		var breite=kernel.px2int(v.css("width"))*faktor;
		var hoehe=kernel.px2int(v.css("height"))*faktor;
		if(data.typ=="kreise") {
			var h=breite;
			if(faktor>1)
				ObjektEcken(data.name, h, 1);
			else
				Warten(zeit, function(){ ObjektEcken(data.name, h, 1); }, 1);
		}
		else
			var h=hoehe;
		
		var gr=SchriftGroesse(data.name)*faktor;
		var lh=SchriftZeilenhoehe(data.name)*faktor;
		var linie=ObjektLinie(data.name)[1]*faktor;
		v.animate({ top:newy+"px", left:newx+"px", width:breite+"px", height:h+"px", fontSize:gr+"px", lineHeight:lh+"px", borderWidth:linie+"px" }, { queue:false, duration:zeit*1000, easing:kernel.Run.easeDict(art), complete:fertig });
		fertig=function(){};
		var afterChilds=[];
		$.each(v.children(), function(i,v) {
			if($(v).attr("id"))
				afterChilds.push($(v).attr("id"));
		});
		if(afterChilds.length > 0)
			ObjektSkalieren(afterChilds.join(","), zeit, faktor, function(){}, 0, new Array(0, 0));
	});
	
}
function ObjektVerblassen(name, zeit, op, fertig, art) {
	name = kernel.Run.umwandlung(name);
	if(!fertig)
		fertig=function(){};
	var i = 0;
	if(op>0)
		$(name).css("display", "block");
	$(name).animate({ opacity:op }, { queue:false, duration:zeit*1000, easing:kernel.Run.easeDict(art), complete:function(e, Taste, Wert) {
		var t = this;
		if(op==0)
			$(t).css("display", "none");
		if(i==0)
			setTimeout(function() {
				fertig.call(t, e);
			}, 0);
		i++;
	} });
}

function Zufall(von, bis) {
	von=von*1;
	bis=bis*1;
	return Math.round(Math.random()*(bis-von))+von;
}

function Runden(zahl) {
	return Math.round(zahl*1);
}

function Meldung(text) {
	window.alert(text);
	window.focus();
}

function Abfrage(text, tue, sonst) {
	var a=window.confirm(text);
	window.focus();
	(a?tue:(sonst?sonst:function(){}))();
}

function Eingabe(text, pre, tue, sonst) {
	var a=window.prompt(text, pre);
	window.focus();
	(a?tue:(sonst?sonst:function(){}))(null,null,a);
}

function ObjektKlick(name, aktion) {
	name = kernel.Run.umwandlung(name);
	if(!aktion)
		aktion=function(){};
	$(name).click(aktion);
}

function ObjektKlickStart(name, aktion) {
	name = kernel.Run.umwandlung(name);
	if(!aktion)
		aktion=function(){};
	$(name).mousedown(aktion);
}

function ObjektBeruehren(name, aktion) {
	name = kernel.Run.umwandlung(name);
	if(!aktion)
		aktion=function(){};
	$(name).mouseenter(aktion);
}

function ObjektVerlassen(name, aktion) {
	name = kernel.Run.umwandlung(name);
	if(!aktion)
		aktion=function(){};
	$(name).mouseleave(aktion);
}

function ObjektDoppelKlick(name, aktion) {
	name = kernel.Run.umwandlung(name);
	if(!aktion)
		aktion=function(){};
	$(name).dblclick(aktion);
}

function ObjektStreichen(name, aktion) {
	name = kernel.Run.umwandlung(name);
	if(!aktion)
		aktion=function(){};
	$(name).mousemove(aktion);
}

function ObjektDublizieren(namen, anhang, ziel) {
	namen=String(namen).split(",");
	for(var z=0;z<namen.length;z++) {
		name=namen[z];
		if(kernel.objekte[name]) {
			if(kernel.objekte[name][0]=="gruppe")
				kernel.objekte[name+anhang] = ["gruppe"];
			name = kernel.Run.umwandlung(name);
			$.each($(name), function(i,v) {
				var videoDo = 0;
				var neueId = $(v).attr('id')+anhang;
				var nameAttr = $(v).attr('name');
				if(!kernel.objekte[neueId]) {
					var c="";
					if($(v).attr('class'))
						c = " class='" +($(v).attr('class')+anhang)+ "'";
					if(!ziel)
						ziel=$(v).parent();
					ziel.append("<div id='" +neueId+ "'" +c+ " style='" +$(v).attr('style')+ "' name='" +nameAttr+ "'></div>");
					neueIdObj = $("#"+neueId);
					if(nameAttr != "videos") {
						neueIdObj.html($(v).html());
						$.each(neueIdObj.children(), function(i,v) {
							if($(v).is("div"))
								$(v).remove();
						});
					}
					else
						videoDo = 1;
					
					var meta=kernel.objekte[$(v).attr("id")];
					kernel.objekte[neueId] = $.extend(true, {}, kernel.objekte[$(v).attr("id")]);
					if(videoDo)
						ObjektQuelle(neueId, kernel.objekte[$(v).attr("id")][5]);
					var afterChilds=[];
					$(v).children("div").each(function(i,v) {
						if($(v).attr("id"))
							afterChilds.push($(v).attr("id"));
					});
					kernel.Run.zZuteilung();
					if(afterChilds.length > 0)
						ObjektDublizieren(afterChilds.join(","), anhang, neueIdObj)
				}
			});
		}
	}
}

function ObjektStoppen(name) {
	name = kernel.Run.umwandlung(name);
	$(name).stop();
}

function ObjektEntfernen(name) {
	kernel.Run.loopName(name, function(data) {
		if(data.typ == "sequenz")
			SequenzStoppen(data.name);
		delete kernel.objekte[data.name];
		data.objekt.empty().remove();
	});
}

function ObjektVorne(name) {
	kernel.Run.loopName(name, function(data) {
		for(var e=0;e<kernel.objekteOrder.length;e++)
			if(kernel.objekteOrder[e]==data.name)
				break;
		kernel.objekteOrder.splice(e, 1);
		kernel.objekteOrder.push(data.name);
	});
	kernel.Run.zZuteilung();
}

function ObjektHinten(name) {
	kernel.Run.loopName(name, function(data) {
		for(var e=0;e<kernel.objekteOrder.length;e++)
			if(kernel.objekteOrder[e]==data.name)
				break;
		kernel.objekteOrder.splice(e, 1);
		kernel.objekteOrder.unshift(data.name);
	});
	kernel.Run.zZuteilung();
}

function SchriftEntfernen(name) {
	Schrift(name, "")
}

function MausLinks(e) {
	var b = kernel.px2int($("#wrap").css("width"));
	var b = (window.innerWidth-b)/2;
	return e.pageX-b;
}

function MausOben(e) {
	var b = kernel.px2int($("#wrap").css("height"));
	var b = (window.innerHeight-b)/2;
	return e.pageY-b;
}

/**
Musik
**/
function MusikStoppen(m) {
	kernel.Run.music.end(m);
}

function Musik(datei, repeat, f) {
	var datei = kernel.fileKernel(datei);
	return kernel.Run.music.start(datei, repeat=="endlos", f);
}

function MusikStumm(m, t) {
	kernel.Run.music.mute(m);
}
function MusikLaut(m, t) {
	kernel.Run.music.unmute(m);
}

function MusikAktivieren() {
	kernel.Run.music.activate();
}
function MusikDeaktivieren() {
	kernel.Run.music.deactivate();
}


/**
Video
**/
function VideoStoppen(name) {
	name = kernel.Run.umwandlung(name);
	$(name).jPlayer("pause");
}
function VideoAbspielen(name) {
	name = kernel.Run.umwandlung(name);
	$(name).jPlayer("play");
}
function VideoBeendet(name, func) {
	kernel.objekte[name]["vidDone"] = func;
}

/**
Logik
**/
function WennGleich(w1, w2, dann, sonst) {
	if(w1 == w2){
		if(dann)
			(dann)();
		return 1;
	}
	else if(sonst)
		(sonst)();
	return 0;
}
function WennGroesser(w1, w2, dann, sonst) {
	if(w1 > w2){
		if(dann)
			(dann)();
		return 1;
	}
	else if(sonst)
		(sonst)();
	return 0;
}
function WennKleiner(w1, w2, dann, sonst) {
	if(w1 < w2) {
		if(dann)
			(dann)();
		return 1;
	}
	else if(sonst)
		(sonst)();
	return 0;
}
function WennNichtGleich(w1, w2, dann, sonst) {
	if(w1 != w2) {
		if(dann)
			(dann)();
		return 1;
	}
	else if(sonst)
		(sonst)();
	return 0;
}

function WennBeruehrt(o1, o2, dann, sonst) {
	var o = [];
	o[0] = kernel.Run.umwandlung(o1);
	o[1] = kernel.Run.umwandlung(o2);
	for(var i=0;i<2;i++)
		o[i] = new Array(kernel.Run.gruppenEcke(o[i]), kernel.Run.gruppenEnde(o[i]));
	//array: [objekt][obere/untere kante][x oder y]
	for(var u=0;u<2;u++) {
		var correct = new Array(0, 0);
		for(var i=0;i<2;i++) {
			for(var e=0;e<2;e++) {
				o1ie1=o[1][i][e];
				o1ie2=o[1][i][e];
				if(i==0)
					o1ie1 = o[1][i][e]+1;
				else
					o1ie2 = o[1][i][e]-1;
				if(o1ie1 > o[0][0][e] && o1ie2 < o[0][1][e])
					correct[e] = 1;
			}
		}
		if(correct[0] == 1 && correct[1] == 1) {
			if(dann)
				(dann)();
			return 1;
		}
		o=o.reverse();
	}
	if(sonst)
		(sonst)();
	return 0;
}

function Wenn(ausdruck, dann, sonst) {
	if(ausdruck) {
		if(dann)
			(dann)();
		return 1;
	}
	else if(sonst)
		(sonst)();
	return 0;	
}

function Schleife(anzahl, funktion) {
	for(Durchlauf=1;Durchlauf<=anzahl;Durchlauf++)
		(funktion)();
}

/**
Verweise
**/
function Neuladen() {
	location.reload();
}
function Verweis(programm) {
	location.href="#"+programm;
	location.reload();
}
function Internet(url, target) {
	target=="neu"?window.open(url, "jAnimationFenster"):location.href=url;
}
function Einbinden(programm, funktion) {
	if(!funktion)
		funktion = function() {};
	$.get("meineDateien/"+programm, {}, function(data) {
		console.log(kernel.Init.check(data));
		eval(kernel.Init.check(data));
		funktion();
	}, "html");
}
function Funktion(func) {
	func();
}

/**
Tastatur
**/
function tastAuswertung(typ, eve) {
	if(eve) {
		var chosen = "";
		switch(eve) {
			case 13:
				chosen = "Enter";
				break;
			case 27:
				chosen = "Escape";
				break;
			case 37:
				chosen = "Links";
				break;
			case 38:
				chosen = "Oben";
				break;
			case 39:
				chosen = "Rechts";
				break;
			case 40:
				chosen = "Unten";
				break;
			case 32:
				chosen = "Leertaste";
				break;
			default:
				if(eve>47&&eve<58)
					chosen = eve-48;
				else
					chosen = String.fromCharCode(eve);
				break;
		}
		
		if(kernel.tastActions[typ][chosen])
			kernel.tastActions[typ][chosen](null, chosen);
		
		if(kernel.tastActions[typ]["Immer"])
			kernel.tastActions[typ]["Immer"](null, chosen);
	}
}
$(document).keydown(function(a) {
	a = a.keyCode;
	if(!kernel.tastDowns[a])
		tastAuswertung(2, a);
	tastAuswertung(0, a);
	kernel.tastDowns[a] = true;
}).keyup(function(a) {
	a = a.keyCode;
	kernel.tastDowns[a] = false;
	tastAuswertung(1, a);
});

function TastaturHalten(taste, funktion) {
	if(!funktion)
		funktion = function() {};
	taste=taste.split(",");
	for(var t=0;t<taste.length;t++)
		kernel.tastActions[0][taste[t]] = funktion;
}
function TastaturLoslassen(taste, funktion) {
	if(!funktion)
		funktion = function() {};
	taste=taste.split(",");
	for(var t=0;t<taste.length;t++)
		kernel.tastActions[1][taste[t]] = funktion;
}
function TastaturDruck(taste, funktion) {
	if(!funktion)
		funktion = function() {};
	taste=String(taste).split(",");
	for(var t=0;t<taste.length;t++)
		kernel.tastActions[2][taste[t]] = funktion;
}

/**
Zwischenspeicher
**/
function SpeicherSchreiben(key, wert) {
	var ex=new Date();
	ex.setTime(ex.getTime()+(5*365*24*60*60*1000));
	if(navigator.cookieEnabled)
		document.cookie = key+"="+wert+"; expires=" +ex.toGMTString();
}
function SpeicherLesen(key) {
	var cook = document.cookie;
	cook = cook.split(";");
	for(var t=0;t<cook.length;t++) {
		var wert=cook[t];
		wert=wert.split("=");
		if(kernel.trimmen(wert[0]) == kernel.trimmen(key))
			return wert[1];
	}
	return 0;
}

/**
Listen
**/
function ListeErweitern(list, objekt) {
	liste = [];
	for(var i=0; i<list.length; i++)
		liste.push(list[i]);
	liste[liste.length] = objekt;
	return liste;
}

function ListeVerbinden(liste1, liste2) {
	liste = [];
	for(var i=0; i<liste1.length; i++)
		liste.push(liste1[i]);
	return liste.concat(liste2);
}

function ListeLoeschen(liste, key) {
	var p1 = liste.slice(0, key);
	var p2 = liste.slice(key+1);
	return p1.concat(p2);
}

function ListeLaenge(list) {
	return list.length;
}

function ListeAusText(text, trenner) {
	return String(text).split(trenner);
}
function ListeZuText(liste, binder) {
	return liste.join(binder);
}

/**
Preloading
**/
function VorladenBilder(liste, f) {
	var preloadDone = 0;
	var loadImg = [];
	for(var s=0;s<liste.length;s++) {
		loadImg[s] = new Image();
		loadImg[s].src = "meineBilder/"+liste[s];
		loadImg[s].onLoad = (function() { preloadDone++; if(preloadDone>=liste.length) (f)(); })();
	}
}
function VorladenMusik(liste, f) {
	var preloadDone = 0;
	for(var s=0;s<liste.length;s++) {
		var datei = kernel.fileKernel(liste[s]);
		/*$("#preloadBox").append("<div name='prel"+s+"M'></div>");
		$("#preloadBox [name=prel"+s+"M]").jPlayer({ ready:function() { $(this).jPlayer("setMedia", { mp3:"meineMusik/"+datei+".mp3", oga:"meineMusik/"+datei+".ogg", wav:"meineMusik/"+datei+".wav" }).jPlayer("play"); }, canplaythrough:function() { $(this).remove(); preloadDone++; if(preloadDone>=liste.length) (f)(); }, muted:1, supplied:"mp3,oga,wav", solution:"html,flash" });*/
		var m = kernel.Run.music.start(datei, false);
		kernel.Run.music.ready(m, function(ended) {
			kernel.Run.music.end(ended);
			preloadDone++;
			if(preloadDone>=liste.length)
				f();
		});
		kernel.Run.music.mute(m);
	}
}
function VorladenVideos(liste, f) {
	var preloadDone = 0;
	for(var s=0;s<liste.length;s++) {
		var datei = kernel.fileKernel(liste[s]);
		$("#preloadBox").append("<div name='prel"+s+"V'></div>");
		$("#preloadBox div[name=prel"+s+"V]").jPlayer({
			ready: function(e) {
				$(this).jPlayer("setMedia", { m4v:"meineVideos/"+datei+".mov", ogv:"meineVideos/"+datei+".ogg" }).jPlayer("play");
				if(!e.jPlayer.html.used)
					f();
			},
			loadeddata: function() {
				$(this).remove();
				preloadDone++;
				if(preloadDone>=liste.length)
					f(); 
			},
			muted: 1,
			supplied: "m4v,ogv",
			solution: "html,flash"
		});
	}
}

/**
Mathe
**/
function MatheWurzel(rad, exp) {
	if(!exp)
		exp = 2;
	var m = 1;
	if(rad < 0 && exp%2 != 0)
		m = -1;
	rad = Math.abs(rad);
	return kernel.fixTransform(Math.pow(rad, 1/exp)*m);
}
function MathePotenz(bas, exp) {
	return kernel.fixTransform(Math.pow(bas, exp));
}
function MatheLogarithmus(bas, exp) {
	return kernel.fixTransform(Math.log(bas)/Math.log(exp));
}
function MatheSinus(w) {
	return kernel.fixTransform(Math.sin(kernel.deg2rad(w)));
}
function MatheCosinus(w) {
	return kernel.fixTransform(Math.cos(kernel.deg2rad(w)));
}
function MatheTangens(w) {
	return kernel.fixTransform(Math.tan(kernel.deg2rad(w)));
}

function MatheArcusSinus(w) {
	return kernel.fixTransform(Math.asin(kernel.deg2rad(w)));
}
function MatheArcusCosinus(w) {
	return kernel.fixTransform(Math.acos(kernel.deg2rad(w)));
}
function MatheArcusTangens(w) {
	return kernel.fixTransform(Math.atan(kernel.deg2rad(w)));
}

/**
Sequenz
**/
function SequenzPosition(name, i) {
	kernel.Run.loopName(name, function(data) {
		var meta = kernel.objekte[data.name].seq;
		if(i) {
			i--;
			if(i>=meta.len)
				i %= meta.len;
			meta.pos = i;
			data.objekt.css({ backgroundPosition:"-"+(i*kernel.px2int(data.objekt.css("width")))+"px 0px" });
		}
	});
	
	return kernel.Run.normalReturn(kernel.Run.umwandlung(name),[["obj", "seq", function(v) {
		return v.pos+1;
	}]]);
}
function SequenzLaenge(name, i) {
	kernel.Run.loopName(name, function(data) {
		if(i) {
			kernel.objekte[data.name].seq.len = i;
			data.objekt.css({ backgroundSize:(100*i)+"% 100%" });
		}
	});
	return kernel.Run.normalReturn(kernel.Run.umwandlung(name),[["obj", "seq", function(v) {
		return v.len;
	}]]);
}
function SequenzStarten(name, callback) {
	kernel.Run.loopName(name, function(data) {
		var meta = kernel.objekte[data.name].seq;
		var z = 0;
		meta.timer = setInterval(function() {
			if(z == meta.len)
				z = 0;
			SequenzPosition(data.name, SequenzPosition(data.name)+1); //+1: versatz, +1: nullpunktdifferenz
			if(z == meta.len-2 && !meta.repeat) {
				clearInterval(meta.timer);
				if(callback)
					callback();
			}
			z++;
		}, meta.speed*1000);
	});
}
function SequenzStoppen(name) {
	kernel.Run.loopName(name, function(data) {
		var t = kernel.objekte[data.name].seq.timer;
		if(t)
			clearInterval(t);
	});
}
function SequenzGeschwindigkeit(name, i) {
	kernel.Run.loopName(name, function(data) {
		if(i)
			kernel.objekte[data.name].seq.speed = i;
	});
	return kernel.Run.normalReturn(kernel.Run.umwandlung(name),[["obj", "seq", function(v) {
		return v.speed;
	}]]);
}
function SequenzWiederholen(name, i) {
	kernel.Run.loopName(name, function(data) {
		if(i != undefined)
			kernel.objekte[data.name].seq.repeat = i*1;
	});
	return kernel.Run.normalReturn(kernel.Run.umwandlung(name),[["obj", "seq", function(v) {
		return v.repeat;
	}]]);
}