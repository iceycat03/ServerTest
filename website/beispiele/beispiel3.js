ObjektGroesse("Wand", 600, 600)
ObjektEcken("Wand", 20)
Kreis("figur")
ObjektGroesse("figur", 30)
ObjektQuelle("figur", "red")
rX=10
rY=0

Rechteck("punkte")
ObjektGroesse("punkte", 150, 20)
ObjektQuelle("punkte", "grey")
ObjektPosition("punkte", 225, "X")
Schrift("punkte", 0)
SchriftAusrichtung("punkte", "zentriert")
SchriftZeilenhoehe("punkte", 20)

baum=15
mkBaum = {
	Schleife(baum, {
		Rechteck("baum"+Durchlauf)
		ObjektGroesse("baum"+Durchlauf, 50, 50)
		ObjektQuelle("baum"+Durchlauf, "green")
		ObjektPosition("baum"+Durchlauf, Zufall(ObjektGroesse("figur")[0], ObjektGroesse("Wand")[0]-ObjektGroesse("baum"+Durchlauf)[0]), Zufall(ObjektGroesse("figur")[1], ObjektGroesse("Wand")[1]-ObjektGroesse("baum"+Durchlauf)[1]))
	})
	ObjektVorne("punkte")
}
Funktion(mkBaum)

punkte=0
punktFunc = {
	punkte+=baum
	Schrift("punkte", punkte)
}
Wiederholen(0.1, punktFunc)

bewegen={
	Schleife(baum, {
		ObjektBewegen("baum"+Durchlauf, 7, Zufall(0, ObjektGroesse("Wand")[0]-ObjektGroesse("baum"+Durchlauf)[0]), Zufall(0, ObjektGroesse("Wand")[1]-ObjektGroesse("baum"+Durchlauf)[1]))
	})
}

Funktion(bewegen)

Wiederholen(7, bewegen)

figur = { Wiederholen(0.05, {
	ObjektBewegenUm("figur", 0.03, rX, rY)
	WennKleiner(ObjektPosition("figur")[0], 0, {
		rX=10
		rY=0
		ObjektPosition("figur", 0, "X")
	})
	WennKleiner(ObjektPosition("figur")[1], 0, {
		rX=0
		rY=10
		ObjektPosition("figur", "X", 0)
	})
	WennGroesser(ObjektPosition("figur")[0], ObjektGroesse("Wand")[0]-ObjektGroesse("figur")[0], {
		rX=-10
		rY=0
		ObjektPosition("figur", ObjektGroesse("Wand")[0]-ObjektGroesse("figur")[0], "X")
	})
	WennGroesser(ObjektPosition("figur")[1], ObjektGroesse("Wand")[1]-ObjektGroesse("figur")[1], {
		rX=0
		rY=-10
		ObjektPosition("figur", "X", ObjektGroesse("Wand")[1]-ObjektGroesse("figur")[1])
	})
	
	Schleife(baum, {
		WennBeruehrt("baum"+Durchlauf, "figur", {
			Stoppen()
			ObjektStoppen("figur")
			Schrift("punkte", punkte)
			ObjektSichtbar("figur", 0)
			WennGroesser(punkte, SpeicherLesen("high"), {
				SpeicherSchreiben("high", punkte)
				Meldung("Highscore!")
			})
			Meldung("Du hast "+punkte+" Punkte!")
			rX=10
			rY=0
			punkte=0
			ObjektSichtbar("figur", 1)
			ObjektPosition("figur", 0, 0)
			Schleife(baum, {
				ObjektEntfernen("baum"+Durchlauf)
			})
			Wiederholen(0.1, punktFunc)
			Funktion(mkBaum)
			Funktion(bewegen)
			Wiederholen(7, bewegen)
			Funktion(figur)
		})
	})
}) }
Funktion(figur)

TastaturDruck("Rechts", {
	rX=10
	rY=0
})
TastaturDruck("Links", {
	rX=-10
	rY=0
})
TastaturDruck("Oben", {
	rX=0
	rY=-10
})
TastaturDruck("Unten", {
	rX=0
	rY=10
})