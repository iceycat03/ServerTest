//menü:
Rechteck("menu")
ObjektQuelle("menu", "transparent")
ObjektGroesse("menu", 400, 400)
ObjektPosition("menu", 250, 100)
Rechteck("einfach", "menu")
Rechteck("schwer", "menu")
ObjektGroesse("einfach,schwer", 400, 100)
ObjektEcken("einfach,schwer", 100)
ObjektQuelle("einfach", "#6666ff")
ObjektQuelle("schwer", "#ff0000")
ObjektLinie("einfach,schwer", "#000000", 2)
ObjektMaus("einfach,schwer", "klick")
ObjektPosition("einfach", 0, 90)
ObjektPosition("schwer", 0, 210)
SchriftGroesse("menu", 40)
SchriftGroesse("einfach,schwer", 30)
SchriftAusrichtung("menu", "zentriert")
SchriftZeilenhoehe("einfach,schwer", 100)
SchriftFarbe("einfach,schwer", "white")
Schrift("einfach", "Einfach")
Schrift("schwer", "Schwer")
Schrift("menu", "Fang den Kreis!")

ObjektKlick("einfach", {
	Wiederholen(0.6, {
		ObjektBewegen("wesen", 0.5, Zufall(0, 350), Zufall(0, 350))
	})
	ObjektQuelle("wesen", ObjektQuelle("einfach")[0])
	ObjektBewegen("spiel", 1, 250, 100)
})

ObjektKlick("schwer", {
	Wiederholen(0.3, {
		ObjektBewegen("wesen", 0.2, Zufall(0, 350), Zufall(0, 350))
	})
	ObjektQuelle("wesen", ObjektQuelle("schwer")[0])
	ObjektBewegen("spiel", 1, 250, 100)
})

//spiel:
Rechteck("spiel")
ObjektQuelle("spiel", "#aadd00")
ObjektGroesse("spiel", 400, 400)
ObjektPosition("spiel", 250, -500)
ObjektLinie("spiel", "#000000", 2)
ObjektMaus("spiel", "fadenkreuz")
Schrift("spiel", "Fang den Kreis!")
SchriftGroesse("spiel", 40)
SchriftAusrichtung("spiel", "zentriert")
SchriftZeilenhoehe("spiel", 400)
SchriftFarbe("spiel", "#88bb00")

Kreis("wesen", "spiel")
ObjektGroesse("wesen", 50)
ObjektLinie("wesen", "#000000", 2)

Rechteck("status", "spiel")
ObjektGroesse("status", 400, 40)
ObjektQuelle("status", "#88bb00")
ObjektPosition("status", -2, 360)
ObjektLinie("status", "#000000", 2)
ObjektMaus("status", "standard")
Schrift("status", "Noch 9 Schüsse")
SchriftFarbe("status", "#000000")
SchriftZeilenhoehe("status", 40)
SchriftGroesse("status", 20)

ObjektKlickStart("wesen", {
	schuesse=10
	Meldung("Gewonnen!")
})

schuesse=9
ObjektKlickStart("spiel", {
	schuesse--
	WennGleich(schuesse, 0, {
		Meldung("Verloren!")
		schuesse=9
		SchriftEntfernen("status")
		Schrift("status", "Noch " +schuesse+ " Schüsse")
	}, {
		SchriftEntfernen("status")
		Schrift("status", "Noch " +schuesse+ " Schüsse")
	})
})