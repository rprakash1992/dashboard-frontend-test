import { useEffect, useState } from "react";
import {
  Flex,
  Box,
  Text,
  Grid,
  TextInput,
  Select,
  Stack,
  NumberInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useStore } from "../../store";
import type { CountryType } from "../../store/userProfileSlice";
import { userProfileApi } from "../../apiActions/userProfileApi";
import { VCCalenderTimeIcon } from "../../assets/icons";
import { SubmitButton } from "../common/SubmitButton/SubmitButton";
import { AlertMsgType } from "../../store/actionSlice";

const countries: CountryType[] = [
  {
    label: "India",
    value: "india",
    code: "+91",
  },
  {
    label: "United States",
    value: "us",
    code: "+1",
  },
];

const getFirstLastNames = (fullname: string) => {
  if (!fullname) {
    return { first: "", last: "" };
  }

  const fullnameArr = fullname.split(" ");

  if (fullnameArr.length === 1) {
    return { first: fullnameArr[0], last: "" };
  }

  return {
    first: fullnameArr.slice(0, fullnameArr.length - 1).join(" "),
    last: fullnameArr[fullnameArr.length - 1],
  };
};

export const PersonalInfo = () => {
  const userProfile = useStore((state) => state.userProfile);
  const setUserProfile = useStore((state) => state.setUserProfile);
  const setDialogBoxMsg = useStore((state) => state.setDialogBoxMsg);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<CountryType>();
  const [phone, setPhone] = useState<number | string>("");
  const [infoLoading, setInfoLoading] = useState<boolean>(false);
  const [dob, setDob] = useState<any>(null);

  useEffect(() => {
    if (userProfile?.id) {
      setFirstName(getFirstLastNames(userProfile.name).first);
      setLastName(getFirstLastNames(userProfile.name).last);
      setEmail(userProfile.email);
      setSelectedCountry(
        (countries?.find(
          (c) => c?.value === userProfile?.country,
        ) as CountryType) ?? countries[0],
      );
      setPhone(userProfile.phone);
      setDob(userProfile?.dob === undefined ? null : userProfile?.dob);
    }
  }, [userProfile]);

  const handleUpdate = async () => {
    try {
      setInfoLoading(true);

      const updatedProfile = {
        ...userProfile,
        name: firstName + " " + lastName,
        country: selectedCountry?.value,
        phone: String(phone),
        dob,
      };

      const { data, error } =
        await userProfileApi.updateFullUserProfile(updatedProfile);

      if (error) {
        return setDialogBoxMsg(error, AlertMsgType.ERROR);
      }

      setUserProfile(data);
      setDialogBoxMsg("Profile Updated.", AlertMsgType.SUCCESS);
    } catch (error) {
      console.error(error);
      setDialogBoxMsg(String(error), AlertMsgType.ERROR);
    } finally {
      setInfoLoading(false);
    }
  };

  const selectCountry = (countryValue: string | null) => {
    setSelectedCountry(
      countries?.find((c) => c?.value === countryValue) as CountryType,
    );
  };

  return (
    <>
      <Flex gap="xs" justify="center" direction="column" wrap="wrap" p="10px">
        <Box>
          <Flex pt="10" gap="0.5rem" direction="column">
            <Text
              fw={"bold"}
              styles={{ root: { fontSize: "1.2rem", lineHeight: "2" } }}
            >
              Personal Information
            </Text>
            <Text styles={{ root: { fontSize: "0.8rem", lineHeight: "2" } }}>
              Information you add, will be visible only in your profile.
            </Text>
          </Flex>
        </Box>
        <Stack>
          <TextInput
            label="First Name:"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <TextInput
            label="Last Name:"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <TextInput
            disabled
            label="Email address:"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <DateInput
            label="D.O.B:"
            placeholder="- - -"
            value={dob ? new Date(dob.slice(0, 10) + "T00:00:00") : null}
            rightSection={<VCCalenderTimeIcon size={20} />}
            onChange={(val) =>
              setDob(
                val
                  ? `${val.getFullYear()}-${String(val.getMonth() + 1).padStart(2, "0")}-${String(val.getDate()).padStart(2, "0")}`
                  : null,
              )
            }
          />
          <Grid>
            <Grid.Col span={6}>
              <Select
                label="Country:"
                data={countries}
                value={selectedCountry?.value}
                checkIconPosition="right"
                onChange={(_value) => selectCountry(_value)}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <NumberInput
                label="Contact Number:"
                allowDecimal={false}
                value={phone}
                onChange={(val) => setPhone(val)}
                leftSection={selectedCountry?.code}
              />
            </Grid.Col>
          </Grid>
        </Stack>
        <SubmitButton
          isLoading={infoLoading}
          isDisabled={infoLoading}
          label="Update"
          onSubmit={handleUpdate}
        />
      </Flex>
      {/* <Center>
        <Button
          disabled={infoLoading}
          loading={infoLoading}
          onClick={handleUpdate}
          mb={20}
        >
          Update
        </Button>
      </Center> */}
    </>
  );
};
