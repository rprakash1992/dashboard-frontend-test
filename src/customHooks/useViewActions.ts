import { useStore } from "../store";
import { viewApi } from "../apiActions/viewApi";
import { generateUniqueId } from "../utils/misc";
import type {
  ViewItemPropertyType,
  FilterItem,
  GroupFilterItem,
  NewFilterItem,
} from "../store/viewSlice";
import { AlertMsgType } from "../store/actionSlice";
import { ItemTypeToRouteEnums } from "../data/gui/RouteEnums";
import { useNavigate } from "react-router";

export const useViewActions = () => {
  const viewProperties = useStore((state) => state.viewProperties);
  const setViewPropertiesItem = useStore(
    (state) => state.setViewPropertiesItem,
  );
  const updateViewProperties = useStore((state) => state.updateViewProperties);
  const setDialogBoxMsg = useStore((state) => state.setDialogBoxMsg);
  const setTabIdToDelete = useStore((state) => state.setTabIdToDelete);
  const setIsCopyingView = useStore((state) => state.setIsCopyingView);
  const setIsDeletingView = useStore((state) => state.setIsDeletingView);
  const viewsAddingInProgress = useStore(
    (state) => state.viewsAddingInProgress,
  );
  const setViewsAddingInProgress = useStore(
    (state) => state.setViewsAddingInProgress,
  );
  const navigate = useNavigate();

  const deleteView = async (viewId: string) => {
    try {
      setIsDeletingView(true);
      const view = viewProperties?.find(
        (v) => String(v?.id) === String(viewId),
      );
      const status = view?.status;

      if (status === "permanent") {
        return setDialogBoxMsg(
          "Deleting this view is not allowed.",
          AlertMsgType.ERROR,
        );
      }

      // setViewPropertiesItem(
      //   viewProperties?.filter((item) => String(item?.id) !== String(viewId)),
      // );

      if (status === "pinned") {
        const { error } = await viewApi?.deleteViewById(viewId);

        if (error) {
          setDialogBoxMsg(error, AlertMsgType.ERROR);
          // setViewPropertiesItem(viewProperties);
          return;
        }
      }

      setViewPropertiesItem(
        viewProperties?.filter((item) => String(item?.id) !== String(viewId)),
      );
      setDialogBoxMsg("View deleted.", AlertMsgType.SUCCESS);
      setTabIdToDelete(String(viewId));
    } catch (error) {
      // setViewPropertiesItem(viewProperties);
      setDialogBoxMsg("Error while deleting view.", AlertMsgType.SUCCESS);
    } finally {
      setIsDeletingView(false);
    }
  };

  const copyView = async (view: ViewItemPropertyType) => {
    try {
      setIsCopyingView(true);
      const { id, ...rest } = view;

      const { error: viewErr, data: newViews } = await viewApi.insertNewView({
        ...rest,
        title: view.title + "_copy",
      });

      if (viewErr) {
        return setDialogBoxMsg(viewErr, AlertMsgType.ERROR);
      }

      const newView: ViewItemPropertyType = newViews[0];
      const route = ItemTypeToRouteEnums[newView?.item_type];
      setViewPropertiesItem([...viewProperties, newView]);
      navigate(
        `${route}?tabId=${newView?.id}&tabTitle=${newView?.title}&itemId=${newView?.id}`,
      );
    } catch (error) {
      setDialogBoxMsg("Error while copying view.", AlertMsgType.ERROR);
    } finally {
      setIsCopyingView(false);
    }
  };

  const updateViewAs = async (viewId: string, newVal: string) => {
    const view = viewProperties.find(
      (view) => String(view.id) === String(viewId),
    ) as ViewItemPropertyType;

    updateViewProperties({
      ...view,
      view_as: newVal,
    });

    try {
      const { error: viewErr } = await viewApi?.updateViewById(
        viewId,
        "view_as",
        newVal,
      );

      if (viewErr) {
        // updateViewProperties(view);
        updateViewProperties({
          ...view,
          view_as: newVal === "grid" ? "table" : "grid",
        });
        return setDialogBoxMsg(viewErr, AlertMsgType.ERROR);
      }

      // if (data) {
      // // const newView = data[0];
      //   const newView = data;
      //   updateViewProperties(newView);
      // }
    } catch (error) {
      // updateViewProperties(view);
      updateViewProperties({
        ...view,
        view_as: newVal === "grid" ? "table" : "grid",
      });
    }
  };

  const togglePinView = async (viewId: string) => {
    const view = viewProperties.find(
      (view) => String(view?.id) === String(viewId),
    ) as ViewItemPropertyType;

    const currentStatus = view?.status;

    if (currentStatus === "permanent") {
      return setDialogBoxMsg(
        "Pin/Unpin is not allowed for this view.",
        AlertMsgType.ERROR,
      );
    }

    view.status = currentStatus === "pinned" ? "temporary" : "pinned";
    // view.status = status;

    setViewPropertiesItem(
      viewProperties.map((v) => (String(v?.id) === String(viewId) ? view : v)),
    );

    const { id, ...rest } = view;

    if (currentStatus === "temporary") {
      // if currentStatus is "temporary", which means we are changing the status to "pinned"
      // hence we need to add the view to database
      const { data, error } = await viewApi.insertNewView(rest);

      if (error) {
        setViewPropertiesItem(
          viewProperties.map((v) =>
            String(v?.id) === String(viewId)
              ? { ...v, status: "temporary" }
              : v,
          ),
        );
        return setDialogBoxMsg(error, AlertMsgType.ERROR);
      }

      if (data?.length > 0) {
        const newView = data[0];

        setViewPropertiesItem(
          viewProperties.map((view) =>
            String(view?.id) === String(viewId) ? newView : view,
          ),
        );
      }
    }

    if (currentStatus === "pinned") {
      // if current status is "pinned", which means we are changing the status to "temporary"
      // hence we need to delete the view from database
      const { error } = await viewApi.deleteViewById(viewId);

      if (error) {
        setViewPropertiesItem(
          viewProperties.map((v) =>
            String(v?.id) === String(viewId) ? { ...v, status: "pinned" } : v,
          ),
        );
        return setDialogBoxMsg(error, AlertMsgType.ERROR);
      }
    }
  };

  const addNewView = async (title: string, itemType: string) => {
    let newViewId: string;
    try {
      const filters = {
        filterType: [
          {
            id: String(Math.floor(Math.random() * 10000)),
            filterTitle: "Parent Folder",
            operator: "Equals",
            value: null,
            isChecked: true,
          },
        ],
        groupedFilterType: [],
      };

      const payload = {
        id: String(Math.floor(Math.random() * 100000)),
        title: title,
        item_type: itemType,
        group_by: "created_date_descend",
        sort_by: "created_date_descend",
        filters,
        view_as: "grid",
        status: "pinned",
      };

      const { id, ...rest } = payload;
      newViewId = id;

      setViewsAddingInProgress([...viewsAddingInProgress, payload]);

      const { data, error } = await viewApi?.insertNewView(rest);

      if (error) {
        return setDialogBoxMsg(error, AlertMsgType.ERROR);
      }

      if (data?.length > 0) {
        const newView = data[0];
        const viewId = newView.id;
        setViewPropertiesItem([...viewProperties, newView]);
        const route = ItemTypeToRouteEnums[itemType];
        navigate(`${route}?tabId=${viewId}&tabTitle=${title}&itemId=${viewId}`);
      }
    } catch (error) {
      return setDialogBoxMsg(String(error), AlertMsgType.ERROR);
    } finally {
      setViewsAddingInProgress(
        viewsAddingInProgress.filter(
          (view) => String(view.id) !== String(newViewId),
        ),
      );
    }
  };

  const renameView = async (viewId: string, newTitle: string) => {
    const view = viewProperties.find(
      (v) => String(v.id) === String(viewId),
    ) as ViewItemPropertyType;

    const currentStatus = view?.status;

    if (currentStatus === "permanent") {
      return setDialogBoxMsg(
        "Renaming is not allowed for this view.",
        AlertMsgType.ERROR,
      );
    }

    setViewPropertiesItem(
      viewProperties.map((v) =>
        String(v?.id) === String(viewId) ? { ...view, title: newTitle } : v,
      ),
    );

    if (currentStatus === "pinned") {
      // if the status of view is "pinned", then we need to update the filter in database also
      const { error } = await viewApi.updateViewById(viewId, "title", newTitle);

      if (error) {
        setViewPropertiesItem(viewProperties);
        return setDialogBoxMsg(error, AlertMsgType.ERROR);
      }
    }

    if (currentStatus === "temporary") {
      // if status is temporary, it means that the view is present only in the frontend state
      // we don't need to delete it from database
      // A view created using 'searching' is present only in frontend state and not in database
    }
  };

  const applyFilter = async (viewId: string, filter: FilterItem) => {
    const view = viewProperties.find(
      (v) => String(v.id) === String(viewId),
    ) as ViewItemPropertyType;

    const status = view?.status;

    if (status === "permanent") {
      return setDialogBoxMsg(
        "Adding/Updating filter for this view is not allowed.",
        AlertMsgType.ERROR,
      );
    }

    const filterTypes = view?.filters?.filterType;
    const filterId = filterTypes?.find(
      (f) => String(f.id) === String(filter.id),
    );

    if (filterId) {
      // if filterId is there, which means we are updating the filter
      view.filters.filterType = filterTypes?.map((ft) =>
        String(ft.id) === String(filter.id) ? filter : ft,
      );
    } else {
      // if no filterId is present, which means we are creating a new filter
      view?.filters?.filterType?.push({
        ...filter,
        id: !filter?.id
          ? String(Math.floor(Math.random() * 100000))
          : filter?.id,
      });
    }

    setViewPropertiesItem(
      viewProperties.map((v) => (String(v.id) === String(viewId) ? view : v)),
    );

    if (status === "pinned") {
      // if the status of view is "pinned", the we need to update it in database also
      const { data, error } = await viewApi.updateFullView(view);

      if (error) {
        setViewPropertiesItem(viewProperties);
        return setDialogBoxMsg(error, AlertMsgType.ERROR);
      }

      if (data?.length > 0) {
        const updatedView = data[0];
        setViewPropertiesItem(
          viewProperties.map((v) =>
            String(v.id) === String(viewId) ? updatedView : v,
          ),
        );
      }
    }

    if (status === "temporary") {
      // if status is temporary, it means that the view is present only in the frontend state
      // we don't need to update it in database
      // A view created using 'searching' is present only in frontend state and not in database
    }
  };

  const editFilter = async (viewId: string, filter: FilterItem) => {
    const view = viewProperties.find(
      (v) => String(v.id) === String(viewId),
    ) as ViewItemPropertyType;

    const status = view?.status;

    if (status === "permanent") {
      return setDialogBoxMsg(
        "Editing filter for this view is not allowed.",
        AlertMsgType.ERROR,
      );
    }

    const filterTypes = view?.filters?.filterType;

    view.filters.filterType = filterTypes?.map((ft) =>
      String(ft.id) === String(filter.id) ? filter : ft,
    );

    setViewPropertiesItem(
      viewProperties.map((v) => (String(v.id) === String(viewId) ? view : v)),
    );

    if (status === "pinned") {
      // if the status of view is "pinned", the we need to update it in database also
      const { error } = await viewApi.updateFullView(view);

      if (error) {
        setViewPropertiesItem(viewProperties);
        return setDialogBoxMsg(error, AlertMsgType.ERROR);
      }
    }

    if (status === "temporary") {
      // if status is temporary, it means that the view is present only in the frontend state
      // we don't need to update it in database
      // A view created using 'searching' is present only in frontend state and not in database
    }
  };

  const addNewFilter = async (viewId: string, filter: NewFilterItem) => {
    const view = viewProperties.find(
      (v) => String(v.id) === String(viewId),
    ) as ViewItemPropertyType;

    const status = view?.status;

    if (status === "permanent") {
      return setDialogBoxMsg(
        "Adding filter for this view is not allowed.",
        AlertMsgType.ERROR,
      );
    }

    view?.filters?.filterType?.push({
      ...filter,
      id: generateUniqueId(),
    });

    setViewPropertiesItem(
      viewProperties.map((v) => (String(v.id) === String(viewId) ? view : v)),
    );

    if (status === "pinned") {
      // if the status of view is "pinned", the we need to add it in database also
      const { error } = await viewApi.updateFullView(view);

      if (error) {
        setViewPropertiesItem(viewProperties);
        return setDialogBoxMsg(error, AlertMsgType.ERROR);
      }
    }

    if (status === "temporary") {
      // if status is temporary, it means that the view is present only in the frontend state
      // we don't need to add it in database
      // A view created using 'searching' is present only in frontend state and not in database
    }
  };

  const deleteFilter = async (viewId: string, filterId: string) => {
    const view = viewProperties.find(
      (v) => String(v.id) === String(viewId),
    ) as ViewItemPropertyType;

    const status = view?.status;

    if (status === "permanent") {
      return setDialogBoxMsg(
        "Deleting filter for this view is not allowed.",
        AlertMsgType.ERROR,
      );
    }

    const filterTypes = view?.filters?.filterType;
    const updatedFilterTypes = filterTypes?.filter(
      (f) => String(f?.id) !== String(filterId),
    );

    view.filters.filterType = updatedFilterTypes;

    setViewPropertiesItem(
      viewProperties.map((v) => (String(v.id) === String(viewId) ? view : v)),
    );

    if (status === "pinned") {
      // if the status of view is "pinned", then we need to delete the filter from database also
      const { data, error } = await viewApi.updateFullView(view);

      if (error) {
        setViewPropertiesItem(viewProperties);
        return setDialogBoxMsg(error, AlertMsgType.ERROR);
      }

      if (data?.length > 0) {
        const updatedView = data[0];
        setViewPropertiesItem(
          viewProperties.map((v) =>
            String(v.id) === String(viewId) ? updatedView : v,
          ),
        );
      }
    }

    if (status === "temporary") {
      // if status is temporary, it means that the view is present only in the frontend state
      // we don't need to delete it from database
      // A view created using 'searching' is present only in frontend state and not in database
    }
  };

  const deleteFilterGroup = async (viewId: string, filterGroupId: string) => {
    const view = viewProperties.find(
      (v) => String(v.id) === String(viewId),
    ) as ViewItemPropertyType;

    const status = view?.status;

    if (status === "permanent") {
      return setDialogBoxMsg(
        "Deleting filter for this view is not allowed.",
        AlertMsgType.ERROR,
      );
    }

    const groupedFilterTypes = view?.filters?.groupedFilterType;
    const updatedGroupFilterTypes = groupedFilterTypes?.filter(
      (f) => String(f?.id) !== String(filterGroupId),
    );

    view.filters.groupedFilterType = updatedGroupFilterTypes;

    setViewPropertiesItem(
      viewProperties.map((v) => (String(v.id) === String(viewId) ? view : v)),
    );

    if (status === "pinned") {
      // if the status of view is "pinned", then we need to delete the filter group from database also
      const { data, error } = await viewApi.updateFullView(view);

      if (error) {
        setViewPropertiesItem(viewProperties);
        return setDialogBoxMsg(error, AlertMsgType.ERROR);
      }

      if (data?.length > 0) {
        const updatedView = data[0];
        setViewPropertiesItem(
          viewProperties.map((v) =>
            String(v.id) === String(viewId) ? updatedView : v,
          ),
        );
      }
    }

    if (status === "temporary") {
      // if status is temporary, it means that the view is present only in the frontend state
      // we don't need to delete it from database
      // A view created using searching is present only in frontend state and not in database
    }
  };

  const applyFilterGroup = async (
    viewId: string,
    filterGroup: GroupFilterItem,
  ) => {
    const view = viewProperties.find(
      (v) => String(v.id) === String(viewId),
    ) as ViewItemPropertyType;

    const status = view?.status;

    if (status === "permanent") {
      return setDialogBoxMsg(
        "Appling filter for this view is not allowed.",
        AlertMsgType.ERROR,
      );
    }

    const groupedFilterTypes = view?.filters?.groupedFilterType;
    const filterGroupId = groupedFilterTypes?.find(
      (f) => String(f.id) === String(filterGroup.id),
    );

    if (filterGroupId) {
      view.filters.groupedFilterType = groupedFilterTypes?.map((gft) =>
        String(gft.id) === String(filterGroup.id) ? filterGroup : gft,
      );
    } else {
      view?.filters?.groupedFilterType?.push({
        ...filterGroup,
        id: !filterGroup?.id
          ? String(Math.floor(Math.random() * 100000))
          : filterGroup?.id,
      });
    }

    // remove the filters from filterTypes which are moved to the group
    const filterTypes = view?.filters?.filterType;
    const groupedFilterTypeIds: string[] = [];
    groupedFilterTypes?.forEach((gft) => {
      gft?.children?.forEach((c) => {
        groupedFilterTypeIds?.push(String(c?.id));
      });
    });
    view.filters.filterType = filterTypes?.filter(
      (f) => !groupedFilterTypeIds.includes(String(f?.id)),
    );

    setViewPropertiesItem(
      viewProperties.map((v) => (String(v.id) === String(viewId) ? view : v)),
    );

    if (status === "pinned") {
      const { data, error } = await viewApi.updateFullView(view);

      if (error) {
        setViewPropertiesItem(viewProperties);
        return setDialogBoxMsg(error, AlertMsgType.ERROR);
      }

      if (data?.length > 0) {
        const updatedView = data[0];
        setViewPropertiesItem(
          viewProperties.map((v) =>
            String(v.id) === String(viewId) ? updatedView : v,
          ),
        );
      }
    }
  };

  const applySort = async (viewId: string, sort: string) => {
    const view = viewProperties.find(
      (v) => String(v.id) === String(viewId),
    ) as ViewItemPropertyType;

    const status = view?.status;

    view.sort_by = sort;
    view.group_by = sort;

    setViewPropertiesItem(
      viewProperties.map((v) => (String(v.id) === String(viewId) ? view : v)),
    );

    if (status === "pinned") {
      // if the status of view is "pinned", the we need to update it in database also
      const { data, error } = await viewApi.updateFullView(view);

      if (error) {
        setViewPropertiesItem(viewProperties);
        return setDialogBoxMsg(error, AlertMsgType.ERROR);
      }

      if (data) {
        const updatedView = data;
        setViewPropertiesItem(
          viewProperties.map((v) =>
            String(v.id) === String(viewId) ? updatedView : v,
          ),
        );
      }
    }

    if (status === "temporary") {
      // if status is temporary, it means that the view is present only in the frontend state
      // we don't need to update it in database
      // A view created using 'searching' is present only in frontend state and not in database
    }
  };

  return {
    deleteView,
    copyView,
    updateViewAs,
    togglePinView,
    addNewView,
    renameView,
    applyFilter,
    editFilter,
    addNewFilter,
    deleteFilter,
    deleteFilterGroup,
    applyFilterGroup,
    applySort,
  };
};
