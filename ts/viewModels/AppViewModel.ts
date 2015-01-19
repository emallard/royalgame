declare var saveAs;

module game2
{
    export class AppViewModel
    {
        areaViewModel = new AreaViewModel();
        loadSaveService = new LoadSaveService();

        constructor() {
        }


        save()
        {
            var savedString = this.loadSaveService.save(this);
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