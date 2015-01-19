
module game2
{
    export class LoadSaveService
    {

        public load(appVm:AppViewModel, content:string)
        {
            var savedData:SavedData = JSON.parse(content);
            appVm.areaViewModel.cubeViewModels.removeAll();
            savedData.blocks.forEach((b) =>
            {
                var cubeVm = new CubeViewModel();
                cubeVm.cssId(b.cssId);
                cubeVm.cube().setMinMax(b.cube.min, b.cube.max);

                appVm.areaViewModel.cubeViewModels.push(cubeVm);
            });
        }

        public save(appVm:AppViewModel):string
        {

            var cubeVms:CubeViewModel[] = appVm.areaViewModel.cubeViewModels();

            var savedData:any = {};
            savedData.blocks = [];

            cubeVms.forEach((cubeVm)=>
            {
                var savedBlock = new SavedBlock();
                savedBlock.cssId = cubeVm.cssId();
                savedBlock.cube = cubeVm.cube();

                savedData.blocks.push(savedBlock);
            });


            return JSON.stringify(savedData);
        }
    }
}
