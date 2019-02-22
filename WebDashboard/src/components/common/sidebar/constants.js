
        const defaultRoles = ['admin'];

        export const adminAreaArr = [{"name":"VehicleType","to":"/vehicleType"}].map(item =>
          !item.subItems
            ? item
            : {
              ...item,
              roles: item.roles.concat(defaultRoles),
              subItems: item.subItems.map(subItem => ({
                ...subItem,
                roles: subItem.roles.concat(defaultRoles),
              })),
            }
        );

      