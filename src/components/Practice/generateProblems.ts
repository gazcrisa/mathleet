import { ProblemType } from "../../enums/problems";
import { Problem } from "../../types/problem";

const addSubtract = (size: number, hasNegatives: boolean): Problem[] => {
  const problems = [];

  const numbers = generateNumbersInRange(1, size);
  for (let i = 0; i < 200; i++) {
    let x = pickNumber(numbers);
    let y = pickNumber(numbers);

    let answer = 0;
    let operation;

    if (Math.random() < 0.5) {
      answer = x + y;
      operation = "+";
    } else {
      answer = x - y;
      operation = "-";
    }

    if (hasNegatives) {
      if (Math.random() < 0.5) {
        x = x * -1;
      }
    }

    const problem = `${x} ${operation} ${y}`;
    problems.push({
      x: x,
      y: y,
      answer: answer,
      text: problem,
    });
  }

  return problems;
};

const multiplyDivide = (size: number, hasNegatives: boolean): Problem[] => {
  const problems = [];
  const numbers = generateNumbersInRange(1, size);
  for (let i = 0; i < 200; i++) {
    let x = pickNumber(numbers);
    let y = pickNumber(numbers);
    let result;
    let problem;

    result = x * y;

    if (Math.random() < 0.5) {
      const dividend = x * y;
      result = dividend / y;
      problem = `${dividend} ÷ ${y}`;
    } else {
      problem = `${x} x ${y}`;
    }

    if (hasNegatives) {
      if (Math.random() < 0.5) {
        x = x * -1;
        result = result * -1;
      }
    }

    problems.push({
      x: x,
      y: y,
      answer: result,
      text: problem,
    });
  }

  return problems;
};

const percentage = (size: number): Problem[] => {
  const problems = [];
  const numbers = generateNumbersInRange(1, size);
  const percentages = generateNumbersInRange(1, 100);

  for (let i = 0; i < 200; i++) {
    const x = pickNumber(numbers);
    let y = -1;
    let foundValid = false;
    while (!foundValid) {
      const percentage = pickNumber(percentages) / 100;
      if ((x * percentage) % 1 == 0) {
        foundValid = true;
        console.log("the percentage: ", percentage)
        y = percentage * 100;
        break;
      }
    }

    const answer = x * (y / 100);
    const problem = `${y}% of ${x}?`;

    problems.push({
      x: x,
      y: y,
      answer: answer,
      text: problem,
    });
  }
  return problems;
};

const pickNumber = (numbers: number[]) => {
  return numbers[Math.floor(Math.random() * numbers.length)];
};

const generateNumbersInRange = (min: number, max: number) => {
  const numbers = [];
  for (let i = min; i <= max; i++) {
    numbers.push(i);
  }
  return numbers;
};

export const generateProblems = (
  size: number,
  hasNegatives: boolean,
  type: ProblemType
): Problem[] => {
  switch (type) {
    case ProblemType.ADD_SUBTRACT:
      return addSubtract(size, hasNegatives);
    case ProblemType.MULTIPLY_DIVIDE:
      return multiplyDivide(size, hasNegatives);
    case ProblemType.PERCENTAGES:
      return percentage(size);
    default:
      return [];
  }
};
