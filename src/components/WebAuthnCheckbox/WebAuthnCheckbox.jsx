import React, { useState, useEffect } from "react";

function TwoFactorCheckbox({ user, setAddTwoFactorAuth, setRemoveTwoFactorAuth }) {
  const [isChecked, setIsChecked] = useState(!!user.isTwoFactorAuth);

  // Đồng bộ ban đầu với user.credential
  useEffect(() => {
    console.log(user.isTwoFactorAuth)
    setIsChecked(!!user.isTwoFactorAuth);
  }, [user.isTwoFactorAuth]);

  const handleChange = () => {
    if (isChecked) {
      // Đang checked => bỏ check
      setIsChecked(false);
      setRemoveTwoFactorAuth(true);
      setAddTwoFactorAuth(false);
    } else {
      // Đang unchecked => check
      setIsChecked(true);
      setAddTwoFactorAuth(true);
      setRemoveTwoFactorAuth(false);
    }
  };

  return (
    <input
      type="checkbox"
      style={{ border: "hidden" }}
      checked={isChecked}
      onChange={handleChange}
    />
  );
}

export default TwoFactorCheckbox;
