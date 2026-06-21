import React, { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "20px", color: "#e11d48", backgroundColor: "#fff1f2", border: "1px solid #fda4af", borderRadius: "12px", margin: "20px", fontFamily: "monospace" }}>
          <h1 style={{ margin: "0 0 10px 0", fontSize: "18px" }}>Uncaught Runtime Error:</h1>
          <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-all", fontSize: "14px" }}>
            {this.state.error?.stack || this.state.error?.toString()}
          </pre>
          <button 
            onClick={() => { localStorage.clear(); window.location.reload(); }}
            style={{ marginTop: "15px", padding: "8px 16px", backgroundColor: "#e11d48", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
          >
            Clear LocalStorage & Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);