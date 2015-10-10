// Ein Rechteck "korpus" wird erzeugt
// "korpus" werden diverse Eigenschaften zugewiesen
Rechteck("korpus")
Rechteck("fenster1")
Rechteck("fenster2")
Rechteck("fenster3")
Rechteck("fenster4")
Rechteck("fenster5")
ObjektGruppe("fenster1,fenster2,fenster3,fenster4,fenster5", "fenster")
ObjektGroesse("fenster", 50, 50)
ObjektFarbe("fenster", "white")
ObjektPosition("fenster", 20, 30)
ObjektPosition("fenster2", 80, "*")
ObjektPosition("fenster3", 140, "*")
ObjektPosition("fenster4", 200, "*")
ObjektPosition("fenster5", 260, "*")
ObjektEcken("fenster", 20)
ObjektGroesse("korpus", 310, 150)
ObjektFarbe("korpus", "red")
ObjektEcken("korpus", 40)
ObjektPosition("korpus", 10, 20)
Schrift("korpus", "<b>Hier klicken</b>")
SchriftAusrichtung("korpus", "zentriert")
SchriftZeilenhoehe("korpus", 170)
SchriftGroesse("korpus", 24)

// Zwei Kreise werden erzeugt
// und erhalten diverse Eigenschaften
Kreis("r1")
Kreis("r2")
ObjektGruppe("r1,r2", "rad")
ObjektGroesse("rad", 80)
ObjektFarbe("rad", "black")
ObjektPosition("rad", 30, 120)
ObjektPosition("r2", 210, "*")


// Kreise und korpus werden gruppiert
ObjektGruppe("rad,korpus,fenster", "bulli")

ObjektMaus("bulli", "klick")
ObjektKlick("bulli", {
	SchriftEntfernen("bulli")
	ObjektBewegen("bulli", 2, 1000, "*")
	Warten(2)
	ObjektBewegen("bulli", 2, 10, "*")
})