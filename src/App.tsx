import { App as AntApp, ConfigProvider } from 'antd';
import enGB from 'antd/locale/en_GB';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { queryClient } from '@/core/query';
import { theme } from '@/core/theme/theme';
import { router } from '@/routes/router';

export function App() {
  return (
    // Locale and direction are set here so an RTL or translated release is configuration.
    <ConfigProvider theme={theme} locale={enGB} direction="ltr">
      <AntApp>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </AntApp>
    </ConfigProvider>
  );
}
