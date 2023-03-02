import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Route, Routes, Navigate } from "react-router-dom";
import {
  AuthForm,
  SplashPage,
  NotFound,
  SingleProject,
  AllProjects,
  FinalProjectView,
} from "../";
import { me } from "../../features";

import { fetchAllProjectsByUserIdAsync } from "../../features";

/**
 * COMPONENT
 */

const AppRoutes = () => {
  const isLoggedIn = useSelector((state) => !!state.auth.me.id);
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.me.id);

  useEffect(() => {
    dispatch(me());
  }, [dispatch]);

  useEffect(() => {
    if (userId) {
      dispatch(fetchAllProjectsByUserIdAsync(userId));
    }
  }, [dispatch, userId]);

  return (
    <Routes>
      {isLoggedIn ? (
        <>
          <Route path="/" element={<SplashPage />} />
          <Route path="/login" element={<Navigate to="/projects" />} />
          <Route path="/signup" element={<Navigate to="/projects" />} />
          <Route path="/projects" element={<AllProjects />} />
          <Route path="/projects/:projectId" element={<SingleProject />} />
        </>
      ) : (
        <>
          <Route path="/" element={<SplashPage />} />
          <Route
            path="/login"
            element={<AuthForm name="login" displayName="Login" />}
          />
          <Route
            path="/signup"
            element={<AuthForm name="signup" displayName="Sign Up" />}
          />
        </>
      )}
      <Route path="/share/:projectId" element={<FinalProjectView />}></Route>
      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
