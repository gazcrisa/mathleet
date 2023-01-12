import { ProblemType } from "./enums/problems";

export const getFullTitle = (type: ProblemType) => {
  switch (type) {
    case ProblemType.PERCENTAGES:
      return "Percentages";
    case ProblemType.ADD_SUBTRACT:
      return "Addition & Subtraction";
    case ProblemType.MULTIPLY_DIVIDE:
      return "Multiplication & Division";
    default:
      return "Mashup";
  }
};

export const getShortTitle = (type: ProblemType) => {
    switch (type) {
      case ProblemType.PERCENTAGES:
        return "Percentages";
      case ProblemType.ADD_SUBTRACT:
        return "Add / Subtract";
      case ProblemType.MULTIPLY_DIVIDE:
        return "Multiply & Divide";
      default:
        return "Mashup";
    }
  };
