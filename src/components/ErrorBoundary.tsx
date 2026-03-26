import React from "react";
import { RefreshCw } from "lucide-react";

type State = { hasError: boolean };

export default class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Dashboard crash:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-6 m-4 rounded-lg border border-red-300 bg-red-50 text-red-700 space-y-4 shadow-md">
          <span className="text-4xl">⚠️</span>
          <h2 className="text-lg font-semibold">
            Oops! Something went wrong.
          </h2>
          <p className="text-sm text-center">
            The dashboard failed to load. You can try refreshing the page.
          </p>
          <button
            onClick={this.handleRetry}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            <RefreshCw size={16} /> Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}