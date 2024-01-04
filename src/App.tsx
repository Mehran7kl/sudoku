import { useState } from "react"

function Cell({val=0}){
  return (
  <div className=" box-border border-2 flex items-center justify-center">
    <span>{val==0 ? null:val}</span>
  </div>
  )
}

function Square(){
  return(
  <div className=" border-2 border-black grid grid-cols-3">
    {
      new Array(9).fill(null).map((_v,i)=>{
        return <Cell key={i}/>
      })
    }
  </div>
  )
}

function isValid(table:Int8Array){
  const cols=new Int8Array(9);

}
function Board()
{
  const [table,setTable] = useState(new Int8Array(81));
  
  
  const squraes :ReturnType< typeof Square>[]=new Array(9)
  for(let i=0;i<9;i++) squraes[i] = <Square key={i}/>
  return (
  <div className="w-[90vmin] h-[90vmin] grid grid-cols-3">
    {squraes}
  </div>
  )
}
export default function App() {
  return (
    <div className=" flex justify-center" >
      <Board />
    </div>
  )
}