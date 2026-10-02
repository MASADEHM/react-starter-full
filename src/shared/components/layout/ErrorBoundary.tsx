import { Button, Result } from 'antd';
import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props { children: ReactNode }
interface State { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  override state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Unhandled error', error, info.componentStack);
  }

  override render(): ReactNode {
    const { error } = this.state;
    if (!error) return this.props.children;
    return (
      <Result
        status="error"
        title="Something went wrong"
        subTitle={error.message}
        extra={
          <Button type="primary" onClick={() => this.setState({ error: null })}>
            Try again
          </Button>
        }
      />
    );
  }
}
