const activeCode = (typeCode: string): boolean => {
  switch (typeCode) {
    case "shiny":
      console.log("shiny");
      return true;
      // TODO: when function is implemented
      break;
    default:
      throw new Error("Code not found :" + typeCode);
  }
};

export default activeCode;
