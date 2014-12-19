module game2
{
    export class ButtonViewModel
    {

        image:string = "";
        dimensions:number[] = [1,1,1];
        clickCb : (btn:ButtonViewModel)=>void;

        set(image:string, dimensions:number[], clickCb:(btn:ButtonViewModel)=>void):ButtonViewModel
        {
            this.image = image;
            this.clickCb = clickCb;
            for (var i=0; i<3; ++i)
            {
                this.dimensions[i] = dimensions[i];
            }
            return this;
        }

        click()
        {
            if (this.clickCb != null)
            {
                this.clickCb(this);
            }
        }
    }
}
