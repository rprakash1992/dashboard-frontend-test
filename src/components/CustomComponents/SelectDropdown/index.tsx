import { useEffect, useRef, useState } from "react";
import { Box, Input, Text, useMantineColorScheme } from "@mantine/core";

import classes from "./styles.module.css";
import { useCustomColors } from "../../../customHooks/useCustomColors";

interface SelectDropdownType {
  pt?: string;
  pb?: string;
  data: string[];
  value: string;
  disabled?: boolean;
  onChange: (val: string) => void;
}

export const SelectDropdown = ({
  pt,
  pb,
  data,
  value,
  disabled,
  onChange,
}: SelectDropdownType) => {
  const [dropdownItems, setDropdownItems] = useState<string[]>(data);
  const [inputFocus, setInputFocus] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [mouseOnDropdown, setMouseOnDropdown] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { colorScheme } = useMantineColorScheme();

  const bgColor = colorScheme === "dark" ? "#2e2e2e" : "#fff";
  const { borderColor } = useCustomColors();

  useEffect(() => {
    if (!value) {
      setDropdownItems(data);
    } else {
      const newItems = data.filter((i) =>
        i.toLowerCase().includes(value.toLowerCase())
      );
      setDropdownItems(newItems);
    }
  }, [value, data]);

  useEffect(() => {
    if (!inputFocus && !mouseOnDropdown) {
      setShowDropdown(false);
    }
    if (inputFocus) {
      setShowDropdown(true);
    }
  }, [inputFocus]);

  const selectValue = (val: string) => {
    onChange(val);
    setShowDropdown(false);
  };

  const close = (e: any) => {
    if (e?.key === "Escape") {
      setShowDropdown(false);
      inputRef?.current?.blur();
    }
  };

  return (
    <Box
      className={classes.selectDropdown}
      pt={pt || "sm"}
      pb={pb || "sm"}
      onKeyUp={close}
    >
      <Input
        style={{ width: "100%" }}
        placeholder="Type Category"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setInputFocus(true)}
        onBlur={() => setInputFocus(false)}
        ref={inputRef}
        disabled={disabled}
      />
      {showDropdown && (
        <div
          className={classes.dropdown}
          style={{
            backgroundColor: bgColor,
            borderColor,
          }}
          onMouseEnter={() => setMouseOnDropdown(true)}
          onMouseLeave={() => setMouseOnDropdown(false)}
        >
          {dropdownItems?.length > 0 ? (
            dropdownItems.map((val: string, index: number) => (
              <Text
                key={`${val}${index}`}
                className={
                  colorScheme === "dark"
                    ? classes.dropdownItemDark
                    : classes.dropdownItemLight
                }
                onClick={() => selectValue(val)}
              >
                {val}
              </Text>
            ))
          ) : (
            <Text>Not found</Text>
          )}
        </div>
      )}
    </Box>
  );
};
