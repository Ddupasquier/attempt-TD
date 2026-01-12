const IS_DEV = false;

const getCatapultDamagePopupStyle = () =>
  IS_DEV
    ? {
        color: "#c93d3d",
        duration: 1.2,
        sizeMult: 1.4,
      }
    : {};

export { IS_DEV, getCatapultDamagePopupStyle };
