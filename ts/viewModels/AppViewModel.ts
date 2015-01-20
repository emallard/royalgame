declare var saveAs;

module game2
{
    export class AppViewModel
    {
        areaViewModel = new AreaViewModel();
        loadSaveService = new LoadSaveService();
        saveViewModel = new SaveViewModel();
        openViewModel = new OpenViewModel();

        constructor() {
        }



        saveClick()
        {
            this.saveViewModel.onDialogOpen(() => this.getSavedString());
        }

        getSavedString()
        {
            return this.loadSaveService.save(this);
        }


        openClick()
        {
            this.openViewModel.onDialogOpen((content) => this.setSavedString(content));
        }

        setSavedString(content:string)
        {
            return this.loadSaveService.load(this, content);
        }

        save()
        {
            var savedString = this.getSavedString();
            var b = new Blob([savedString], {type: "text/plain;charset=UTF-8"});
            saveAs(b, "royalgame.json");
        }

        openChange(sender:any, evt:any)
        {
            var f = evt.target.files[0];
            var reader = new FileReader();

            reader.onload = (e) => {
                var text = reader.result;
                this.loadSaveService.load(this, text);
            };

            reader.readAsText(f);
        }

    }
}