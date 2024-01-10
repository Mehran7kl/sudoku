import './App.css'
import { useEffect, useState } from "react";
import { Sudoku, idiv } from "./sudoku";




function prepareSudoku(level: number):[Int32Array , Int32Array]{
  const soduku = new Sudoku();
  soduku.generateSudoku(level);  
  const unsolvedTable = soduku.table.slice();

  
  
  soduku.solve();
  
  const solvedTable = soduku.table;
  return [unsolvedTable,solvedTable];
}

function Cell({index=0,initValue=0}){
  
  const [value,setValue] = useState(0);
  
  useEffect(()=>{
    setValue(initValue);
    
  },[initValue]);

  const col = index%9;
  const row = idiv(index,9);
  const srow = idiv(row,3);
  const scol = idiv(col,3);
  const sqIndex = srow*3 + scol;
  
  const isFixed = initValue > 0;

  return (
  <div onClick={()=>{
    isFixed || setValue((value+1)%10);
    
  }}
    className={ `${isFixed?" text-green-400":" text-black"} row-${row} col-${col} sq-${sqIndex} box-border border-2 flex items-center justify-center`}>
    <span className='values'>{value>0 && value}</span>
  </div>
  )
}

function Board({level=3,solved=false})
{
  const [table,setTable] = useState(()=>prepareSudoku(level));
  useEffect(()=>{
    setTable(prepareSudoku(level));
  },[level])
  useEffect(()=>{
    if(solved) setTable(t=>[t[1],t[1]]);
  },[solved])
  
  const cells :ReturnType< typeof Cell>[]=new Array(81)
  for(let i=0;i<81;i++) cells[i] = <Cell key={i} index={i} initValue={table[0][i]}/>
  return (
  <div className=" m-1 w-[90vmin] h-[90vmin] grid grid-cols-9 grid-rows-9">
    
    {cells}
  
  </div>
  )
}
function Switch({values,onChange,init=0}:{init:number,values:string[] ,onChange:(str:string)=>void})
{
  const [selected, setSelected] = useState(values[init])
  return (
    <div className=' rounded-md overflow-clip flex shadow'>
      {
        values.map(val=> <div key={val} onClick={()=>{
          onChange(val);
          setSelected(val);
          
        }} className={ (selected==val ? " bg-green-600 " : "bg-slate-300")+ ' flex-auto shadow-lg transition-colors p-3  '}>{val}</div>)
      }
    </div>
  )
}
export default function App() {
  const [levelName,setLevelName] = useState('Amator');
  const [solved,setSolved] = useState(false);
  const level = ({
    Amator:0.2,
    Expert:0.5,
    Master:0.7,
  })[levelName];
  
  
  return (
    <div className=" flex items-center flex-col" >
      <Board solved={solved} level={level}/>
      <div className=' gap-2 justify-center self-stretch flex '>
        <button className=' rounded-md shadow-lg  p-3 bg-slate-300' onClick={()=>setSolved(true)}>Solve</button>
        <Switch init={1} values={["Amator","Expert","Master"]} onChange={str=>{setSolved(false); setLevelName(str)}}/>
      </div>
    </div>
  )
}