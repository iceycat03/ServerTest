ObjektGroesse("Wand",1024,600)
ObjektFarbe("Wand","grey")
Rechteck("Zurück")
ObjektPosition("Zurück",0,550)
ObjektGroesse("Zurück",290,53)
ObjektFarbe("Zurück","black")
Schrift("Zurück","Zurück")
SchriftFarbe("Zurück","red")
SchriftGroesse("Zurück",45)
ObjektKlick("Zurück",{Verweis("project.js")})
Rechteck("Busg")
ObjektGroesse("Busg",1024,60)
ObjektFarbe("Busg","red")
Schrift("Busg","1.Busgame")
SchriftGroesse("Busg",50)
ObjektKlick("Busg",{Verweis("Busgame.js")})
Rechteck("ego")
ObjektGroesse("ego",1024,60)
ObjektFarbe("ego","red")
ObjektPosition("ego",0,70)
Schrift("ego","2.Das Quiz")
SchriftGroesse("ego",50)
ObjektKlick("ego",{Verweis("nga.js")})
Rechteck("weit")
ObjektFarbe("weit","blue")
ObjektGroesse("weit",290,53)
ObjektPosition("weit",750,550)
ObjektKlick("weit",{
	Verweis("weitere.js")
})
Schrift("weit","Über")
SchriftGroesse("weit",53)
SchriftFarbe("weit","white")