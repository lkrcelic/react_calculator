import React from "react"
import { ACTIONS } from "./App.js"

export default function({ digit, dispatch }) {
    return <button onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: {digit} })}>{digit}</button>
}
