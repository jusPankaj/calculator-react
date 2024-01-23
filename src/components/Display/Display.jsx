import { useReducer } from "react";
import DigitButton from "../DigitButton/DigitButton";
import OperationButton from "../OperationButton/OperationButton";
import "./Display.css";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  PERCENTAGE: "percentage",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overWrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overWrite: false,
        };
      }
      //to check if 0 precedes starting digit or maore than one zero at begining
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state;
      }
      // to check no more than one point be in current operand
      if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state;
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };

    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.prevOperand == null) {
        return state;
      }
      //to handle to override the operand

      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }

      if (state.prevOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          prevOperand: state.currentOperand,
          currentOperand: null,
        };
      }

      return {
        ...state,
        prevOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      };

    case ACTIONS.PERCENTAGE:
      if (state.currentOperand == null) {
        return state;
      }

      const percentageValue = parseFloat(state.currentOperand) / 100;
      return {
        ...state,
        currentOperand: percentageValue.toString(),
      };

    case ACTIONS.CLEAR:
      return {};

    case ACTIONS.DELETE_DIGIT:
      if (state.overWrite) {
        return {
          ...state,
          overWrite: false,
          currentOperand: null,
        };
      }

      if (state.currentOperand == null) return state;

      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: null,
        };
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };

    case ACTIONS.EVALUATE:
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.prevOperand == null
      ) {
        return state;
      }

      return {
        ...state,
        overWrite: true,
        prevOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      };
  }
}

function evaluate({ currentOperand, prevOperand, operation }) {
  const prev = parseFloat(prevOperand);
  const current = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(current)) return "";
  let computation = "";
  switch (operation) {
    case "+":
      computation = prev + current;
      break;
    case "-":
      computation = prev - current;
      break;
    case "*":
      computation = prev * current;
      break;
    case "÷":
      computation = prev / current;
      break;
  }
  return computation.toString();
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});

function formatOperand(operand) {
  if (operand == null) return;
  const [integer, decimal] = operand.split(".");
  if (decimal == null) return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

const Display = () => {
  const [{ currentOperand, prevOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );

  return (
    <>
      <div className="output">
        <div className="prev-operand">
          {formatOperand(prevOperand)}
          {operation}
        </div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>

      <div className="button-grid">
        <button
          className="span-two"
          onClick={() => dispatch({ type: ACTIONS.CLEAR })}
        >
          C
        </button>

        <button
          style={{ fontSize: "34px" }}
          onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}
        >
          DEL
        </button>
        <OperationButton
          dispatch={dispatch}
          operation="÷"
          style={styles.rightmost}
        />
        <DigitButton dispatch={dispatch} digit="9" />
        <DigitButton dispatch={dispatch} digit="8" />
        <DigitButton dispatch={dispatch} digit="7" />
        <OperationButton
          dispatch={dispatch}
          operation="*"
          style={styles.rightmost}
        />
        <DigitButton dispatch={dispatch} digit="6" />
        <DigitButton dispatch={dispatch} digit="5" />
        <DigitButton dispatch={dispatch} digit="4" />
        <OperationButton
          dispatch={dispatch}
          operation="-"
          style={styles.rightmost}
        />
        <DigitButton dispatch={dispatch} digit="3" />
        <DigitButton dispatch={dispatch} digit="2" />
        <DigitButton dispatch={dispatch} digit="1" />
        <OperationButton
          dispatch={dispatch}
          operation="+"
          style={styles.rightmost}
        />
        <DigitButton dispatch={dispatch} digit="0" style={styles.spanTwo} />
        <DigitButton dispatch={dispatch} digit="." />
        <button
          style={styles.rightmost}
          onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
        >
          =
        </button>
      </div>
    </>
  );
};

const styles = {
  rightmost: {
    backgroundColor: "#F79231",
    color: "#ffffff",
  },
  spanTwo: {
    gridColumn: "span 2",
  },
};

export default Display;
