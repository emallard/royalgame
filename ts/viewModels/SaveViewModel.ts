declare var $;

module game2
{
    export class SaveFilenameViewModel
    {
        filename = "";
        click: (sender:any, e:any) => void;
    }



    export class SaveViewModel
    {
        filenames = ko.observableArray<SaveFilenameViewModel>();
        filename = ko.observable("");
        fileContentCb:()=>string;

        onDialogOpen(fileContentCb:()=>string)
        {
            this.fileContentCb = fileContentCb;

            this.filenames.removeAll();

            $.ajax(
                {
                    method: 'POST',
                    url: '/api/scandir',
                    data: {dir:'./save'}
                }
            ).done(data =>
                {
                    var dataObj = JSON.parse(data);
                    for (var key in dataObj)
                    {
                        var f = dataObj[key];
                        var vm = new SaveFilenameViewModel();
                        vm.filename = f;
                        vm.click = (sender, e) => this.filename(sender.filename);
                        this.filenames.push(vm);
                    }
                });
        }

        saveClick()
        {
            var f = this.filename();
            if (!endsWith(f, '.json'))
            {
                f = f + '.json';
            }

            $.ajax(
                {
                    method: 'POST',
                    url: '/api/file_put_contents',
                    data: {
                        filename: './save/'+f,
                        content: this.fileContentCb()
                    }
                }
            ).done(data =>
                {
                    console.log("save ok");
                })
            .fail( () =>
                {
                    alert("save failed");
                })
        }

    }
}