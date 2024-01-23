import DigitButton from "../DigitButton/DigitButton";
import Display from "../Display/Display";
import "./Calculator.css";

const Calculator = () => {
  return (
    <div className="calculator-">
      <Display />
      <DigitButton />
    </div>
  );
};

export default Calculator;
