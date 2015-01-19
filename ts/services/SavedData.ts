
module game2
{
    export class SavedData
    {
        blocks:SavedBlock[] = [];
    }

    export class SavedBlock
    {
        cssId:string;
        cube:Cube;
    }
}
