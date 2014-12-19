
function getViewData(element) : game2.View2d
{
    return $(element).data('view');
}

function setViewData(element) : game2.View2d
{
    var elt = $(element).parent()[0];
    while (elt != undefined && elt != null)
    {
        var view = $(elt).data('view');
        if (view != undefined)
        {
            $(element).data('view', view);
            return view;
        }
        elt = $(elt).parent()[0];
    }
    alert("view not found in DOM");
    return undefined;
}


ko.bindingHandlers['cube'] =
{
    init:function(element, valueAccessor, allBindingsAccessor, viewModel)
    {
        var view = setViewData(element);
        var callback = function()
        {
            ko.bindingHandlers['cube'].update(element, valueAccessor, allBindingsAccessor, viewModel, null);
        };
        view.pushBoundChanged(element, callback);

        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            //var debugCounter = $(element).data('vue2PointsDebugCounter');
            //console.log("dispose points #" + debugCounter);
            view.removeBoundChanged(element);
        });
    },

    update:function(element, valueAccessor, allBindingsAccessor, viewModel)
    {
        var observable = valueAccessor();
        var cube:game2.Cube = observable();
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
}

ko.bindingHandlers['view'] =
{
    init:function(element, valueAccessor, allBindingsAccessor, viewModel)
    {
        var value:any = ko.utils.unwrapObservable(valueAccessor());
        var view:game2.View2d = value;

        $(element).data('view', view);
        console.log("view setWindowSize");
        console.log($(element).width(), ", " , $(element).height());
        view.setWindowSize($(element).width(), $(element).height());

        // Interactions
        /*
         var interactions = new vue2.viewInteractions();
         interactions.setview(view);

         $(element).mousewheel(function(e, delta)
         {
         var eoffsetX = (e.offsetX || e.clientX - $(e.target).offset().left + window.pageXOffset ),
         eoffsetY = (e.offsetY || e.clientY - $(e.target).offset().top + window.pageYOffset );

         interactions.zoomRelative(delta, [eoffsetX, eoffsetY]);
         });

         var callback = function()
         {
         observable.withPausing().sneakyUpdate(view.bounds);
         if (viewModel.onRectangleChangedFromView)
         {
         viewModel.onRectangleChangedFromView();
         }
         }
         view.pushBoundChanged(element, callback);

         */
        ko.bindingHandlers['view'].update(element, valueAccessor, allBindingsAccessor, viewModel, null);
    },

    update:function(element, valueAccessor, allBindingsAccessor, viewModel)
    {

        var value:any = ko.utils.unwrapObservable(valueAccessor());
        var view = getViewData(element);

        /*
        console.log("view set bounds to view model");
        console.log(JSON.stringify(value));
        setTimeout(function() {
            view.setBounds(value);
        }, 1);
        */

    }
};




ko.bindingHandlers['background'] =
{
    init: function (element, valueAccessor, allBindingsAccessor, viewModel)
    {
        var value:any = ko.utils.unwrapObservable(valueAccessor());
        $(element).css(
            {
                "background": "url(css/images/"+value+".png) no-repeat",
                "background-size": "100% auto"
            }
        )
    }
};





//
// Grid
//
/*
ko.bindingHandlers.vue2Grid =
{
    init:function(element, valueAccessor, allBindingsAccessor, viewModel)
    {
        var view = setViewData(element);

        var value = ko.utils.unwrapObservable(valueAccessor());
        var grid = new vue2.infiniteGrid2();
        grid.setDivSize(value.divSize);


        var doUpdate = function()
        {
            var view = $(element).data('view');
            grid.setBounds(view.bounds);

            var path = element;
            var segments = path.pathSegList;
            segments.clear();

            var dest = [0,0];
            var i,len = grid.lines.length;
            for (i=0; i<len; i+=2)
            {
                view.vecToWindow(grid.lines[i], dest);
                segments.appendItem(path.createSVGPathSegMovetoAbs(dest[0], dest[1]));

                view.vecToWindow(grid.lines[i+1], dest);
                segments.appendItem(path.createSVGPathSegLinetoAbs(dest[0], dest[1]));
            }
        }

        doUpdate();
        view.pushBoundChanged(element, doUpdate);
    },

    update:function(element, valueAccessor, allBindingsAccessor, viewModel)
    {
    }
}
*/
