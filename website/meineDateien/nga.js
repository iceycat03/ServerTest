ObjektGroesse("Wand",1024,600)
ObjektFarbe("Wand","blue")
Rechteck("fr1")
ObjektGroesse("fr1",250,50)
ObjektFarbe("fr1","red")
Schrift("fr1","Das Quiz")
SchriftGroesse("fr1",50)
Rechteck("p1")
ObjektFarbe("p1","red")
ObjektGroesse("p1",300,50)
ObjektPosition("p1",300,150)
Schrift("p1","Mathe???")
SchriftGroesse("p1",50)
ObjektKlick("p1",{
	Eingabe("150:30=","",{
		Wenn(Wert gleich 5,{
			Meldung("richtig!")
		},{
			Meldung("falsch!")
		})
	})
},{})

Rechteck("p2")
ObjektFarbe("p2","red")
ObjektGroesse("p2",300,50)
ObjektPosition("p2",300,200)
Schrift("p2","Deutsch???")
SchriftGroesse("p2",50)
ObjektKlick("p2",{
	Eingabe("Die Toil???e","",{
		Wenn(Wert gleich "ett",{
			Meldung("richtig!")
		},{
			Meldung("falsch!")
		})
	})
})
Rechteck("p3")
ObjektFarbe("p3","red")
ObjektGroesse("p3",300,50)
ObjektPosition("p3",300,250)
Schrift("p3","Englisch???")
SchriftGroesse("p3",50)
ObjektKlick("p3",{
	Eingabe("Was tuhst du?","",{
		Wenn(Wert gleich "What are you doing?",{
			Meldung("richtig!")
		},{
			Meldung("falsch!")
		})
 	})
})
Rechteck("Zurück")
ObjektPosition("Zurück",0,550)
ObjektGroesse("Zurück",290,53)
ObjektFarbe("Zurück","blue")
Schrift("Zurück","back?")
SchriftFarbe("Zurück","red")
SchriftGroesse("Zurück",45)
ObjektKlick("Zurück",{
	Verweis("Gamelist.js")
})
