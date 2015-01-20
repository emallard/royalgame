var game2;
(function (game2) {
    var LoadSaveService = (function () {
        function LoadSaveService() {
        }
        LoadSaveService.prototype.load = function (appVm, content) {
            var savedData = JSON.parse(content);
            appVm.areaViewModel.cubeViewModels.removeAll();
            savedData.blocks.forEach(function (b) {
                var cubeVm = new game2.CubeViewModel();
                cubeVm.cssId(b.cssId);
                cubeVm.cube().setMinMax(b.cube.min, b.cube.max);
                appVm.areaViewModel.cubeViewModels.push(cubeVm);
            });
        };
        LoadSaveService.prototype.save = function (appVm) {
            var cubeVms = appVm.areaViewModel.cubeViewModels();
            var savedData = {};
            savedData.blocks = [];
            cubeVms.forEach(function (cubeVm) {
                var savedBlock = new game2.SavedBlock();
                savedBlock.cssId = cubeVm.cssId();
                savedBlock.cube = cubeVm.cube();
                savedData.blocks.push(savedBlock);
            });
            return JSON.stringify(savedData);
        };
        return LoadSaveService;
    })();
    game2.LoadSaveService = LoadSaveService;
})(game2 || (game2 = {}));
var game2;
(function (game2) {
    var SavedData = (function () {
        function SavedData() {
            this.blocks = [];
        }
        return SavedData;
    })();
    game2.SavedData = SavedData;
    var SavedBlock = (function () {
        function SavedBlock() {
        }
        return SavedBlock;
    })();
    game2.SavedBlock = SavedBlock;
})(game2 || (game2 = {}));
var game2;
(function (game2) {
    var Rectangle = (function () {
        function Rectangle() {
            this.min = [0, 0];
            this.max = [1, 1];
        }
        return Rectangle;
    })();
    game2.Rectangle = Rectangle;
})(game2 || (game2 = {}));
var game2;
(function (game2) {
    var callbackWithTag = (function () {
        function callbackWithTag(tag, callback) {
            this.tag = tag;
            this.callback = callback;
        }
        return callbackWithTag;
    })();
    game2.callbackWithTag = callbackWithTag;
    var View2d = (function () {
        function View2d() {
            this.width = 700;
            this.height = 700;
            this.bounds = [0, 0, 700, 700];
            this.boundsChanged = [];
            this.tmpWorld = [0, 0];
            this.tmpRect = new game2.Rectangle();
            this.tmpPt1 = [0, 0];
            this.tmpPt2 = [0, 0];
        }
        View2d.prototype.getCubeZIndex = function (cube) {
            return -(cube.min[1] * 10000 - cube.min[2] * 100);
        };
        View2d.prototype.windowTo3d = function (point, planeHeight, dest) {
            this.windowToWorld2d(point, this.tmpWorld);
            this.world2dToPoint(this.tmpWorld, planeHeight, dest);
        };
        View2d.prototype.cubeToWindowRectangle = function (cube, dest) {
            this.cubeToRect(cube, this.tmpRect);
            this.rectToWindow(this.tmpRect, dest);
            // offset a cause de l'espace au dessus
            dest.top -= 50;
            dest.height += 50;
            dest.zIndex = this.getCubeZIndex(cube);
        };
        View2d.prototype.cubeToRect = function (cube, dest) {
            this.pointToWorld2d(cube.min, dest.min);
            this.pointToWorld2d(cube.max, dest.max);
        };
        View2d.prototype.world2dToPoint = function (point2, height, dest) {
            dest[0] = point2[0] / 100;
            dest[2] = height;
            dest[1] = (point2[1] - 40 * height) / 80;
        };
        // 1 en hauteur : 40px
        // 1 en largeur : 100 px
        // 1 en profondeur : 80px
        View2d.prototype.pointToWorld2d = function (point3, dest) {
            dest[0] = 100 * point3[0];
            dest[1] = 80 * point3[1] + 40 * point3[2];
        };
        View2d.prototype.rectToWindow = function (rect, dest) {
            this.world2dToWindow(rect.min, this.tmpPt1);
            this.world2dToWindow(rect.max, this.tmpPt2);
            dest.left = this.tmpPt1[0];
            dest.top = this.tmpPt2[1];
            dest.width = this.tmpPt2[0] - this.tmpPt1[0];
            dest.height = this.tmpPt1[1] - this.tmpPt2[1];
        };
        View2d.prototype.world2dToWindow = function (w, dest) {
            var minX = this.bounds[0];
            var minY = this.bounds[1];
            var maxX = this.bounds[2];
            var maxY = this.bounds[3];
            var rx = (w[0] - minX) / (maxX - minX);
            var ry = (w[1] - minY) / (maxY - minY);
            var cx = rx * this.width;
            var cy = this.height * (1 - ry);
            dest[0] = cx;
            dest[1] = cy;
        };
        View2d.prototype.windowToWorld2d = function (c, dest) {
            var minX = this.bounds[0];
            var minY = this.bounds[1];
            var maxX = this.bounds[2];
            var maxY = this.bounds[3];
            var rx = c[0] / this.width;
            var ry = 1 - c[1] / this.height;
            var wx = (1 - rx) * minX + rx * maxX;
            var wy = (1 - ry) * minY + ry * maxY;
            dest[0] = wx;
            dest[1] = wy;
        };
        View2d.prototype.windowVectorToWorld2d = function (v, dest) {
            var minX = this.bounds[0];
            var minY = this.bounds[1];
            var maxX = this.bounds[2];
            var maxY = this.bounds[3];
            dest[0] = v[0] / this.width * (maxX - minX);
            dest[1] = -v[1] / this.height * (maxY - minY);
        };
        View2d.prototype.zoomRelative = function (delta, mouseXY) {
            var cx = mouseXY[0];
            var cy = mouseXY[1];
            var coeff = delta > 0 ? 0.9 : 1.1;
            var minX = this.bounds[0];
            var minY = this.bounds[1];
            var maxX = this.bounds[2];
            var maxY = this.bounds[3];
            var wxy = [0, 0];
            this.windowToWorld2d(mouseXY, wxy);
            var wx = wxy[0];
            var wy = wxy[1];
            var k = coeff * (maxX - minX);
            var newMinX = -1 * (k * cx / this.width - wx);
            var newMaxX = k + newMinX;
            k = coeff * (maxY - minY);
            var newMinY = k * (cy / this.height - 1) + wy;
            var newMaxY = k + newMinY;
            this.setBounds4(newMinX, newMinY, newMaxX, newMaxY);
        };
        View2d.prototype.setWindowSize = function (width, height) {
            this.width = width;
            this.height = height;
        };
        View2d.prototype.setBounds = function (bounds) {
            this.setBounds4(bounds[0], bounds[1], bounds[2], bounds[3]);
        };
        View2d.prototype.setBounds4 = function (xMin, yMin, xMax, yMax) {
            this.bounds[0] = xMin;
            this.bounds[1] = yMin;
            this.bounds[2] = xMax;
            this.bounds[3] = yMax;
            this.boundsChanged.forEach(function (f) { return f.callback(); });
        };
        View2d.prototype.pushBoundChanged = function (tag, callback) {
            //console.log("push BoundChanged to view " + this.__uniqueId);
            this.boundsChanged.push(new callbackWithTag(tag, callback));
        };
        View2d.prototype.removeBoundChanged = function (tag) {
            var len = this.boundsChanged.length;
            for (var i = 0; i < len; ++i) {
                if (this.boundsChanged[i].tag == tag) {
                    this.boundsChanged.splice(i, 1);
                    return;
                }
            }
            console.error("removeBoundChanged not found");
        };
        return View2d;
    })();
    game2.View2d = View2d;
})(game2 || (game2 = {}));
var game2;
(function (game2) {
    var WindowRectangle = (function () {
        function WindowRectangle() {
        }
        return WindowRectangle;
    })();
    game2.WindowRectangle = WindowRectangle;
})(game2 || (game2 = {}));
function getViewData(element) {
    return $(element).data('view');
}
function setViewData(element) {
    var elt = $(element).parent()[0];
    while (elt != undefined && elt != null) {
        var view = $(elt).data('view');
        if (view != undefined) {
            $(element).data('view', view);
            return view;
        }
        elt = $(elt).parent()[0];
    }
    alert("view not found in DOM");
    return undefined;
}
ko.bindingHandlers['cube'] = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var view = setViewData(element);
        var callback = function () {
            ko.bindingHandlers['cube'].update(element, valueAccessor, allBindingsAccessor, viewModel, null);
        };
        view.pushBoundChanged(element, callback);
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            //var debugCounter = $(element).data('vue2PointsDebugCounter');
            //console.log("dispose points #" + debugCounter);
            view.removeBoundChanged(element);
        });
    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var observable = valueAccessor();
        var cube = observable();
        var view = getViewData(element);
        var rectangle = new game2.WindowRectangle();
        view.cubeToWindowRectangle(cube, rectangle);
        $(element).css({
            top: rectangle.top,
            left: rectangle.left,
            width: rectangle.width,
            height: rectangle.height,
            zIndex: rectangle.zIndex
        });
    }
};
ko.bindingHandlers['view'] = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        var view = value;
        $(element).data('view', view);
        console.log("view setWindowSize");
        console.log($(element).width(), ", ", $(element).height());
        view.setWindowSize($(element).width(), $(element).height());
        ko.bindingHandlers['view'].update(element, valueAccessor, allBindingsAccessor, viewModel, null);
    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        var view = getViewData(element);
    }
};
ko.bindingHandlers['background'] = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        $(element).css({
            "background": "url(css/" + value + ") no-repeat",
            "background-size": "100% auto"
        });
    }
};
var game2;
(function (game2) {
    var AppViewModel = (function () {
        function AppViewModel() {
            this.areaViewModel = new game2.AreaViewModel();
            this.loadSaveService = new game2.LoadSaveService();
        }
        AppViewModel.prototype.save = function () {
            var savedString = this.loadSaveService.save(this);
            var b = new Blob([savedString], { type: "text/plain;charset=UTF-8" });
            saveAs(b, "royalgame.json");
        };
        AppViewModel.prototype.openChange = function (sender, evt) {
            var _this = this;
            var f = evt.target.files[0];
            var reader = new FileReader();
            reader.onload = function (e) {
                var text = reader.result;
                _this.loadSaveService.load(_this, text);
            };
            reader.readAsText(f);
        };
        return AppViewModel;
    })();
    game2.AppViewModel = AppViewModel;
})(game2 || (game2 = {}));
var game2;
(function (game2) {
    var AreaViewModel = (function () {
        function AreaViewModel() {
            var _this = this;
            this.cubeViewModels = ko.observableArray([]);
            this.cursorBlockViewModel = new game2.CubeViewModel();
            this.currentHeight = 0;
            this.currentBlock = "blocks/GrassBlock.png";
            this.view2d = new game2.View2d();
            this.buttonViewModels = ko.observableArray([]);
            this.cubes = [];
            this.isAddMode = true;
            this.isMouseDown = false;
            this.isMouseDrag = false;
            this.dragStartBounds = [0, 0, 0, 0];
            this.cursorBlockPos = [0, 0, 0];
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
            $.get('/api/get_blocks', function (data) {
                var dataObj = JSON.parse(data);
                for (var key in dataObj) {
                    _this.buttonViewModels.push(new game2.ButtonViewModel().set(dataObj[key], [1, 1, 1], function (btn) { return _this.onBtnClick(btn); }));
                }
                var zreerzrez = 0;
            });
        }
        AreaViewModel.prototype.onMouseUp = function (sender, e) {
            this.isMouseDown = false;
        };
        AreaViewModel.prototype.onMouseDown = function (sender, e) {
            var eoffsetX = (e.offsetX || e.clientX - $(e.target).offset().left + window.pageXOffset), eoffsetY = (e.offsetY || e.clientY - $(e.target).offset().top + window.pageYOffset);
            this.isMouseDrag = e.which == 2 || e.shiftKey == true;
            this.isMouseDown = true;
            if (!this.isMouseDrag) {
                var cube = new game2.Cube();
                this.getCubeUnderMouse(eoffsetX, eoffsetY, cube);
                if (this.isAddMode) {
                    this.addCube(cube, this.currentBlock);
                }
                else {
                    this.removeCube(cube);
                }
            }
            else {
                this.dragStartX = eoffsetX;
                this.dragStartY = eoffsetY;
                for (var i = 0; i < 4; ++i) {
                    this.dragStartBounds[i] = this.view2d.bounds[i];
                }
            }
        };
        AreaViewModel.prototype.onMouseMove = function (sender, e) {
            var eoffsetX = (e.offsetX || e.clientX - $(e.target).offset().left + window.pageXOffset), eoffsetY = (e.offsetY || e.clientY - $(e.target).offset().top + window.pageYOffset);
            if (this.isMouseDown && this.isMouseDrag) {
                var dx = this.dragStartX - eoffsetX;
                var dy = this.dragStartY - eoffsetY;
                var diffBounds = [0, 0];
                this.view2d.windowVectorToWorld2d([dx, dy], diffBounds);
                this.view2d.setBounds4(this.dragStartBounds[0] + diffBounds[0], this.dragStartBounds[1] + diffBounds[1], this.dragStartBounds[2] + diffBounds[0], this.dragStartBounds[3] + diffBounds[1]);
                return;
            }
            var cube = new game2.Cube();
            this.getCubeUnderMouse(eoffsetX, eoffsetY, cube);
            //console.log(JSON.stringify(cube.min));
            this.cursorBlockViewModel.setCube(cube);
        };
        AreaViewModel.prototype.onMouseWheel = function (sender, e) {
            var delta = e.originalEvent.deltaY > 0 ? -1 : 1;
            this.view2d.zoomRelative(delta, [350, 350]);
        };
        AreaViewModel.prototype.getCubeUnderMouse = function (x, y, dest) {
            var pickedPoint = [0, 0, 0];
            this.view2d.windowTo3d([x, y], this.currentHeight, pickedPoint);
            // console.log("" + pickedPoint[0] + ", " + pickedPoint[1] + ", " + pickedPoint[2]);
            // snap picked point to cube
            dest.min[0] = Math.floor(pickedPoint[0]);
            dest.min[1] = Math.floor(pickedPoint[1]);
            dest.min[2] = pickedPoint[2];
            dest.max[0] = dest.min[0] + 1;
            dest.max[1] = dest.min[1] + 1;
            dest.max[2] = dest.min[2] + 1;
        };
        AreaViewModel.prototype.heightPlus = function () {
            this.setEditHeight(this.currentHeight + 1);
        };
        AreaViewModel.prototype.heightMinus = function () {
            this.setEditHeight(this.currentHeight - 1);
        };
        AreaViewModel.prototype.onBtnClick = function (btn) {
            this.currentBlock = btn.image;
            this.isAddMode = true;
        };
        AreaViewModel.prototype.onDelClick = function () {
            this.isAddMode = false;
        };
        AreaViewModel.prototype.zoomPlus = function () {
            this.view2d.zoomRelative(+1, [350, 350]);
        };
        AreaViewModel.prototype.zoomMinus = function () {
            this.view2d.zoomRelative(-1, [350, 350]);
        };
        AreaViewModel.prototype.addCube = function (cube, cssId) {
            //console.log("insert cube at : " + cube.toString());
            var vm = new game2.CubeViewModel();
            vm.setCube(cube);
            vm.cssId(cssId);
            this.cubes.push(cube);
            this.cubeViewModels.push(vm);
        };
        AreaViewModel.prototype.removeCube = function (cube) {
            var foundVm = this.getCubeViewModelAt(cube.min[0], cube.min[1], cube.min[2]);
            this.cubeViewModels.remove(foundVm);
        };
        AreaViewModel.prototype.getCubeViewModelAt = function (i, j, k) {
            var vms = this.cubeViewModels();
            var _i, len = vms.length;
            for (_i = 0; _i < len; ++_i) {
                var vm = vms[_i];
                if (vm.cube().min[0] == i && vm.cube().min[1] == j && vm.cube().min[2] == k) {
                    return vm;
                }
            }
            return null;
        };
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
        AreaViewModel.prototype.setEditHeight = function (height) {
            console.log("setHeight: " + height);
            this.currentHeight = height;
            var a = this.cubeViewModels();
            ko.utils.arrayForEach(a, function (vm) {
                var isNb = (vm.cube().max[2] != height);
                vm.setCssNb(isNb);
            });
        };
        return AreaViewModel;
    })();
    game2.AreaViewModel = AreaViewModel;
})(game2 || (game2 = {}));
var game2;
(function (game2) {
    var ButtonViewModel = (function () {
        function ButtonViewModel() {
            this.image = "";
            this.dimensions = [1, 1, 1];
        }
        ButtonViewModel.prototype.set = function (image, dimensions, clickCb) {
            this.image = image;
            this.clickCb = clickCb;
            for (var i = 0; i < 3; ++i) {
                this.dimensions[i] = dimensions[i];
            }
            return this;
        };
        ButtonViewModel.prototype.click = function () {
            if (this.clickCb != null) {
                this.clickCb(this);
            }
        };
        return ButtonViewModel;
    })();
    game2.ButtonViewModel = ButtonViewModel;
})(game2 || (game2 = {}));
var game2;
(function (game2) {
    var Cube = (function () {
        function Cube() {
            this.min = [0, 0, 0];
            this.max = [1, 1, 1];
        }
        Cube.prototype.setFrom = function (cube) {
            var newMin = this.min;
            var newMax = this.max;
            for (var i = 0; i < 3; ++i) {
                newMin[i] = cube.min[i];
                newMax[i] = cube.max[i];
            }
        };
        Cube.prototype.setMinMax = function (_min, _max) {
            var newMin = this.min;
            var newMax = this.max;
            for (var i = 0; i < 3; ++i) {
                newMin[i] = _min[i];
                newMax[i] = _max[i];
            }
        };
        Cube.prototype.toString = function () {
            var min = this.min;
            var max = this.max;
            return min[0] + "," + min[1] + "," + min[2] + " | " + max[0] + "," + max[1] + "," + max[2];
        };
        return Cube;
    })();
    game2.Cube = Cube;
})(game2 || (game2 = {}));
var game2;
(function (game2) {
    var CubeViewModel = (function () {
        function CubeViewModel() {
            this.cssId = ko.observable();
            this.cube = ko.observable(new game2.Cube());
            this.isNb = ko.observable(false);
        }
        CubeViewModel.prototype.setCssNb = function (isNb) {
            this.isNb(isNb);
        };
        CubeViewModel.prototype.setCube = function (cube) {
            var c = new game2.Cube();
            c.setFrom(cube);
            this.cube(c);
        };
        CubeViewModel.prototype.setCubeMinMax = function (min, max) {
            var c = new game2.Cube();
            c.setMinMax(min, max);
            this.cube(c);
        };
        return CubeViewModel;
    })();
    game2.CubeViewModel = CubeViewModel;
})(game2 || (game2 = {}));
var game2;
(function (game2) {
    var ShadowComputer = (function () {
        function ShadowComputer() {
        }
        ShadowComputer.prototype.setCubes = function (cubes) {
            this.cubes = cubes;
        };
        ShadowComputer.prototype.getShadows = function (cube) {
            var x = cube.min[0];
            var y = cube.min[1];
            var z = cube.min[2];
            var d = 2;
            var atSouthEast = this.checkCubeAt(x + d, y - d, z + 1);
            var atEast = this.checkCubeAt(x + d, y, z + 1);
            var atNorthEast = this.checkCubeAt(x + d, y + d, z + 1);
            var atSouthWest = this.checkCubeAt(x - d, y - d, z + 1);
            var atWest = this.checkCubeAt(x - d, y, z + 1);
            var atNorthWest = this.checkCubeAt(x - d, y + d, z + 1);
            var atNorth = this.checkCubeAt(x, y + d, z + 1);
            var atSouth = this.checkCubeAt(x, y - d, z + 1);
            var atSide = this.checkCubeAt(x - d, y - d, z);
            var shadows = [];
            var test = function (b, id) {
                if (b) {
                    shadows.push(id);
                }
                ;
            };
            test(atSouthEast && !atEast, "shadowSouthEast");
            test(atSouth, "shadowSouth");
            test(atSouthWest && !atWest, "shadowSouthWest");
            test(atEast, "shadowEast");
            test(atWest, "shadowWest");
            test(atNorthEast && !atEast && !atNorth, "shadowNorthEast");
            test(atNorth, "shadowNorth");
            test(atNorthWest && !atWest && !atNorth, "shadowNorthWest");
            test(atSide, "shadowSide");
            return shadows;
        };
        ShadowComputer.prototype.checkCubeAt = function (i, j, k) {
            var _i, len = this.cubes.length;
            for (_i = 0; _i < len; ++_i) {
                var c = this.cubes[_i];
                if (c.min[0] == i && c.min[1] == j && c.min[2] == k) {
                    return true;
                }
            }
            return false;
        };
        return ShadowComputer;
    })();
    game2.ShadowComputer = ShadowComputer;
})(game2 || (game2 = {}));
//# sourceMappingURL=out.js.map