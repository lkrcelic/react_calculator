import "./styles.css"
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
import { useReducer } from "react";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION:"choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate"
}

function reducer(state, { type, payload }) {
  switch (type) {
    case  ACTIONS.ADD_DIGIT:
      if(state.overwrite) {
        state.currentOperand = null;
        state.overwrite = false;
      }
      if(payload.digit === "0" && state.currentOperand == null) {
         return state;
        }
      if(payload.digit === "." && 
      (state.currentOperand == null || state.currentOperand.includes("."))) { 
        return state;
      }
      return {...state, currentOperand: `${state.currentOperand || ""}${payload.digit}`};
    
    case ACTIONS.CHOOSE_OPERATION:
      if(state.previousOperand == null && state.currentOperand == null) {
        return state;
      }
      else if(state.currentOperand == null) {
        console.log(state);
        return {...state, operation: payload.operation};
      }
      else if(state.previousOperand == null) {
        return {previousOperand: state.currentOperand, currentOperand: null, operation: payload.operation}
      }
      else {
        return {previousOperand: evaluate(state), operation: payload.operation, currentOperand: null}
      }
    
    case ACTIONS.EVALUATE:
      if(state.operation == null || state.currentOperand == null || state.previousOperand == null) {
        return state;
      }
      else {
      return {overwrite: true, currentOperand: evaluate(state), previousOperand: null, operation: null}
      }

    case ACTIONS.DELETE_DIGIT:
      if(state.overwrite) {
        return {...state, overwrite: false, currentOperand: null }
      }
      else if (state.currentOperand == null) {
        return state;
      }
      else if (state.currentOperand.length === 1) {
        return {...state, currentOperand: null}
      }
      else {
        return {...state, currentOperand: state.currentOperand.slice(0, -1)}
      }

    case ACTIONS.CLEAR:
      return {};
        
    default:
      return null;
  }
}

function evaluate({currentOperand, previousOperand, operation}) {
  const prev = parseFloat(previousOperand);
  const curr = parseFloat(currentOperand);
  let result;

  if(isNaN(prev) && isNaN(curr)) {
    return "";
  }
  else {
    switch(operation) {
      case "+":
        result = prev + curr; 
        break;
      case "-":
        result = prev - curr;
        break;
      case "*":
        result = prev * curr;
        break;
      case "÷":
        result = prev / curr;
        break;
    }
  }

  return result.toString();
}


const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {maximumFractionDigits: 0});
function formatOperand(operand) {
  if(operand == null){
    return null;
  }
  const [integer, decimal] = operand.split('.');
  if(decimal == null) {
    return INTEGER_FORMATTER.format(integer);
  }
  else {
    return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
  }
}

function App() {
  const [{currentOperand, previousOperand, operation}, dispatch ] = useReducer(reducer,{});

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">{formatOperand(previousOperand)} {operation}</div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
       <button className="span-two" onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button className="span-two" onClick={() => dispatch({type: ACTIONS.EVALUATE})}>=</button>


    </div>
  );
}

export default App;
