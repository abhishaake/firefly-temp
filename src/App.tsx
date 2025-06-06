import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { ManageClassesPage } from './pages/ManageClassesPage';
import { CustomMainLayout } from './layouts/CustomMainLayout';
import { WorkoutPage } from './pages/WorkoutPage';
import { CreateWorkoutPage } from './pages/CreateWorkoutPage';
import { CreateClassPage } from './pages/CreateClassPage';
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
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/manage-classes"
              element={
                <ProtectedRoute>
                  <CustomMainLayout>
                    <ManageClassesPage />
                  </CustomMainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/workout"
              element={
                <ProtectedRoute>
                  <CustomMainLayout>
                    <WorkoutPage />
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
            <Route path="*" element={<Navigate to="/manage-classes" replace />} />
          </Routes>
        </BrowserRouter>
      </MantineProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
