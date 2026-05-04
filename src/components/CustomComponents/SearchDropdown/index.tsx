import { useEffect, useRef, useState } from "react";
import { Box, Input, Text, useMantineColorScheme } from "@mantine/core";
import debounce from "lodash.debounce";

import classes from "./styles.module.css";
import { useCustomColors } from "../../../customHooks/useCustomColors";
import { VCSearchIcon } from "../../../assets/icons";
import { Label } from "../../common/Label/Label";

interface SearchDropdownType {
  pt?: string;
  pb?: string;
  title?: string;
  value: string;
  disabled?: boolean;
  placeholder?: string;
  dropdownItems: any[];
  DropdownItemComponent: any;
  NotFoundComponent?: any;
  onChange: (val: string) => void;
  onSelect: (item: any) => void;
}

export const SearchDropdown = ({
  // pt,
  // pb,
  title,
  value,
  disabled,
  placeholder,
  dropdownItems,
  DropdownItemComponent,
  NotFoundComponent,
  onChange,
  onSelect,
}: SearchDropdownType) => {
  const [inputValue, setInputValue] = useState<string>(value);
  const [inputFocus, setInputFocus] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [mouseOnDropdown, setMouseOnDropdown] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { colorScheme } = useMantineColorScheme();

  const bgColor = colorScheme === "dark" ? "#2e2e2e" : "#fff";
  const { borderColor } = useCustomColors();

  const debouncedOnChange = useRef(
    debounce((val: string) => {
      onChange(val);
    }, 500)
  ).current;

  useEffect(() => {
    setInputValue(value); // Sync local inputValue with the prop value
  }, [value]);

  useEffect(() => {
    return () => {
      debouncedOnChange.cancel(); // Cleanup on unmount
    };
  }, [debouncedOnChange]);

  const handleInputChange = (val: string) => {
    setInputValue(val); // Update input value immediately
    debouncedOnChange(val); // Debounce the API call
  };

  const selectValue = (item: any) => {
    onSelect(item);
    setShowDropdown(false);
  };

  const close = (e: any) => {
    if (e?.key === "Escape") {
      setShowDropdown(false);
      inputRef?.current?.blur();
    }
  };

  useEffect(() => {
    if (!inputFocus && !mouseOnDropdown) {
      setShowDropdown(false);
    }
    if (inputFocus) {
      setShowDropdown(true);
    }
  }, [inputFocus]);

  return (
    <Box
      className={classes.searchBox}
      // pt={pt || "sm"}
      // pb={pb || "sm"}
      onKeyUp={close}
    >
      {title && <Label label={title} />}
      <Box>
        <Input
          style={{ width: "100%" }}
          placeholder={placeholder || "Search..."}
          value={inputValue} // Use local state value
          onChange={(e) => handleInputChange(e.target.value)} // Use local handler
          onFocus={() => setInputFocus(true)}
          onBlur={() => setInputFocus(false)}
          disabled={disabled}
          rightSection={<VCSearchIcon size={18} />}
          ref={inputRef}
        />
      </Box>
      {showDropdown && (
        <div
          className={classes.searchBoxDropdown}
          style={{
            backgroundColor: bgColor,
            borderColor,
            top: title ? "68px" : "44px",
            // top: title ? "89px" : "44px",
          }}
          onMouseEnter={() => setMouseOnDropdown(true)}
          onMouseLeave={() => setMouseOnDropdown(false)}
        >
          {dropdownItems?.length > 0 ? (
            dropdownItems.map((item: any, index: number) => (
              <div
                key={`${item.title}${index}`}
                onClick={() => selectValue(item)}
              >
                <DropdownItemComponent item={item} />
              </div>
            ))
          ) : (
            <div>
              {NotFoundComponent ? (
                <NotFoundComponent />
              ) : (
                <Text>Not found</Text>
              )}
            </div>
          )}
        </div>
      )}
    </Box>
  );
};
