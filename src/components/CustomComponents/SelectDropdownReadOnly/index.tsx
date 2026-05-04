import { useEffect, useRef, useState } from "react";
import { Box, Input, Text, useMantineColorScheme } from "@mantine/core";

import classes from "./styles.module.css";
import { useCustomColors } from "../../../customHooks/useCustomColors";

type DataType = {
  value: any;
  label: string;
};

interface SelectDropdownType {
  pt?: string;
  pb?: string;
  data: DataType[];
  value: string;
  placeholder?: string;
  onSelect: (value: any, label: string) => void;
}

export const SelectDropdownReadOnly = ({
  pt,
  pb,
  data,
  value,
  placeholder,
  onSelect,
}: SelectDropdownType) => {
  const [inputFocus, setInputFocus] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [mouseOnDropdown, setMouseOnDropdown] = useState<boolean>(false);
  const [dropdownHeight, setDropdownHeight] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { colorScheme } = useMantineColorScheme();

  const bgColor = colorScheme === "dark" ? "#2e2e2e" : "#fff";
  const { borderColor } = useCustomColors();

  useEffect(() => {
    if (dropdownRef?.current) {
      setDropdownHeight(dropdownRef?.current?.clientHeight);
    }
  }, [dropdownRef?.current]);

  useEffect(() => {
    if (!inputFocus && !mouseOnDropdown) {
      setShowDropdown(false);
    }
    if (inputFocus) {
      setShowDropdown(true);
    }
  }, [inputFocus]);

  const selectValue = (value: any, label: string) => {
    onSelect(value, label);
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
        style={{ width: "100%", cursor: "pointer" }}
        placeholder={placeholder || "Select"}
        value={value}
        onFocus={() => setInputFocus(true)}
        onBlur={() => setInputFocus(false)}
        ref={inputRef}
        readOnly
      />
      {showDropdown && (
        <div
          ref={dropdownRef}
          className={classes.dropdown}
          style={{
            backgroundColor: bgColor,
            borderColor,
            top: `-${dropdownHeight + 10}px`,
          }}
          onMouseEnter={() => setMouseOnDropdown(true)}
          onMouseLeave={() => setMouseOnDropdown(false)}
        >
          {data?.length > 0 ? (
            data.map(({ value, label }: DataType, index: number) => (
              <Text
                key={`${label}${index}`}
                className={
                  colorScheme === "dark"
                    ? classes.dropdownItemDark
                    : classes.dropdownItemLight
                }
                onClick={() => selectValue(value, label)}
              >
                {label}
              </Text>
            ))
          ) : (
            <Text>No items</Text>
          )}
        </div>
      )}
    </Box>
  );
};
