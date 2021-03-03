import React, { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { clearAllToast } from "../../redux/reducers/toastReducer";

export const Toaster = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.toast.notifications);
  const notify = () =>
    toast("Producto Agregado !", {
      autoClose: true,
    });

  useEffect(() => {
    if (notifications.length > 0) {
      notifications.forEach((x) => {
        notify();
      });
      dispatch(clearAllToast());
    }
  }, [notifications]);

  return (
    <ToastContainer
      position="bottom-left"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnVisibilityChange={false}
      draggable
      pauseOnHover={true}
    />
  );
};
