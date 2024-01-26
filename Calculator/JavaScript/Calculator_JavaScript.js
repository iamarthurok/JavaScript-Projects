//Creates an object to keep track of values.
const Calculator = {
  Display_Value: '0',
  First_Operand: null,
  Wait_Second_Operand: false,
  operator: null,
};

//This modifies values each time a button is clicked on.
function Input_Digit(digit) {
  const { Display_Value, Wait_Second_Operand } = Calculator;
  // If Wait_Second_Operand is true and sets Display_Value
  // to the key that was clicked on.
  if (Wait_Second_Operand === true) {
    Calculator.Display_Value = digit;
    Calculator.Wait_Second_Operand = false;
  } else {
    // This overwrites Display_Value if the current value is 0
    // otherwise it adds onto it.
    Calculator.Display_Value = Display_Value === '0' ? digit : Display_Value + digit;
  }
}

//This section handles decimal points.
function Input_Decimal(dot) {
  // This ensures that accidental clicking of the decimal point doesn't
  // cause bugs in the operation.
  if (Calculator.Wait_Second_Operand === true) return;
  if (!Calculator.Display_Value.includes(dot)) {
    // We are saying that if the Display_Value does not contain a decimal point
    // we want to add a decimal point.
    Calculator.Display_Value += dot;
  }
}

//This section handles operators
function Handle_Operator(Next_Operator) {
  const { First_Operand, Display_Value, operator } = Calculator;
  const Value_of_Input = parseFloat(Display_Value);
  //When an operator key is pressed we convert the current number
  //displayed on the screen to a number and then store the result in
  //Calculator.First_Operand if it doesn't already exist.
  //Checks if an operator already exists and if Wait_Second_Operand is true,
  //then updates the operator and exits the function.
  if (operator && Calculator.Wait_Second_Operand) {
    Calculator.operator = Next_Operator;
    return;
  }
  if (First_Operand == null) {
    Calculator.First_Operand = Value_of_Input;
  } else if (operator) {
    const Value_Now = First_Operand || 0;
    let result = Perform_Calculation[operator](Value_Now, Value_of_Input);
    result = Number(result).toFixed(9);
    // Will remove any trailing 0's
    result = (result * 1).toString();
    Calculator.Display_Value = parseFloat(result);
    Calculator.First_Operand = parseFloat(result);
  }
  Calculator.Wait_Second_Operand = true;
  Calculator.operator = Next_Operator;
}

const Perform_Calculation = {
  '/': (First_Operand, Second_Operand) => First_Operand / Second_Operand,
  '*': (First_Operand, Second_Operand) => First_Operand * Second_Operand,
  '+': (First_Operand, Second_Operand) => First_Operand + Second_Operand,
  '-': (First_Operand, Second_Operand) => First_Operand - Second_Operand,
  '=': (First_Operand, Second_Operand) => Second_Operand
};

function Calculator_Reset() {
  Calculator.Display_Value = '0';
  Calculator.First_Operand = null;
  Calculator.Wait_Second_Operand = false;
  Calculator.operator = null;
}

//This function updates the calculator screen with the contents of Display_Value
function Update_Display() {
  const display = document.querySelector('.calculator-screen');
  display.value = Calculator.Display_Value;
}

Update_Display();

//This section monitors button clicks
const keys = document.querySelector('.calculator-keys');
keys.addEventListener('click', (event) => {
  // The target variable is an object that represents the element
  // that was clicked.
  const { target } = event;
  // If the element that was clicked on is not a button, exit the function.
  if (!target.matches('button')) {
    return;
  }
  if (target.classList.contains('operator')) {
    Handle_Operator(target.value);
    Update_Display();
    return;
  }
  if (target.classList.contains('decimal')) {
    Input_Decimal(target.value);
    Update_Display();
    return;
  }
  if (target.classList.contains('all-clear')) {
    Calculator_Reset();
    Update_Display();
    return;
  }
  Input_Digit(target.value);
  Update_Display();
})
