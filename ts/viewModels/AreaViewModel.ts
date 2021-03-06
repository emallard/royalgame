
declare var $;

module game2
{
    export class AreaViewModel
    {
        cubeViewModels  = ko.observableArray<CubeViewModel>([]);
        cursorBlockViewModel = new CubeViewModel();

        private cursorBlockPos: number[];
        private currentHeight:number = 0;
        private currentBlock:string = "blocks/GrassBlock.png";

        view2d:View2d = new View2d();

        buttonViewModels= ko.observableArray<ButtonViewModel>([]);


        cubes : Cube[] = [];

        isAddMode = true;

        isMouseDown:boolean = false;
        isMouseDrag:boolean = false;
        dragStartX:number;
        dragStartY:number;
        dragStartBounds = [0,0,0,0];


        constructor()
        {
            this.cursorBlockPos = [0,0,0];
            this.cursorBlockViewModel.cssId("images/CursorBlock.png");

            /*
            var c = new Cube();
            c.min = [0,0,0];
            c.max = [1,1,1];
            this.addCube(c, "StoneBlock");

            var c2 = new Cube();
            c2.min = [1,0,0];
            c2.max = [2,1,1];
            this.addCube(c2, "GrassBlock");

            var c3 = new Cube();
            c3.min = [1,1,0];
            c3.max = [2,2,1];
            this.addCube(c3, "WaterBlock");
            */

            $.get('/api/get_blocks',(data) =>
            {
                var dataObj = JSON.parse(data);
                for (var key in dataObj)
                {
                    this.buttonViewModels.push(
                        new ButtonViewModel().set(dataObj[key], [1, 1, 1], (btn)=>this.onBtnClick(btn))
                    );
                }
                var zreerzrez= 0;
            });
        }

        onMouseUp(sender:any, e:any)
        {
            this.isMouseDown = false;
        }

        onMouseDown(sender:any, e:any)
        {
            var eoffsetX = (e.offsetX || e.clientX - $(e.target).offset().left + window.pageXOffset ),
                eoffsetY = (e.offsetY || e.clientY - $(e.target).offset().top + window.pageYOffset );

            this.isMouseDrag = e.which == 2 || e.shiftKey == true;
            this.isMouseDown = true;



            if (!this.isMouseDrag)
            {
                var cube = new Cube();
                this.getCubeUnderMouse(eoffsetX, eoffsetY, cube);
                if (this.isAddMode)
                {

                    this.addCube(cube, this.currentBlock);
                }
                else
                {
                    this.removeCube(cube);
                }
            }

            else
            {
                this.dragStartX = eoffsetX;
                this.dragStartY = eoffsetY;
                for (var i=0;i<4;++i)
                {
                    this.dragStartBounds[i] = this.view2d.bounds[i];
                }
            }



        }

        onMouseMove(sender:any, e:any)
        {
            var eoffsetX = (e.offsetX || e.clientX - $(e.target).offset().left + window.pageXOffset ),
                eoffsetY = (e.offsetY || e.clientY - $(e.target).offset().top + window.pageYOffset );


            if (this.isMouseDown && this.isMouseDrag)
            {
                var dx = this.dragStartX - eoffsetX;
                var dy = this.dragStartY - eoffsetY;
                var diffBounds = [0,0];
                this.view2d.windowVectorToWorld2d([dx, dy], diffBounds);
                this.view2d.setBounds4(
                    this.dragStartBounds[0] + diffBounds[0],
                    this.dragStartBounds[1] + diffBounds[1],
                    this.dragStartBounds[2] + diffBounds[0],
                    this.dragStartBounds[3] + diffBounds[1]
                );
                return;
            }


            var cube = new Cube();
            this.getCubeUnderMouse(eoffsetX, eoffsetY, cube);

            //console.log(JSON.stringify(cube.min));
            this.cursorBlockViewModel.setCube(cube);
        }

        onMouseWheel(sender:any, e:any)
        {
            var delta = e.originalEvent.deltaY > 0 ? -1 : 1;
            this.view2d.zoomRelative(delta, [350,350]);
        }

        getCubeUnderMouse(x:number, y:number, dest:Cube)
        {
            var pickedPoint = [0,0,0];
            this.view2d.windowTo3d([x, y], this.currentHeight, pickedPoint);

            // console.log("" + pickedPoint[0] + ", " + pickedPoint[1] + ", " + pickedPoint[2]);
            // snap picked point to cube
            dest.min[0] = Math.floor(pickedPoint[0]);
            dest.min[1] = Math.floor(pickedPoint[1]);
            dest.min[2] = pickedPoint[2];

            dest.max[0] = dest.min[0] + 1;
            dest.max[1] = dest.min[1] + 1;
            dest.max[2] = dest.min[2] + 1;
        }

        heightPlus()            { this.setEditHeight(this.currentHeight+1); }
        heightMinus()           { this.setEditHeight(this.currentHeight-1); }


        onBtnClick(btn:ButtonViewModel):void
        {
            this.currentBlock = btn.image;
            this.isAddMode = true;
        }

        onDelClick():void
        {
            this.isAddMode = false;
        }



        zoomPlus()  {this.view2d.zoomRelative(+1, [350,350]);}
        zoomMinus() {this.view2d.zoomRelative(-1, [350,350]);}


        addCube(cube:Cube, cssId:string)
        {
            //console.log("insert cube at : " + cube.toString());

            var vm = new CubeViewModel();
            vm.setCube(cube);
            vm.cssId(cssId);
            this.cubes.push(cube);
            this.cubeViewModels.push(vm);
        }

        removeCube(cube:Cube)
        {
            var foundVm = this.getCubeViewModelAt(cube.min[0], cube.min[1], cube.min[2]);
            this.cubeViewModels.remove(foundVm);
        }

        getCubeViewModelAt(i:number, j:number, k:number)
        {
            var vms = this.cubeViewModels();
            var _i,len = vms.length;
            for (_i=0; _i<len; ++_i)
            {
                var vm = vms[_i];
                if (vm.cube().min[0] == i && vm.cube().min[1] == j && vm.cube().min[2] == k)
                {
                    return vm;
                }
            }
            return null;
        }
/*
        updateNeighbourShadows(cube:Cube)
        {
            var x = cube.min[0];
            var y = cube.min[1];
            var z = cube.min[2];

            for (var i=-1; i<=1; ++i)
            {
                for (var j=-1; j<=1; ++j)
                {
                    for (var k=-1; k<=1; ++k)
                    {
                        this.updateCubeShadows(x+2*i, y+2*j, z+k);
                    }
                }
            }
        }

        updateCubeShadows(i:number, j:number, k:number)
        {
            var vm = this.getCubeViewModelAt(i, j, k);
            if (vm != null)
            {
                //console.log("update shadows found at : " + i +","+j+","+k + " - " + vm.cube.toString());
                this.shadowComputer.setCubes(this.cubes);
                vm.setShadows(this.shadowComputer.getShadows(vm.cube));
            }
            else
            {
                //console.log("update shadows not found at : " + i +","+j+","+k);
            }
        }
*/
        setEditHeight(height:number)
        {
            console.log("setHeight: " + height);
            this.currentHeight = height;
            var a = this.cubeViewModels();
            ko.utils.arrayForEach(a,
                    vm =>
                {
                    var isNb = (vm.cube().max[2] != height);
                    vm.setCssNb(isNb);
                });
        }
    }
}
