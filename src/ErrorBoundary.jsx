import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { error: error?.message || "Unknown error" };
  }

  componentDidCatch(error, errorInfo) {
    console.error("[task-manager] erro capturado:", error, errorInfo);
    this.setState({ info: errorInfo?.componentStack || "" });
  }

  reset = () => this.setState({ error: null, info: null });

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="tm-error" role="alert">
        <h2 className="tm-title">Task Manager hit an error</h2>
        <p className="tm-caption">{this.state.error}</p>
        {this.state.info && <pre className="tm-error-stack">{this.state.info}</pre>}
        <button type="button" className="tm-btn tm-btn--primary" onClick={this.reset}>
          Try again
        </button>
      </div>
    );
  }
}

export default ErrorBoundary;
