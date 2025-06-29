import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ToastProvider } from './contexts/ToastContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { ManageClassesPage } from './pages/ManageClassesPage';
import { ManageTrainerPage } from './pages/ManageTrainerPage';
import { ManageMembersPage } from './pages/ManageMembersPage';
import { MemberProfilePage } from './pages/MemberProfilePage';
import { CustomMainLayout } from './layouts/CustomMainLayout';
import { WorkoutPage } from './pages/WorkoutPage';
import { CreateWorkoutPage } from './pages/CreateWorkoutPage';
import { CreateClassPage } from './pages/CreateClassPage';
import { EditClassPage } from './pages/EditClassPage';
import { ViewClassPage } from './pages/VIewClassPage';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,  
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        <Notifications />
        <ToastProvider>
          <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route 
              path="/*" 
              element={
                <ProtectedRoute>
                  <CustomMainLayout>
                    <Routes>
                      <Route path="/" element={<Navigate to="/manage-classes" replace />} />
                      <Route path="/manage-classes" element={<ManageClassesPage />} />
                      <Route path="/workouts" element={<WorkoutPage />} />
                      <Route path="/manage-trainer" element={<ManageTrainerPage />} />
                      <Route path="/members" element={<ManageMembersPage />} />
                      <Route path="/member-profile/:userId" element={<MemberProfilePage />} />
                    </Routes>
                  </CustomMainLayout>
                </ProtectedRoute>
              } 
            />
            <Route
              path="/workout/create"
              element={
                <ProtectedRoute>
                  <CustomMainLayout>
                    <CreateWorkoutPage />
                  </CustomMainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/classes/create"
              element={
                <ProtectedRoute>
                  <CustomMainLayout>
                    <CreateClassPage />
                  </CustomMainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/classes/edit/:classId"
              element={
                <ProtectedRoute>
                  <CustomMainLayout>
                    <EditClassPage />
                  </CustomMainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/classes/:classId"
              element={
                <ProtectedRoute>
                  {/* <CustomMainLayout> */}
                    <ViewClassPage />
                  {/* </CustomMainLayout> */}
                </ProtectedRoute>
              }
            />
            <Route
              path="/customers"
              element={
                <ProtectedRoute>
                  <CustomMainLayout>
                    <div>Customers Page</div>
                  </CustomMainLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
        </ToastProvider>
      </MantineProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
