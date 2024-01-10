
/**
 * @returns result of integer division
 * @param a right operand
 * @param b left operand
 * @description performs integer division
 * @example idiv(8,3) -> 2
 */
export function idiv(a:number,b:number)
{
    return ~~(a/b)
}
/**@returns a random integer in range [start,end) */
function randomInt(start:number, end: number)
{
    const length= end-start;
    return Math.floor(Math.random()*length)+start;
}
export class Sudoku{
    
    // An array which holds the values 
    readonly table = new Int32Array(81);
    // An array that keeps which cells are prefilled
    readonly fixedCells:boolean[] = new Array(81);
    //some arrays with 9 integers per each and every integer is a bitset that holds 9 boolean values
    // that shows which col/row/square has already has that number
    // for example: 
    // 000000001 means this square/row/col has a number 1 and cant hold a new 1
    // 000000010 means this square/row/col has a number 2 and cant hold a new 2
    private readonly sqBits = new Int32Array(9);
    private readonly rowBits = new Int32Array(9);
    private readonly colBits = new Int32Array(9);
    /**
     * @description puts a value into a cell if valid and updates the row , col and square stats to don't get that value again
     * if there's a value in the cell already; overrides and erases its effects
     * @param index index of cell to put in; in range [0,80]
     * @param value the value of cell; in range [0,9], 0 means empty the cell
     * @returns true if value is valid for that cell, false otherwise
     */
    private putValue(index: number, value: number): boolean
    {
        const currentValue = this.table[index];
        // coordinates
        const row = idiv(index, 9);
        const col = index % 9;
        // s stans for square
        // square coordinates
        const srow = idiv(row,3);
        const scol = idiv(col,3);
        // index of the square from 0 to 8
        const squareIndex = srow*3 + scol;
        // returns the bit represention of this value for col/row/square; v is in range [1,9]
        function toBitState(v: number){
            return 1 << (v-1)
        }
        /**@description erases the effects of the current value if there's any */
        const erase=()=>
        {
            if(currentValue==0) return;

            const bitState = toBitState(currentValue);
            // turn off this state
            this.colBits[col] ^= bitState;
            this.rowBits[row] ^= bitState;
            this.sqBits[squareIndex] ^= bitState;
        }
        if(value==0){
            erase();
            this.table[index] = 0;
        }else{
            const bitState = toBitState(value);
            // check wether this value is valid or not
            if( (this.colBits[col]| this.rowBits[row]| this.sqBits[squareIndex]) & bitState) return false;
            //now erase the current value
            erase();
            //put the new value and update the states
            this.table[index] = value;
            this.colBits[col] |= bitState;
            this.rowBits[row] |= bitState;
            this.sqBits[squareIndex] |= bitState;
        }
        return true;
    }

    /**
     * @description generates a sudoku to be soved ny user; 9! possible sudokus.
     * @param level level of difcualty; an integer in range [2,9] easy-> hard
     */
    public generateSudoku(level:number )
    {
        const temp= new Sudoku();
        const arr=[1,2,3,4,5,6,7,8,9];
        arr.forEach((v,i,arr)=>{
            
            const otherIndex = randomInt(1,10);
            arr[i]=arr[otherIndex];
            arr[otherIndex]=v;
        })
        for(let i=0,j=0;i<81;i+=10,j++)
        {
            temp.putFixedCell(i,arr[j]);
        }
        temp.solve();
        for(let i=0;i<81;i++){
            if(Math.random()>level) this.putFixedCell(i,temp.table[i])
        }
    }
    /**
     * @description puts values into table regarding they are fixed (if non-zero) and can't change.
     * @param args 81 numbers that represent sudoku values; non-zero values are fixed.
     */
    public putFixedCells(...args: number[])
    {
        args.forEach((value,index)=>{
            if(!this.putFixedCell(index, value)) return false;
        })
        return true;
    }
    public putFixedCell(index: number, value: number)
    {
        if(!this.putValue(index, value)) return false;
        if(value!=0) this.fixedCells[index]=true;
        return true;
    }
    /**
     * @description solves the sudoku
     * @returns wether could solve or not
     */
    public solve()
    {
        /*
        I'm using an algoritm known as backtracking which is a depth-first broute-force search algoritm.
        */
        let firstCell = 0;
        let i=0;
        while(this.fixedCells[firstCell]) firstCell++;
        i=firstCell;
        //advances to next non-fixed-cell
        const next=()=>
        {
            do{
                i++;
            }while(this.fixedCells[i])
        }
        // goes back to last non-fixed cell
        const back=()=>
        {
            do{
                i--;
            }while(this.fixedCells[i])    
        }
        
        //returns the current value
        const val=()=> this.table[i];
        
        while(i<81){
            
            let newVal;
            // increment cuurent value
            for(newVal=val()+1;newVal<10;newVal++)
            {
                //if the new value is valid go for next cell; otherwise keep incrementing
                if(this.putValue(i,newVal)) break;

            }
            //if no value was valid then this state is not valid erase the cell and go back
            if(newVal == 10)
            {
                //if this is first empty cell, so we can't backtrack futhermore
                if(i == firstCell && val()== 9) return false; 
                
                this.putValue(i,0);
                back();
                
                continue;
            }
            next();
        }
        
        return true;
    }

}