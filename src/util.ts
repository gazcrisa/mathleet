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

export const hashCode = (str: string): number => {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    var code = str.charCodeAt(i);
    hash = (hash << 5) - hash + code;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
};
