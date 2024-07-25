import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const UserTypeSelector = ({
  userType,
  setUserType,
  onClickHandler,
}: UserTypeSelectorParams) => {
  const accessChangeHandler = (type: UserType) => {
    // Update the selected user type state
    setUserType(type);
    // If an additional handler is provided, call it with the selected type
    onClickHandler && onClickHandler(type);
  };
  return (
    <Select
      value={userType}
      onValueChange={(type: UserType) => accessChangeHandler(type)} // Handle change in selected value
    >
      <SelectTrigger className="shad-select">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="border-none bg-dark-200">
        <SelectItem className="shad-select-item" value="viewer">
          can view
        </SelectItem>
        <SelectItem className="shad-select-item" value="editor">
          can edit
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default UserTypeSelector;
