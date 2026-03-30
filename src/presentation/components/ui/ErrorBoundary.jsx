"use client";

import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[50vh] items-center justify-center px-4 py-12">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-md ring-1 ring-slate-200">
            <div className="text-4xl" aria-hidden="true">
              ⚠️
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-slate-900">
              Something went wrong
            </h2>
            {this.state.error?.message ? (
              <p className="mt-3 text-sm text-slate-600">
                {this.state.error.message}
              </p>
            ) : null}
            <button
              type="button"
              onClick={() =>
                this.setState({
                  hasError: false,
                  error: null,
                })
              }
              className="mt-6 inline-flex items-center justify-center rounded-2xl bg-red-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-200"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
