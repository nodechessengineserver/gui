function main(){       

    Globals.app=new App().build()

    Globals.app.logpane.log(new Misc.Logitem("log").info())

}

//localStorage.clear()

Gui.startupThen(main)

