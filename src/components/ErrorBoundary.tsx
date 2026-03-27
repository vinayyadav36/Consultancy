import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #0a0a14 0%, #1e1b4b 100%)' }}
        >
          <div className="text-center max-w-md px-6">
            <div className="text-6xl mb-6">⚡</div>
            <h1 className="text-2xl font-bold text-cyan-400 mb-3">Something went wrong</h1>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              An unexpected error occurred. Please refresh the page or try again.
            </p>
            {this.state.error && (
              <details className="mb-6 text-left">
                <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-300 transition-colors">
                  Error details
                </summary>
                <pre className="mt-2 text-xs text-red-400 bg-red-400/5 rounded-lg p-3 overflow-auto max-h-32">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="btn btn-primary"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-300 transition-colors hover:text-white"
                style={{ border: '1px solid rgba(49,46,129,0.5)' }}
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
