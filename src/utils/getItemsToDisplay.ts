import type { ItemsToDisplayType, ItemMetadataType } from "../types";
import type { ViewItemPropertyType, FilterItem } from "../store/viewSlice";
import type { TagType } from "../store/tagSlice";

// const getAge = (dateString: string) => {
//   var today = new Date();
//   var birthDate = new Date(dateString);
//   var age = today.getFullYear() - birthDate.getFullYear();
//   var m = today.getMonth() - birthDate.getMonth();
//   if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
//     age--;
//   }
//   return age;
// };

const getArrayIntersaction = (
  arr1: ItemMetadataType[],
  arr2: ItemMetadataType[],
) => {
  const result: ItemMetadataType[] = [];

  arr1.forEach((item) => {
    const checkIfArr2IncludesItem = arr2?.some((i) => i?.id === item?.id);
    if (checkIfArr2IncludesItem) {
      result?.push(item);
    }
  });

  return result;
};

const checkContains = (
  filterTitle: string,
  title: string,
  tags: string[],
  // email: string,
  // name: string,
  value: string,
) => {
  let check: boolean = false;

  if (filterTitle === "Title") {
    check = title?.includes(value?.toLowerCase());
    // } else if (filterTitle === "Email") {
    // check = email?.toLowerCase()?.includes(value?.toLowerCase());
    // } else if (filterTitle === "Name") {
    // check = name?.toLowerCase()?.includes(value?.toLowerCase());
  } else {
    check = tags?.some((tag) => tag?.includes(value?.toLowerCase()));
  }

  return check;
};

const checkDoesntContains = (
  filterTitle: string,
  title: string,
  tags: string[],
  // email: string,
  // name: string,
  value: string,
) => {
  let check: boolean = false;

  if (filterTitle === "Title") {
    check = !title?.includes(value?.toLowerCase());
    // } else if (filterTitle === "Email") {
    // check = !email?.toLowerCase()?.includes(value?.toLowerCase());
    // } else if (filterTitle === "Name") {
    // check = !name?.toLowerCase()?.includes(value?.toLowerCase());
  } else {
    check = !tags?.some((tag) => tag?.includes(value?.toLowerCase()));
  }

  return check;
};

const checkMatches = (
  filterTitle: string,
  title: string,
  tags: string[],
  // email: string,
  // name: string,
  value: string,
) => {
  let check: boolean = false;

  if (filterTitle === "Title") {
    check = title === value?.trim()?.toLowerCase();
    // } else if (filterTitle === "Email") {
    // check = email?.toLowerCase() === value?.toLowerCase();
    // } else if (filterTitle === "Name") {
    // check = name?.toLowerCase() === value?.toLowerCase();
  } else {
    check = tags?.some((tag) => tag?.toLowerCase() === value?.toLowerCase());
  }

  return check;
};

const checkEquals = (
  itemType: string,
  itemCreatedDate: Date,
  itemModifiedDate: Date,
  formattedDateFilterValue: Date,
  filterTitle: string,
  // status: string,
  // country: string,
  value: string,
  // itemAge: number,
  isUploaded: boolean,
  parent: string,
  mimeType: string,
) => {
  let check: boolean = false;

  // if (filterTitle === "Status") {
  //   check = status?.toLowerCase() === value?.toLowerCase();
  // }

  // if (filterTitle === "Country") {
  //   check = country?.toLowerCase() === value?.toLowerCase();
  // }

  if (filterTitle === "Created Date") {
    check = itemCreatedDate?.getDay() === formattedDateFilterValue?.getDay();
  }

  if (filterTitle === "Modified Date") {
    check = itemModifiedDate?.getDay() === formattedDateFilterValue?.getDay();
  }

  // if (filterTitle === "Age") {
  //   check = Number(itemAge) === Number(value);
  // }

  if (itemType === "file" && filterTitle === "Upload Status") {
    check = !isUploaded;
  }

  if (itemType === "file" && filterTitle === "Parent Folder") {
    check = parent === value;
  }

  if (itemType === "file" && filterTitle === "Workflows") {
    check = mimeType === "user_flow";
  }

  // Upload Status and Parent Folder filters are only applicable for file item type
  // Hence if item type is not file, then returning true for these filters
  if (itemType !== "file" && filterTitle === "Upload Status") {
    check = true;
  }

  if (itemType !== "file" && filterTitle === "Parent Folder") {
    check = true;
  }

  if (itemType !== "file" && filterTitle === "Workflows") {
    check = true;
  }

  return check;
};

const checkNotEquals = (
  itemCreatedDate: Date,
  itemModifiedDate: Date,
  formattedDateFilterValue: Date,
  filterTitle: string,
  // status: string,
  // country: string,
  // value: string,
) => {
  let check: boolean = false;

  // if (filterTitle === "Status") {
  //   check = status?.toLowerCase() !== value?.toLowerCase();
  // }

  // if (filterTitle === "Country") {
  //   check = country?.toLowerCase() !== value?.toLowerCase();
  // }

  if (filterTitle === "Created Date") {
    check = itemCreatedDate?.getDay() !== formattedDateFilterValue?.getDay();
  }

  if (filterTitle === "Modified Date") {
    check = itemModifiedDate?.getDay() !== formattedDateFilterValue?.getDay();
  }

  return check;
};

const checkLaterThan = (
  filterTitle: string,
  itemCreatedDate: Date,
  itemModifiedDate: Date,
  formattedDateFilterValue: Date,
) => {
  let check = false;

  if (filterTitle === "Created Date") {
    check = itemCreatedDate > formattedDateFilterValue;
  }

  if (filterTitle === "Modified Date") {
    check = itemModifiedDate > formattedDateFilterValue;
  }

  return check;
};

const checkEarlierThan = (
  filterTitle: string,
  itemCreatedDate: Date,
  itemModifiedDate: Date,
  formattedDateFilterValue: Date,
) => {
  let check = false;

  if (filterTitle === "Created Date") {
    check = itemCreatedDate < formattedDateFilterValue;
  }

  if (filterTitle === "Modified Date") {
    check = itemModifiedDate < formattedDateFilterValue;
  }

  return check;
};

const checkBetween = (
  filterTitle: string,
  itemCreatedDate: Date,
  itemModifiedDate: Date,
  formattedDateFilterValue: Date,
  formattedDateFilterValue2: Date,
) => {
  let check = false;

  if (filterTitle === "Created Date") {
    check =
      itemCreatedDate > formattedDateFilterValue &&
      itemCreatedDate < formattedDateFilterValue2;
  }

  if (filterTitle === "Modified Date") {
    check =
      itemModifiedDate > formattedDateFilterValue &&
      itemModifiedDate < formattedDateFilterValue2;
  }

  return check;
};

// const checkGreaterThan = (
//   filterTitle: string,
//   itemAge: number,
//   filterValue: string
// ) => {
//   let check = false;

//   if (filterTitle === "Age") {
//     check = Number(itemAge) > Number(filterValue);
//   }

//   return check;
// };

// const checkLessThan = (
//   filterTitle: string,
//   itemAge: number,
//   filterValue: string
// ) => {
//   let check = false;

//   if (filterTitle === "Age") {
//     check = Number(itemAge) < Number(filterValue);
//   }

//   return check;
// };

const checkIfItemSatisfiesFilter = (
  item: ItemMetadataType,
  filter: FilterItem,
  fileItem: any,
) => {
  let check: boolean = false;

  const filterTitle = filter?.filterTitle;
  const filterOperator = filter?.operator;
  const filterValue = filter?.value;

  const itemType = item?.item_type;
  const itemTitle = item?.title?.toLowerCase()?.trim();
  const itemTags = item?.tags?.map((tag) => tag?.toLowerCase());
  const itemCreatedDate = new Date(item?.created_at as string);
  const itemModifiedDate = new Date(item?.last_modified_at as string);
  // const itemStatus = item?.status ?? "";
  // const itemCountry = item?.country ?? "";
  // const itemEmail = item?.email ?? "";
  // const itemName = item?.name ?? "";
  // const itemDob = item?.dob;
  // const itemAge = getAge(itemDob ?? new Date().toDateString());
  const isUploaded = fileItem?.is_uploaded;
  const parent = fileItem?.parent;
  const mimeType = fileItem?.mime_type;

  let formattedDateFilterValue;
  let formattedDateFilterValue2 = new Date();

  if (filterOperator === "Between") {
    formattedDateFilterValue = new Date(filterValue[0]);
    formattedDateFilterValue2 = new Date(filterValue[1]);
  } else {
    formattedDateFilterValue = new Date(filterValue);
  }

  switch (filterOperator) {
    case "Contains":
      check = checkContains(
        filterTitle,
        itemTitle,
        itemTags,
        // itemEmail,
        // itemName,
        filterValue,
      );
      break;
    case "Doesn't Contains":
      check = checkDoesntContains(
        filterTitle,
        itemTitle,
        itemTags,
        // itemEmail,
        // itemName,
        filterValue,
      );
      break;
    case "Matches":
      check = checkMatches(
        filterTitle,
        itemTitle,
        itemTags,
        // itemEmail,
        // itemName,
        filterValue,
      );
      break;
    case "Equals":
      check = checkEquals(
        itemType,
        itemCreatedDate,
        itemModifiedDate,
        formattedDateFilterValue,
        filterTitle,
        // itemStatus,
        // itemCountry,
        filterValue,
        // itemAge,
        isUploaded,
        parent,
        mimeType,
      );
      break;
    case "Not Equals":
      check = checkNotEquals(
        itemCreatedDate,
        itemModifiedDate,
        formattedDateFilterValue,
        filterTitle,
        // itemStatus,
        // itemCountry,
        // filterValue,
      );
      break;
    case "Later than":
      check = checkLaterThan(
        filterTitle,
        itemCreatedDate,
        itemModifiedDate,
        formattedDateFilterValue,
      );
      break;
    case "Earlier than":
      check = checkEarlierThan(
        filterTitle,
        itemCreatedDate,
        itemModifiedDate,
        formattedDateFilterValue,
      );
      break;
    case "Between":
      check = checkBetween(
        filterTitle,
        itemCreatedDate,
        itemModifiedDate,
        formattedDateFilterValue,
        formattedDateFilterValue2,
      );
      break;
    // case "Greater than":
    // check = checkGreaterThan(filterTitle, itemAge, filterValue);
    // break;
    // case "Less than":
    // check = checkLessThan(filterTitle, itemAge, filterValue);
    // break;
    default:
      check = false;
  }

  return check;
};

const itemsWhichSatisfiesFilter = (
  allItems: ItemMetadataType[],
  filter: FilterItem,
  fileItems: any[],
) => {
  const filteredItems: ItemMetadataType[] = [];

  allItems?.forEach((item) => {
    const fileItem = fileItems?.find((file: any) => file?.id === item?.id);
    const check = checkIfItemSatisfiesFilter(item, filter, fileItem);
    if (check) {
      filteredItems?.push(item);
    }
  });

  return filteredItems;
};

const handleFiltering = (
  view: ViewItemPropertyType,
  allItems: ItemMetadataType[],
  fileItems: any[],
) => {
  const allFilters = view?.filters;
  const normalFilters = allFilters?.filterType;
  const groupFilters = allFilters?.groupedFilterType;

  let intersactionOfAllItems: ItemMetadataType[] = [];
  let intersactionOfItemsFilteredFromGroup: ItemMetadataType[] = [];
  let intersactionOfItemsFilteredFromNormalFilters: ItemMetadataType[] = [];

  groupFilters?.forEach((groupFilter, index: number) => {
    const groupFilterOperator = groupFilter?.groupOperator;
    const groupFilterChildren = groupFilter?.children;

    if (groupFilterOperator === "All") {
      let intersactionItems: ItemMetadataType[] = [];

      groupFilterChildren?.forEach((children, index: number) => {
        const items = itemsWhichSatisfiesFilter(allItems, children, fileItems);

        if (index === 0) {
          intersactionItems = items;
        }

        intersactionItems = getArrayIntersaction(intersactionItems, items);
      });

      intersactionOfItemsFilteredFromGroup = intersactionItems;
    }

    if (groupFilterOperator === "Any") {
      let unionItems: ItemMetadataType[] = [];

      groupFilterChildren?.forEach((children) => {
        const items = itemsWhichSatisfiesFilter(allItems, children, fileItems);

        unionItems.push(...items);
      });

      const uniqueItems = Array.from(new Set(unionItems));

      if (index === 0) {
        intersactionOfItemsFilteredFromGroup = uniqueItems;
      }

      intersactionOfItemsFilteredFromGroup = getArrayIntersaction(
        intersactionOfItemsFilteredFromGroup,
        uniqueItems,
      );
    }
  });

  normalFilters?.forEach((filter, index: number) => {
    const items = itemsWhichSatisfiesFilter(allItems, filter, fileItems);
    const uniqueItems = Array.from(new Set(items));

    if (index === 0) {
      intersactionOfItemsFilteredFromNormalFilters = uniqueItems;
    }

    intersactionOfItemsFilteredFromNormalFilters = getArrayIntersaction(
      intersactionOfItemsFilteredFromNormalFilters,
      uniqueItems,
    );
  });

  if (
    groupFilters &&
    groupFilters?.length > 0 &&
    normalFilters &&
    normalFilters?.length > 0
  ) {
    intersactionOfAllItems = getArrayIntersaction(
      intersactionOfItemsFilteredFromGroup,
      intersactionOfItemsFilteredFromNormalFilters,
    );
  } else if (
    groupFilters &&
    groupFilters?.length > 0 &&
    (!normalFilters || normalFilters?.length === 0)
  ) {
    intersactionOfAllItems = intersactionOfItemsFilteredFromGroup;
  } else if (
    (!groupFilters || groupFilters?.length === 0) &&
    normalFilters?.length > 0
  ) {
    intersactionOfAllItems = intersactionOfItemsFilteredFromNormalFilters;
  } else {
    intersactionOfAllItems = allItems;
  }

  return intersactionOfAllItems;
};

const applyGroupByToItemsDisplay = (
  allItemsData: ItemMetadataType[],
  tags: TagType[],
  view: ViewItemPropertyType,
) => {
  const uniqueArray = (prop: string, type: string) => {
    const date = allItemsData?.map((ele: any) => {
      return new Date(ele[prop]).toDateString();
    });
    const filteredData = Array.from(new Set(date));
    return filteredData.slice().sort((a: any, b: any) => {
      const a1 = new Date(a).getTime(),
        b1 = new Date(b).getTime();
      if (type === "date_ascend") {
        return a1 - b1;
      } else {
        return b1 - a1;
      }
    });
  };

  const uniqueTitleArray = (type: string) => {
    const title = allItemsData?.map((ele: any) => {
      return ele.title;
    });
    const filteredData = Array.from(new Set(title));
    return filteredData.slice().sort((a, b) => {
      const nameA = a.toLowerCase(),
        nameB = b.toLowerCase();
      if (type === "title-AtoZ") {
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
      } else {
        if (nameA > nameB) return -1;
        if (nameA < nameB) return 1;
      }
      return 0;
    });
  };

  const sortArrayByName = (type: string) => {
    return tags.slice().sort((a, b) => {
      const nameA = a.name.toLowerCase(),
        nameB = b.name.toLowerCase();
      if (type === "cat-AtoZ") {
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
      } else {
        if (nameA > nameB) return -1;
        if (nameA < nameB) return 1;
      }
      return 0;
    });
  };

  const handleFilter = (name: string, filter: string) => {
    return allItemsData
      ?.filter((ele: ItemMetadataType) => {
        if (filter === "created_at") {
          return new Date(ele.created_at).toDateString() === name;
        } else if (filter === "last_modified_at") {
          return (
            new Date(ele.last_modified_at as string).toDateString() === name
          );
        } else if (filter === "title") {
          return ele.title.toLowerCase() === name.toLowerCase();
        } else {
          return ele?.tags?.includes(name);
        }
      })
      .map((ele) => {
        return { ...ele, uniqId: generateUniqueId() };
      });
  };

  const getGridItemsData = (data: any, filter: string) => {
    const res = data?.map((ele: any, i: number) => {
      return {
        id: i,
        title: ele.name ?? ele,
        children: handleFilter(ele.name ?? ele, filter),
      };
    });
    if (filter === "cat-ZtoA" || filter === "cat-AtoZ") {
      return res?.filter((ele: any) => ele?.children?.length > 0);
    } else {
      return res;
    }
  };

  const generateUniqueId = () => {
    return String(
      Date.now().toString(32) +
        Math.random().toString(32) +
        Math.random().toString(32),
    ).replace(/\./g, "");
  };

  const unGroupedData = (data: ItemMetadataType[]) => {
    return data
      .filter((ele) => ele.tags === null)
      .map((ele) => {
        return { ...ele, uniqId: generateUniqueId() };
      });
  };

  const getGroupByFilteredData = () => {
    if (view?.group_by === "created_date_ascend") {
      const uniArr = uniqueArray("created_at", "date_ascend");
      return getGridItemsData(uniArr, "created_at");
    } else if (view?.group_by === "created_date_descend") {
      const uniArr = uniqueArray("created_at", "date_descend");
      return getGridItemsData(uniArr, "created_at");
    } else if (view?.group_by === "cat-AtoZ") {
      const sortedTags = sortArrayByName("cat-AtoZ");
      const gridItemsData = getGridItemsData(sortedTags, "cat-AtoZ");
      const unGroup = unGroupedData(allItemsData);
      return unGroup.length > 0
        ? [
            ...gridItemsData,
            {
              id:
                gridItemsData.length > 0
                  ? gridItemsData[gridItemsData.length - 1].id + 1
                  : 0,
              title: "Not Grouped",
              children: unGroup,
            },
          ]
        : gridItemsData;
    } else if (view?.group_by === "cat-ZtoA") {
      const sortedTags = sortArrayByName("cat-ZtoA");
      const gridItemsData = getGridItemsData(sortedTags, "cat-ZtoA");
      const unGroup = unGroupedData(allItemsData);
      return unGroup.length > 0
        ? [
            ...gridItemsData,
            {
              id:
                gridItemsData.length > 0
                  ? gridItemsData[gridItemsData.length - 1].id + 1
                  : 0,
              title: "Not Grouped",
              children: unGroup,
            },
          ]
        : gridItemsData;
    } else if (view?.group_by === "modified_date_ascend") {
      const uniArr = uniqueArray("last_modified_at", "date_ascend");
      return getGridItemsData(uniArr, "last_modified_at");
    } else if (view?.group_by === "modified_date_descend") {
      const uniArr = uniqueArray("last_modified_at", "date_descend");
      return getGridItemsData(uniArr, "last_modified_at");
    } else if (view?.group_by === "title-AtoZ") {
      const uniArr = uniqueTitleArray("title-AtoZ");
      return getGridItemsData(uniArr, "title");
    } else if (view?.group_by === "title-ZtoA") {
      const uniArr = uniqueTitleArray("title-ZtoA");
      return getGridItemsData(uniArr, "title");
    }
  };

  return getGroupByFilteredData() ?? [];
};

// const getTabValues = (data: ItemsToDisplayType[]) => {
//   return data?.map((ele: ItemsToDisplayType, i) => String(ele.id));
// };

const applySortByToItemsDisplay = (
  data: ItemsToDisplayType[],
  view: ViewItemPropertyType,
  selectedSort: string,
) => {
  const handleTitleSort = (type: string) => {
    return data?.map((ele) => {
      const sortArr = ele?.children?.slice(0).sort((a, b) => {
        const nameA = a?.title?.toLowerCase();
        const nameB = b?.title?.toLowerCase();
        if (type === "title-AtoZ") {
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
        } else {
          if (nameA > nameB) return -1;
          if (nameA < nameB) return 1;
        }
        return 0;
      });
      return { ...ele, children: sortArr };
    });
  };

  const handleDateSort = (selectedDate: string, type: string) => {
    return data?.map((ele) => {
      const sortArr = ele?.children?.slice(0).sort((a, b) => {
        const a1 =
          selectedDate === "created_at"
            ? new Date(a.created_at).getTime()
            : new Date(a.last_modified_at as string).getTime();
        const b1 =
          selectedDate === "created_at"
            ? new Date(b.created_at).getTime()
            : new Date(b.last_modified_at as string).getTime();
        if (type === "date_ascend") {
          return a1 - b1;
        } else {
          return b1 - a1;
        }
      });
      return { ...ele, children: sortArr };
    });
  };

  const handleCategorySort = (type: string) => {
    return data?.map((ele) => {
      const nonTagsArr = ele?.children?.filter((o) => {
        return o.tags === null;
      });
      const tagsArr = ele?.children?.filter((o) => {
        return o.tags !== null;
      });
      const sortArr = tagsArr?.slice(0)?.sort((a, b) => {
        const nameA = a?.tags[0]?.toLowerCase();
        const nameB = b?.tags[0]?.toLowerCase();
        if (type === "cat-AtoZ") {
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
        } else {
          if (nameA > nameB) return -1;
          if (nameA < nameB) return 1;
        }
        return 0;
      });
      const childrenArr = [...sortArr, ...nonTagsArr];
      return { ...ele, children: childrenArr };
    });
  };

  if (
    view?.sort_by &&
    (selectedSort === "created_date_ascend" ||
      selectedSort === "created_date_descend")
  ) {
    const sortedArr = handleDateSort("created_at", selectedSort.slice(8));
    return sortedArr;
  } else if (
    view?.sort_by &&
    (selectedSort === "modified_date_ascend" ||
      selectedSort === "modified_date_descend")
  ) {
    const sortedArr = handleDateSort("last_modified_at", selectedSort.slice(9));
    return sortedArr;
  } else if (view?.sort_by && selectedSort === "cat-AtoZ") {
    const sortedArr = handleCategorySort("cat-AtoZ");
    return sortedArr;
  } else if (view?.sort_by && selectedSort === "cat-ZtoA") {
    const sortedArr = handleCategorySort("cat-ZtoA");
    return sortedArr;
  } else if (
    view?.sort_by &&
    (selectedSort === "title-AtoZ" || selectedSort === "title-ZtoA")
  ) {
    const sortedArr = handleTitleSort(selectedSort);
    return sortedArr;
  }
};

export const getItemsToDisplay = (
  allItemsData: ItemMetadataType[],
  currentView: ViewItemPropertyType,
  tags: any[],
  fileItems: any[],
) => {
  // On page render calling action to apply all property sort, filters and group
  const filteredItems = handleFiltering(currentView, allItemsData, fileItems);

  // let tabData;
  let filteredItemsData;

  filteredItemsData = applyGroupByToItemsDisplay(
    filteredItems,
    tags,
    currentView,
  );

  if (currentView?.sort_by) {
    const newSort: string = currentView?.sort_by;
    filteredItemsData = applySortByToItemsDisplay(
      filteredItemsData,
      currentView,
      newSort,
    );
  }

  // tabData = getTabValues(filteredItemsData);

  // return { itemsToDisplay: filteredItemsData, tabData };
  return filteredItemsData;
};
