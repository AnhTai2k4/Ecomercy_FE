import React, { useState, useEffect } from "react";

function WebAuthnCheckbox({ user, setAddWebAuthn, setRemoveWebAuthn }) {
  const [isChecked, setIsChecked] = useState(false);

  // Đồng bộ ban đầu với user.credential
  useEffect(() => {
    console.log(user.credential)
    setIsChecked(!!user.credential);
  }, [user.credential]);

  const handleChange = () => {
    if (isChecked) {
      // Đang checked => bỏ check
      setIsChecked(false);
      setRemoveWebAuthn(true);
    } else {
      // Đang unchecked => check
      setIsChecked(true);
      setAddWebAuthn(true);
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

export default WebAuthnCheckbox;
