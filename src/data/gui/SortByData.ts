export const SortByData = [
    {
        id: 'created_at',
        name: 'Created Date',
        children: [
          { id: 'created_date_ascend', name: 'Ascending', activeAt: true },
          { id: 'created_date_descend', name: 'Descending', activeAt: true }
        ]
    },
    {
        id: 'title',
        name: 'Title',
        children: [
          { id: 'title-AtoZ', name: 'A to Z', activeAt: true },
          { id: 'title-ZtoA', name: 'Z to A', activeAt: true }
        ]
    },
    {
      id: 'categories',
      name: 'Categories',
      children: [
        { id: 'cat-AtoZ', name: 'A to Z', activeAt: true },
        { id: 'cat-ZtoA', name: 'Z to A', activeAt: true }
      ]
    },
    {
      id: 'last-accessed',
      name: 'Last Modified Date',
      children: [
        { id: 'modified_date_ascend', name: 'Ascending', activeAt: true },
        { id: 'modified_date_descend', name: 'Descending', activeAt: true }
      ]
  },
    // {
    //   id: 'role',
    //   name: 'Role'
    // },
    // {
    //     id: 'owners',
    //     name: 'Owners'
    // }
  ]