module game2
{
    export class callbackWithTag
    {
        tag:any;
        callback:()=>void;
        constructor(tag:any, callback:()=>void)
        {
            this.tag = tag;
            this.callback = callback;
        }
    }

    export class View2d
    {
        width:number = 700;
        height:number = 700;
        bounds:number[] = [0,0,700,700];

        private boundsChanged:callbackWithTag[] = [];

        getCubeZIndex(cube:Cube)
        {
            return - (cube.min[1] * 10000 - cube.min[2] * 100);
        }

        tmpWorld:number[] = [0,0];
        windowTo3d(point:number[], planeHeight:number, dest:number[])
        {
            this.windowToWorld2d(point, this.tmpWorld);
            this.world2dToPoint(this.tmpWorld, planeHeight, dest);
        }

        tmpRect = new Rectangle();

        cubeToWindowRectangle(cube:Cube, dest:WindowRectangle)
        {
            this.cubeToRect(cube, this.tmpRect);
            this.rectToWindow(this.tmpRect, dest);

            // offset a cause de l'espace au dessus
            dest.top -= 50;
            dest.height += 50;
            dest.zIndex = this.getCubeZIndex(cube);
        }

        cubeToRect(cube:Cube, dest:Rectangle)
        {
            this.pointToWorld2d(cube.min, dest.min);
            this.pointToWorld2d(cube.max, dest.max);
        }

        world2dToPoint(point2:number[], height:number, dest:number[])
        {
            dest[0] = point2[0] / 100;
            dest[2] = height;
            dest[1] = (point2[1] - 40 * height) / 80;
        }

        // 1 en hauteur : 40px
        // 1 en largeur : 100 px
        // 1 en profondeur : 80px
        pointToWorld2d(point3:number[], dest:number[])
        {
            dest[0] = 100 * point3[0];
            dest[1] = 80 * point3[1] + 40 * point3[2];
        }

        tmpPt1:number[] = [0,0];
        tmpPt2:number[] = [0,0];
        rectToWindow(rect:Rectangle, dest:WindowRectangle)
        {
            this.world2dToWindow(rect.min, this.tmpPt1);
            this.world2dToWindow(rect.max, this.tmpPt2);
            dest.left = this.tmpPt1[0];
            dest.top = this.tmpPt2[1];
            dest.width = this.tmpPt2[0] - this.tmpPt1[0];
            dest.height = this.tmpPt1[1] - this.tmpPt2[1];
        }


        world2dToWindow(w:number[], dest:number[])
        {
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
        }

        windowToWorld2d(c:number[], dest:number[])
        {
            var minX = this.bounds[0];
            var minY = this.bounds[1];
            var maxX = this.bounds[2];
            var maxY = this.bounds[3];

            var rx = c[0] / this.width;
            var ry = 1 - c[1]/this.height;

            var wx = (1-rx) * minX + rx * maxX;
            var wy = (1-ry) * minY + ry * maxY;
            dest[0] = wx;
            dest[1] = wy;
        }

        windowVectorToWorld2d(v:number[], dest:number[])
        {
            var minX = this.bounds[0];
            var minY = this.bounds[1];
            var maxX = this.bounds[2];
            var maxY = this.bounds[3];

            dest[0] = v[0] / this.width * (maxX - minX);
            dest[1] = - v[1] / this.height * (maxY - minY);
        }

        zoomRelative(delta:number, mouseXY:number[])
        {
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

            var k = coeff*(maxX - minX);
            var newMinX = -1*(k*cx/this.width -wx);
            var newMaxX = k + newMinX;

            k = coeff*(maxY - minY);
            var newMinY = k*(cy/this.height-1) + wy;
            var newMaxY = k + newMinY;

            this.setBounds4(newMinX, newMinY, newMaxX, newMaxY);
        }

        setWindowSize(width:number, height:number)
        {
            this.width = width;
            this.height = height;
        }

        setBounds(bounds:number[])
        {
            this.setBounds4(bounds[0], bounds[1], bounds[2], bounds[3]);
        }

        setBounds4(xMin:number, yMin:number, xMax:number, yMax:number)
        {
            this.bounds[0] = xMin;
            this.bounds[1] = yMin;
            this.bounds[2] = xMax;
            this.bounds[3] = yMax;
            this.boundsChanged.forEach((f) => f.callback());
        }

        pushBoundChanged(tag:any, callback:()=>void)
        {
            //console.log("push BoundChanged to view " + this.__uniqueId);
            this.boundsChanged.push(new callbackWithTag(tag, callback));
        }

        removeBoundChanged(tag:any)
        {
            var len = this.boundsChanged.length;
            for (var i=0; i<len; ++i)
            {
                if (this.boundsChanged[i].tag == tag)
                {
                    this.boundsChanged.splice(i, 1);
                    return;
                }
            }
            console.error("removeBoundChanged not found");
        }

    }
}