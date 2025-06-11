import React from "react";
import Board from "./Board";
import CreateTask from "./CreateTask";

export default function MainTaskPage(){
    return(
        <>
            <CreateTask/>
            <Board/>
        </>
    )
}