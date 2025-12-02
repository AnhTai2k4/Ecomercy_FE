import React, { useEffect, useState } from "react";
import "./SecuritySettingsModal.css";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import {
  addRegister,
  deleteWebauthnCredential,
  getWebauthnCredentials,
  renameWebauthnCredential,
} from "../../../service/UserService";

const SecuritySettingsModal = ({ isOpen, onClose }) => {
  const user = useSelector((state) => state.user);
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [workingCredential, setWorkingCredential] = useState(null);

  const hasToken = user?.access_token;

  useEffect(() => {
    if (isOpen && hasToken) {
      fetchCredentials();
    }
  }, [isOpen, hasToken]);

  const fetchCredentials = async () => {
    if (!hasToken) {
      setError("Bạn cần đăng nhập để xem cài đặt bảo mật");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // Parse token nếu là JSON string
      let token = user.access_token;
      if (typeof user.access_token === 'string' && user.access_token.startsWith('"')) {
        try {
          token = JSON.parse(user.access_token);
        } catch (e) {
          token = user.access_token;
        }
      }
      
      const { id } = jwtDecode(token);
      const res = await getWebauthnCredentials({
        userId: id,
        access_token: token,
      });
      setCredentials(res?.data || []);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Không thể tải danh sách thiết bị WebAuthn"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddDevice = async () => {
    if (!user?.username) return;
    setAdding(true);
    setError("");
    try {
      await addRegister({ username: user.username });
      await fetchCredentials();
    } catch (err) {
      setError(
        err?.response?.data?.message || "Không thể thêm thiết bị WebAuthn mới"
      );
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (credentialId) => {
    if (!hasToken) return;
    const confirmDelete = window.confirm(
      "Bạn chắc chắn muốn xóa thiết bị này?"
    );
    if (!confirmDelete) return;

    setWorkingCredential(credentialId);
    setError("");
    try {
      // Parse token nếu là JSON string
      let token = user.access_token;
      if (typeof user.access_token === 'string' && user.access_token.startsWith('"')) {
        try {
          token = JSON.parse(user.access_token);
        } catch (e) {
          token = user.access_token;
        }
      }
      
      const { id } = jwtDecode(token);
      await deleteWebauthnCredential({
        userId: id,
        credentialId,
        access_token: token,
      });
      await fetchCredentials();
    } catch (err) {
      setError(err?.response?.data?.message || "Xóa thiết bị thất bại");
    } finally {
      setWorkingCredential(null);
    }
  };

  const handleRename = async (credentialId, currentName) => {
    if (!hasToken) return;
    const name = window.prompt("Nhập tên thiết bị mới", currentName || "");
    if (!name || name.trim() === "") return;

    setWorkingCredential(credentialId);
    setError("");
    try {
      // Parse token nếu là JSON string
      let token = user.access_token;
      if (typeof user.access_token === 'string' && user.access_token.startsWith('"')) {
        try {
          token = JSON.parse(user.access_token);
        } catch (e) {
          token = user.access_token;
        }
      }
      
      const { id } = jwtDecode(token);
      await renameWebauthnCredential({
        userId: id,
        credentialId,
        name: name.trim(),
        access_token: token,
      });
      await fetchCredentials();
    } catch (err) {
      setError(err?.response?.data?.message || "Đổi tên thiết bị thất bại");
    } finally {
      setWorkingCredential(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="security-modal__backdrop">
      <div className="security-modal__content">
        <div className="security-modal__header">
          <div>
            <h3>Cài đặt bảo mật</h3>
            <p>Quản lý các thiết bị WebAuthn có thể đăng nhập vào tài khoản</p>
          </div>
          <button className="security-modal__close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="security-modal__body">
          {error && <div className="security-modal__error">{error}</div>}
          {loading ? (
            <p>Đang tải danh sách thiết bị...</p>
          ) : credentials.length === 0 ? (
            <p>Bạn chưa đăng ký thiết bị WebAuthn nào.</p>
          ) : (
            <div className="security-device__list">
              {credentials.map((credential) => (
                <div
                  key={credential.credentialId}
                  className="security-device__item"
                >
                  <div>
                    <p className="security-device__name">
                      {credential.name || "Thiết bị WebAuthn"}
                    </p>
                    <p className="security-device__meta">
                      ID: {credential.credentialId?.slice(0, 16)}...
                    </p>
                    {credential.createdAt && (
                      <p className="security-device__meta">
                        Ngày thêm:{" "}
                        {new Date(credential.createdAt).toLocaleString("vi-VN")}
                      </p>
                    )}
                  </div>
                  <div className="security-device__actions">
                    <button
                      className="security-btn security-btn--ghost"
                      onClick={() =>
                        handleRename(
                          credential.credentialId,
                          credential.name || ""
                        )
                      }
                      disabled={workingCredential === credential.credentialId}
                    >
                      Đổi tên
                    </button>
                    <button
                      className="security-btn security-btn--danger"
                      onClick={() => handleDelete(credential.credentialId)}
                      disabled={workingCredential === credential.credentialId}
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="security-modal__footer">
          <button
            className="security-btn security-btn--primary"
            onClick={handleAddDevice}
            disabled={adding || !user?.username}
          >
            {adding ? "Đang thêm..." : "+ Thêm thiết bị"}
          </button>
          <button className="security-btn security-btn--ghost" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettingsModal;

