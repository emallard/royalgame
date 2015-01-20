declare var $;

module game2
{
    export class OpenFilenameViewModel
    {
        filename = "";
        click: (sender:any, e:any) => void;
    }



    export class OpenViewModel
    {
        filenames = ko.observableArray<OpenFilenameViewModel>();
        filename = ko.observable("");
        fileContentCb:(string)=>void;

        onDialogOpen(fileContentCb:(string)=>void)
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
                        var vm = new OpenFilenameViewModel();
                        vm.filename = f;
                        vm.click = (sender, e) => this.filename(sender.filename);
                        this.filenames.push(vm);
                    }
                });
        }

        openClick()
        {
            $.ajax(
                {
                    method: 'POST',
                    url: '/api/file_get_contents',
                    data: {
                        filename: './save/'+this.filename()
                    }
                }
            ).done(data =>
                {
                    console.log("open ok");
                    this.fileContentCb(data);
                })
            .fail( () =>
                {
                    alert("open failed");
                })
        }

    }
}